import { useState } from 'react';
import { X, Calendar, Users, MessageSquare, Phone, Mail, AlertCircle } from 'lucide-react';
import { services } from '../data/mockData';
import type { Reservation } from '../data/mockData';

interface AddReservationModalProps {
  onClose: () => void;
  onSubmit: (reservation: Reservation) => void;
  nextId: string;
}

type ContactMethod = 'platform' | 'phone' | 'email';

const contactOptions: { key: ContactMethod; label: string; icon: typeof Phone }[] = [
  { key: 'platform', label: 'Platform', icon: MessageSquare },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'email', label: 'Email', icon: Mail },
];

export default function AddReservationModal({ onClose, onSubmit, nextId }: AddReservationModalProps) {
  const [clientName, setClientName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(2);
  const [contactMethod, setContactMethod] = useState<ContactMethod>('platform');
  const [contactValue, setContactValue] = useState('');
  const [assignedTo, setAssignedTo] = useState('Youssef A.');
  const [error, setError] = useState('');

  const selectedService = services.find((s) => s.id === serviceId) ?? null;
  const totalPrice = selectedService ? selectedService.price * people : 0;
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) { setError('Please enter the client name.'); return; }
    if (!serviceId) { setError('Please select a service.'); return; }
    if (!date) { setError('Please select a date.'); return; }
    if (!contactValue.trim()) { setError('Please enter contact details.'); return; }

    const newReservation: Reservation = {
      id: nextId,
      clientName: clientName.trim(),
      serviceTitle: selectedService!.title,
      serviceId: selectedService!.id,
      date,
      people,
      contactMethod,
      contactValue: contactValue.trim(),
      status: 'pending',
      assignedTo,
      createdAt: new Date().toISOString(),
      totalPrice,
    };

    onSubmit(newReservation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-thin shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-sand-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-display text-lg font-bold text-sand-900">Add New Reservation</h2>
            <p className="text-xs text-sand-500 mt-0.5">Create a manual booking entry</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-sand-100 flex items-center justify-center text-sand-600 hover:bg-sand-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Client name */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Jane Smith"
              className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
          </div>

          {/* Service select */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">Service</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all appearance-none"
            >
              <option value="">Select an experience...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.title} — ${s.price}/{s.priceUnit}</option>
              ))}
            </select>
          </div>

          {/* Date & people */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5" /> Date
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-2">
                <Users className="w-4 h-4 inline mr-1.5" /> People
              </label>
              <input
                type="number"
                min="1"
                max={selectedService?.capacity ?? 30}
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Assigned to */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">Assigned To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all appearance-none"
            >
              <option value="Youssef A.">Youssef A.</option>
              <option value="Fatima Z.">Fatima Z.</option>
              <option value="Karim B.">Karim B.</option>
              <option value="Said M.">Said M.</option>
            </select>
          </div>

          {/* Contact method */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">Contact Method</label>
            <div className="grid grid-cols-3 gap-2">
              {contactOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setContactMethod(opt.key)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                      contactMethod === opt.key ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-sand-200 text-sand-600 hover:border-sand-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact value */}
          <div>
            <label className="block text-sm font-medium text-sand-700 mb-2">Contact Details</label>
            <input
              type={contactMethod === 'email' ? 'email' : contactMethod === 'phone' ? 'tel' : 'text'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={contactMethod === 'email' ? 'you@email.com' : contactMethod === 'phone' ? '+212 6XX-XXXXXX' : '@username'}
              className="w-full px-4 py-3 rounded-xl border border-sand-300 bg-sand-50 text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
            />
          </div>

          {/* Summary */}
          {selectedService && (
            <div className="bg-sand-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-sand-500">Estimated Total</div>
                <div className="text-2xl font-bold text-terracotta-600">${totalPrice}</div>
              </div>
              <div className="text-right text-xs text-sand-500">
                <div>${selectedService.price} × {people} {people === 1 ? 'person' : 'people'}</div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-sand-300 text-sand-700 font-medium hover:bg-sand-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors active:scale-95"
            >
              Add Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
