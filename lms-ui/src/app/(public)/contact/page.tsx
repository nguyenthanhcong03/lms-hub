import dynamic from 'next/dynamic'
import HeroSection from './components/hero-section'

// Import tĩnh cho nội dung quan trọng ở vùng đầu trang

const ContactInfoSection = dynamic(() => import('./components/contact-info-section'))

export default function ContactPage() {
  return (
    <>
      {/* Nội dung quan trọng ở vùng đầu trang - tải ngay */}
      <HeroSection />

      {/* Nội dung phía dưới - tải dần, vẫn thân thiện SEO */}
      <ContactInfoSection />
    </>
  )
}
