import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const Qibla = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Mecca coordinates
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  // -----------------------------
  // Calculate Qibla bearing
  // -----------------------------
  const calculateQiblaDirection = (lat: number, lng: number) => {
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (meccaLat * Math.PI) / 180;
    const deltaLng = ((meccaLng - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLng);
    const x =
      Math.cos(lat1) * Math.tan(lat2) -
      Math.sin(lat1) * Math.cos(deltaLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  };

  // -----------------------------
  // Request iOS permission
  // -----------------------------
  const requestOrientationPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-ignore
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== 'granted') {
          alert('Compass permission denied');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  // -----------------------------
  // Get user location
  // -----------------------------
  const getUserLocation = async () => {
    setIsCalibrating(true);
    await requestOrientationPermission();

    if (!navigator.geolocation) {
      setIsCalibrating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(calculateQiblaDirection(latitude, longitude));
        setIsCalibrating(false);
      },
      () => {
        // fallback: Mumbai
        const lat = 19.076;
        const lng = 72.8777;
        setUserLocation({ lat, lng });
        setQiblaDirection(calculateQiblaDirection(lat, lng));
        setIsCalibrating(false);
      }
    );
  };

  // -----------------------------
  // Device compass heading
  // -----------------------------
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS
      // @ts-ignore
      if (event.webkitCompassHeading !== undefined) {
        // @ts-ignore
        heading = event.webkitCompassHeading;
      }
      // Android
      else if (event.alpha !== null) {
        heading = 360 - event.alpha;
      }

      if (heading !== null) {
        // smooth jitter
        setDeviceHeading((prev) => prev * 0.8 + heading * 0.2);
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  // -----------------------------
  // Final rotation angle
  // -----------------------------
  const compassDirection = (qiblaDirection - deviceHeading + 360) % 360;

  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Qibla Direction</h1>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {userLocation
                ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
                : 'Getting location...'}
            </span>
          </div>
        </div>

        {/* Compass */}
        <Card className="p-8 rounded-3xl bg-secondary/30">
          <div className="relative w-80 h-80 mx-auto">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />

            <div className="absolute inset-8 border-2 border-primary/20 rounded-full bg-card">
              {/* Arrow */}
              <div
                className="absolute w-1 bg-primary rounded-full transition-transform duration-300"
                style={{
                  height: '120px',
                  left: '50%',
                  top: '20px',
                  transformOrigin: 'bottom center',
                  transform: `translateX(-50%) rotate(${compassDirection}deg)`
                }}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-primary" />
                </div>
              </div>

              {/* Center */}
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Navigation className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <Card className="p-4 rounded-2xl bg-primary text-primary-foreground">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-2">QIBLA DIRECTION</h3>
            <p className="text-2xl font-bold">{Math.round(qiblaDirection)}°</p>
            <p className="text-sm opacity-90">Point your device toward Mecca</p>
          </div>
        </Card>

        {/* Recalibrate */}
        <Button
          onClick={getUserLocation}
          disabled={isCalibrating}
          className="w-full bg-primary text-primary-foreground rounded-2xl py-3"
        >
          {isCalibrating ? 'Calibrating…' : 'Recalibrate'}
        </Button>

        {/* Instructions */}
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold text-primary mb-2">How to use</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Hold phone flat</li>
            <li>• Move phone in figure-8 if needed</li>
            <li>• Rotate yourself until arrow points up</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};
