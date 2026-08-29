import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, ShieldCheck, Sparkles, Download } from 'lucide-react';
import { navLinks } from '../data/navigation';
import Button from './Button';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-primary-border/60 shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-[#E84C77] to-primaryDark flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl text-textPrimary tracking-tight flex items-center gap-1">
                RISHTA<span className="text-primary font-extrabold">24</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-textMuted -mt-1">
                रिश्ता २४
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary-border/40 shadow-sm">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary font-semibold' : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-primaryDark rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/contact"
              className="text-sm font-medium text-textSecondary hover:text-primary transition-colors px-3 py-2"
            >
              Support
            </Link>
            <Button
              href="/downloads/rishta24-app.apk"
              download="rishta24-app.apk"
              variant="gold"
              size="sm"
              icon={Download}
            >
              Download App
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-textPrimary hover:bg-primary-light/50 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-primary-border/60 shadow-card overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-light text-primary font-bold border border-primary-border/60'
                          : 'text-textPrimary hover:bg-primary-subtle'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-primary-border/40 flex flex-col gap-3">
                <Button
                  href="/downloads/rishta24-app.apk"
                  download="rishta24-app.apk"
                  variant="gold"
                  size="md"
                  icon={Download}
                  className="w-full"
                >
                  Download Android APK
                </Button>
                <Button to="/guide" variant="outline" size="md" icon={Sparkles} className="w-full">
                  User Guide
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
