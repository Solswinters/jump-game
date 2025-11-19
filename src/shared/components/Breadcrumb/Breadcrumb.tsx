/**
 * Breadcrumb navigation component
 */

'use client'

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
}

export function Breadcrumb({ items, separator = '/' }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-gray-400 transition-colors hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={isLast ? 'text-white font-medium' : 'text-gray-400'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span className="mx-2 text-gray-600">{separator}</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
