import { useState } from 'react';
import chatAvatar from '@/assets/chat-avatar.webp';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export const FloatingChatButton = ({ onClick }: FloatingChatButtonProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 border-2 border-primary/40 shadow-[0_0_25px_-5px_hsl(145_70%_45%/0.5)] hover:shadow-[0_0_35px_-5px_hsl(145_70%_45%/0.7)] hover:scale-110 transition-all duration-300 overflow-hidden flex items-center justify-center transform-gpu"
      aria-label="Open chat assistant"
    >
      {!imgError ? (
        <img 
          src={chatAvatar} 
          alt="" 
          draggable={false}
          className="w-11 h-11 object-contain flex-shrink-0 relative z-10 block pointer-events-none" 
          onError={() => setImgError(true)}
        />
      ) : (
        <MessageCircle className="w-7 h-7 text-primary absolute z-10" strokeWidth={1.5} />
      )}
    </button>
  );
};
