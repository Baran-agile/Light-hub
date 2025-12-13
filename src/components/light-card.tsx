'use client';

import { useRef } from 'react';
import { Lightbulb, LightbulbOff } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Light } from '@/lib/types';

export function LightCard({ light, action }: { light: Light; action: (formData: FormData) => void; }) {
  const isOn = light.status === 'on';
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className={cn('transition-all duration-300', isOn ? 'bg-primary/10 border-primary/40 shadow-lg' : 'bg-card')}>
      <form action={action} ref={formRef}>
        <input type="hidden" name="lightId" value={light.id} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-semibold">{light.name}</CardTitle>
          {isOn ? (
            <Lightbulb className="h-6 w-6 text-primary" />
          ) : (
            <LightbulbOff className="h-6 w-6 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className={cn("text-lg font-bold uppercase", isOn ? 'text-primary' : 'text-muted-foreground')}>{light.status}</div>
            <Switch
              checked={isOn}
              onCheckedChange={() => formRef.current?.requestSubmit()}
              aria-label={`Toggle ${light.name}`}
            />
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
