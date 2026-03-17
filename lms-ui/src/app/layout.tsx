import { AuthInitializer } from '@/components/auth/auth-initializer'
import { QueryProvider } from '@/components/providers/query-provider'
import { StructuredData } from '@/components/seo/structured-data'
import { SEO_CONFIG, STRUCTURED_DATA } from '@/configs/seo'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

// Metadata gốc đã được giản lược
export const metadata: Metadata = {
  title: {
    default: SEO_CONFIG.defaultTitle,
    template: `%s | ${SEO_CONFIG.siteName}`
  },
  description: SEO_CONFIG.defaultDescription,
  keywords: SEO_CONFIG.keywords.join(', '),
  authors: [{ name: SEO_CONFIG.business.name }],
  creator: SEO_CONFIG.business.name,
  publisher: SEO_CONFIG.business.name,
  generator: 'Next.js',

  // OpenGraph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SEO_CONFIG.siteUrl,
    siteName: SEO_CONFIG.siteName,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [
      {
        url: SEO_CONFIG.openGraph.defaultImage,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.openGraph.imageAlt
      }
    ]
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: SEO_CONFIG.social.twitter,
    creator: SEO_CONFIG.social.twitter,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.defaultDescription,
    images: [SEO_CONFIG.openGraph.defaultImage]
  },

  // Xác minh (chỉ khi được cấu hình)
  verification: Object.fromEntries(Object.entries(SEO_CONFIG.verification).filter(([, value]) => value))
}

// Viewport đã được giản lược
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='vi' className='h-full'>
      <head>
        {/* Dữ liệu có cấu trúc */}
        <StructuredData data={[STRUCTURED_DATA.organization, STRUCTURED_DATA.website]} />

        {/* Gợi ý tối ưu hiệu năng */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTopLoader
          color='#333333!important'
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing='ease'
          speed={200}
          shadow='0 0 10px #333,0 0 5px #333'
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <AuthInitializer>
          <QueryProvider>
            {children}
            <Toaster position='top-center' />
          </QueryProvider>
        </AuthInitializer>
      </body>
    </html>
  )
}
