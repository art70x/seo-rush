'use client'

import { useState, useEffect } from 'react'
import {
  Bot,
  Check,
  Clipboard,
  Download,
  FileText,
  Tags,
  Link as LinkIcon,
  Share2,
  FileJson,
  FileCode,
  FileType,
  ExternalLink,
} from 'lucide-react'
import type { AnalysisResult } from '@/app/actions'
import { SeoCard } from '@/components/seo-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { OpenGraphPreview } from '@/components/open-graph-preview'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SeoReportProps {
  data: AnalysisResult
}

export function SeoReport({ data }: SeoReportProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const generateReportText = () => {
    let report = `SEO Analysis Report for: ${data.url}\n\n`
    report += `--- AI Summary ---\n${data.aiSummary}\n\n`
    report += `--- Details ---\n`
    report += `Title: ${data.title || 'Not found'}\n`
    report += `Meta Description: ${data.metaDescription || 'Not found'}\n`
    report += `Keywords: ${data.keywords || 'Not found'}\n\n`
    report += `--- Links ---\n`
    report += `Internal Links: ${data.links.internal.length}\n`
    data.links.internal.forEach((l) => {
      report += `- ${l.text} (${l.href})\n`
    })
    report += `\nExternal Links: ${data.links.external.length}\n`
    data.links.external.forEach((l) => {
      report += `- ${l.text} (${l.href})\n`
    })

    report += `\n\n--- OpenGraph Data ---\n`
    if (Object.keys(data.openGraphData).length > 0) {
      for (const [key, value] of Object.entries(data.openGraphData)) {
        report += `og:${key}: ${value}\n`
      }
    } else {
      report += 'No OpenGraph data found.\n'
    }
    return report
  }

  const generateReportMarkdown = () => {
    let report = `# SEO Analysis Report for: ${data.url}\n\n`
    report += `## AI Summary\n${data.aiSummary}\n\n`
    report += `## Details\n`
    report += `**Title**: ${data.title || 'Not found'}\n`
    report += `**Meta Description**: ${data.metaDescription || 'Not found'}\n`
    report += `**Keywords**: ${data.keywords ? `\`${data.keywords}\`` : 'Not found'}\n\n`

    report += `## Link Analysis\n`
    report += `### Internal Links (${data.links.internal.length})\n`
    if (data.links.internal.length > 0) {
      data.links.internal.forEach((l) => (report += `- [${l.text}](${l.href})\n`))
    } else {
      report += `No internal links found.\n`
    }

    report += `\n### External Links (${data.links.external.length})\n`
    if (data.links.external.length > 0) {
      data.links.external.forEach((l) => (report += `- [${l.text}](${l.href})\n`))
    } else {
      report += `No external links found.\n`
    }

    report += `\n## OpenGraph Data\n`
    if (Object.keys(data.openGraphData).length > 0) {
      report += '| Property | Value |\n| --- | --- |\n'
      for (const [key, value] of Object.entries(data.openGraphData)) {
        report += `| \`og:${key}\` | ${value} |\n`
      }
    } else {
      report += 'No OpenGraph data found.\n'
    }
    return report
  }

  const generateReportHtml = () => {
    const md = generateReportMarkdown()
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/#### (.*)/g, '<h4>$1</h4>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
    return `<!DOCTYPE html><html><head><title>SEO Report</title><style>body{font-family:sans-serif;}</style></head><body>${md}</body></html>`
  }

  const handleCopyToClipboard = () => {
    const reportText = generateReportText()
    navigator.clipboard
      .writeText(reportText)
      .then(() => {
        setIsCopied(true)
        toast({ title: 'Report copied to clipboard!' })
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => {
        toast({
          variant: 'destructive',
          title: 'Failed to copy report',
          description: err.message,
        })
      })
  }

  const handleDownload = (format: 'txt' | 'json' | 'md' | 'html') => {
    let content = ''
    let mimeType = 'text/plain'

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2)
        mimeType = 'application/json'
        break
      case 'md':
        content = generateReportMarkdown()
        mimeType = 'text/markdown'
        break
      case 'html':
        content = generateReportHtml()
        mimeType = 'text/html'
        break
      case 'txt':
      default:
        content = generateReportText()
        mimeType = 'text/plain'
        break
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-${new URL(data.url).hostname}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: `Report download as ${format.toUpperCase()} started!` })
  }

  if (!isMounted) {
    return null
  }

  const LinkList = ({ links }: { links: { text: string; href: string }[] }) => (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index} className="flex items-start gap-3">
          <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm break-all text-primary hover:underline"
          >
            {link.href}
            <span className="block text-xs text-muted-foreground">
              {link.text || 'No anchor text'}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <section className="mt-8 w-full max-w-5xl animate-fade-in space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analysis Report</h2>
          <p className="break-all text-muted-foreground">
            Results for:{' '}
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {data.url}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            {isCopied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {isCopied ? 'Copied' : 'Copy'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload('txt')}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Text (.txt)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('md')}>
                <FileType className="mr-2 h-4 w-4" />
                <span>Markdown (.md)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('json')}>
                <FileJson className="mr-2 h-4 w-4" />
                <span>JSON (.json)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('html')}>
                <FileCode className="mr-2 h-4 w-4" />
                <span>HTML (.html)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="space-y-4">
        <SeoCard icon={Bot} title="AI-Powered Summary">
          <p className="text-base leading-relaxed text-foreground/90">{data.aiSummary}</p>
        </SeoCard>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SeoCard icon={FileText} title="Page Title">
            <p className="text-lg font-semibold">
              {data.title || <span className="text-muted-foreground">Not found</span>}
            </p>
          </SeoCard>
          <SeoCard icon={LinkIcon} title="Meta Description" className="lg:col-span-2">
            <p className="text-sm text-muted-foreground">{data.metaDescription || 'Not found'}</p>
          </SeoCard>
          <SeoCard icon={Tags} title="Keywords" className="lg:col-span-3">
            {data.keywords ? (
              <div className="flex flex-wrap gap-2">
                {data.keywords.split(',').map(
                  (kw, i) =>
                    kw.trim() && (
                      <Badge key={i} variant="secondary">
                        {kw.trim()}
                      </Badge>
                    ),
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No keywords meta tag found.</p>
            )}
          </SeoCard>

          <SeoCard icon={Share2} title="OpenGraph Preview" className="lg:col-span-3">
            <OpenGraphPreview data={data.openGraphData} siteUrl={data.url} />
          </SeoCard>

          <SeoCard icon={LinkIcon} title="Link Analysis" className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold">
                  Internal Links ({data.links.internal.length})
                </h3>
                {data.links.internal.length > 0 ? (
                  <ScrollArea className="h-64 pr-4">
                    <LinkList links={data.links.internal} />
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No internal links found.</p>
                )}
              </div>
              <div>
                <h3 className="mb-3 font-semibold">
                  External Links ({data.links.external.length})
                </h3>
                {data.links.external.length > 0 ? (
                  <ScrollArea className="h-64 pr-4">
                    <LinkList links={data.links.external} />
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No external links found.</p>
                )}
              </div>
            </div>
          </SeoCard>
        </div>
      </div>
    </section>
  )
}
