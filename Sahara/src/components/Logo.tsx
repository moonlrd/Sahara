import { Compass } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-7 h-7', title: 'text-lg', subtitle: 'text-[10px]' },
    md: { icon: 'w-9 h-9', title: 'text-xl', subtitle: 'text-xs' },
    lg: { icon: 'w-12 h-12', title: 'text-2xl', subtitle: 'text-sm' },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s.icon} rounded-xl bg-gradient-to-br from-terracotta-400 to-terracotta-600 flex items-center justify-center shadow-sm`}>
        <Compass className="w-1/2 h-1/2 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`${s.title} font-display font-bold ${variant === 'light' ? 'text-white' : 'text-sand-900'} tracking-tight`}>
          Sahara
        </span>
        <span className={`${s.subtitle} font-medium ${variant === 'light' ? 'text-sand-200' : 'text-teal-600'} tracking-widest uppercase`}>
          Journeys
        </span>
      </div>
    </div>
  );
}
