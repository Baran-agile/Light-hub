'use server';

import { revalidatePath } from 'next/cache';
import { activateScene, toggleLightStatus } from '@/lib/data';

export async function toggleLightAction(formData: FormData) {
  const lightId = formData.get('lightId') as string;
  if (!lightId) {
    return { success: false, message: 'Light ID is missing.' };
  }
  try {
    await toggleLightStatus(lightId);
    revalidatePath('/');
    return { success: true, message: 'Light toggled.' };
  } catch (error) {
    console.error('An error occurred in toggleLightAction:', error);
    // In case of an error, we should still revalidate to sync client with server state
    revalidatePath('/');
    return { success: false, message: 'Failed to toggle light.' };
  }
}

export async function activateSceneAction(sceneId: string) {
  try {
    await activateScene(sceneId);
    revalidatePath('/');
    return { success: true, message: 'Scene activated.' };
  } catch (error) {
    return { success: false, message: 'Failed to activate scene.' };
  }
}
