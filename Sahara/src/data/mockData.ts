export type Category = 'adventure' | 'cultural' | 'accommodation' | 'dining' | 'transport';

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  priceUnit: string;
  duration: string;
  category: Category;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  capacity: number;
  tags: string[];
}

export interface Reservation {
  id: string;
  clientName: string;
  serviceTitle: string;
  serviceId: string;
  date: string;
  people: number;
  contactMethod: 'platform' | 'phone' | 'email';
  contactValue: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed';
  assignedTo: string;
  createdAt: string;
  totalPrice: number;
}

export const categoryLabels: Record<Category, string> = {
  adventure: 'Adventure',
  cultural: 'Cultural',
  accommodation: 'Accommodation',
  dining: 'Dining',
  transport: 'Transport',
};

export const categoryColors: Record<Category, string> = {
  adventure: 'bg-terracotta-100 text-terracotta-700',
  cultural: 'bg-teal-100 text-teal-700',
  accommodation: 'bg-sand-200 text-sand-800',
  dining: 'bg-amber-100 text-amber-700',
  transport: 'bg-blue-100 text-blue-700',
};

export const services: Service[] = [
  {
    id: 'camel-trek',
    title: 'Sunset Camel Trek',
    description: 'Ride a camel caravan across golden dunes as the sun dips below the horizon.',
    longDescription: 'Join an authentic camel caravan led by Berber guides across the Erg Chebbi dunes. Watch the sky transform into a canvas of orange and violet as you trek to a traditional nomad camp for mint tea. Perfect for couples and families.',
    price: 45,
    priceUnit: 'per person',
    duration: '3 hours',
    category: 'adventure',
    image: 'https://images.pexels.com/photos/12378901/pexels-photo-12378901.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Merzouga, Sahara',
    rating: 4.9,
    reviews: 247,
    capacity: 12,
    tags: ['Sunset', 'Guided', 'Berber Tea'],
  },
  {
    id: 'quad-biking',
    title: 'Desert Quad Biking',
    description: 'Thrill through sand dunes on a powerful quad bike with expert guidance.',
    longDescription: 'Experience an adrenaline rush as you navigate the Sahara on a 250cc quad bike. Safety gear, briefing, and expert guides included. Suitable for beginners and experienced riders alike.',
    price: 70,
    priceUnit: 'per person',
    duration: '2 hours',
    category: 'adventure',
    image: 'https://images.pexels.com/photos/11294565/pexels-photo-11294565.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Agafay Desert',
    rating: 4.8,
    reviews: 189,
    capacity: 8,
    tags: ['Adrenaline', 'Safety Gear', 'Guided'],
  },
  {
    id: 'luxury-camp',
    title: 'Luxury Desert Camp',
    description: 'Overnight in a premium tented camp under the stars with full board.',
    longDescription: 'Spend a magical night in a luxury desert camp with private tents, en-suite bathrooms, and gourmet Moroccan cuisine. Enjoy stargazing, traditional music around the campfire, and a spectacular sunrise over the dunes.',
    price: 180,
    priceUnit: 'per person',
    duration: '1 night',
    category: 'accommodation',
    image: 'https://images.pexels.com/photos/35976808/pexels-photo-35976808.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Erg Chebbi, Sahara',
    rating: 4.9,
    reviews: 312,
    capacity: 20,
    tags: ['Full Board', 'Stargazing', 'Private Tent'],
  },
  {
    id: '4x4-tour',
    title: '4x4 Desert Safari',
    description: 'Off-road adventure through remote desert landscapes and oases.',
    longDescription: 'Climb aboard a Land Cruiser for a full-day 4x4 safari visiting hidden oases, fossil beds, and nomad settlements. Includes lunch at a local family home and hotel pickup.',
    price: 95,
    priceUnit: 'per person',
    duration: 'Full day',
    category: 'adventure',
    image: 'https://images.pexels.com/photos/10658203/pexels-photo-10658203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Atlas to Sahara',
    rating: 4.7,
    reviews: 156,
    capacity: 6,
    tags: ['Off-road', 'Lunch Included', 'Hotel Pickup'],
  },
  {
    id: 'berber-village',
    title: 'Berber Village Experience',
    description: 'Immerse yourself in Berber culture with a village visit and cooking class.',
    longDescription: 'Visit a traditional Berber village in the Atlas Mountains. Learn to bake bread in a clay oven, prepare tagine with a local family, and discover centuries-old traditions. A deeply authentic cultural exchange.',
    price: 55,
    priceUnit: 'per person',
    duration: '5 hours',
    category: 'cultural',
    image: 'https://images.pexels.com/photos/37684085/pexels-photo-37684085.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'High Atlas Mountains',
    rating: 4.9,
    reviews: 98,
    capacity: 10,
    tags: ['Cooking Class', 'Authentic', 'Family Visit'],
  },
  {
    id: 'hot-air-balloon',
    title: 'Sunrise Hot Air Balloon',
    description: 'Float above the desert at dawn with a champagne breakfast.',
    longDescription: 'Rise before dawn for an unforgettable hot air balloon flight over the desert. Enjoy panoramic views of the sun rising over dunes and mountains, followed by a champagne breakfast at the landing site.',
    price: 250,
    priceUnit: 'per person',
    duration: '4 hours',
    category: 'adventure',
    image: 'https://images.pexels.com/photos/5318766/pexels-photo-5318766.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Marrakech Desert',
    rating: 5.0,
    reviews: 134,
    capacity: 16,
    tags: ['Sunrise', 'Champagne', 'Breakfast'],
  },
  {
    id: 'traditional-dinner',
    title: 'Traditional Moroccan Dinner',
    description: 'Savor a multi-course Moroccan feast at a desert restaurant.',
    longDescription: 'Enjoy a traditional Moroccan dinner featuring harira soup, lamb tagine, couscous, and pastilla. Live Andalusian music accompanies your meal in an atmospheric desert-adjacent restaurant.',
    price: 35,
    priceUnit: 'per person',
    duration: '2 hours',
    category: 'dining',
    image: 'https://images.pexels.com/photos/36984667/pexels-photo-36984667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'Ouarzazate',
    rating: 4.6,
    reviews: 203,
    capacity: 30,
    tags: ['Multi-course', 'Live Music', 'Vegetarian Option'],
  },
  {
    id: 'private-transfer',
    title: 'Private Airport Transfer',
    description: 'Comfortable door-to-door transport in an air-conditioned vehicle.',
    longDescription: 'Start your trip stress-free with a private airport transfer. Professional drivers, air-conditioned vehicles, and complimentary water. Available 24/7 for all major airports and cities.',
    price: 30,
    priceUnit: 'per trip',
    duration: '1 hour',
    category: 'transport',
    image: 'https://images.pexels.com/photos/13118554/pexels-photo-13118554.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    location: 'All Major Cities',
    rating: 4.5,
    reviews: 321,
    capacity: 4,
    tags: ['24/7', 'Air-conditioned', 'Complimentary Water'],
  },
];

export const reservations: Reservation[] = [
  {
    id: 'RES-2401',
    clientName: 'James Whitfield',
    serviceTitle: 'Sunset Camel Trek',
    serviceId: 'camel-trek',
    date: '2026-10-18',
    people: 2,
    contactMethod: 'platform',
    contactValue: '@jwhitfield',
    status: 'pending',
    assignedTo: 'Youssef A.',
    createdAt: '2026-10-14T09:32:00Z',
    totalPrice: 90,
  },
  {
    id: 'RES-2402',
    clientName: 'Sofia Marenco',
    serviceTitle: 'Luxury Desert Camp',
    serviceId: 'luxury-camp',
    date: '2026-10-17',
    people: 4,
    contactMethod: 'email',
    contactValue: 'sofia.marenco@email.com',
    status: 'confirmed',
    assignedTo: 'Fatima Z.',
    createdAt: '2026-10-13T14:15:00Z',
    totalPrice: 720,
  },
  {
    id: 'RES-2403',
    clientName: 'Daniel Okafor',
    serviceTitle: 'Desert Quad Biking',
    serviceId: 'quad-biking',
    date: '2026-10-15',
    people: 3,
    contactMethod: 'phone',
    contactValue: '+212 612-345678',
    status: 'in_progress',
    assignedTo: 'Karim B.',
    createdAt: '2026-10-12T11:00:00Z',
    totalPrice: 210,
  },
  {
    id: 'RES-2404',
    clientName: 'Yuki Tanaka',
    serviceTitle: 'Sunrise Hot Air Balloon',
    serviceId: 'hot-air-balloon',
    date: '2026-10-16',
    people: 2,
    contactMethod: 'platform',
    contactValue: '@yukitanaka',
    status: 'confirmed',
    assignedTo: 'Youssef A.',
    createdAt: '2026-10-14T08:20:00Z',
    totalPrice: 500,
  },
  {
    id: 'RES-2405',
    clientName: 'Elena Petrov',
    serviceTitle: 'Berber Village Experience',
    serviceId: 'berber-village',
    date: '2026-10-14',
    people: 5,
    contactMethod: 'email',
    contactValue: 'elena.petrov@email.com',
    status: 'completed',
    assignedTo: 'Fatima Z.',
    createdAt: '2026-10-10T16:45:00Z',
    totalPrice: 275,
  },
  {
    id: 'RES-2406',
    clientName: 'Marcus Hale',
    serviceTitle: '4x4 Desert Safari',
    serviceId: '4x4-tour',
    date: '2026-10-20',
    people: 4,
    contactMethod: 'phone',
    contactValue: '+44 7700 900123',
    status: 'pending',
    assignedTo: 'Karim B.',
    createdAt: '2026-10-15T07:10:00Z',
    totalPrice: 380,
  },
  {
    id: 'RES-2407',
    clientName: 'Amara Diallo',
    serviceTitle: 'Traditional Moroccan Dinner',
    serviceId: 'traditional-dinner',
    date: '2026-10-16',
    people: 6,
    contactMethod: 'platform',
    contactValue: '@amaradiollo',
    status: 'confirmed',
    assignedTo: 'Said M.',
    createdAt: '2026-10-13T19:30:00Z',
    totalPrice: 210,
  },
  {
    id: 'RES-2408',
    clientName: 'Liam Connolly',
    serviceTitle: 'Private Airport Transfer',
    serviceId: 'private-transfer',
    date: '2026-10-15',
    people: 3,
    contactMethod: 'phone',
    contactValue: '+353 86 123 4567',
    status: 'completed',
    assignedTo: 'Said M.',
    createdAt: '2026-10-11T10:00:00Z',
    totalPrice: 30,
  },
  {
    id: 'RES-2409',
    clientName: 'Priya Sharma',
    serviceTitle: 'Sunset Camel Trek',
    serviceId: 'camel-trek',
    date: '2026-10-19',
    people: 4,
    contactMethod: 'email',
    contactValue: 'priya.sharma@email.com',
    status: 'in_progress',
    assignedTo: 'Youssef A.',
    createdAt: '2026-10-14T15:00:00Z',
    totalPrice: 180,
  },
  {
    id: 'RES-2410',
    clientName: 'Olivia Chen',
    serviceTitle: 'Luxury Desert Camp',
    serviceId: 'luxury-camp',
    date: '2026-10-22',
    people: 2,
    contactMethod: 'platform',
    contactValue: '@oliviachen',
    status: 'pending',
    assignedTo: 'Fatima Z.',
    createdAt: '2026-10-15T06:45:00Z',
    totalPrice: 360,
  },
];

export const statusConfig = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    border: 'border-amber-200',
  },
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-teal-100',
    text: 'text-teal-700',
    dot: 'bg-teal-500',
    border: 'border-teal-200',
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    border: 'border-blue-200',
  },
  completed: {
    label: 'Completed',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    border: 'border-green-200',
  },
} as const;

export const contactMethodLabels: Record<Reservation['contactMethod'], string> = {
  platform: 'Platform Message',
  phone: 'Phone Call',
  email: 'Email',
};

export type PartnerType = 'host' | 'driver' | 'guide';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  subtype: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  servicesHandled: string[];
  availability: 'available' | 'busy' | 'off_duty';
  avatarColor: string;
}

export const partnerTypeLabels: Record<PartnerType, string> = {
  host: 'Host',
  driver: 'Driver',
  guide: 'Guide',
};

export const partnerTypeConfig: Record<PartnerType, { label: string; pluralLabel: string; icon: string }> = {
  host: { label: 'Host', pluralLabel: 'Hosts', icon: 'Building2' },
  driver: { label: 'Driver', pluralLabel: 'Drivers', icon: 'Car' },
  guide: { label: 'Guide', pluralLabel: 'Guides', icon: 'MapPin' },
};

export const availabilityConfig: Record<Partner['availability'], { label: string; bg: string; text: string; dot: string }> = {
  available: { label: 'Available', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  busy: { label: 'Busy', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  off_duty: { label: 'Off Duty', bg: 'bg-sand-100', text: 'text-sand-500', dot: 'bg-sand-400' },
};

export const partners: Partner[] = [
  { id: 'P-01', name: 'Erg Chebbi Luxury Camp', type: 'host', subtype: 'Desert Camp', location: 'Merzouga', phone: '+212 535-877201', email: 'stay@ergchebbicamp.ma', rating: 4.9, servicesHandled: ['luxury-camp'], availability: 'available', avatarColor: 'bg-terracotta-500' },
  { id: 'P-02', name: 'La Maison Arabe', type: 'host', subtype: 'Restaurant', location: 'Marrakech', phone: '+212 524-338020', email: 'contact@lamaisonarabe.ma', rating: 4.7, servicesHandled: ['traditional-dinner'], availability: 'available', avatarColor: 'bg-teal-500' },
  { id: 'P-03', name: 'Riad Ksar Anika', type: 'host', subtype: 'Hotel', location: 'Ouarzazate', phone: '+212 524-885500', email: 'info@ksaraniqa.ma', rating: 4.8, servicesHandled: ['luxury-camp', '4x4-tour'], availability: 'busy', avatarColor: 'bg-blue-500' },
  { id: 'P-04', name: 'Chez Berbere Restaurant', type: 'host', subtype: 'Restaurant', location: 'Ouarzazate', phone: '+212 524-677810', email: 'hello@chezberbere.ma', rating: 4.6, servicesHandled: ['traditional-dinner', 'berber-village'], availability: 'available', avatarColor: 'bg-amber-500' },
  { id: 'P-05', name: 'Desert Activity Center', type: 'host', subtype: 'Activity Provider', location: 'Agafay', phone: '+212 661-220033', email: 'info@desertactivity.ma', rating: 4.8, servicesHandled: ['quad-biking', '4x4-tour'], availability: 'available', avatarColor: 'bg-terracotta-400' },

  { id: 'D-01', name: 'Hassan El Idrissi', type: 'driver', subtype: '4x4 Specialist', location: 'Marrakech', phone: '+212 661-445566', email: 'hassan.driv@gmail.com', rating: 4.9, servicesHandled: ['4x4-tour', 'private-transfer', 'camel-trek'], availability: 'available', avatarColor: 'bg-teal-600' },
  { id: 'D-02', name: 'Omar Tazi', type: 'driver', subtype: 'Van & Transfer', location: 'Marrakech', phone: '+212 662-778899', email: 'omar.tazi@gmail.com', rating: 4.7, servicesHandled: ['private-transfer', 'luxury-camp'], availability: 'busy', avatarColor: 'bg-blue-600' },
  { id: 'D-03', name: 'Brahim Alaoui', type: 'driver', subtype: 'All-round', location: 'Ouarzazate', phone: '+212 663-112233', email: 'brahim.alaoui@gmail.com', rating: 4.8, servicesHandled: ['4x4-tour', 'hot-air-balloon', 'berber-village'], availability: 'available', avatarColor: 'bg-terracotta-600' },

  { id: 'G-01', name: 'Fatima Zahra', type: 'guide', subtype: 'Cultural & Berber', location: 'Marrakech', phone: '+212 664-556677', email: 'fatima.guide@gmail.com', rating: 5.0, servicesHandled: ['berber-village', 'camel-trek'], availability: 'available', avatarColor: 'bg-teal-500' },
  { id: 'G-02', name: 'Karim Benani', type: 'guide', subtype: 'Desert & Adventure', location: 'Merzouga', phone: '+212 665-889900', email: 'karim.benani@gmail.com', rating: 4.9, servicesHandled: ['camel-trek', 'quad-biking', '4x4-tour', 'luxury-camp'], availability: 'available', avatarColor: 'bg-amber-600' },
  { id: 'G-03', name: 'Nadia Cherkaoui', type: 'guide', subtype: 'Multi-lingual', location: 'Marrakech', phone: '+212 666-223344', email: 'nadia.cherk@gmail.com', rating: 4.8, servicesHandled: ['hot-air-balloon', 'berber-village', 'traditional-dinner'], availability: 'off_duty', avatarColor: 'bg-blue-500' },
];

export interface Trip {
  id: string;
  reservationId: string;
  clientName: string;
  serviceTitle: string;
  date: string;
  people: number;
  totalPrice: number;
  hostId: string | null;
  driverId: string | null;
  guideId: string | null;
  status: Reservation['status'];
  createdAt: string;
}

export const initialTrips: Trip[] = [
  { id: 'TRIP-001', reservationId: 'RES-2402', clientName: 'Sofia Marenco', serviceTitle: 'Luxury Desert Camp', date: '2026-10-17', people: 4, totalPrice: 720, hostId: 'P-01', driverId: 'D-02', guideId: 'G-02', status: 'confirmed', createdAt: '2026-10-13T16:00:00Z' },
  { id: 'TRIP-002', reservationId: 'RES-2404', clientName: 'Yuki Tanaka', serviceTitle: 'Sunrise Hot Air Balloon', date: '2026-10-16', people: 2, totalPrice: 500, hostId: 'P-05', driverId: 'D-03', guideId: null, status: 'confirmed', createdAt: '2026-10-14T09:00:00Z' },
  { id: 'TRIP-003', reservationId: 'RES-2403', clientName: 'Daniel Okafor', serviceTitle: 'Desert Quad Biking', date: '2026-10-15', people: 3, totalPrice: 210, hostId: 'P-05', driverId: 'D-01', guideId: 'G-02', status: 'in_progress', createdAt: '2026-10-12T12:00:00Z' },
  { id: 'TRIP-004', reservationId: 'RES-2405', clientName: 'Elena Petrov', serviceTitle: 'Berber Village Experience', date: '2026-10-14', people: 5, totalPrice: 275, hostId: 'P-04', driverId: 'D-03', guideId: 'G-01', status: 'completed', createdAt: '2026-10-10T17:30:00Z' },
  { id: 'TRIP-005', reservationId: 'RES-2407', clientName: 'Amara Diallo', serviceTitle: 'Traditional Moroccan Dinner', date: '2026-10-16', people: 6, totalPrice: 210, hostId: 'P-02', driverId: 'D-01', guideId: null, status: 'confirmed', createdAt: '2026-10-13T20:00:00Z' },
  { id: 'TRIP-006', reservationId: 'RES-2408', clientName: 'Liam Connolly', serviceTitle: 'Private Airport Transfer', date: '2026-10-15', people: 3, totalPrice: 30, hostId: null, driverId: 'D-02', guideId: null, status: 'completed', createdAt: '2026-10-11T11:00:00Z' },
  { id: 'TRIP-007', reservationId: 'RES-2409', clientName: 'Priya Sharma', serviceTitle: 'Sunset Camel Trek', date: '2026-10-19', people: 4, totalPrice: 180, hostId: 'P-01', driverId: 'D-01', guideId: 'G-01', status: 'in_progress', createdAt: '2026-10-14T16:00:00Z' },
];
