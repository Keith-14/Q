import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Filter } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'TASBIH',
    price: '$20.00',
    image: '/placeholder-tasbih.png',
  },
  {
    id: 2,
    name: 'TASBIH',
    price: '$20.00',
    image: '/placeholder-tasbih.png',
  },
];

export const Shop = () => {
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
          <Button variant="ghost" className="ml-2">
            <ShoppingCart className="h-5 w-5" />
            Cart
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4 rounded-2xl">
              <div className="aspect-square bg-sage-light rounded-xl mb-3 flex items-center justify-center">
                <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-sage rounded-full"></div>
                </div>
              </div>
              <h3 className="font-semibold text-sage text-center mb-1">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-center mb-3">
                {product.price}
              </p>
              <Button 
                variant="outline" 
                className="w-full rounded-full border-sage text-sage hover:bg-sage hover:text-primary-foreground"
              >
                ADD TO CART
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};