import { Users, CalendarDays, DollarSign, Building2, Car, MapPin, ChevronRight } from 'lucide-react';
import type { Trip } from '../data/mockData';
import { partners, statusConfig } from '../data/mockData';
import type { PartnerType } from '../data/mockData';

interface TripsListProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
}

function getPartner(id: string | null) {
  if (!id) return null;
  return partners.find((p) => p.id === id) ?? null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TripsList({ trips, onSelectTrip }: TripsListProps) {
  if (trips.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-3">
          <CalendarDays className="w-7 h-7 text-sand-400" />
        </div>
        <p className="text-sm text-sand-500">No trips yet. Confirm reservations to create trips.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trips.map((trip) => {
        const sc = statusConfig[trip.status];
        const host = getPartner(trip.hostId);
        const driver = getPartner(trip.driverId);
        const guide = getPartner(trip.guideId);

        const partnerSlots: { label: string; icon: typeof Building2; partner: ReturnType<typeof getPartner> }[] = [
          { label: 'Host', icon: Building2, partner: host },
          { label: 'Driver', icon: Car, partner: driver },
          { label: 'Guide', icon: MapPin, partner: guide },
        ];

        return (
          <div
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className="bg-white rounded-xl border border-sand-200/60 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-xs text-sand-500">{trip.id}</div>
                <h3 className="font-display font-bold text-sand-900 mt-0.5">{trip.serviceTitle}</h3>
                <div className="text-xs text-sand-500 mt-0.5">{trip.clientName}</div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-sand-500 mb-4">
              <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(trip.date)}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {trip.people}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> {trip.totalPrice}</span>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-sand-100">
              {partnerSlots.map((slot) => (
                <div key={slot.label} className="flex items-center gap-2 text-xs">
                  <slot.icon className="w-3.5 h-3.5 text-sand-400 flex-shrink-0" />
                  <span className="text-sand-400 w-12">{slot.label}</span>
                  {slot.partner ? (
                    <span className="font-medium text-sand-700 truncate">{slot.partner.name}</span>
                  ) : (
                    <span className="text-sand-300 italic">Not assigned</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3">
              <span className="text-xs font-medium text-teal-600 flex items-center gap-1">
                View Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
