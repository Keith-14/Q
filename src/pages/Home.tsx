import { Layout } from '@/components/Layout';
import { FeatureCard } from '@/components/FeatureCard';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Clock, 
  BookOpen, 
  Calculator, 
  Compass, 
  Search,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();
  
  // Get current Islamic date (simplified for demo)
  const currentDate = "Wed, 17 Muharram 1447";

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search" 
            className="pl-10 bg-sage-light border-sage-light rounded-full"
          />
        </div>

        {/* Date Display */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sage mb-2">HOME</h1>
          <div className="flex items-center justify-center space-x-2">
            <MapPin className="h-4 w-4 text-sage" />
            <span className="text-sm text-muted-foreground">Mumbai, India</span>
          </div>
          <p className="text-lg text-foreground mt-2">{currentDate}</p>
        </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <FeatureCard
            icon={Clock}
            title="PRAYER TIMES"
            subtitle="FIVE PRAYERS REMINDER"
            onClick={() => navigate('/prayer-times')}
          />
          <FeatureCard
            icon={BookOpen}
            title="QIBLA"
            subtitle="VIEW QIBLA DIRECTION"
            onClick={() => navigate('/qibla')}
          />
          <FeatureCard
            icon={Calculator}
            title="ZAKAT"
            subtitle="ZAKAT CALCULATOR"
            onClick={() => navigate('/zakat')}
          />
          <FeatureCard
            icon={Compass}
            title="MAKKAH"
            subtitle="WATCH MAKKAH LIVE"
            onClick={() => navigate('/makkah-live')}
          />
        </div>

        {/* Daily Hadith */}
        <Card className="bg-card p-4 rounded-2xl">
          <h3 className="text-lg font-semibold text-sage mb-3">DAILY HADITH</h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground italic">
              "The believer is not one who eats his fill while his neighbour goes hungry."
            </p>
            <p className="text-xs text-muted-foreground text-right">
              —Sahih Bukhari
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};