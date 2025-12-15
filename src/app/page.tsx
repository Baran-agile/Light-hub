import { getLights, getScenes, getEnvironmentData } from '@/lib/data';
import { LightsControl } from '@/components/lights-control';
import { ScenesControl } from '@/components/scenes-control';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import { EnvironmentMonitor } from '@/components/environment-monitor';

export default async function Home() {
  const lights = await getLights();
  const scenes = await getScenes();
  const environmentData = await getEnvironmentData();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex-grow">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            Light Hub
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Your central command for a brighter home.
            </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="space-y-12">
        <section>
          <h2 className="mb-4 font-headline text-2xl font-semibold">
            All Lights
          </h2>
          <LightsControl lights={lights} />
        </section>

        <Separator />

        <EnvironmentMonitor initialData={environmentData} />

        <Separator />

        <section>
          <h2 className="mb-4 font-headline text-2xl font-semibold">
            Lighting Scenes
          </h2>
          <ScenesControl scenes={scenes} />
        </section>
      </main>
      
      <footer className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Light Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
