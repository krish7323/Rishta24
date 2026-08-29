import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserPlus, Sliders, Heart, MessageSquare, ShieldCheck, HelpCircle, ChevronRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { guideSections } from '../data/guide';
import { usePageTitle } from '../utils/seo';

export default function GuidePage() {
  usePageTitle(
    'User Guide & Documentation — RISHTA24 Matrimonial App',
    'Comprehensive step-by-step user guide for RISHTA24: Account registration, 10-step profile wizard, compatibility search, interest workflow, socket chat, and Govt ID verification.'
  );

  const [activeSectionId, setActiveSectionId] = useState(guideSections[0].id);

  const activeSection =
    guideSections.find((s) => s.id === activeSectionId) || guideSections[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageHeader
        badge="Complete User Manual"
        title="How to Use RISHTA24"
        subtitle="A step-by-step guide explaining every screen, feature, and workflow in the RISHTA24 application."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Guide Sidebar Navigation */}
          <aside className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-primary-border/60 shadow-soft space-y-2 lg:sticky lg:top-28">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-textMuted px-3 mb-3">
              Guide Modules
            </h3>
            <nav className="space-y-1.5 text-xs sm:text-sm">
              {guideSections.map((sec, idx) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-2xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-primary text-white font-bold shadow-soft'
                        : 'text-textSecondary hover:text-textPrimary hover:bg-primary-subtle'
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-textMuted'}`} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Guide Main Content View */}
          <main className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-10 border border-primary-border/60 shadow-soft space-y-6">
            <div className="flex items-center gap-3 border-b border-primary-border/40 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary-light text-primary flex items-center justify-center border border-primary-border">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-textPrimary">
                {activeSection.title}
              </h2>
            </div>

            <div className="prose prose-rose max-w-none text-textSecondary text-sm sm:text-base leading-relaxed space-y-4 font-normal">
              {activeSection.content.split('\n\n').map((paragraph, pIdx) => {
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="font-serif font-bold text-lg text-textPrimary pt-2">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={pIdx} className="list-disc pl-5 space-y-1.5 text-textSecondary">
                      {paragraph.split('\n').map((item, iIdx) => (
                        <li key={iIdx}>{item.replace('- ', '')}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('1. ')) {
                  return (
                    <ol key={pIdx} className="list-decimal pl-5 space-y-1.5 text-textSecondary">
                      {paragraph.split('\n').map((item, iIdx) => (
                        <li key={iIdx}>{item.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={pIdx}>{paragraph}</p>;
              })}
            </div>
          </main>
        </div>
      </div>

      <CTASection
        title="Need further assistance or support?"
        subtitle="Our support team and help desk are available 24/7 to resolve any questions or verification inquiries."
        buttonText="Contact Support Desk"
        buttonTo="/contact"
      />
    </div>
  );
}
