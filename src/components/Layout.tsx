import { ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';
import { SideMenu } from './SideMenu';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  showHeader?: boolean;
}

export const Layout = ({ children, showNavigation = true, showHeader = true }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const location = useLocation();

  // Trigger page transition animation on route change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden font-arabic">
      {/* Watercolor atmospheric background - Black & Green */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Deep black base */}
        <div className="absolute inset-0 bg-[hsl(0_0%_3%)]" />
        
        {/* Watercolor blob - top right */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,hsl(145_25%_45%/0.15)_0%,hsl(145_30%_40%/0.08)_40%,transparent_70%)] blur-3xl" />
        
        {/* Watercolor blob - top left */}
        <div className="absolute top-40 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,hsl(150_20%_42%/0.12)_0%,hsl(145_25%_38%/0.06)_50%,transparent_70%)] blur-3xl" />
        
        {/* Watercolor blob - center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[radial-gradient(ellipse,hsl(145_28%_46%/0.1)_0%,hsl(148_22%_40%/0.05)_45%,transparent_70%)] blur-3xl" />
        
        {/* Watercolor blob - bottom */}
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,hsl(142_22%_44%/0.12)_0%,hsl(145_25%_40%/0.06)_40%,transparent_65%)] blur-3xl" />
        
        {/* Subtle texture overlay for watercolor feel */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[hsl(0_0%_3%)] to-transparent" />
      </div>
      
      {showHeader && <TopHeader onMenuClick={handleMenuClick} />}
      
      <main className={cn(
        "flex-1 relative z-10",
        showNavigation && "pb-24",
        isTransitioning && "animate-fade-in"
      )}>
        {children}
      </main>
      
      {showNavigation && <BottomNavigation />}
      
      {/* Side Menu */}
      <SideMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
    </div>
  );
};
