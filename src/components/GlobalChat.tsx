import { useState, useRef, useEffect, PointerEvent as ReactPointerEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingChatButton } from './FloatingChatButton';
import { ChatAssistant } from './ChatAssistant';

export const GlobalChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  
  const iconRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ clientX: number; clientY: number, initialX: number, initialY: number } | null>(null);

  // Set initial position on mount
  useEffect(() => {
    // 14 * 4 = 56px (w-14 h-14)
    // 28 * 4 = 112px (bottom-28)
    // 4 * 4 = 16px (right-4)
    if (position === null) {
      const initialY = window.innerHeight - 112 - 56;
      const initialX = window.innerWidth - 16 - 56;
      setPosition({ x: initialX, y: initialY });
    }
  }, []);

  // Handle window resize to keep it on screen
  useEffect(() => {
    const handleResize = () => {
      if (position) {
        snapToEdge(position.x, position.y);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isChatOpen) return;
    
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialX: position?.x || window.innerWidth - 72,
      initialY: position?.y || window.innerHeight - 168
    };
    
    // Set pointer capture to track outside the element
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    setIsDragging(true);

    const deltaX = e.clientX - dragStartRef.current.clientX;
    const deltaY = e.clientY - dragStartRef.current.clientY;

    setPosition({
      x: dragStartRef.current.initialX + deltaX,
      y: dragStartRef.current.initialY + deltaY
    });
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    
    // If it was a very small drag, treat it as a click
    const deltaX = Math.abs(e.clientX - dragStartRef.current.clientX);
    const deltaY = Math.abs(e.clientY - dragStartRef.current.clientY);
    
    if (deltaX < 5 && deltaY < 5) {
      setIsChatOpen(true);
      dragStartRef.current = null;
      setTimeout(() => setIsDragging(false), 50);
      return;
    }
    
    // It was a true drag, snap to the nearest edge
    if (position) {
      snapToEdge(position.x, position.y);
    }
    
    dragStartRef.current = null;
    // Short delay before removing drag state so onClick won't mistakenly fire
    setTimeout(() => setIsDragging(false), 50); 
  };

  const snapToEdge = (currentX: number, currentY: number) => {
    const margin = 16; 
    const iconWidth = 56;
    const iconHeight = 56;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Only snap Horizontally (Left or Right)
    const distLeft = currentX;
    const distRight = viewportWidth - (currentX + iconWidth);

    // Force it to stick to the left or right bounding edge
    const newX = distLeft < distRight ? margin : Math.max(0, viewportWidth - iconWidth - margin);
    
    // Clamp Y to viewport to keep it freely draggable up/down along those edges
    const newY = Math.max(margin, Math.min(currentY, viewportHeight - iconHeight - margin));

    setPosition({ x: newX, y: newY });
  };

  if (location.pathname === '/login' || location.pathname === '/loading') return null;

  return (
    <>
      {!isChatOpen && (
        <div 
          ref={iconRef}
          style={{ 
            position: 'fixed', 
            left: position?.x ?? 'auto', 
            top: position?.y ?? 'auto', 
            right: position === null ? 16 : 'auto',
            bottom: position === null ? 112 : 'auto',
            zIndex: 999,
            touchAction: 'none', // Prevents scrolling on touch phones when dragging
            transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <FloatingChatButton onClick={() => {
            if (!isDragging) setIsChatOpen(true);
          }} />
        </div>
      )}

      <ChatAssistant open={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
