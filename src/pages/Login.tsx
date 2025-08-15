import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple navigation for demo - in real app would handle authentication
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center max-w-md mx-auto relative">
      {/* Islamic pattern background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-light/30 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236B8E7A' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20zM0 20v20h20c0-11.046-8.954-20-20-20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 w-full px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-sage rounded-full flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white rounded-full border-dashed"></div>
          </div>
          <h1 className="text-4xl font-bold text-sage">BARAKAH</h1>
          <p className="text-sm text-muted-foreground mt-2">
            FAITH. LIFESTYLE. COMMUNITY.
          </p>
        </div>

        {/* Login Form */}
        <Card className="p-6 rounded-3xl bg-card/80 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-center mb-6">Create an account</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter you email to signup for this app
          </p>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="yourname@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background border-sage-light rounded-2xl"
            />

            <Button 
              onClick={handleLogin}
              className="w-full bg-sage hover:bg-sage-dark text-primary-foreground rounded-2xl py-3"
            >
              Continue
            </Button>

            <div className="text-center text-sm text-muted-foreground">or</div>

            <Button 
              variant="outline" 
              className="w-full rounded-2xl py-3 border-sage-light"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button 
              variant="outline" 
              className="w-full rounded-2xl py-3 border-sage-light"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By clicking continue, you agree to our{' '}
            <span className="underline">Terms of Service</span> and{' '}
            <span className="underline">Privacy Policy</span>
          </p>
        </Card>
      </div>
    </div>
  );
};