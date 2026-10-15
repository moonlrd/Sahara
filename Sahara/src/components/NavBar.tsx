import type { Page } from '../App';

interface NavBarProps {
  current: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { key: Page; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'booking', label: 'Book Now' },
  { key: 'dashboard', label: 'Employee Hub' },
];

export default function NavBar({ current, onNavigate }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-sand-50/90 backdrop-blur-md border-b border-sand-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-sand-900 tracking-tight">Sahara</span>
              <span className="text-[10px] font-medium text-teal-600 tracking-widest uppercase">Journeys</span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  current === item.key
                    ? 'bg-sand-200 text-sand-900'
                    : 'text-sand-700 hover:bg-sand-100 hover:text-sand-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('login')}
            className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
          >
            Staff Login
          </button>

          <button
            onClick={() => onNavigate('booking')}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium"
          >
            Book
          </button>
        </div>
      </div>
    </nav>
  );
}
