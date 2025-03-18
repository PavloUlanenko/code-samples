import { Metadata } from 'next'
import { APP_NAME, Language } from '@/constant'

type GetMetadata = (props: {
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  createdAt: string
  updatedAt: string
  locale: Language
}) => Metadata

export const getMetadata: GetMetadata = ({
  metaTitle,
  metaDescription,
  canonicalUrl,
  createdAt,
  updatedAt,
  locale
}) => {
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl
    },
    manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    applicationName: APP_NAME,
    appleWebApp: {
      title: APP_NAME
    },
    icons: {
      icon: [
        {
          url: '/web-app-manifest-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          url: '/web-app-manifest-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { url: '/favicon.svg', sizes: '16x16', type: 'image/svg+xml' }
      ],
      apple: {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: APP_NAME,
      images: [
        {
          url: '/images/site/us-flag.svg',
          width: 60,
          height: 34.5
        }
      ],
      locale: locale || 'en_US',
      type: 'website'
    },
    bookmarks: canonicalUrl,
    other: {
      'article:modified_time': createdAt,
      'article:published_time': updatedAt
    }
  }
}
