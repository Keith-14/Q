import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { 
  Lock, 
  TrendingUp, 
  ShoppingBag, 
  MapPin, 
  LogOut,
  ChevronRight
} from 'lucide-react';

const accountOptions = [
  { icon: Lock, label: 'Change Password', href: '/change-password' },
  { icon: TrendingUp, label: 'My Progress', href: '/progress' },
  { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
  { icon: MapPin, label: 'Location', href: '/location' },
  { icon: LogOut, label: 'Logout', href: '/logout' },
];

export const Account = () => {
  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-sage text-primary-foreground px-6 py-3 rounded-2xl">
            ACCOUNT
          </h1>
        </div>

        {/* Account Options */}
        <div className="space-y-3">
          {accountOptions.map(({ icon: Icon, label, href }) => (
            <Card key={label} className="p-4 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-sage" />
                  <span className="font-medium text-foreground">{label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};