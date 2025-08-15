import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navigation, Search, Filter } from 'lucide-react';

const places = [
  {
    id: 1,
    name: 'CENTRAL MOSQUE',
    type: 'mosque',
    image: '/placeholder-mosque.png',
  },
  {
    id: 2,
    name: 'CENTRAL MOSQUE',
    type: 'mosque',
    image: '/placeholder-mosque.png',
  },
  {
    id: 3,
    name: 'HALAL RESTAURANT',
    type: 'restaurant',
    image: '/placeholder-restaurant.png',
  },
  {
    id: 4,
    name: 'HALAL RESTAURANT',
    type: 'restaurant',
    image: '/placeholder-restaurant.png',
  },
];

export const Places = () => {
  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 mr-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search" 
              className="pl-10 bg-sage-light border-sage-light rounded-full"
            />
          </div>
          <Button variant="outline" className="rounded-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-2 gap-4">
          {places.map((place) => (
            <Card key={place.id} className="p-4 rounded-2xl">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {place.type === 'mosque' ? (
                  <div className="text-white text-xs font-semibold text-center">
                    🕌
                  </div>
                ) : (
                  <div className="text-white text-xs font-semibold text-center">
                    🍽️
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-sage text-center mb-3 text-sm">
                {place.name}
              </h3>
              <Button 
                variant="outline" 
                className="w-full rounded-full border-sage text-sage hover:bg-sage hover:text-primary-foreground"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Directions
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};