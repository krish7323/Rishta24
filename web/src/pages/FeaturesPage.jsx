import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import FeatureCard from '../components/FeatureCard';
import CTASection from '../components/CTASection';
import { features, featureCategories } from '../data/features';
import { usePageTitle } from '../utils/seo';

export default function FeaturesPage() {
  usePageTitle(
    'Features & Capabilities — RISHTA24 Matrimonial App',
    'Explore the complete feature set of RISHTA24: 7-vector compatibility algorithm, real-time socket chat, Aadhaar/Passport verification desk, VIP membership tiers, and privacy controls.'
  );

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredFeatures =
    activeCategory === 'all'
      ? features
      : features.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageHeader
        badge="Complete Platform Showcase"
        title="Everything You Need for a Lifelong Connection"
        subtitle="RISHTA24 combines modern engineering with deep cultural matching. Explore all feature groups below."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 bg-white/80 backdrop-blur-md p-2 rounded-full border border-primary-border/60 shadow-soft max-w-3xl mx-auto">
          {featureCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-soft scale-105'
                    : 'text-textSecondary hover:text-textPrimary hover:bg-primary-subtle'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feature Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredFeatures.map((feature, idx) => (
            <FeatureCard key={feature.id} feature={feature} index={idx} />
          ))}
        </motion.div>
      </div>

      <CTASection
        title="Experience 7-vector smart matching today"
        subtitle="Create your detailed profile dossier and discover candidate matches tailored to your family's preferences."
        buttonText="Read User Guide"
        buttonTo="/guide"
      />
    </div>
  );
}
