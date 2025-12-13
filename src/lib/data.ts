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
      { lightId: '3', 'status': 'on' },
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

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getLights(): Promise<Light[]> {
  await delay(50);
  return lights;
}

export async function getLight(lightId: string): Promise<Light | undefined> {
  await delay(50);
  return lights.find(l => l.id === lightId);
}

export async function getScenes(): Promise<Scene[]> {
  await delay(50);
  return scenes;
}

export async function toggleLightStatus(lightId: string): Promise<void> {
  await delay(50);
  const light = lights.find(l => l.id === lightId);
  if (light) {
    light.status = light.status === 'on' ? 'off' : 'on';
  }
}


export async function setLightStatus(lightId: string, status: 'on' | 'off'): Promise<void> {
  await delay(50);
  const light = lights.find(l => l.id === lightId);
  if (light) {
    light.status = status;
  }
}

export async function activateScene(sceneId: string): Promise<void> {
  const scene = scenes.find(s => s.id === sceneId);
  if (!scene) return;

  const promises = scene.lightStates.map(lightState => {
    return setLightStatus(lightState.lightId, lightState.status);
  });

  await Promise.all(promises);
}


export async function getEnvironmentData(): Promise<Environment> {
    await delay(50);
    return environmentData;
}

export async function updateEnvironmentData(newData: Partial<Environment>): Promise<Environment> {
    await delay(50);
    environmentData = { ...environmentData, ...newData };
    return environmentData;
}
