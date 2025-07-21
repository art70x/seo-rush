
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bot, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { SeoReport } from '@/components/seo-report';
import { useToast } from '@/hooks/use-toast';
import { analyzeUrl, type AnalysisResult } from './actions';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function Home() {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('url', values.url);

    try {
      const result = await analyzeUrl(formData);
      setAnalysisResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const LoadingState = () => (
    <div className="mt-8 w-full max-w-5xl space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2 w-full sm:w-auto">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-sm" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full lg:col-span-2" />
        <Skeleton className="h-24 w-full lg:col-span-3" />
        <Skeleton className="h-48 w-full lg:col-span-3" />
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        <header className="mb-8">
            <div className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full p-3 mb-4">
                <Bot className="h-8 w-8" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground font-headline">
            SEO Pulse
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Get an instant, AI-powered SEO analysis of any website. Uncover insights, check your meta tags, and improve your ranking.
          </p>
        </header>

        <section className="w-full max-w-2xl rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} className="h-12 text-base" aria-label="Website URL" />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={isLoading} className="h-12 text-base">
                <Zap className="mr-2 h-5 w-5" />
                Analyze
              </Button>
            </form>
          </Form>
        </section>

        {isLoading && <LoadingState />}
        {analysisResult && <SeoReport data={analysisResult} />}
      </div>
    </main>
  );
}
