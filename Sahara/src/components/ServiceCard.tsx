import { Star, Clock, MapPin, Users } from 'lucide-react';
import type { Service } from '../data/mockData';
import { categoryColors, categoryLabels } from '../data/mockData';

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void;
  onDetails: (serviceId: string) => void;
}

export default function ServiceCard({ service, onBook, onDetails }: ServiceCardProps) {
  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-sand-200/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onDetails && onDetails(service.id)}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[service.category]}`}>
            {categoryLabels[service.category]}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400" />
          <span className="text-sm font-semibold">{service.rating}</span>
          <span className="text-xs text-white/80">({service.reviews})</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg text-sand-900 mb-1">{service.title}</h3>
        <div className="flex items-center gap-1 text-xs text-sand-600 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{service.location}</span>
        </div>
        <p className="text-sm text-sand-700 leading-relaxed mb-4 line-clamp-2">{service.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-600 text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-sand-600 mb-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {service.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Max {service.capacity}
          </span>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-sand-100">
          <div>
            <span className="text-2xl font-bold text-terracotta-600">${service.price}</span>
            <span className="text-xs text-sand-500 ml-1">{service.priceUnit}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook(service.id);
            }}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors active:scale-95"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
