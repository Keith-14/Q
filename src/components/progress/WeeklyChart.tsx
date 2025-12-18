import { Card } from '@/components/ui/card';

interface DayData {
  date: string;
  dayName: string;
  completed: number;
  total: number;
}

interface WeeklyChartProps {
  data: DayData[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  const maxHeight = 60; // pixels

  return (
    <Card className="p-4 rounded-2xl bg-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Last 7 Days</h3>
      <div className="flex items-end justify-between gap-2">
        {data.map((day, index) => {
          const height = day.total > 0 ? (day.completed / day.total) * maxHeight : 0;
          const isToday = index === data.length - 1;
          const isComplete = day.completed === day.total;

          return (
            <div key={day.date} className="flex flex-col items-center gap-2 flex-1">
              <div
                className="relative w-full flex flex-col items-center"
                style={{ height: maxHeight }}
              >
                {/* Background bar */}
                <div
                  className="absolute bottom-0 w-full rounded-t-sm bg-muted"
                  style={{ height: maxHeight }}
                />
                {/* Progress bar */}
                <div
                  className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-300 ${
                    isComplete ? 'bg-primary' : 'bg-primary/60'
                  }`}
                  style={{ height: height || 2 }}
                />
                {/* Completed count */}
                <span className="absolute -top-5 text-xs font-medium text-foreground">
                  {day.completed}
                </span>
              </div>
              <span
                className={`text-xs ${
                  isToday ? 'font-bold text-primary' : 'text-muted-foreground'
                }`}
              >
                {day.dayName}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>All prayers</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <span>Partial</span>
        </div>
      </div>
    </Card>
  );
};
