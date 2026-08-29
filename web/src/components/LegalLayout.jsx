import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import PageHeader from './PageHeader';

export default function LegalLayout({
  title,
  subtitle,
  lastUpdated,
  sections,
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader badge="Legal Document" title={title} subtitle={subtitle} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Document Metadata Bar */}
        <div className="mb-10 p-4 rounded-2xl bg-white border border-primary-border/60 shadow-soft flex items-center justify-between gap-4 text-xs sm:text-sm text-textSecondary">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Official Policy Document</span>
          </div>
          <div className="font-semibold text-textPrimary">
            Last Updated: <span className="text-primary">{lastUpdated}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Sticky Sidebar Navigation (Desktop) */}
          <aside className="hidden lg:block sticky top-28 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-primary-border/60 shadow-soft space-y-2">
            <h3 className="font-serif font-bold text-sm text-textPrimary uppercase tracking-wider mb-4 px-3">
              Table of Contents
            </h3>
            <nav className="space-y-1 text-xs">
              {sections.map((section, idx) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-primary-light text-primary font-bold border border-primary-border/60'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-primary-subtle'
                    }`}
                  >
                    <span className="truncate">{idx + 1}. {section.title}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Legal Content Column */}
          <main className="lg:col-span-3 space-y-10">
            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-primary-border/60 shadow-soft space-y-4"
              >
                <div className="flex items-center gap-3 border-b border-primary-border/40 pb-4">
                  <span className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-textPrimary">
                    {section.title}
                  </h2>
                </div>

                <div className="text-textSecondary text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
