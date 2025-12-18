import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, Flame, Loader2 } from 'lucide-react';
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
        <div className="px-4 py-6 space-y-6">
          <h1 className="text-2xl font-bold text-primary">Your Progress</h1>
          <Card className="p-6 rounded-2xl bg-card text-center">
            <p className="text-muted-foreground">Please log in to track your prayers</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-primary">Your Progress</h1>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary text-primary-foreground p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <Flame className="h-5 w-5" />
              <h3 className="font-bold text-lg">{streak.current_streak}</h3>
            </div>
            <p className="text-sm opacity-90">DAY STREAK</p>
          </Card>
          <Card className="bg-primary text-primary-foreground p-4 rounded-2xl text-center">
            <h3 className="font-bold text-lg">{progressPercentage}%</h3>
            <p className="text-sm opacity-90">TODAY'S PROGRESS</p>
          </Card>
        </div>

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} />

        {/* Prayer Checklist */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Today's Prayers</h2>
          {prayerStatus.map((prayer) => (
            <Card key={prayer.name} className="p-4 rounded-2xl bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {prayer.name}
                  </div>
                </div>
                <Button
                  variant={prayer.completed ? "default" : "outline"}
                  onClick={() => togglePrayer(prayer.key)}
                  className={`rounded-full ${
                    prayer.completed 
                      ? "bg-primary text-primary-foreground" 
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {prayer.completed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      DONE
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      MARK AS DONE
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Longest Streak */}
        {streak.longest_streak > 0 && (
          <Card className="p-4 rounded-2xl bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Longest streak: <span className="font-bold text-foreground">{streak.longest_streak} days</span>
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
};
