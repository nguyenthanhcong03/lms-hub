// ✨ Simplified SEO Configuration - Only Essential Fields
export const SEO_CONFIG = {
  // 🏠 Core Site Information
  siteName: "LMS Hub",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  defaultTitle: "LMS Hub - Học Kỹ Năng Mới, Phát Triển Sự Nghiệp",
  defaultDescription:
    "Nền tảng học tập trực tuyến hàng đầu, giúp bạn phát triển kỹ năng mới và tiến xa trong sự nghiệp.",

  // 👤 Business Basics
  business: {
    name: "lms hub",
    foundedYear: 2020,
    email: "support@lmshub.com",
  },

  // 📱 Social Media (for structured data & sharing)
  social: {
    twitter: "@lmshub",
    facebook: "lmshub",
    instagram: "lmshub",
    linkedin: "company/lmshub",
    youtube: "@lmshub",
  },

  // 🔍 SEO Basics
  keywords: [
    "online learning",
    "education platform",
    "online courses",
    "skill development",
    "professional development",
    "e-learning",
    "LMS",
  ],

  // 🌐 OpenGraph (for social sharing)
  openGraph: {
    defaultImage: "/images/og-default.jpg", // 1200x630px
    imageAlt: "LMS Hub - Học Kỹ Năng Mới, Phát Triển Sự Nghiệp",
  },

  // 🐦 Twitter Card
  twitter: {
    handle: "@lmshub",
  },

  // ✅ Verification (add when you have them)
  verification: {
    google: "", // Add your Google Search Console verification code
    // bing: "", // Uncomment when needed
  },
};

// 📄 Page-Specific SEO (simplified)
export const PAGE_SEO = {
  home: {
    title: "LMS Hub - Học Kỹ Năng Mới, Phát Triển Sự Nghiệp", // Only used for OpenGraph
    description: "Nền tảng học tập trực tuyến hàng đầu, giúp bạn phát triển kỹ năng mới và tiến xa trong sự nghiệp.",
  },

  about: {
    title: "About - Building the Future of Education", // Will become "About - Building the Future of Education | LMSHub"
    description:
      "Discover how LMSHub is making quality education accessible to everyone. Our story, mission, and commitment to empowering learners worldwide since 2020.",
  },

  courses: {
    title: "Online Courses - Learn from Expert Instructors", // Will become "Online Courses - Learn from Expert Instructors | LMSHub"
    description:
      "Browse hundreds of courses across technology, business, design, and more. Expert instructors, hands-on projects, and certificates to advance your career.",
  },

  blog: {
    title: "Education Blog - Learning Tips & Industry Insights", // Will become "Education Blog - Learning Tips & Industry Insights | LMSHub"
    description:
      "Stay ahead with learning strategies, industry trends, and expert insights. Practical tips to accelerate your professional growth and skill development.",
  },

  contact: {
    title: "Contact - Get Support & Connect with Us", // Will become "Contact - Get Support & Connect with Us | LMSHub"
    description:
      "Need help with your learning journey? Get in touch with our support team. We're here to help you succeed and make the most of your educational experience.",
  },
};

// 🎯 Templates for Dynamic Pages
export const SEO_TEMPLATES = {
  course: {
    title: "%s - Online Course | LMSHub",
    description:
      "Learn %s with our comprehensive online course. Expert instruction, practical projects, and certification upon completion.",
  },
  blog: {
    title: "%s | LMSHub Education Blog",
    description:
      "Read about %s and discover expert insights on education, learning strategies, and professional development from LMSHub.",
  },
};

// 🏗️ Structured Data Templates (JSON-LD)
export const STRUCTURED_DATA = {
  organization: {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SEO_CONFIG.business.name,
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/images/logo.png`,
    foundingDate: SEO_CONFIG.business.foundedYear.toString(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SEO_CONFIG.business.email,
    },
    sameAs: [
      `https://twitter.com/${SEO_CONFIG.social.twitter.replace("@", "")}`,
      `https://facebook.com/${SEO_CONFIG.social.facebook}`,
      `https://instagram.com/${SEO_CONFIG.social.instagram}`,
      `https://linkedin.com/${SEO_CONFIG.social.linkedin}`,
      `https://youtube.com/${SEO_CONFIG.social.youtube}`,
    ],
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },

  // 📚 Course Schema Template
  course: (course: {
    title: string;
    description: string;
    slug: string;
    thumbnail?: string;
    instructor?: { name: string };
    price?: number;
    rating?: number;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: SEO_CONFIG.business.name,
      url: SEO_CONFIG.siteUrl,
    },
    instructor: course.instructor
      ? {
          "@type": "Person",
          name: course.instructor.name,
        }
      : undefined,
    image: course.thumbnail,
    offers: course.price
      ? {
          "@type": "Offer",
          price: course.price,
          priceCurrency: "USD",
        }
      : undefined,
    aggregateRating: course.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: course.rating,
        }
      : undefined,
  }),

  // 📝 Blog Post Schema Template
  blogPost: (blog: {
    title: string;
    description: string;
    slug: string;
    thumbnail?: string;
    author?: { name: string };
    createdAt: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description,
    image: blog.thumbnail,
    author: {
      "@type": "Person",
      name: blog.author?.name || SEO_CONFIG.business.name,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.business.name,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.siteUrl}/images/logo.png`,
      },
    },
    datePublished: blog.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SEO_CONFIG.siteUrl}/blogs/${blog.slug}`,
    },
  }),

  // 🍞 Breadcrumb Schema
  breadcrumbs: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // ❓ FAQ Schema Template
  faq: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),
};

// 🚀 Export aliases for backwards compatibility
export const SCHEMA_ORG = STRUCTURED_DATA; // Keep old name working
export const COURSE_SEO_TEMPLATE = SEO_TEMPLATES.course;
export const BLOG_SEO_TEMPLATE = SEO_TEMPLATES.blog;
