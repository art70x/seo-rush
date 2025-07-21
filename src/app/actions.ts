
'use server';

import { z } from 'zod';
import { summarizeSeoInsights } from '@/ai/flows/summarize-seo-insights';

const analyzeUrlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

export interface AnalysisResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  keywords: string | null;
  headings: { level: number; text: string }[];
  contentSample: string;
  aiSummary: string;
}

// A simple regex to strip HTML tags. Not perfect, but works for basic cases.
const stripTags = (html: string) => html.replace(/<[^>]*>/g, '');

// A simple regex to get body content.
const getBodyContent = (html: string): string => {
    const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return match ? match[1] : '';
}

export async function analyzeUrl(formData: FormData): Promise<AnalysisResult> {
  const validation = analyzeUrlSchema.safeParse({
    url: formData.get('url'),
  });

  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { url } = validation.data;

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'SEO-Pulse-Bot/1.0' } });
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();

    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
    
    const headings: { level: number; text: string }[] = [];
    const headingRegex = /<h([1-6])[^>]*>([^<]*)<\/h\1>/gi;
    let headingMatch;
    while ((headingMatch = headingRegex.exec(html)) !== null) {
        headings.push({ level: parseInt(headingMatch[1]), text: headingMatch[2].trim() });
    }

    const bodyText = stripTags(getBodyContent(html)).replace(/\s\s+/g, ' ').trim();
    
    const analysisInput = {
      url,
      title: titleMatch ? titleMatch[1] : '',
      metaDescription: descriptionMatch ? descriptionMatch[1] : '',
      keywords: keywordsMatch ? keywordsMatch[1] : '',
      content: bodyText.substring(0, 4000), // Limit content to avoid overly long prompts
    };
    
    const { summary } = await summarizeSeoInsights(analysisInput);

    return {
      url,
      title: titleMatch ? titleMatch[1].trim() : null,
      metaDescription: descriptionMatch ? descriptionMatch[1].trim() : null,
      keywords: keywordsMatch ? keywordsMatch[1].trim() : null,
      headings,
      contentSample: bodyText.substring(0, 500),
      aiSummary: summary,
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    if (error instanceof Error) {
        if (error.message.includes('fetch')) {
            throw new Error('Could not retrieve the website. Please check the URL and if the site is publicly accessible.');
        }
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}
