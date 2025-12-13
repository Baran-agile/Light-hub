'use client';

import { useOptimistic } from 'react';
import type { Light } from '@/lib/types';
import { toggleLightAction } from '@/app/actions';
import { LightCard } from './light-card';

export function LightsControl({ lights }: { lights: Light[] }) {
  const [optimisticLights, toggleOptimisticLight] = useOptimistic(
    lights,
    (state, lightId: string) => {
      return state.map(light =>
        light.id === lightId
          ? { ...light, status: light.status === 'on' ? 'off' : 'on' }
          : light
      );
    }
  );

  const formAction = async (formData: FormData) => {
    const lightId = formData.get('lightId') as string;
    toggleOptimisticLight(lightId);
    await toggleLightAction(formData);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {optimisticLights.map(light => (
        <LightCard key={light.id} light={light} action={formAction} />
      ))}
    </div>
  );
}
