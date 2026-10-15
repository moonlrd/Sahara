import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

export type Page = 'home' | 'services' | 'booking' | 'login' | 'dashboard';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = (target: Page) => {
    if (target === 'services') {
      setPage('home');
      setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    if (target === 'dashboard' && !isLoggedIn) {
      setPage('login');
      return;
    }
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBookService = (serviceId: string) => {
    setBookingServiceId(serviceId);
    setPage('booking');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('home');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  switch (page) {
    case 'home':
      return <LandingPage onNavigate={navigate} onBookService={handleBookService} />;
    case 'booking':
      return <BookingPage onNavigate={navigate} preselectedServiceId={bookingServiceId} />;
    case 'login':
      return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;
    case 'dashboard':
      return <DashboardPage onNavigate={navigate} onLogout={handleLogout} />;
    default:
      return <LandingPage onNavigate={navigate} onBookService={handleBookService} />;
  }
}

export default App;
