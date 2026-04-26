import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const Qibla = () => {
  const [userLocation, setUserLocation] =
    useState<{ lat: number; lng: number } | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const permissionGranted = useRef(false);

  // Mecca
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;

  /* ---------------- Qibla bearing ---------------- */
  const calculateQiblaDirection = (lat: number, lng: number) => {
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (meccaLat * Math.PI) / 180;
    const dLng = ((meccaLng - lng) * Math.PI) / 180;

    const y = Math.sin(dLng);
    const x =
      Math.cos(lat1) * Math.tan(lat2) -
      Math.sin(lat1) * Math.cos(dLng);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  /* ---------------- Permission (iOS only once) ---------------- */
  const requestOrientationPermission = async () => {
    if (permissionGranted.current) return;

    // @ts-ignore
    if (typeof DeviceOrientationEvent?.requestPermission === 'function') {
      try {
        // @ts-ignore
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') {
          permissionGranted.current = true;
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      permissionGranted.current = true;
    }
  };

  /* ---------------- Location ---------------- */
  const getUserLocation = async () => {
    if (isCalibrating) return;

    setIsCalibrating(true);
    await requestOrientationPermission();

    if (!navigator.geolocation) {
      setIsCalibrating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setQiblaDirection(calculateQiblaDirection(latitude, longitude));
        setIsCalibrating(false);
      },
      () => {
        // fallback Mumbai
        const lat = 19.076;
        const lng = 72.8777;
        setUserLocation({ lat, lng });
        setQiblaDirection(calculateQiblaDirection(lat, lng));
        setIsCalibrating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  /* ---------------- Compass ---------------- */
  useEffect(() => {
    let lastHeading = 0;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS
      // @ts-ignore
      if (e.webkitCompassHeading !== undefined) {
        // @ts-ignore
        heading = e.webkitCompassHeading;
      }
      // Android
      else if (e.alpha !== null) {
        heading = 360 - e.alpha;
      }

      if (heading === null) return;

      // Normalize wrap-around
      let diff = heading - lastHeading;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const smooth = lastHeading + diff * 0.15;
      lastHeading = (smooth + 360) % 360;

      setDeviceHeading(lastHeading);
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

  const compassDirection =
    (qiblaDirection - deviceHeading + 360) % 360;

  /* ---------------- UI ---------------- */
  return (
    <Layout>
      <div className="px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">
            Qibla Direction
          </h1>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {userLocation
                ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}`
                : 'Detecting location…'}
            </span>
          </div>
        </div>

        {/* Compass */}
        <Card className="p-6 rounded-3xl bg-secondary/30">
          <div className="relative mx-auto aspect-square w-full max-w-[280px]">
            <div className="absolute inset-0 border-4 border-primary/30 rounded-full" />

            <div className="absolute inset-6 border-2 border-primary/20 rounded-full bg-card">
              {/* Arrow */}
              <div
                className="absolute left-1/2 top-4 w-1 bg-primary rounded-full transition-transform duration-200"
                style={{
                  height: '40%',
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
        <Card className="p-4 rounded-2xl bg-primary text-primary-foreground text-center">
          <p className="text-sm opacity-90">Qibla Bearing</p>
          <p className="text-2xl font-bold">
            {Math.round(qiblaDirection)}°
          </p>
        </Card>

        {/* Recalibrate */}
        <Button
          onClick={getUserLocation}
          disabled={isCalibrating}
          className="w-full rounded-2xl py-3"
        >
          {isCalibrating ? 'Calibrating…' : 'Recalibrate'}
        </Button>

        {/* Instructions */}
        <Card className="p-4 rounded-2xl">
          <h3 className="font-semibold text-primary mb-2">
            How to use
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Hold phone flat</li>
            <li>• Move phone in a figure-8 motion</li>
            <li>• Turn until arrow points straight up</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
};