import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import type { Page } from '../App';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: () => void;
}

const heroImage = 'https://images.pexels.com/photos/16299830/pexels-photo-16299830.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }
    setError('');
    onLogin();
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 bg-sand-50 relative">
        <button
          onClick={() => onNavigate('home')}
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-sand-600 hover:text-sand-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-sand-900">Sahara</span>
              <span className="text-[10px] font-medium text-teal-600 tracking-widest uppercase">Journeys</span>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-sand-900 mb-2">Staff Login</h1>
          <p className="text-sand-600 mb-8">Sign in to manage reservations and coordinate trips.</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-sand-700 mb-2">Email Address</label>
              <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@saharajourneys.ma"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-sand-700">Password</label>
                <button type="button" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-sand-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-sand-300 bg-white text-sand-900 placeholder:text-sand-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-sand-600 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-sand-300 text-teal-600 focus:ring-teal-500" />
              Remember me on this device
            </label>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-sand-200">
            <div className="flex items-center gap-2 text-xs text-sand-500">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              <span>Demo mode — any email and password will work.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — hero image */}
      <div className="hidden lg:flex flex-1 relative">
        <img src={heroImage} alt="Desert sunset" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-sand-900/70 via-terracotta-900/40 to-sand-900/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
          <div className="max-w-md">
            <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight mb-4 text-balance">
              Coordinating Unforgettable Journeys
            </h2>
            <p className="text-sand-200 leading-relaxed">
              Manage reservations, coordinate with partners, and deliver exceptional experiences — all from one dashboard.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <div className="text-3xl font-bold text-white">10</div>
                <div className="text-sm text-sand-300">Active Reservations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">5</div>
                <div className="text-sm text-sand-300">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15</div>
                <div className="text-sm text-sand-300">Partners</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
