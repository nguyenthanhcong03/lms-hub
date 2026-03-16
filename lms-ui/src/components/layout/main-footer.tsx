import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa6";

const MainFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Về chúng tôi", href: "/about" },
    { name: "Khóa học", href: "/courses" },
    { name: "Giảng viên", href: "/instructors" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const supportLinks = [
    { name: "Trung tâm trợ giúp", href: "/help" },
    { name: "Điều khoản dịch vụ", href: "/terms" },
    { name: "Chính sách bảo mật", href: "/privacy" },
    { name: "Chính sách hoàn tiền", href: "/refund" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/LMS7dev/",
      icon: Facebook,
    },
    { name: "Telegram", href: "https://t.me/LMS7dev", icon: FaTelegram },
    {
      name: "Instagram",
      href: "https://www.instagram.com/LMS7dev/",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/tin-phan-thanh-880684275/",
      icon: Linkedin,
    },
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">LMSHub</span>
            </Link>
            <p className="text-gray-600 max-w-sm">
              Bứt phá tương lai với các khóa học trực tuyến toàn diện. Học từ chuyên gia trong ngành và phát triển sự
              nghiệp của bạn.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-600 hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kết nối với chúng tôi</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@lmshub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Hà Nội, Việt Nam</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Đăng ký nhận bản tin</p>
              <div className="flex space-x-2">
                <Input type="email" placeholder="Nhập email của bạn" className="flex-1" />
                <Button size="sm">Đăng Ký</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {currentYear} LMSHub. Bảo lưu mọi quyền.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Điều Khoản
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Bảo Mật
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-primary text-sm transition-colors">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
