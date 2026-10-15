import { useState } from 'react';
import { Star, Clock, MapPin, Users, ArrowRight, Quote, ShieldCheck, Phone, Calendar, ChevronRight } from 'lucide-react';
import type { Page } from '../App';
import { services, categoryLabels, categoryColors } from '../data/mockData';
import type { Category } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';
import NavBar from '../components/NavBar';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onBookService: (serviceId: string) => void;
}

const heroImage = 'https://images.pexels.com/photos/30710172/pexels-photo-30710172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const heroImage2 = 'https://images.pexels.com/photos/33442715/pexels-photo-33442715.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const categories: (Category | 'all')[] = ['all', 'adventure', 'cultural', 'accommodation', 'dining', 'transport'];

export default function LandingPage({ onNavigate, onBookService }: LandingPageProps) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const selectedService = selectedServiceId
    ? services.find((s) => s.id === selectedServiceId) ?? null
    : null;

  const handleBook = (serviceId: string) => {
    onBookService(serviceId);
  };

  const handleDetails = (serviceId: string) => {
    setSelectedServiceId(serviceId);
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <NavBar current="home" onNavigate={onNavigate} />

      {/* Hero */}
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Sahara desert dunes" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-sand-900/80 via-sand-900/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400" />
              <span>Rated 4.9/5 by 2,000+ travelers</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15] mb-6 text-balance">
              Discover the Soul of the Sahara
            </h1>
            <p className="text-lg text-sand-100/90 leading-relaxed mb-8 max-w-xl">
              Unforgettable desert experiences — camel treks, luxury camps, 4x4 safaris, and cultural immursions, all coordinated seamlessly by our local team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToServices}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-terracotta-500 text-white font-semibold hover:bg-terracotta-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Explore Experiences
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate('booking')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/30 text-white font-semibold hover:bg-white/25 transition-all"
              >
                <Calendar className="w-5 h-5" />
                Make a Reservation
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-sand-900/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '2,000+', label: 'Happy Travelers' },
                { value: '8', label: 'Curated Experiences' },
                { value: '15', label: 'Local Partners' },
                { value: '24/7', label: 'Support Team' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-sand-300 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Our Experiences</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-900 mt-2 mb-4">
              Find Your Perfect Desert Adventure
            </h2>
            <p className="text-sand-600 leading-relaxed">
              From tranquil camel treks to adrenaline-pumping quad biking, every experience is crafted by local experts who know the desert like the back of their hand.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white text-sand-700 border border-sand-200 hover:border-sand-300 hover:bg-sand-50'
                }`}
              >
                {cat === 'all' ? 'All Experiences' : categoryLabels[cat as Category]}
              </button>
            ))}
          </div>

          {/* Service cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBook}
                onDetails={handleDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-20 bg-white border-y border-sand-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={heroImage2}
                alt="Golden desert dunes"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs hidden md:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-sand-900">Trusted Local Team</div>
                    <div className="text-xs text-sand-500">Licensed & insured</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Why Sahara Journeys</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-900 mt-2 mb-6">
                Coordinated End-to-End, Every Time
              </h2>
              <div className="space-y-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Verified Local Partners',
                    desc: 'Hotels, restaurants, drivers, and guides — all vetted and trusted by our team.',
                  },
                  {
                    icon: Calendar,
                    title: 'Seamless Reservations',
                    desc: 'Book online, by phone, or by email. Our staff confirms every detail within hours.',
                  },
                  {
                    icon: Phone,
                    title: '24/7 On-Trip Support',
                    desc: 'Something comes up mid-trip? Our team is one call away, day or night.',
                  },
                ].map((feat) => (
                  <div key={feat.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sand-100 flex items-center justify-center">
                      <feat.icon className="w-5 h-5 text-terracotta-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sand-900 mb-1">{feat.title}</h3>
                      <p className="text-sm text-sand-600 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-wider">Traveler Stories</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sand-900 mt-2">
              Loved by Adventurers Worldwide
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The camel trek at sunset was the highlight of our Morocco trip. Our guide Youssef was incredibly knowledgeable and warm.',
                name: 'Sarah & Tom',
                location: 'United Kingdom',
              },
              {
                quote: 'The luxury desert camp exceeded all expectations. Stargazing from the dunes was pure magic. Highly recommend!',
                name: 'Marco Rossi',
                location: 'Italy',
              },
              {
                quote: 'Quad biking through the dunes was an adrenaline rush like no other. Professional, safe, and so much fun.',
                name: 'Jennifer Liu',
                location: 'Canada',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-sand-200/60 shadow-sm">
                <Quote className="w-8 h-8 text-sand-300 mb-4" />
                <p className="text-sand-700 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sand-900">{t.name}</div>
                    <div className="text-xs text-sand-500">{t.location}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-terracotta-400 text-terracotta-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-sand-800 to-sand-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for Your Desert Adventure?
          </h2>
          <p className="text-sand-200 text-lg mb-8 max-w-2xl mx-auto">
            Reserve your spot in minutes. Our team will confirm every detail and take care of the rest.
          </p>
          <button
            onClick={() => onNavigate('booking')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-terracotta-500 text-white font-semibold text-lg hover:bg-terracotta-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Make a Reservation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sand-900 text-sand-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-bold text-white">Sahara</span>
                  <span className="text-[10px] font-medium text-teal-400 tracking-widest uppercase">Journeys</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed">Your trusted partner for authentic desert experiences in Morocco.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Experiences</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('services')} className="hover:text-teal-400 transition-colors">All Tours</button></li>
                <li><button onClick={scrollToServices} className="hover:text-teal-400 transition-colors">Adventure</button></li>
                <li><button onClick={scrollToServices} className="hover:text-teal-400 transition-colors">Cultural</button></li>
                <li><button onClick={scrollToServices} className="hover:text-teal-400 transition-colors">Accommodation</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('home')} className="hover:text-teal-400 transition-colors">About Us</button></li>
                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-teal-400 transition-colors">Employee Hub</button></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-teal-400 transition-colors">Staff Login</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +212 524-123456</li>
                <li>hello@saharajourneys.ma</li>
                <li>Marrakech, Morocco</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-sand-800 text-center text-sm">
            © 2026 Sahara Journeys. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Service detail modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedServiceId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              <img src={selectedService.image} alt={selectedService.title} className="w-full h-full object-cover rounded-t-2xl" />
              <button
                onClick={() => setSelectedServiceId(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-sand-700 hover:bg-white transition-colors shadow-md"
              >
                ✕
              </button>
              <div className="absolute top-4 left-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[selectedService.category]}`}>
                  {categoryLabels[selectedService.category]}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl font-bold text-sand-900 mb-2">{selectedService.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-sand-600 mb-4">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedService.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {selectedService.duration}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Max {selectedService.capacity}</span>
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400" /> {selectedService.rating} ({selectedService.reviews})</span>
              </div>
              <p className="text-sand-700 leading-relaxed mb-6">{selectedService.longDescription}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedService.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-sand-100 text-sand-600 text-xs font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-sand-100">
                <div>
                  <span className="text-3xl font-bold text-terracotta-600">${selectedService.price}</span>
                  <span className="text-sm text-sand-500 ml-1">{selectedService.priceUnit}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedServiceId(null);
                    handleBook(selectedService.id);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors active:scale-95"
                >
                  Reserve Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
