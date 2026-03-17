import { Metadata } from 'next'
import { SEO_CONFIG } from '@/configs/seo'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  noIndex?: boolean
  noFollow?: boolean
  openGraph?: {
    title?: string
    description?: string
    image?: string
    type?: 'website' | 'article' | 'profile'
  }
  twitter?: {
    title?: string
    description?: string
    image?: string
  }
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonical,
  noIndex = false,
  noFollow = false,
  openGraph,
  twitter
}: SEOHeadProps): Metadata {
  const fullTitle = title ? `${title} | ${SEO_CONFIG.siteName}` : SEO_CONFIG.defaultTitle // Dùng trực tiếp tiêu đề mặc định cho trang chủ

  const fullDescription = description || SEO_CONFIG.defaultDescription
  const allKeywords = [...SEO_CONFIG.keywords, ...keywords]
  const canonicalUrl = canonical ? `${SEO_CONFIG.siteUrl}${canonical}` : undefined

  // Ảnh mặc định
  const defaultImage = openGraph?.image || SEO_CONFIG.openGraph.defaultImage
  const imageAlt = openGraph?.title || SEO_CONFIG.openGraph.imageAlt

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(', '),
    authors: [{ name: SEO_CONFIG.business.name }],
    creator: SEO_CONFIG.business.name,
    publisher: SEO_CONFIG.business.name,

    // Robots
    robots:
      noIndex || noFollow
        ? {
            index: !noIndex,
            follow: !noFollow
          }
        : {
            index: true,
            follow: true
          },

    // URL chuẩn (canonical)
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl
        }
      : undefined,

    // OpenGraph cho chia sẻ mạng xã hội
    openGraph: {
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || fullDescription,
      url: canonicalUrl,
      siteName: SEO_CONFIG.siteName,
      locale: 'vi_VN',
      type: openGraph?.type || 'website',
      images: defaultImage
        ? [
            {
              url: defaultImage,
              width: 1200,
              height: 630,
              alt: imageAlt
            }
          ]
        : undefined
    },

    // Thẻ Twitter
    twitter: {
      card: 'summary_large_image',
      site: SEO_CONFIG.social.twitter,
      creator: SEO_CONFIG.social.twitter,
      title: twitter?.title || openGraph?.title || fullTitle,
      description: twitter?.description || openGraph?.description || fullDescription,
      images: twitter?.image || defaultImage ? [twitter?.image || defaultImage!] : undefined
    },

    // Mã xác minh (chỉ thêm khi tồn tại)
    verification: Object.fromEntries(Object.entries(SEO_CONFIG.verification).filter(([, value]) => value))
  }
}
