import { InstagramLogo, TiktokLogo, WhatsappLogo, X } from "phosphor-react";
import { Link } from "react-router-dom";
import UnivyxLogo from "../../../../assets/images/univyx-logo.svg";

const footerMenu = [
  { href: "/academics", menu: "Academics" },
  { href: "/entertainment", menu: "Entertainment" },
  { href: "/gaming", menu: "Gaming" },
  { href: "/store", menu: "Store" },
];

const socialMediaPlatforms = [
  {
    link: "https://www.instagram.com/univyx",
    icon: <InstagramLogo size={24} />,
    name: "Instagram",
  },
  {
    link: "https://whatsapp.com/channel/0029Vb2ER34F1YlKC4kehu3Y",
    icon: <WhatsappLogo size={24} />,
    name: "WhatsApp",
  },
  {
    link: "https://www.tiktok.com/@univyx_",
    icon: <TiktokLogo size={24} />,
    name: "TikTok",
  },
  { link: "https://x.com/univyx", icon: <X size={24} />, name: "X" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer aria-label="footer" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src={UnivyxLogo} alt="Univyx" className="h-12" />
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The ultimate platform for private university students, combining academics, business, gaming, and entertainment in one place.
            </p>
            <div className="flex gap-3">
              {socialMediaPlatforms.map((platform, index) => (
                <a
                  key={index}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  aria-label={platform.name}
                >
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerMenu.map((menu, index) => (
                <li key={index}>
                  <Link to={menu.href} className="text-gray-300 hover:text-white transition-colors">
                    {menu.menu}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Jobs</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© {currentYear} Univyx. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
