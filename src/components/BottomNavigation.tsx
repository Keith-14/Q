import { Home, BookOpen, Users, MapPin, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: BookOpen, label: 'Quran', path: '/quran' },
  { icon: Users, label: 'Guftagu', path: '/forum' },
  { icon: MapPin, label: 'Places', path: '/places' },
  { icon: User, label: 'Account', path: '/account' },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-30 px-4 pb-4">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex flex-col items-center py-3 px-4 text-xs font-medium transition-all duration-200 ease-out rounded-xl",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-200",
                    isActive && "text-primary"
                  )} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "mt-1 transition-all duration-200",
                  isActive && "font-semibold"
                )}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};