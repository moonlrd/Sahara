import { Check, Star, MapPin, Phone } from 'lucide-react';
import type { Partner, PartnerType } from '../data/mockData';
import { partners, availabilityConfig } from '../data/mockData';

interface PartnerSelectProps {
  type: PartnerType;
  label: string;
  serviceId: string;
  selectedId: string | null;
  onSelect: (partnerId: string | null) => void;
  required?: boolean;
}

export default function PartnerSelect({ type, label, serviceId, selectedId, onSelect, required }: PartnerSelectProps) {
  const eligible = partners.filter(
    (p) => p.type === type && (p.servicesHandled.includes(serviceId) || p.servicesHandled.length === 0)
  );
  const fallback = partners.filter((p) => p.type === type && !p.servicesHandled.includes(serviceId));
  const allForType = [...eligible, ...fallback];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-sand-700">
          {label} {required && <span className="text-terracotta-500">*</span>}
        </label>
        {selectedId && (
          <button
            onClick={() => onSelect(null)}
            className="text-xs text-sand-400 hover:text-terracotta-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {allForType.length === 0 ? (
        <p className="text-xs text-sand-400 py-3">No {type}s available.</p>
      ) : (
        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin pr-1">
          {allForType.map((p: Partner) => {
            const isSelected = selectedId === p.id;
            const avail = availabilityConfig[p.availability];
            const isEligible = eligible.some((e) => e.id === p.id);

            return (
              <button
                key={p.id}
                onClick={() => onSelect(isSelected ? null : p.id)}
                disabled={p.availability === 'off_duty'}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-sand-200 hover:border-sand-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg ${p.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {p.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-sand-900 truncate">{p.name}</span>
                    {isEligible && (
                      <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Match</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sand-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-terracotta-400 text-terracotta-400" />{p.rating}</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{p.location}</span>
                    <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" />{p.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${avail.bg} ${avail.text}`}>
                    <span className={`w-1 h-1 rounded-full ${avail.dot}`} />
                    {avail.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
