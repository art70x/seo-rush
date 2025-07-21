import Image from 'next/image'
import { Globe } from 'lucide-react'

interface OpenGraphPreviewProps {
  data: Record<string, string>
  siteUrl: string
}

export function OpenGraphPreview({ data, siteUrl }: OpenGraphPreviewProps) {
  const { title, description, image, site_name: siteName } = data

  if (Object.keys(data).length === 0) {
    return <p className="text-sm text-muted-foreground">No OpenGraph (og:...) meta tags found.</p>
  }

  const displayUrl = siteName || new URL(siteUrl).hostname.replace('www.', '')

  return (
    <div className="mx-auto w-full max-w-lg overflow-hidden rounded-lg border bg-card/50">
      {image && (
        <div className="relative aspect-video bg-muted">
          <Image src={image} alt={title || 'OpenGraph Image'} fill className="object-cover" />
        </div>
      )}
      <div className="bg-secondary/30 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase">
          <Globe className="h-3 w-3" />
          {displayUrl}
        </div>
        {title && <p className="mt-1 truncate font-semibold text-foreground">{title}</p>}
        {description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
