
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Lexend } from 'next/font/google';

export const metadata: Metadata = {
  title: 'SEO Pulse - Instant AI-Powered SEO Analysis',
  description: 'Get an instant, AI-powered SEO analysis of any website. Uncover insights, check your meta tags, and improve your search engine ranking for free.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${lexend.variable}`}>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
