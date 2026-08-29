import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, HelpCircle, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import FAQAccordion from '../components/FAQAccordion';
import CTASection from '../components/CTASection';
import { faqs, faqCategories } from '../data/faqs';
import { usePageTitle } from '../utils/seo';

export default function FAQPage() {
  usePageTitle(
    'Frequently Asked Questions (FAQ) — RISHTA24',
    'Search and browse answers to common questions about RISHTA24: matching, verification, privacy controls, VIP membership, and real-time chat.'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageHeader
        badge="Help Desk & FAQ"
        title="Frequently Asked Questions"
        subtitle="Have questions about RISHTA24? Search our knowledge base or browse by category below."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Search Input Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., Aadhaar, Compatibility, Phone privacy)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-primary-border/80 text-textPrimary placeholder:text-textMuted shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm sm:text-base transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {faqCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-soft'
                    : 'bg-white/80 text-textSecondary border border-primary-border/60 hover:bg-white hover:text-textPrimary'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Accordion Results */}
        {filteredFaqs.length > 0 ? (
          <FAQAccordion items={filteredFaqs} allowMultiple />
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-primary-border/60 shadow-soft p-8 space-y-3">
            <HelpCircle className="w-12 h-12 text-primary/40 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-textPrimary">No matching questions found</h3>
            <p className="text-textSecondary text-sm">
              Try searching with a different term or browse all questions above.
            </p>
          </div>
        )}
      </div>

      <CTASection
        title="Still have questions?"
        subtitle="Contact our 24/7 customer support desk and we will be happy to assist you."
        buttonText="Contact Support"
        buttonTo="/contact"
      />
    </div>
  );
}
