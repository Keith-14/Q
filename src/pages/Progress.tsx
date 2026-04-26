import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Flame, Loader2, Trophy } from 'lucide-react';
import { useSalahTracker } from '@/hooks/useSalahTracker';
import { WeeklyChart } from '@/components/progress/WeeklyChart';
import { useAuth } from '@/contexts/AuthContext';

export const Progress = () => {
  const { user } = useAuth();
  const {
    loading,
    prayerStatus,
    streak,
    togglePrayer,
    progressPercentage,
    weeklyData,
  } = useSalahTracker();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="px-5 py-6 space-y-6">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Your Progress</h1>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to track your prayers</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-5 py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Your Progress</h1>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 border-0 shadow-lg">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-primary-foreground/20">
                <Flame className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold">{streak.current_streak}</span>
            </div>
            <p className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Day Streak</p>
          </Card>
          <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5 border-0 shadow-lg">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-xl bg-primary-foreground/20">
                <Trophy className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold">{progressPercentage}%</span>
            </div>
            <p className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wider">Today's Progress</p>
          </Card>
        </div>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Prayer Checklist */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Today's Prayers</h2>
          <div className="space-y-2.5">
            {prayerStatus.map((prayer) => (
              <Card key={prayer.name} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl transition-colors duration-200 ${
                      prayer.completed 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    }`}>
                      {prayer.completed ? (
                        <CheckCircle className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <Circle className="h-4 w-4" strokeWidth={2} />
                      )}
                    </div>
                    <span className="font-medium text-foreground">{prayer.name}</span>
                  </div>
                  <Button
                    variant={prayer.completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePrayer(prayer.key)}
                    className={`rounded-xl px-4 transition-all duration-200 ${
                      prayer.completed 
                        ? "bg-primary hover:bg-primary/90" 
                        : "border-border hover:bg-primary/5 hover:border-primary/50"
                    }`}
                  >
                    {prayer.completed ? 'Completed' : 'Mark Done'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Longest Streak */}
        {streak.longest_streak > 0 && (
          <Card className="p-4 bg-muted/30 border-0 text-center">
            <p className="text-sm text-muted-foreground">
              Longest streak: <span className="font-semibold text-foreground">{streak.longest_streak} days</span>
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};