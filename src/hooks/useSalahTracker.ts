import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SalahLog {
  id: string;
  user_id: string;
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface SalahStreak {
  current_streak: number;
  longest_streak: number;
  last_updated: string;
}

interface PrayerStatus {
  name: string;
  key: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  completed: boolean;
}

const PRAYER_KEYS: Array<'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'> = [
  'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'
];

export const useSalahTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayLog, setTodayLog] = useState<SalahLog | null>(null);
  const [streak, setStreak] = useState<SalahStreak>({ current_streak: 0, longest_streak: 0, last_updated: '' });
  const [weeklyLogs, setWeeklyLogs] = useState<SalahLog[]>([]);

  const getToday = () => new Date().toISOString().split('T')[0];

  const getPrayerStatus = useCallback((): PrayerStatus[] => {
    return [
      { name: 'FAJR', key: 'fajr', completed: todayLog?.fajr ?? false },
      { name: 'DHUHR', key: 'dhuhr', completed: todayLog?.dhuhr ?? false },
      { name: 'ASR', key: 'asr', completed: todayLog?.asr ?? false },
      { name: 'MAGHRIB', key: 'maghrib', completed: todayLog?.maghrib ?? false },
      { name: "ISHA'A", key: 'isha', completed: todayLog?.isha ?? false },
    ];
  }, [todayLog]);

  const fetchTodayLog = useCallback(async () => {
    if (!user) return;
    
    const today = getToday();
    const { data, error } = await supabase
      .from('salah_log')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching today log:', error);
      return;
    }
    
    setTodayLog(data);
  }, [user]);

  const fetchStreak = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('salah_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching streak:', error);
      return;
    }

    if (data) {
      setStreak({
        current_streak: data.current_streak,
        longest_streak: data.longest_streak,
        last_updated: data.last_updated,
      });
    }
  }, [user]);

  const fetchWeeklyLogs = useCallback(async () => {
    if (!user) return;

    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const { data, error } = await supabase
      .from('salah_log')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekAgo.toISOString().split('T')[0])
      .lte('date', today.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching weekly logs:', error);
      return;
    }

    setWeeklyLogs(data || []);
  }, [user]);

  const calculateStreak = useCallback(async () => {
    if (!user) return;

    // Get all logs ordered by date descending
    const { data: logs, error } = await supabase
      .from('salah_log')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(100);

    if (error || !logs) return;

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      // Check if all prayers are completed for this day
      const allCompleted = log.fajr && log.dhuhr && log.asr && log.maghrib && log.isha;

      // Check if this log matches the expected consecutive day
      if (logDate.getTime() === expectedDate.getTime() && allCompleted) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Update streak in database
    const { data: existingStreak } = await supabase
      .from('salah_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const longestStreak = Math.max(currentStreak, existingStreak?.longest_streak || 0);

    if (existingStreak) {
      await supabase
        .from('salah_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_updated: getToday(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('salah_streaks')
        .insert({
          user_id: user.id,
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_updated: getToday(),
        });
    }

    setStreak({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_updated: getToday(),
    });
  }, [user]);

  const togglePrayer = async (prayerKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    if (!user) {
      toast.error('Please log in to track prayers');
      return;
    }

    const today = getToday();
    const newValue = !todayLog?.[prayerKey];

    try {
      if (todayLog) {
        // Update existing record
        const { error } = await supabase
          .from('salah_log')
          .update({ [prayerKey]: newValue })
          .eq('id', todayLog.id);

        if (error) throw error;

        setTodayLog({ ...todayLog, [prayerKey]: newValue });
      } else {
        // Create new record
        const newLog = {
          user_id: user.id,
          date: today,
          fajr: false,
          dhuhr: false,
          asr: false,
          maghrib: false,
          isha: false,
          [prayerKey]: true,
        };

        const { data, error } = await supabase
          .from('salah_log')
          .insert(newLog)
          .select()
          .single();

        if (error) throw error;
        setTodayLog(data);
      }

      // Recalculate streak after update
      await calculateStreak();
      await fetchWeeklyLogs();
      
      toast.success(newValue ? 'Prayer marked as completed' : 'Prayer unmarked');
    } catch (error) {
      console.error('Error updating prayer:', error);
      toast.error('Failed to update prayer status');
    }
  };

  const getWeeklyData = useCallback(() => {
    const today = new Date();
    const days: { date: string; dayName: string; completed: number; total: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      const log = weeklyLogs.find(l => l.date === dateStr);
      const completed = log
        ? PRAYER_KEYS.filter(key => log[key]).length
        : 0;

      days.push({ date: dateStr, dayName, completed, total: 5 });
    }

    return days;
  }, [weeklyLogs]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTodayLog(), fetchStreak(), fetchWeeklyLogs()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user, fetchTodayLog, fetchStreak, fetchWeeklyLogs]);

  const completedToday = todayLog
    ? PRAYER_KEYS.filter(key => todayLog[key]).length
    : 0;

  const progressPercentage = Math.round((completedToday / 5) * 100);

  return {
    loading,
    prayerStatus: getPrayerStatus(),
    streak,
    togglePrayer,
    completedToday,
    progressPercentage,
    weeklyData: getWeeklyData(),
  };
};
