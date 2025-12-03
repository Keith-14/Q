import { Layout } from '@/components/Layout';
import { FeatureCard } from '@/components/FeatureCard';
import { PrayerOverviewCard } from '@/components/home/PrayerOverviewCard';
import { QuickActionsRow } from '@/components/home/QuickActionsRow';
import { DailyDuaCard } from '@/components/home/DailyDuaCard';
import { TodaysVerseCard } from '@/components/home/TodaysVerseCard';
import {
  Clock,
  BookOpen,
  Calculator,
  Compass,
  Search,
  MapPin,
  BarChart3,
  Heart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Getting location...');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentPrayer, setCurrentPrayer] = useState({ name: '', nextTime: '' });

  const getCurrentPrayer = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    // Approximate prayer times (can be made more accurate with proper calculation)
    const prayerTimes = {
      Fajr: { start: 5 * 60, end: 6 * 60 + 30 }, // 5:00 - 6:30
      Dhuhr: { start: 12 * 60 + 30, end: 15 * 60 }, // 12:30 - 15:00
      Asr: { start: 15 * 60, end: 18 * 60 }, // 15:00 - 18:00
      Maghrib: { start: 18 * 60, end: 19 * 60 + 30 }, // 18:00 - 19:30
      Isha: { start: 19 * 60 + 30, end: 23 * 60 }, // 19:30 - 23:00
    } as const;

    for (const [name, time] of Object.entries(prayerTimes)) {
      if (currentMinutes >= time.start && currentMinutes <= time.end) {
        const nextPrayerTime = time.end;
        const nextHours = Math.floor(nextPrayerTime / 60);
        const nextMins = nextPrayerTime % 60;
        return {
          name: `${name} Time`,
          nextTime: `Next prayer at ${nextHours.toString().padStart(2, '0')}:${nextMins
            .toString()
            .padStart(2, '0')}`,
        };
      }
    }

    // If no current prayer time, show next prayer
    const nextPrayerNames: Array<keyof typeof prayerTimes> = [
      'Fajr',
      'Dhuhr',
      'Asr',
      'Maghrib',
      'Isha',
    ];
    const nextPrayer =
      nextPrayerNames.find((name) => {
        const time = prayerTimes[name];
        return currentMinutes < time.start;
      }) || 'Fajr';

    const nextTime = prayerTimes[nextPrayer].start;
    const nextHours = Math.floor(nextTime / 60);
    const nextMins = nextTime % 60;

    return {
      name: `Next: ${nextPrayer}`,
      nextTime: `${nextHours.toString().padStart(2, '0')}:${nextMins
        .toString()
        .padStart(2, '0')}`,
    };
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            );
            const data = await response.json();
            setLocation(
              `${data.city || data.locality || 'Unknown'}, ${
                data.countryName || 'Unknown'
              }`,
            );
          } catch (error) {
            setLocation('Location unavailable');
          }
        },
        () => {
          setLocation('Location access denied');
        },
      );
    }

    // Get current date and Islamic date
    const now = new Date();
    const islamicDate = new Intl.DateTimeFormat('en-u-ca-islamic', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now);

    setCurrentDate(islamicDate);
  }, []);

  // Update time and prayer info every second
  useEffect(() => {
    const updateTimeAndPrayer = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(timeString);
      setCurrentPrayer(getCurrentPrayer());
    };

    updateTimeAndPrayer(); // Initial call
    const interval = setInterval(updateTimeAndPrayer, 1000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { label: 'Qibla', Icon: Compass, onClick: () => navigate('/qibla') },
    { label: 'Quran', Icon: BookOpen, onClick: () => navigate('/quran') },
    { label: 'Track', Icon: BarChart3, onClick: () => navigate('/progress') },
    { label: 'Mood', Icon: Heart, onClick: () => navigate('/makkah-live') },
    { label: 'Prayer', Icon: Clock, onClick: () => navigate('/prayer-times') },
    { label: 'Zakat', Icon: Calculator, onClick: () => navigate('/zakat') },
    { label: 'Store', Icon: Search, onClick: () => navigate('/shop') },
    { label: 'Progress', Icon: MapPin, onClick: () => navigate('/progress') },
  ];

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Welcome + Prayer overview */}
        <section className="space-y-4" aria-label="Welcome and prayer overview">
          <div className="space-y-2">
            <p className="text-xs tracking-wide text-muted-foreground">
              As-Salaam-Alaikum, Ahmed
            </p>
            <h1 className="text-2xl font-semibold text-foreground">Barakah Home</h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="line-clamp-1">{location}</span>
            </div>
            <p className="text-xs text-muted-foreground">{currentDate}</p>
          </div>

          <PrayerOverviewCard
            currentPrayerName={currentPrayer.name}
            currentTime={currentTime}
            nextTimeLabel={currentPrayer.nextTime}
          />
        </section>

        {/* All quick actions icons */}
        <section aria-label="Quick actions">
          <QuickActionsRow items={quickActions} />
        </section>

        {/* Daily Dua */}
        <section aria-label="Daily dua">
          <DailyDuaCard />
        </section>

        {/* Today's Verse */}
        <section aria-label="Today's verse">
          <TodaysVerseCard />
        </section>
      </div>
    </Layout>
  );
};
