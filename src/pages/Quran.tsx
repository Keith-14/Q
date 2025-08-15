import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export const Quran = () => {
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-sage text-primary-foreground px-6 py-3 rounded-2xl">
            QURAN
          </h1>
        </div>

        {/* Chapter Info */}
        <Card className="p-4 rounded-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-sage text-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">1</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-sage">Al-Fatihah: The Opening</h2>
              <p className="text-sm text-muted-foreground">7 verses • Meccan</p>
            </div>
          </div>

          {/* Translation Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Translation</span>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showTranslation} 
                onCheckedChange={setShowTranslation}
              />
              <Button variant="outline" size="sm" className="text-xs">
                SHOW
              </Button>
            </div>
          </div>

          {/* Verses */}
          <div className="space-y-4">
            <div className="text-center border-b border-sage-light pb-4">
              <div className="w-8 h-8 bg-sage text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">1</span>
              </div>
              <p className="text-lg font-arabic mb-2" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {showTranslation && (
                <p className="text-sm text-muted-foreground italic">
                  In the name of Allah, the Entirely Merciful, the Especially Merciful.
                </p>
              )}
            </div>

            <div className="text-center border-b border-sage-light pb-4">
              <div className="w-8 h-8 bg-sage text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">2</span>
              </div>
              <p className="text-lg font-arabic mb-2" dir="rtl">
                الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
              </p>
              {showTranslation && (
                <p className="text-sm text-muted-foreground italic">
                  All praise is due to Allah, Lord of the worlds.
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};