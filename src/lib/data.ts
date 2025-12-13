import type { Light, Scene, Environment } from '@/lib/types';

// In-memory store for lights. In a real app, this would be a database.
let lights: Light[] = [
  { id: '1', name: 'Living Room Ceiling', status: 'off' },
  { id: '2', name: 'Living Room Lamp', status: 'on' },
  { id: '3', name: 'Bedroom Lamp', status: 'off' },
  { id: '4', name: 'Kitchen Overhead', status: 'on' },
  { id: '5', name: 'Office Desk Light', status: 'off' },
  { id: '6', name: 'Hallway Light', status: 'off' },
];

let scenes: Scene[] = [
  {
    id: 'reading',
    name: 'Reading Book',
    icon: 'BookOpen',
    description: 'Bright, focused light for reading.',
    lightStates: [
      { lightId: '1', status: 'off' },
      { lightId: '2', status: 'on' },
      { lightId: '3', status: 'off' },
      { lightId: '4', status: 'off' },
      { lightId: '5', status: 'on' },
      { lightId: '6', status: 'off' },
    ],
  },
  {
    id: 'movie',
    name: 'Movie Night',
    icon: 'Film',
    description: 'Dim, warm lighting for a cinematic experience.',
    lightStates: [
      { lightId: '1', status: 'off' },
      { lightId: '2', status: 'on' },
      { lightId: '3', status: 'off' },
      { lightId: '4', status: 'off' },
      { lightId: '5', 'status': 'off' },
      { lightId: '6', status: 'off' },
    ],
  },
  {
    id: 'party',
    name: 'Party Time',
    icon: 'PartyPopper',
    description: 'Vibrant and full lighting for social gatherings.',
    lightStates: [
      { lightId: '1', status: 'on' },
      { lightId: '2', status: 'on' },
      { lightId: '3', status: 'on' },
      { lightId: '4', status: 'on' },
      { lightId: '5', status: 'on' },
      { lightId: '6', 'status': 'on' },
    ],
  },
  {
    id: 'focus',
    name: 'Focus Work',
    icon: 'Tv',
    description: 'Cool, bright light for productive work.',
    lightStates: [
      { lightId: '1', status: 'off' },
      { lightId: '2', status: 'off' },
      { lightId: '3', status: 'off' },
      { lightId: '4', status: 'on' },
      { lightId: '5', status: 'on' },
      { lightId: '6', status: 'off' },
    ]
  }
];

let environmentData: Environment = {
    temperature: 22.5,
    humidity: 45,
};

// This internal function is used by the new API routes.
export function getLightsData(): Light[] {
  return lights;
}

// This internal function is used by the new API routes.
export function getLightByIdData(lightId: string): Light | undefined {
  return lights.find(l => l.id === lightId);
}

// This internal function is used by the new API routes.
export function toggleLightStatusData(lightId: string): Light | undefined {
    const light = lights.find(l => l.id === lightId);
    if (light) {
        light.status = light.status === 'on' ? 'off' : 'on';
        // In a real app, you'd save this to a database.
        // For this demo, we are mutating the in-memory array.
        lights = lights.map(l => l.id === lightId ? light : l);
        return light;
    }
    return undefined;
}

// This internal function is used by the new API routes.
export function setLightStatusData(lightId: string, status: 'on' | 'off'): Light | undefined {
  const light = lights.find(l => l.id === lightId);
  if (light) {
    light.status = status;
    lights = lights.map(l => l.id === lightId ? light : l);
    return light;
  }
  return undefined;
}


export function getEnvironmentData(): Environment {
    return environmentData;
}

export function updateEnvironmentData(newData: Partial<Environment>): Environment {
    environmentData = { ...environmentData, ...newData };
    return environmentData;
}


// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return `http://localhost:${process.env.PORT || 9002}`;
}

export async function getLights(): Promise<Light[]> {
  // Fetch from the new API route
  const res = await fetch(`${getBaseUrl()}/api/lights`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch lights');
  }
  return res.json();
}

export async function getLight(lightId: string): Promise<Light | undefined> {
  const res = await fetch(`${getBaseUrl()}/api/lights/${lightId}`, { cache: 'no-store' });
  if (!res.ok) {
    // Return undefined if light is not found (404)
    if (res.status === 404) {
      return undefined;
    }
    throw new Error('Failed to fetch light');
  }
  return res.json();
}

export async function getScenes(): Promise<Scene[]> {
  await delay(50);
  return scenes;
}

export async function toggleLightStatus(lightId: string): Promise<Light | undefined> {
  const res = await fetch(`${getBaseUrl()}/api/lights/${lightId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
     cache: 'no-store'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to toggle light status');
  }
  
  return res.json();
}

export async function activateScene(sceneId: string): Promise<void> {
  const scene = scenes.find(s => s.id === sceneId);
  if (!scene) return;

  const currentLights = await getLights();

  const promises = scene.lightStates.map(sceneLight => {
    const currentLight = currentLights.find(l => l.id === sceneLight.lightId);
    if (currentLight && currentLight.status !== sceneLight.status) {
      // Only toggle if the status is different
      return toggleLightStatus(sceneLight.lightId);
    }
    return Promise.resolve();
  });

  await Promise.all(promises);
}
