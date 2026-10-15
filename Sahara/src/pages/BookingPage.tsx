import { useState } from 'react';
import { Calendar, Users, ArrowLeft, ArrowRight, Check, Phone, Mail, MessageSquare, MapPin, Clock, Star } from 'lucide-react';
import type { Page } from '../App';
import { services, categoryColors, categoryLabels } from '../data/mockData';
import NavBar from '../components/NavBar';

interface BookingPageProps {
  onNavigate: (page: Page) => void;
  preselectedServiceId: string | null;
}

type ContactMethod = 'platform' | 'phone' | 'email';

export default function BookingPage({ onNavigate, preselectedServiceId }: BookingPageProps) {
  const [serviceId, setServiceId] = useState<string>(preselectedServiceId ?? '');
  const [date, setDate] = useState<string>('');
  const [people, setPeople] = useState<number>(2);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('platform');
  const [contactValue, setContactValue] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const totalPrice = selectedService ? selectedService.price * people : 0;
  const today = new Date().toISOString().split('T')[0];

  const contactMethodConfig: Record<ContactMethod, { label: string; icon: typeof Phone; placeholder: string }> = {
    platform: { label: 'Platform Message', icon: MessageSquare, placeholder: '@yourusername' },
    phone: { label: 'Phone Call', icon: Phone, placeholder: '+212 6XX-XXXXXX' },
    email: { label: 'Email', icon: Mail, placeholder: 'you@email.com' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setServiceId('');
    setDate('');
    setPeople(2);
    setContactMethod('platform');
    setContactValue('');
    setClientName('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-sand-50">
        <NavBar current="booking" onNavigate={onNavigate} />
        <div className="pt-24 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-sand-200/60 shadow-lg p-8 sm:p-12 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-teal-600" strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-sand-900 mb-3">
                Reservation Submitted!
              </h2>
              <p className="text-sand-600 leading-relaxed mb-8 max-w-md mx-auto">
                Thank you, {clientName || 'traveler'}! Your reservation request for <strong>{selectedService?.title}</strong> has been received. Our team will confirm your booking via {contactMethodConfig[contactMethod].label.toLowerCase()} within a few hours.
              </p>

              <div className="bg-sand-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="text-sm font-semibold text-sand-900 mb-4 uppercase tracking-wider">Reservation Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-500">Experience</span>
                    <span className="font-medium text-sand-900">{selectedService?.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-500">Date</span>
                    <span className="font-medium text-sand-900">{date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-500">Guests</span>
                    <span className="font-medium text-sand-900">{people} {people === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-sand-500">Contact via</span>
                    <span className="font-medium text-sand-900">{contactMethodConfig[contactMethod].label}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-3 border-t border-sand-200">
                    <span className="text-sand-500">Total Price</span>
                    <span className="text-xl font-bold text-terracotta-600">${totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => onNavigate('home')}
                  className="px-6 py-3 rounded-xl bg-sand-100 text-sand-700 font-medium hover:bg-sand-200 transition-colors"
                >
                  Back to Home
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
                >
                  Make Another Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <NavBar current="booking" onNavigate={onNavigate} />

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-sm text-sand-600 hover:text-sand-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-sand-900 mb-2">Reserve Your Experience</h1>
            <p className="text-sand-600">Fill in the details below and our team will confirm your booking shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select service */}
              <div className="bg-white rounded-2xl border border-sand-200/60 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <h2 className="font-display text-lg font-bold text-sand-900">Select an Experience</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setServiceId(service.id)}
                      className={`flex gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                        serviceId === service.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-sand-200 hover:border-sand-300 bg-white'
                      }`}
                    >
                      <img src={service.image} alt={service.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sand-900 text-sm truncate">{service.title}</div>
                        <div className="text-xs text-sand-500 mb-1">{service.location}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-terracotta-600">${service.price}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${categoryColors[service.category]}`}>
                            {categoryLabels[service.category]}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Date & party size */}
              <div className="bg-white rounded-2xl border border-sand-200/60 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="font-display text-lg font-bold text-sand-900">Date & Party Size</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1.5" /> Preferred Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">
                      <Users className="w-4 h-4 inline mr-1.5" /> Number of People
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPeople(Math.max(1, people - 1))}
                        className="w-11 h-11 rounded-xl border border-sand-300 bg-sand-50 flex items-center justify-center text-sand-700 hover:bg-sand-100 transition-colors text-xl font-bold flex-shrink-0"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={selectedService?.capacity ?? 30}
                        value={people}
                        onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full text-center px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setPeople(Math.min(selectedService?.capacity ?? 30, people + 1))}
                        className="w-11 h-11 rounded-xl border border-sand-300 bg-sand-50 flex items-center justify-center text-sand-700 hover:bg-sand-100 transition-colors text-xl font-bold flex-shrink-0"
                      >
                        +
                      </button>
                    </div>
                    {selectedService && (
                      <p className="text-xs text-sand-500 mt-2">Maximum capacity: {selectedService.capacity} people</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3: Contact info */}
              <div className="bg-white rounded-2xl border border-sand-200/60 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-terracotta-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <h2 className="font-display text-lg font-bold text-sand-900">Your Details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      placeholder="e.g. Jane Smith"
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-3">Preferred Contact Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Object.keys(contactMethodConfig) as ContactMethod[]).map((method) => {
                        const cfg = contactMethodConfig[method];
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setContactMethod(method)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              contactMethod === method
                                ? 'border-teal-500 bg-teal-50 text-teal-700'
                                : 'border-sand-200 text-sand-600 hover:border-sand-300'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{cfg.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-sand-700 mb-2">
                      {contactMethodConfig[contactMethod].label} Details
                    </label>
                    <input
                      type={contactMethod === 'email' ? 'email' : contactMethod === 'phone' ? 'tel' : 'text'}
                      value={contactValue}
                      onChange={(e) => setContactValue(e.target.value)}
                      required
                      placeholder={contactMethodConfig[contactMethod].placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-sand-200/60 shadow-sm p-6 sticky top-24">
                <h2 className="font-display text-lg font-bold text-sand-900 mb-5">Booking Summary</h2>

                {selectedService ? (
                  <>
                    <div className="rounded-xl overflow-hidden mb-4">
                      <img src={selectedService.image} alt={selectedService.title} className="w-full h-32 object-cover" />
                    </div>
                    <h3 className="font-semibold text-sand-900 mb-1">{selectedService.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-sand-500 mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {selectedService.location}
                    </div>
                    <div className="space-y-2.5 text-sm mb-6">
                      <div className="flex justify-between">
                        <span className="text-sand-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Duration</span>
                        <span className="font-medium text-sand-900">{selectedService.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sand-500 flex items-center gap-1.5"><Star className="w-4 h-4 fill-terracotta-400 text-terracotta-400" /> Rating</span>
                        <span className="font-medium text-sand-900">{selectedService.rating}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sand-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Date</span>
                        <span className="font-medium text-sand-900">{date || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sand-500 flex items-center gap-1.5"><Users className="w-4 h-4" /> Guests</span>
                        <span className="font-medium text-sand-900">{people}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm py-4 border-y border-sand-100">
                      <div className="flex justify-between">
                        <span className="text-sand-500">Unit Price</span>
                        <span className="text-sand-900">${selectedService.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sand-500">Guests</span>
                        <span className="text-sand-900">× {people}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-4">
                      <span className="font-semibold text-sand-900">Total</span>
                      <span className="text-2xl font-bold text-terracotta-600">${totalPrice}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-sand-100 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-7 h-7 text-sand-400" />
                    </div>
                    <p className="text-sm text-sand-500">Select an experience to see your booking summary</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!serviceId || !date || !contactValue || !clientName}
                  className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  Submit Reservation
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-sand-400 text-center mt-3">No payment required — pay on arrival</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
