
import Image from 'next/image';
import { Globe } from 'lucide-react';

interface OpenGraphPreviewProps {
  data: Record<string, string>;
  siteUrl: string;
}

export function OpenGraphPreview({ data, siteUrl }: OpenGraphPreviewProps) {
  const {
    title,
    description,
    image,
    site_name: siteName,
  } = data;

  if (Object.keys(data).length === 0) {
    return <p className="text-sm text-muted-foreground">No OpenGraph (og:...) meta tags found.</p>;
  }
  
  const displayUrl = siteName || new URL(siteUrl).hostname.replace('www.', '');

  return (
    <div className="rounded-lg border bg-card/50 overflow-hidden w-full max-w-lg mx-auto">
      {image && (
        <div className="relative aspect-video bg-muted">
           <Image
            src={image}
            alt={title || 'OpenGraph Image'}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 bg-secondary/30">
        <div className="text-xs uppercase text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            {displayUrl}
        </div>
        {title && <p className="font-semibold text-foreground mt-1 truncate">{title}</p>}
        {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
      </div>
    </div>
  );
}
