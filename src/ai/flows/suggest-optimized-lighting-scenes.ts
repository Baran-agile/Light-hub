// src/ai/flows/suggest-optimized-lighting-scenes.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow to suggest optimized lighting scenes based on user preferences and current time.
 *
 * The flow takes user preferences and current time as input and returns a suggested lighting scene.
 * The file exports:
 *   - suggestOptimizedLightingScene: The main function to trigger the flow.
 *   - SuggestOptimizedLightingSceneInput: The input type for the suggestOptimizedLightingScene function.
 *   - SuggestOptimizedLightingSceneOutput: The output type for the suggestOptimizedLightingScene function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimizedLightingSceneInputSchema = z.object({
  activity: z.string().describe('The activity the user is currently doing or planning to do (e.g., reading, watching movies).'),
  timeOfDay: z.string().describe('The current time of day (e.g., morning, afternoon, evening, night).'),
  userPreferences: z.string().describe('The user\u2019s lighting preferences (e.g., bright, dim, warm, cool).'),
});
export type SuggestOptimizedLightingSceneInput = z.infer<typeof SuggestOptimizedLightingSceneInputSchema>;

const SuggestOptimizedLightingSceneOutputSchema = z.object({
  sceneDescription: z.string().describe('A description of the suggested lighting scene, including which lights to turn on/off and their brightness/color settings.'),
});
export type SuggestOptimizedLightingSceneOutput = z.infer<typeof SuggestOptimizedLightingSceneOutputSchema>;

export async function suggestOptimizedLightingScene(input: SuggestOptimizedLightingSceneInput): Promise<SuggestOptimizedLightingSceneOutput> {
  return suggestOptimizedLightingSceneFlow(input);
}

const suggestOptimizedLightingScenePrompt = ai.definePrompt({
  name: 'suggestOptimizedLightingScenePrompt',
  input: {schema: SuggestOptimizedLightingSceneInputSchema},
  output: {schema: SuggestOptimizedLightingSceneOutputSchema},
  prompt: `You are an AI lighting assistant. You will be provided with the user's current activity, the time of day, and the user's lighting preferences.

  Based on this information, you will suggest an optimized lighting scene for the user.

  Activity: {{{activity}}}
  Time of Day: {{{timeOfDay}}}
  User Preferences: {{{userPreferences}}}

  Suggest an optimized lighting scene:
  `,
});

const suggestOptimizedLightingSceneFlow = ai.defineFlow(
  {
    name: 'suggestOptimizedLightingSceneFlow',
    inputSchema: SuggestOptimizedLightingSceneInputSchema,
    outputSchema: SuggestOptimizedLightingSceneOutputSchema,
  },
  async input => {
    const {output} = await suggestOptimizedLightingScenePrompt(input);
    return output!;
  }
);
