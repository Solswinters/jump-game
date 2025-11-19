/**
 * Google Analytics component
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return

    const url = pathname + searchParams.toString()

    // @ts-expect-error - gtag is loaded externally
    if (window.gtag) {
      // @ts-expect-error - gtag is loaded externally
      window.gtag('config', GA_ID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  if (!GA_ID) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  )
}
