import { useState, useMemo, useEffect } from 'react';
import {
  CalendarDays, Users, DollarSign, TrendingUp, LogOut, Home,
  Search, Filter, Clock, Phone, Mail, MessageSquare, ChevronLeft, ChevronRight,
  LayoutGrid, Bell, Settings, Briefcase, Check, Building2, Car, MapPin, Route,
  AlertCircle, Plus, Pencil, Save,
} from 'lucide-react';
import type { Page } from '../App';
import {
  reservations as initialReservations, statusConfig, contactMethodLabels,
  partners, initialTrips, services,
} from '../data/mockData';
import type { Reservation, Trip, PartnerType } from '../data/mockData';
import { supabase } from '../lib/supabase';
import PartnerSelect from '../components/PartnerSelect';
import TripsList from '../components/TripsList';
import PartnersDirectory from '../components/PartnersDirectory';
import AddReservationModal from '../components/AddReservationModal';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

type StatusFilter = 'all' | Reservation['status'];
type SidebarItem = 'reservations' | 'trips' | 'partners' | 'reports' | 'settings';

interface PartnerAssignment {
  hostId: string | null;
  driverId: string | null;
  guideId: string | null;
}

const sidebarItems: { key: SidebarItem; label: string; icon: typeof CalendarDays; badge?: number }[] = [
  { key: 'reservations', label: 'Reservations', icon: CalendarDays },
  { key: 'trips', label: 'Trips', icon: Route },
  { key: 'partners', label: 'Partners', icon: Briefcase },
  { key: 'reports', label: 'Reports', icon: TrendingUp },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const statusFilters: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date('2026-10-15T12:00:00Z');
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const contactIcons: Record<Reservation['contactMethod'], typeof Phone> = {
  phone: Phone,
  email: Mail,
  platform: MessageSquare,
};

function getPartner(id: string | null) {
  if (!id) return null;
  return partners.find((p) => p.id === id) ?? null;
}

export default function DashboardPage({ onNavigate, onLogout }: DashboardPageProps) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<SidebarItem>('reservations');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [partnerAssignment, setPartnerAssignment] = useState<Record<string, PartnerAssignment>>({});
  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Reservation>>({});
  const itemsPerPage = 6;

  // Load trips from Supabase on mount and merge with seed data
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('trips').select('*');
      if (data && data.length > 0) {
        const dbTrips: Trip[] = data.map((row: Record<string, unknown>) => ({
          id: String(row.id).slice(0, 8).toUpperCase(),
          reservationId: String(row.reservation_id),
          clientName: String(row.client_name),
          serviceTitle: String(row.service_title),
          date: String(row.trip_date),
          people: Number(row.people),
          totalPrice: Number(row.total_price),
          hostId: (row.host_partner_id as string) ?? null,
          driverId: (row.driver_partner_id as string) ?? null,
          guideId: (row.guide_partner_id as string) ?? null,
          status: (row.status as Trip['status']) ?? 'confirmed',
          createdAt: String(row.created_at),
        }));
        // Merge: keep seed trips + add DB trips that don't overlap by reservationId
        const existingResIds = new Set(initialTrips.map((t) => t.reservationId));
        const newDbTrips = dbTrips.filter((t) => !existingResIds.has(t.reservationId));
        setTrips([...initialTrips, ...newDbTrips]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.clientName.toLowerCase().includes(q) ||
        r.serviceTitle.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const totalRevenue = trips
      .filter((t) => t.status === 'confirmed' || t.status === 'completed')
      .reduce((sum, t) => sum + t.totalPrice, 0);
    const pending = reservations.filter((r) => r.status === 'pending').length;
    const activeTrips = trips.filter((t) => t.status === 'in_progress').length;
    const completed = trips.filter((t) => t.status === 'completed').length;
    return { totalRevenue, pending, activeTrips, completed, totalTrips: trips.length };
  }, [reservations, trips]);

  const pendingCount = reservations.filter((r) => r.status === 'pending').length;
  const sidebarWithBadge = sidebarItems.map((item) =>
    item.key === 'reservations' && pendingCount > 0 ? { ...item, badge: pendingCount } : item
  );

  const handleStatusChange = (resId: string, newStatus: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
    );
    setTrips((prev) =>
      prev.map((t) => (t.reservationId === resId ? { ...t, status: newStatus } : t))
    );
    if (selectedReservation?.id === resId) {
      setSelectedReservation((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getAssignment = (resId: string): PartnerAssignment => {
    return partnerAssignment[resId] ?? { hostId: null, driverId: null, guideId: null };
  };

  const setAssignment = (resId: string, type: PartnerType, partnerId: string | null) => {
    setPartnerAssignment((prev) => ({
      ...prev,
      [resId]: {
        ...getAssignment(resId),
        [`${type}Id`]: partnerId,
      },
    }));
  };

  const handleConfirm = async () => {
    if (!selectedReservation) return;
    const assignment = getAssignment(selectedReservation.id);

    if (!assignment.hostId && selectedReservation.serviceId !== 'private-transfer') {
      setConfirmError('Please assign a host before confirming.');
      return;
    }
    if (!assignment.driverId) {
      setConfirmError('Please assign a driver before confirming.');
      return;
    }

    setConfirming(true);
    setConfirmError('');

    const newTrip: Trip = {
      id: `TRIP-${String(trips.length + 1).padStart(3, '0')}`,
      reservationId: selectedReservation.id,
      clientName: selectedReservation.clientName,
      serviceTitle: selectedReservation.serviceTitle,
      date: selectedReservation.date,
      people: selectedReservation.people,
      totalPrice: selectedReservation.totalPrice,
      hostId: assignment.hostId,
      driverId: assignment.driverId,
      guideId: assignment.guideId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Persist to Supabase
    await supabase.from('trips').insert({
      reservation_id: newTrip.reservationId,
      client_name: newTrip.clientName,
      service_title: newTrip.serviceTitle,
      service_id: selectedReservation.serviceId,
      trip_date: newTrip.date,
      people: newTrip.people,
      total_price: newTrip.totalPrice,
      host_partner_id: newTrip.hostId,
      driver_partner_id: newTrip.driverId,
      guide_partner_id: newTrip.guideId,
      status: 'confirmed',
    });

    setTrips((prev) => [...prev, newTrip]);
    setReservations((prev) =>
      prev.map((r) => (r.id === selectedReservation.id ? { ...r, status: 'confirmed' } : r))
    );
    setSelectedReservation((prev) => prev ? { ...prev, status: 'confirmed' } : null);
    setConfirming(false);
  };

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'teal' as const, change: '+12%' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'terracotta' as const, change: 'Needs action' },
    { label: 'Active Trips', value: stats.activeTrips, icon: Route, color: 'blue' as const, change: 'In progress' },
    { label: 'Completed', value: stats.completed, icon: Check, color: 'green' as const, change: 'This month' },
  ];

  const colorMap = {
    teal: 'bg-teal-100 text-teal-600',
    terracotta: 'bg-terracotta-100 text-terracotta-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  };

  const effectiveServiceId = isEditing && selectedReservation
    ? (editForm.serviceId ?? selectedReservation.serviceId)
    : selectedReservation?.serviceId;
  const isTransfer = effectiveServiceId === 'private-transfer';

  const nextReservationId = `RES-${String(2411 + reservations.filter(r => !initialReservations.some(ir => ir.id === r.id)).length).padStart(4, '0')}`;

  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    setShowAddModal(false);
  };

  const handleStartEdit = () => {
    if (!selectedReservation) return;
    setEditForm({
      clientName: selectedReservation.clientName,
      serviceId: selectedReservation.serviceId,
      date: selectedReservation.date,
      people: selectedReservation.people,
      contactMethod: selectedReservation.contactMethod,
      contactValue: selectedReservation.contactValue,
      assignedTo: selectedReservation.assignedTo,
    });
    setIsEditing(true);
  };

  const handleEditServiceChange = (newServiceId: string) => {
    if (!selectedReservation) return;
    setEditForm((prev) => ({ ...prev, serviceId: newServiceId }));
    setPartnerAssignment((prev) => ({
      ...prev,
      [selectedReservation.id]: { hostId: null, driverId: null, guideId: null },
    }));
  };

  const handleSaveEdit = () => {
    if (!selectedReservation || !editForm.clientName?.trim()) return;
    const newServiceId = editForm.serviceId ?? selectedReservation.serviceId;
    const service = services.find((s) => s.id === newServiceId);
    const people = editForm.people ?? selectedReservation.people;
    const totalPrice = service ? service.price * people : selectedReservation.totalPrice;
    const updated: Reservation = {
      ...selectedReservation,
      serviceId: newServiceId,
      serviceTitle: service ? service.title : selectedReservation.serviceTitle,
      clientName: editForm.clientName.trim(),
      date: editForm.date ?? selectedReservation.date,
      people,
      contactMethod: editForm.contactMethod ?? selectedReservation.contactMethod,
      contactValue: editForm.contactValue ?? selectedReservation.contactValue,
      assignedTo: editForm.assignedTo ?? selectedReservation.assignedTo,
      totalPrice,
    };
    setReservations((prev) => prev.map((r) => (r.id === selectedReservation.id ? updated : r)));
    setTrips((prev) => prev.map((t) =>
      t.reservationId === selectedReservation.id
        ? { ...t, serviceTitle: updated.serviceTitle, clientName: updated.clientName, date: updated.date, people: updated.people, totalPrice: updated.totalPrice }
        : t
    ));
    setSelectedReservation(updated);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-sand-100 flex">
      {/* Sidebar — desktop */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen z-40 w-64 bg-sand-900 text-sand-300 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-5 py-5 border-b border-sand-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-white">Sahara</span>
              <span className="text-[10px] font-medium text-teal-400 tracking-widest uppercase">Journeys</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <div className="px-3 py-2 text-[10px] font-semibold text-sand-500 uppercase tracking-widest">Operations</div>
          {sidebarWithBadge.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveSidebar(item.key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSidebar === item.key
                  ? 'bg-sand-800 text-white'
                  : 'text-sand-400 hover:bg-sand-800/60 hover:text-sand-200'
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-terracotta-500 text-white text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-sand-800">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sand-800 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              YA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">Youssef A.</div>
              <div className="text-xs text-sand-500 truncate">Tour Coordinator</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg text-sm font-medium text-sand-400 hover:bg-sand-800 hover:text-terracotta-400 transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-sand-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-sand-700"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-sand-900">
                {activeSidebar === 'reservations' && 'Reservations Dashboard'}
                {activeSidebar === 'trips' && 'Trips Overview'}
                {activeSidebar === 'partners' && 'Partner Directory'}
                {activeSidebar === 'reports' && 'Reports'}
                {activeSidebar === 'settings' && 'Settings'}
              </h1>
              <p className="text-xs text-sand-500 hidden sm:block">
                {activeSidebar === 'reservations' && 'Manage and track all incoming bookings'}
                {activeSidebar === 'trips' && 'All coordinated trips and their partner assignments'}
                {activeSidebar === 'partners' && 'Browse and manage partner network'}
                {activeSidebar === 'reports' && 'Performance metrics and insights'}
                {activeSidebar === 'settings' && 'Configure your dashboard'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Reservation</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button className="relative w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-sand-700 hover:bg-sand-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-500" />
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-sand-100 text-sand-700 text-sm font-medium hover:bg-sand-200 transition-colors"
            >
              <Home className="w-4 h-4" /> View Site
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Stats cards — show on reservations and trips views */}
          {(activeSidebar === 'reservations' || activeSidebar === 'trips') && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-sand-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-sand-400 font-medium">{stat.change}</span>
                  </div>
                  <div className="text-2xl font-bold text-sand-900">{stat.value}</div>
                  <div className="text-sm text-sand-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* === RESERVATIONS VIEW === */}
          {activeSidebar === 'reservations' && (
            <div className="bg-white rounded-xl border border-sand-200/60 shadow-sm">
              <div className="p-5 border-b border-sand-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="font-display text-lg font-bold text-sand-900">Incoming Reservations</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      placeholder="Search by name, service, or ID..."
                      className="pl-9 pr-4 py-2 rounded-lg border border-sand-300 bg-sand-50 text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all w-full sm:w-64"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin -mx-1 px-1">
                  <Filter className="w-4 h-4 text-sand-400 flex-shrink-0 mr-1" />
                  {statusFilters.map((f) => {
                    const count = f.key === 'all' ? reservations.length : reservations.filter((r) => r.status === f.key).length;
                    return (
                      <button
                        key={f.key}
                        onClick={() => { setStatusFilter(f.key); setCurrentPage(1); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                          statusFilter === f.key ? 'bg-sand-900 text-white' : 'text-sand-600 hover:bg-sand-100'
                        }`}
                      >
                        {f.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-sand-100 text-sand-500'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table — desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sand-100 text-xs font-semibold text-sand-500 uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Reservation</th>
                      <th className="text-left px-5 py-3">Client</th>
                      <th className="text-left px-5 py-3">Service</th>
                      <th className="text-left px-5 py-3">Date</th>
                      <th className="text-center px-5 py-3">Guests</th>
                      <th className="text-right px-5 py-3">Price</th>
                      <th className="text-center px-5 py-3">Status</th>
                      <th className="text-right px-5 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r) => {
                      const sc = statusConfig[r.status];
                      const ContactIcon = contactIcons[r.contactMethod];
                      const hasTrip = trips.some((t) => t.reservationId === r.id);
                      return (
                        <tr
                          key={r.id}
                          className="border-b border-sand-50 hover:bg-sand-50/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedReservation(r)}
                        >
                          <td className="px-5 py-4">
                            <div className="font-mono text-xs font-semibold text-sand-700">{r.id}</div>
                            <div className="text-xs text-sand-400 mt-0.5">{timeAgo(r.createdAt)}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-sand-200 flex items-center justify-center text-xs font-bold text-sand-700 flex-shrink-0">
                                {r.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-sand-900 truncate">{r.clientName}</div>
                                <div className="flex items-center gap-1 text-xs text-sand-400">
                                  <ContactIcon className="w-3 h-3" />
                                  {contactMethodLabels[r.contactMethod]}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm text-sand-700 max-w-[180px] truncate">{r.serviceTitle}</div>
                            <div className="text-xs text-sand-400">{r.assignedTo}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-sm text-sand-700">{formatDateShort(r.date)}</div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-flex items-center gap-1 text-sm text-sand-700">
                              <Users className="w-3.5 h-3.5 text-sand-400" /> {r.people}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <span className="text-sm font-semibold text-sand-900">${r.totalPrice}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedReservation(r); }}
                              className="text-xs font-medium text-teal-600 hover:text-teal-700"
                            >
                              {r.status === 'pending' ? 'Coordinate' : 'Details'}
                            </button>
                            {hasTrip && (
                              <div className="text-[10px] text-teal-500 mt-0.5">Trip created</div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile */}
              <div className="lg:hidden divide-y divide-sand-100">
                {paginated.map((r) => {
                  const sc = statusConfig[r.status];
                  const ContactIcon = contactIcons[r.contactMethod];
                  return (
                    <div key={r.id} className="p-4 active:bg-sand-50 transition-colors cursor-pointer" onClick={() => setSelectedReservation(r)}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-mono text-xs font-semibold text-sand-500">{r.id}</div>
                          <div className="text-sm font-medium text-sand-900 mt-0.5">{r.clientName}</div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </div>
                      <div className="text-sm text-sand-700 mb-2">{r.serviceTitle}</div>
                      <div className="flex items-center justify-between text-xs text-sand-500">
                        <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDateShort(r.date)}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {r.people}</span>
                        <span className="flex items-center gap-1"><ContactIcon className="w-3.5 h-3.5" /> {contactMethodLabels[r.contactMethod]}</span>
                        <span className="font-semibold text-sand-700">${r.totalPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {paginated.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-7 h-7 text-sand-400" />
                  </div>
                  <p className="text-sm text-sand-500">No reservations match your filters.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-sand-100">
                  <div className="text-xs text-sand-500">
                    Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                      className="w-8 h-8 rounded-lg border border-sand-200 flex items-center justify-center text-sand-600 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-sand-900 text-white' : 'text-sand-600 hover:bg-sand-50'}`}>
                        {page}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
                      className="w-8 h-8 rounded-lg border border-sand-200 flex items-center justify-center text-sand-600 hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === TRIPS VIEW === */}
          {activeSidebar === 'trips' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-bold text-sand-900">All Trips</h2>
                <span className="text-sm text-sand-500">{trips.length} trips total</span>
              </div>
              <TripsList trips={trips} onSelectTrip={(t) => setSelectedTrip(t)} />
            </div>
          )}

          {/* === PARTNERS VIEW === */}
          {activeSidebar === 'partners' && <PartnersDirectory />}

          {/* === REPORTS / SETTINGS (placeholder) === */}
          {(activeSidebar === 'reports' || activeSidebar === 'settings') && (
            <div className="bg-white rounded-xl border border-sand-200/60 shadow-sm p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-3">
                {activeSidebar === 'reports' ? <TrendingUp className="w-7 h-7 text-sand-400" /> : <Settings className="w-7 h-7 text-sand-400" />}
              </div>
              <p className="text-sm text-sand-500">
                {activeSidebar === 'reports' ? 'Reports coming soon.' : 'Settings coming soon.'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* === RESERVATION DETAIL DRAWER (with partner assignment) === */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={() => { setSelectedReservation(null); setConfirmError(''); }}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-md bg-white h-full overflow-y-auto scrollbar-thin shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-sand-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-xs text-sand-500">{selectedReservation.id}</div>
                <h2 className="font-display text-lg font-bold text-sand-900">Reservation Details</h2>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 rounded-lg bg-sand-100 text-sand-600 text-sm font-medium hover:bg-sand-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-100 text-sand-600 text-sm font-medium hover:bg-sand-200 transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                )}
                <button onClick={() => { setSelectedReservation(null); setConfirmError(''); setIsEditing(false); }}
                  className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-sand-600 hover:bg-sand-200 transition-colors">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Status badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedReservation.status].bg} ${statusConfig[selectedReservation.status].text}`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig[selectedReservation.status].dot}`} />
                  {statusConfig[selectedReservation.status].label}
                </span>
              </div>

              {/* Client info */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Client</h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.clientName ?? ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Client name"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                    <div>
                      <label className="block text-xs font-medium text-sand-600 mb-1.5">Contact Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['platform', 'phone', 'email'] as const).map((method) => {
                          const Icon = contactIcons[method];
                          return (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setEditForm((prev) => ({ ...prev, contactMethod: method }))}
                              className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                                (editForm.contactMethod ?? selectedReservation.contactMethod) === method
                                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                                  : 'border-sand-200 text-sand-600 hover:border-sand-300'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-[10px] font-medium">{contactMethodLabels[method]}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <input
                      type={(editForm.contactMethod ?? selectedReservation.contactMethod) === 'email' ? 'email' : (editForm.contactMethod ?? selectedReservation.contactMethod) === 'phone' ? 'tel' : 'text'}
                      value={editForm.contactValue ?? ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, contactValue: e.target.value }))}
                      placeholder="Contact details"
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-sand-200 flex items-center justify-center text-sm font-bold text-sand-700">
                        {selectedReservation.clientName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-sand-900">{selectedReservation.clientName}</div>
                        <div className="text-xs text-sand-500">Reservation created {timeAgo(selectedReservation.createdAt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-sand-700">
                      {(() => { const Icon = contactIcons[selectedReservation.contactMethod]; return <Icon className="w-4 h-4 text-sand-400" />; })()}
                      <span className="font-medium">{contactMethodLabels[selectedReservation.contactMethod]}:</span>
                      <span>{selectedReservation.contactValue}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Service info */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Service</h3>
                <div className="bg-sand-50 rounded-xl p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-sand-600 mb-1.5">Service</label>
                        <select
                          value={editForm.serviceId ?? selectedReservation.serviceId}
                          onChange={(e) => handleEditServiceChange(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-sand-600 mb-1.5">Assigned To</label>
                        <select
                          value={editForm.assignedTo ?? ''}
                          onChange={(e) => setEditForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                        >
                          <option value="Youssef A.">Youssef A.</option>
                          <option value="Fatima Z.">Fatima Z.</option>
                          <option value="Karim B.">Karim B.</option>
                          <option value="Said M.">Said M.</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-sand-600 mb-1.5">Date</label>
                          <input
                            type="date"
                            value={editForm.date ?? ''}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-sand-600 mb-1.5">People</label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.people ?? 1}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, people: Math.max(1, parseInt(e.target.value) || 1) }))}
                            className="w-full px-3 py-2 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-sand-200">
                        <span className="text-xs text-sand-500">Total (auto-calculated)</span>
                        <span className="font-bold text-terracotta-600">
                          ${(() => {
                            const svc = services.find((s) => s.id === (editForm.serviceId ?? selectedReservation.serviceId));
                            return svc ? svc.price * (editForm.people ?? selectedReservation.people) : selectedReservation.totalPrice;
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs text-sand-500 mb-3">Assigned to: {selectedReservation.assignedTo}</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><div className="text-xs text-sand-500">Date</div><div className="font-medium text-sand-900">{formatDate(selectedReservation.date)}</div></div>
                        <div><div className="text-xs text-sand-500">Guests</div><div className="font-medium text-sand-900">{selectedReservation.people} people</div></div>
                        <div><div className="text-xs text-sand-500">Unit Price</div><div className="font-medium text-sand-900">${selectedReservation.totalPrice / selectedReservation.people}</div></div>
                        <div><div className="text-xs text-sand-500">Total</div><div className="font-bold text-terracotta-600">${selectedReservation.totalPrice}</div></div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Partner assignment section */}
              {selectedReservation.status === 'pending' && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Partner Coordination</h3>
                  <div className="space-y-5">
                    <PartnerSelect
                      type="host"
                      label="Assign Host"
                      serviceId={effectiveServiceId ?? selectedReservation.serviceId}
                      selectedId={getAssignment(selectedReservation.id).hostId}
                      onSelect={(id) => setAssignment(selectedReservation.id, 'host', id)}
                      required={!isTransfer}
                    />
                    <PartnerSelect
                      type="driver"
                      label="Assign Driver"
                      serviceId={effectiveServiceId ?? selectedReservation.serviceId}
                      selectedId={getAssignment(selectedReservation.id).driverId}
                      onSelect={(id) => setAssignment(selectedReservation.id, 'driver', id)}
                      required
                    />
                    <PartnerSelect
                      type="guide"
                      label="Assign Tourist Guide (Optional)"
                      serviceId={effectiveServiceId ?? selectedReservation.serviceId}
                      selectedId={getAssignment(selectedReservation.id).guideId}
                      onSelect={(id) => setAssignment(selectedReservation.id, 'guide', id)}
                    />
                  </div>

                  {confirmError && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs animate-fade-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {confirmError}
                    </div>
                  )}

                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    className="w-full mt-5 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                  >
                    {confirming ? (
                      <>Confirming...</>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Confirm & Create Trip
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Show assigned partners if already confirmed */}
              {selectedReservation.status !== 'pending' && (() => {
                const trip = trips.find((t) => t.reservationId === selectedReservation.id);
                if (!trip) return null;
                const host = getPartner(trip.hostId);
                const driver = getPartner(trip.driverId);
                const guide = getPartner(trip.guideId);
                const slots = [
                  { label: 'Host', icon: Building2, partner: host },
                  { label: 'Driver', icon: Car, partner: driver },
                  { label: 'Guide', icon: MapPin, partner: guide },
                ];
                return (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Assigned Partners</h3>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div key={slot.label} className="flex items-center gap-3 p-3 rounded-lg bg-sand-50">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                            <slot.icon className="w-4 h-4 text-sand-500" />
                          </div>
                          <div>
                            <div className="text-xs text-sand-500">{slot.label}</div>
                            {slot.partner ? (
                              <div className="text-sm font-medium text-sand-900">{slot.partner.name}</div>
                            ) : (
                              <div className="text-sm text-sand-300 italic">Not assigned</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Status update */}
              <div>
                <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['pending', 'confirmed', 'in_progress', 'completed'] as const).map((s) => {
                    const sc = statusConfig[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedReservation.id, s)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                          selectedReservation.status === s ? `${sc.border} ${sc.bg} ${sc.text}` : 'border-sand-200 text-sand-600 hover:border-sand-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TRIP DETAIL DRAWER === */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in" onClick={() => setSelectedTrip(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-md bg-white h-full overflow-y-auto scrollbar-thin shadow-2xl animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-sand-100 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-xs text-sand-500">{selectedTrip.id}</div>
                <h2 className="font-display text-lg font-bold text-sand-900">Trip Details</h2>
              </div>
              <button onClick={() => setSelectedTrip(null)}
                className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-sand-600 hover:bg-sand-200 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[selectedTrip.status].bg} ${statusConfig[selectedTrip.status].text}`}>
                  <span className={`w-2 h-2 rounded-full ${statusConfig[selectedTrip.status].dot}`} />
                  {statusConfig[selectedTrip.status].label}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Trip Info</h3>
                <div className="bg-sand-50 rounded-xl p-4">
                  <div className="font-semibold text-sand-900 mb-1">{selectedTrip.serviceTitle}</div>
                  <div className="text-xs text-sand-500 mb-3">Client: {selectedTrip.clientName}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><div className="text-xs text-sand-500">Date</div><div className="font-medium text-sand-900">{formatDate(selectedTrip.date)}</div></div>
                    <div><div className="text-xs text-sand-500">Guests</div><div className="font-medium text-sand-900">{selectedTrip.people} people</div></div>
                    <div><div className="text-xs text-sand-500">Reservation</div><div className="font-mono font-medium text-sand-900">{selectedTrip.reservationId}</div></div>
                    <div><div className="text-xs text-sand-500">Total</div><div className="font-bold text-terracotta-600">${selectedTrip.totalPrice}</div></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-sand-500 uppercase tracking-wider mb-3">Assigned Partners</h3>
                <div className="space-y-3">
                  {([
                    { label: 'Host', icon: Building2, partner: getPartner(selectedTrip.hostId) },
                    { label: 'Driver', icon: Car, partner: getPartner(selectedTrip.driverId) },
                    { label: 'Guide', icon: MapPin, partner: getPartner(selectedTrip.guideId) },
                  ]).map((slot) => (
                    <div key={slot.label} className="flex items-center gap-3 p-3 rounded-lg border border-sand-200">
                      <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center flex-shrink-0">
                        <slot.icon className="w-5 h-5 text-sand-500" />
                      </div>
                      {slot.partner ? (
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-sand-500">{slot.label}</div>
                          <div className="text-sm font-medium text-sand-900 truncate">{slot.partner.name}</div>
                          <div className="text-xs text-sand-400">{slot.partner.phone}</div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="text-xs text-sand-500">{slot.label}</div>
                          <div className="text-sm text-sand-300 italic">Not assigned</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === ADD RESERVATION MODAL === */}
      {showAddModal && (
        <AddReservationModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddReservation}
          nextId={nextReservationId}
        />
      )}
    </div>
  );
}
