import type { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Calendar, Bookmark, CheckSquare, Image, Home, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { tripDate } from '../data/mockData';
import { useTrip } from '../context/TripContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { tripTitle, resetTrip } = useTrip();

  const calculateDaysUntilTrip = () => {
    const today = new Date();
    const diffTime = tripDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilTrip = calculateDaysUntilTrip();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/plan', icon: Calendar, label: 'Plan' },
    { path: '/scrap', icon: Bookmark, label: 'Scrap' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/check', icon: CheckSquare, label: 'Check' },
    { path: '/memory', icon: Image, label: 'Memory' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{tripTitle || 'Futari-Tabi'}</h1>
        </div>

        {/* Prominent Countdown for Desktop */}
        <div className="mx-4 mb-6 p-4 bg-primary-50 rounded-xl border border-primary-100 text-center">
          <p className="text-sm text-gray-600 mb-1">旅行まであと</p>
          <div className="text-4xl font-bold text-primary-600 leading-none">
            {daysUntilTrip}
            <span className="text-sm font-normal text-gray-400 ml-1">日</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive
                    ? 'bg-gray-100 text-primary-600 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-600" : "text-gray-400")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              if (confirm('アプリを初期化しますか？データは全て消去されます。')) {
                resetTrip();
                window.location.reload();
              }
            }}
            className="flex items-center gap-3 px-4 py-2 w-full text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="text-xs">アプリをリセット</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className={cn("md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-4 shrink-0", location.pathname === '/' && "hidden")}>
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-gray-800">{tripTitle || 'Futari-Tabi'}</h1>
            <p className="text-sm text-gray-600 mt-1">
              旅行まであと <span className="font-semibold text-primary-600">{daysUntilTrip}</span> 日
            </p>
          </div>
        </header>

        <main className={cn(
          "flex-1 md:pb-0",
          location.pathname === '/' ? "overflow-hidden pb-16" : "overflow-y-auto pb-20" // Map needs overflow-hidden, others auto. Mobile nav is 16/20 spacing.
        )}>
          <div className={cn(
            "h-full mx-auto",
            location.pathname === '/'
              ? "w-full p-0" // Full width/height for map, no padding
              : "max-w-md md:max-w-5xl md:p-8" // Standard container for others
          )}>
            {children}
          </div>
        </main>

        {/* Mobile Footer Navigation (Hidden on Desktop) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <div className="flex justify-around items-center h-16">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                      isActive
                        ? 'text-primary-600'
                        : 'text-gray-400 hover:text-gray-600'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs mt-1 font-medium">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
