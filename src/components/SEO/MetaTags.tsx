/**
 * SEO meta tags component
 */

import { generateMetadata, defaultSEO, generateStructuredData } from '@/lib/seo'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function MetaTags(props: MetaTagsProps) {
  const _metadata = generateMetadata({
    ...defaultSEO,
    ...props,
  })

  const structuredData = generateStructuredData('Game')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  )
}
