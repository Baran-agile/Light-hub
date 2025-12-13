'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BrainCircuit, Loader2, Sparkles } from 'lucide-react';
import { getAIOptimizationAction } from '@/app/actions';
import type { SuggestOptimizedLightingSceneInput } from '@/ai/flows/suggest-optimized-lighting-scenes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  activity: z.string().min(2, { message: 'Activity must be at least 2 characters.' }),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']),
  userPreferences: z.string().min(2, { message: 'Preferences must be at least 2 characters.' }),
});

export function AiOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activity: '',
      timeOfDay: 'evening',
      userPreferences: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);

    const input: SuggestOptimizedLightingSceneInput = values;
    const result = await getAIOptimizationAction(input);

    if (result.success && result.data) {
      setSuggestion(result.data.sceneDescription);
    } else {
      setError(result.message || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <Card className="border-accent border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <BrainCircuit className="h-8 w-8 text-accent" />
          <div>
            <CardTitle className="text-xl">AI Scene Optimizer</CardTitle>
            <CardDescription>Let AI suggest the perfect lighting for your activity.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Activity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Reading a book" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time of Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="userPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lighting Preferences</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dim and warm light" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Suggestion
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {(suggestion || error) && (
        <div className="p-6 pt-0">
          {suggestion && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>AI Suggestion</AlertTitle>
              <AlertDescription>{suggestion}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </Card>
  );
}
