'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Environment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function EnvironmentMonitor() {
  const [data, setData] = useState<Environment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEnvironmentData() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/environment');
        if (!response.ok) {
            throw new Error('Failed to fetch environment data');
        }
        const environmentData = await response.json();
        setData(environmentData);
      } catch (error) {
        console.error(error);
        // You could set an error state here and display it to the user
      } finally {
        setIsLoading(false);
      }
    }

    fetchEnvironmentData();
    
  }, []);

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
                <div className="text-2xl font-bold">{data?.temperature}°C</div>
            )}
            <p className="text-xs text-muted-foreground">
              Current room temperature
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
                <div className="text-2xl font-bold">{data?.humidity}%</div>
            )}
            <p className="text-xs text-muted-foreground">
              Current room humidity
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
