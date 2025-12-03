import { Compass, BookOpen, BarChart3, Heart } from "lucide-react";

interface QuickActionsRowProps {
  onQibla: () => void;
  onQuran: () => void;
  onTrack: () => void;
  onMood: () => void;
}

export const QuickActionsRow = ({
  onQibla,
  onQuran,
  onTrack,
  onMood,
}: QuickActionsRowProps) => {
  const items = [
    { label: "Qibla", Icon: Compass, onClick: onQibla },
    { label: "Quran", Icon: BookOpen, onClick: onQuran },
    { label: "Track", Icon: BarChart3, onClick: onTrack },
    { label: "Mood", Icon: Heart, onClick: onMood },
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(({ label, Icon, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="flex flex-col items-center justify-center rounded-2xl bg-card px-2 py-3 text-foreground shadow-md transition-transform duration-200 hover:scale-105"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="mt-1 text-[11px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};
