
'use client';

import { useState, useEffect } from 'react';
import { Bot, Check, Clipboard, Download, FileText, ListTree, Tags, Link as LinkIcon } from 'lucide-react';
import type { AnalysisResult } from '@/app/actions';
import { SeoCard } from '@/components/seo-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SeoReportProps {
  data: AnalysisResult;
}

export function SeoReport({ data }: SeoReportProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const generateReportText = () => {
    let report = `SEO Analysis Report for: ${data.url}\n\n`;
    report += `--- AI Summary ---\n${data.aiSummary}\n\n`;
    report += `--- Details ---\n`;
    report += `Title: ${data.title || 'Not found'}\n`;
    report += `Meta Description: ${data.metaDescription || 'Not found'}\n`;
    report += `Keywords: ${data.keywords || 'Not found'}\n\n`;
    report += `--- Headings ---\n`;
    if (data.headings.length > 0) {
      data.headings.forEach(h => {
        report += `H${h.level}: ${h.text}\n`;
      });
    } else {
      report += 'No headings found.\n'
    }
    return report;
  };

  const handleCopyToClipboard = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText).then(() => {
      setIsCopied(true);
      toast({ title: 'Report copied to clipboard!' });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Failed to copy report', description: err.message });
    });
  };
  
  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${new URL(data.url).hostname}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Report download started!' });
  };

  return (
    <section className="mt-8 w-full max-w-5xl animate-fade-in space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analysis Report</h2>
          <p className="text-muted-foreground break-all">
            Results for: <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{data.url}</a>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </header>

      <div className="space-y-4">
        <SeoCard icon={Bot} title="AI-Powered Summary">
          <p className="text-base text-foreground/90">{data.aiSummary}</p>
        </SeoCard>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SeoCard icon={FileText} title="Page Title">
            <p className="text-lg font-semibold">{data.title || <span className="text-muted-foreground">Not found</span>}</p>
          </SeoCard>
          <SeoCard icon={LinkIcon} title="Meta Description" className="lg:col-span-2">
            <p className="text-sm text-muted-foreground">{data.metaDescription || 'Not found'}</p>
          </SeoCard>
          <SeoCard icon={Tags} title="Keywords" className="lg:col-span-3">
            {data.keywords ? (
                <div className="flex flex-wrap gap-2">
                    {data.keywords.split(',').map((kw, i) => kw.trim() && <Badge key={i} variant="secondary">{kw.trim()}</Badge>)}
                </div>
            ) : (
              <p className="text-sm text-muted-foreground">No keywords meta tag found.</p>
            )}
          </SeoCard>

          <SeoCard icon={ListTree} title="Headings Structure" className="lg:col-span-3">
            {data.headings.length > 0 ? (
              <ul className="space-y-2">
                {data.headings.map((heading, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Badge variant="outline" className={`w-10 justify-center font-bold ${heading.level === 1 ? 'text-primary border-primary' : ''}`}>
                      H{heading.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{heading.text}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No headings (H1-H6) found.</p>
            )}
          </SeoCard>
        </div>
      </div>
    </section>
  );
}
