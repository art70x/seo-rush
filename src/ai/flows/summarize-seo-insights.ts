'use server'

/**
 * @fileOverview Provides AI-powered summaries of SEO analysis for a given URL.
 *
 * - summarizeSeoInsights - A function that takes a URL and returns an SEO summary.
 * - SummarizeSeoInsightsInput - The input type for the summarizeSeoInsights function.
 * - SummarizeSeoInsightsOutput - The return type for the summarizeSeoInsights function.
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit'

const SummarizeSeoInsightsInputSchema = z.object({
  url: z.string().url().describe('The URL to analyze for SEO insights.'),
  metaDescription: z.string().describe('The meta description of the website.'),
  title: z.string().describe('The title of the website.'),
  keywords: z.string().describe('The keywords associated with the website.'),
  content: z.string().describe('The text content of the website.'),
})
export type SummarizeSeoInsightsInput = z.infer<typeof SummarizeSeoInsightsInputSchema>

const SummarizeSeoInsightsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the SEO analysis, highlighting key areas for improvement and opportunities.',
    ),
})
export type SummarizeSeoInsightsOutput = z.infer<typeof SummarizeSeoInsightsOutputSchema>

export async function summarizeSeoInsights(
  input: SummarizeSeoInsightsInput,
): Promise<SummarizeSeoInsightsOutput> {
  return summarizeSeoInsightsFlow(input)
}

const summarizeSeoInsightsPrompt = ai.definePrompt({
  name: 'summarizeSeoInsightsPrompt',
  input: { schema: SummarizeSeoInsightsInputSchema },
  output: { schema: SummarizeSeoInsightsOutputSchema },
  prompt: `You are an SEO expert providing a summary of a website's SEO performance.

  Based on the following information, provide a concise summary of the SEO analysis, highlighting key areas for improvement and opportunities.

  URL: {{{url}}}
  Title: {{{title}}}
  Meta Description: {{{metaDescription}}}
  Keywords: {{{keywords}}}
  Content: {{{content}}}
  `,
})

const summarizeSeoInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeSeoInsightsFlow',
    inputSchema: SummarizeSeoInsightsInputSchema,
    outputSchema: SummarizeSeoInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeSeoInsightsPrompt(input)
    return output!
  },
)
