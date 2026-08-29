import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, Sparkles, Mail, MapPin, Download } from 'lucide-react';
import { footerLinks } from '../data/navigation';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white relative overflow-hidden pt-16 pb-12">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-[#E84C77] to-primaryDark flex items-center justify-center text-white shadow-soft">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl text-white tracking-tight">
                  RISHTA<span className="text-gold font-extrabold">24</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-primary-border -mt-1">
                  रिश्ता २४
                </span>
              </div>
            </Link>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              <span className="font-serif italic text-gold font-medium">“Har Rishta, Ek Nayi Shuruaat”</span> — A production-ready matrimonial application built with multi-vector compatibility scoring, real-time socket chat, and Govt ID verified security.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-gold font-medium">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Govt ID Verified System</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white/80 font-medium">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>256-Bit Encrypted Data</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-serif font-semibold text-base text-gold mb-4 tracking-wide">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.product.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/70 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-serif font-semibold text-base text-gold mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.resources.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/70 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-serif font-semibold text-base text-gold mb-4 tracking-wide">Legal & Trust</h3>
            <ul className="space-y-2.5 text-sm mb-6">
              {footerLinks.legal.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-white/70 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-serif font-semibold text-xs text-gold uppercase tracking-wider mb-2">Download App</h3>
            <a
              href="/downloads/rishta24-app.apk"
              download="rishta24-app.apk"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-secondary font-bold text-xs shadow-soft hover:bg-gold-light transition-all"
            >
              <Download className="w-4 h-4 text-secondary" />
              <span>Download Android APK</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 RISHTA24 (रिश्ता २४). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Support Desk</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
