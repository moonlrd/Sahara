import { useState } from 'react';
import { Star, MapPin, Phone, Mail, Search } from 'lucide-react';
import { partners, partnerTypeLabels, availabilityConfig } from '../data/mockData';
import type { PartnerType } from '../data/mockData';

type FilterType = 'all' | PartnerType;

export default function PartnersDirectory() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filtered = partners.filter((p) => {
    const matchesType = filter === 'all' || p.type === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.subtype.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Partners' },
    { key: 'host', label: 'Hosts' },
    { key: 'driver', label: 'Drivers' },
    { key: 'guide', label: 'Guides' },
  ];

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {filters.map((f) => {
            const count = f.key === 'all' ? partners.length : partners.filter((p) => p.type === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f.key ? 'bg-sand-900 text-white' : 'text-sand-600 hover:bg-sand-100'
                }`}
              >
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20 text-white' : 'bg-sand-100 text-sand-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners..."
            className="pl-9 pr-4 py-2 rounded-lg border border-sand-300 bg-sand-50 text-sm text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all w-full sm:w-56"
          />
        </div>
      </div>

      {/* Partner cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const avail = availabilityConfig[p.availability];
          return (
            <div key={p.id} className="bg-white rounded-xl border border-sand-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-11 h-11 rounded-lg ${p.avatarColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sand-900 truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-sand-500 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-sand-100 font-medium">{partnerTypeLabels[p.type]}</span>
                    <span>{p.subtype}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-sand-600">
                  <MapPin className="w-4 h-4 text-sand-400" /> {p.location}
                </div>
                <div className="flex items-center gap-2 text-sand-600">
                  <Phone className="w-4 h-4 text-sand-400" /> {p.phone}
                </div>
                <div className="flex items-center gap-2 text-sand-600 truncate">
                  <Mail className="w-4 h-4 text-sand-400" /> {p.email}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-sand-100">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400" />
                  <span className="text-sm font-semibold text-sand-900">{p.rating}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${avail.bg} ${avail.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                  {avail.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-3">
            <Search className="w-7 h-7 text-sand-400" />
          </div>
          <p className="text-sm text-sand-500">No partners match your search.</p>
        </div>
      )}
    </div>
  );
}
