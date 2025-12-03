import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PrayerOverviewCardProps {
  currentPrayerName: string;
  currentTime: string;
  nextTimeLabel: string;
}

const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const normalizePrayerName = (label: string) => {
  if (!label) return "";
  return label
    .replace("Next:", "")
    .replace("Time", "")
    .trim()
    .split(" ")[0];
};

export const PrayerOverviewCard = ({
  currentPrayerName,
  currentTime,
  nextTimeLabel,
}: PrayerOverviewCardProps) => {
  const activePrayer = normalizePrayerName(currentPrayerName);

  return (
    <Card className="relative overflow-hidden rounded-3xl border-none bg-gradient-to-r from-primary to-sage-dark px-5 py-4 text-primary-foreground shadow-lg">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary-foreground/10" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-80">Next Prayer</p>
          <p className="mt-1 text-lg font-semibold">
            {activePrayer || "Upcoming"}
          </p>
          <p className="mt-2 text-[11px] opacity-80">
            {nextTimeLabel || "Prayer schedule updates live throughout the day."}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs opacity-80">Current Time</p>
          <p className="mt-1 text-2xl font-bold">
            {currentTime || "--:--:--"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary-foreground/10 px-4 py-2">
        {PRAYER_NAMES.map((name) => (
          <div key={name} className="flex flex-col items-center">
            <span
              className={cn(
                "h-2 w-2 rounded-full bg-primary-foreground/40",
                activePrayer === name && "bg-primary-foreground"
              )}
            />
            <span
              className={cn(
                "mt-1 text-[10px] opacity-70",
                activePrayer === name && "font-medium opacity-100"
              )}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
