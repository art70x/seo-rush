import { Geist } from 'next/font/google'
import type { Metadata } from 'next'
import type { Viewport } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Segoe UI', 'Roboto', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'SEO Rush - Free AI-Powered SEO Analysis Tool for Websites',
  description:
    'Run instant, in-depth SEO audits with AI. Analyze any website, uncover meta tag issues, get optimization tips, and boost your search engine rankings for free.',
  openGraph: {
    title: 'SEO Rush',
    description:
      'Instant AI-powered SEO audits. Analyze any site, find meta tag issues, and boost rankings quickly and for free.',
    url: 'https://seo-rush.vercel.app',
    siteName: 'SEO Rush',
    images: [
      {
        url: 'https://seo-rush.vercel.app/og.png',
        width: 1200,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Rush',
    description:
      'Instant AI-powered SEO audits. Analyze any site, find meta tag issues, and boost rankings quickly and for free.',
    creator: '@art70x',
    images: ['https://seo-rush.vercel.app/og.png'],
  },
  appleWebApp: {
    title: 'SEO Rush',
    statusBarStyle: 'black-translucent',
  },
  alternates: {
    canonical: 'https://seo-rush.vercel.app',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2b7fff' },
    { media: '(prefers-color-scheme: dark)', color: '#155dfc' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geistSans.className}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
