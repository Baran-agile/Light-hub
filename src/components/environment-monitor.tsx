'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Environment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function EnvironmentMonitor({ initialData }: { initialData: Environment | null }) {
  const [data, setData] = useState<Environment | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    async function fetchEnvironmentData() {
      try {
        const response = await fetch('/api/environment');
        if (!response.ok) {
          throw new Error('Failed to fetch environment data');
        }
        const environmentData = await response.json();
        setData(environmentData);
      } catch (error) {
        console.error(error);
        // Don't null out data on intermittent fetch errors, keep last known value
      }
    }

    // Fetch initially if no data
    if (!initialData) {
        setIsLoading(true);
        fetchEnvironmentData().finally(() => setIsLoading(false));
    }
    
    // Set up an interval to poll for new data every 3 seconds
    const intervalId = setInterval(fetchEnvironmentData, 3000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [initialData]);

  return (
    <section>
      <h2 className="mb-4 font-headline text-2xl font-semibold">
        Environment
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Temperature</CardTitle>
            <Thermometer className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-24" />
            ) : (
                <div className="text-2xl font-bold">{data?.temperature.toFixed(1)}°C</div>
            )}
            <p className="text-xs text-muted-foreground">
              Live room temperature
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Humidity</CardTitle>
            <Droplets className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <Skeleton className="h-8 w-20" />
            ) : (
                <div className="text-2xl font-bold">{data?.humidity.toFixed(0)}%</div>
            )}
            <p className="text-xs text-muted-foreground">
              Live room humidity
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
