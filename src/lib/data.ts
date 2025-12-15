import { collection, getDocs, doc, getDoc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Light, Scene, Environment } from '@/lib/types';

// This function should be used by SERVER COMPONENTS only.
async function getDb() {
  const { firestore } = initializeFirebase();
  return firestore;
}

// In-memory store for scenes and environment, as they are not stored in Firestore yet.
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Firestore Data Access Functions for Lights ---

export async function getLights(): Promise<Light[]> {
  const db = await getDb();
  const lightsCol = collection(db, 'lights');
  const lightSnapshot = await getDocs(lightsCol);
  const lightList = lightSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Light));
  
  // If firestore is empty, populate with initial data
  if (lightList.length === 0) {
    const initialLights: Light[] = [
      { id: '1', name: 'Living Room Ceiling', status: 'off' },
      { id: '2', name: 'Living Room Lamp', status: 'on' },
      { id: '3', name: 'Bedroom Lamp', status: 'off' },
      { id: '4', name: 'Kitchen Overhead', status: 'on' },
      { id: '5', name: 'Office Desk Light', status: 'off' },
      { id: '6', name: 'Hallway Light', status: 'off' },
    ];
    for (const light of initialLights) {
        await setDoc(doc(db, "lights", light.id), {name: light.name, status: light.status});
    }
    return initialLights;
  }
  
  return lightList;
}

export async function getLight(lightId: string): Promise<Light | undefined> {
  const db = await getDb();
  const lightRef = doc(db, 'lights', lightId);
  const lightSnap = await getDoc(lightRef);
  if (lightSnap.exists()) {
    return { id: lightSnap.id, ...lightSnap.data() } as Light;
  }
  return undefined;
}


export async function toggleLightStatus(lightId: string): Promise<Light | undefined> {
    const db = await getDb();
    const lightRef = doc(db, 'lights', lightId);
    const lightSnap = await getDoc(lightRef);

    if (lightSnap.exists()) {
        const currentStatus = lightSnap.data().status;
        const newStatus = currentStatus === 'on' ? 'off' : 'on';
        await updateDoc(lightRef, { status: newStatus });
        return { id: lightId, ...lightSnap.data(), status: newStatus } as Light;
    }
    return undefined;
}


export async function setLightStatus(lightId: string, status: 'on' | 'off'): Promise<void> {
    const db = await getDb();
    const lightRef = doc(db, 'lights', lightId);
    await updateDoc(lightRef, { status });
}

// --- In-memory data functions for Scenes and Environment ---

export async function getScenes(): Promise<Scene[]> {
  await delay(50);
  return scenes;
}

export async function getEnvironmentData(): Promise<Environment> {
    // Simulate slight fluctuations from a sensor
    environmentData.temperature += (Math.random() - 0.5) * 0.2;
    environmentData.humidity += (Math.random() - 0.5) * 1;
    // Clamp values
    environmentData.temperature = Math.max(18, Math.min(28, environmentData.temperature));
    environmentData.humidity = Math.max(30, Math.min(60, environmentData.humidity));
    return environmentData;
}

export async function activateScene(sceneId: string): Promise<void> {
  const scene = scenes.find(s => s.id === sceneId);
  if (!scene) return;

  const promises = scene.lightStates.map(lightState => {
    return setLightStatus(lightState.lightId, lightState.status);
  });

  await Promise.all(promises);
}

export async function updateEnvironmentData(newData: Partial<Environment>): Promise<Environment> {
    await delay(50);
    environmentData = { ...environmentData, ...newData };
    return environmentData;
}
