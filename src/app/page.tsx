'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { SeoReport } from '@/components/seo-report'
import { AppLogo } from '@/components/app-logo'
import { toast } from 'sonner'
import { analyzeUrl, type AnalysisResult } from './actions'

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
})

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysisResult(null)

    const formData = new FormData()
    formData.append('url', values.url)

    try {
      const result = await analyzeUrl(formData)
      setAnalysisResult(result)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.'
      toast('Analysis Failed', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const LoadingState = () => (
    <div className="mt-8 w-full max-w-5xl animate-pulse space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full space-y-2 sm:w-auto">
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
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="flex w-full max-w-5xl flex-col items-center text-center">
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center justify-center rounded-full p-3 text-primary drop-shadow-primary/10">
            <AppLogo size={96} />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-foreground md:text-5xl">
            SEO Rush
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Get an instant, AI-powered SEO analysis of any website. Uncover insights, check your
            meta tags, and improve your ranking.
          </p>
        </header>

        <section className="w-full max-w-2xl rounded-lg border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        className="h-12 text-base"
                        aria-label="Website URL"
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="h-12 text-base text-zinc-100"
              >
                <Zap className="mr-2 h-5 w-5" />
                Analyze
              </Button>
            </form>
          </Form>
        </section>

        {isLoading && <LoadingState />}
        {analysisResult && <SeoReport data={analysisResult} />}
      </div>
      <button
        variant="secondary"
        aria-label="Created by art70x"
        title="Created by art70x"
        onClick={() => window.open('https://art70x.vercel.app/?ref=seo_rush', '_blank', 'noopener')}
        className="fixed right-4 bottom-4 cursor-pointer rounded-full bg-gradient-to-r from-primary to-indigo-600 px-4 py-2 font-medium text-zinc-100 shadow-lg ta-200 transition-transform duration-200 hover:scale-105 hover:shadow-xl hover:shadow-muted-foreground/64"
      >
        art70x
      </button>
    </main>
  )
}
