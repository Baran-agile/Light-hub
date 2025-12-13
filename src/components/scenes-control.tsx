'use client';

import { activateSceneAction } from '@/app/actions';
import type { Scene, IconName } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransition, createElement } from 'react';
import { Loader2, BookOpen, Film, PartyPopper, Tv } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<IconName, LucideIcon> = {
  BookOpen,
  Film,
  PartyPopper,
  Tv,
};

export function ScenesControl({ scenes }: { scenes: Scene[] }) {
  let [isPending, startTransition] = useTransition();

  const handleActivate = (sceneId: string) => {
    startTransition(async () => {
      await activateSceneAction(sceneId);
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {scenes.map((scene) => {
        const Icon = iconMap[scene.icon];
        return (
          <Card key={scene.id} className="flex flex-col">
            <CardHeader className="flex-grow">
              <div className="flex items-start gap-4">
                {Icon && <Icon className="h-8 w-8 text-accent flex-shrink-0 mt-1" />}
                <div className="flex-grow">
                  <CardTitle>{scene.name}</CardTitle>
                  <CardDescription>{scene.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => handleActivate(scene.id)}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Activate Scene'}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
