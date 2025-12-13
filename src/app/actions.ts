'use server';

import { revalidatePath } from 'next/cache';
import { activateScene, toggleLightStatus } from '@/lib/data';
import { suggestOptimizedLightingScene } from '@/ai/flows/suggest-optimized-lighting-scenes';
import type { SuggestOptimizedLightingSceneInput } from '@/ai/flows/suggest-optimized-lighting-scenes';

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

export async function getAIOptimizationAction(input: SuggestOptimizedLightingSceneInput) {
    try {
        const result = await suggestOptimizedLightingScene(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to get AI suggestion.' };
    }
}
