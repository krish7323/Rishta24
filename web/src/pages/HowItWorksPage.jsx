import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, HeartHandshake, Sliders, CheckCircle2, MessageSquare, Lock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Timeline from '../components/Timeline';
import CTASection from '../components/CTASection';
import { workflowSteps } from '../data/steps';
import { usePageTitle } from '../utils/seo';

export default function HowItWorksPage() {
  usePageTitle(
    'How It Works — RISHTA24 Matrimonial Process & Algorithm',
    'Understand RISHTA24\'s 5-step matrimonial matching process and 7-vector compatibility score algorithm.'
  );

  const algorithmVectors = [
    { vector: 'Religion & Caste', weight: '20%', desc: 'Community, gotra, mother tongue, and sub-caste alignment.' },
    { vector: 'Age & Height Proximity', weight: '15%', desc: 'Evaluates preferred age difference and height range bounds.' },
    { vector: 'Location & Relocation', weight: '15%', desc: 'Current city, state, native origin, and relocation willingness.' },
    { vector: 'Education & Profession', weight: '15%', desc: 'Highest degree level, field of work, occupation, and career tier.' },
    { vector: 'Lifestyle & Diet', weight: '15%', desc: 'Dietary habits (Veg/Non-Veg), smoking, drinking, and daily routines.' },
    { vector: 'Family Background', weight: '10%', desc: 'Family structure (Nuclear/Joint), parents\' occupations, and family values.' },
    { vector: 'Profile Completeness', weight: '10%', desc: 'Rewards fully verified profiles with high-resolution photo galleries.' },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      <PageHeader
        badge="Transparent Matching"
        title="How RISHTA24 Works From Start to Finish"
        subtitle="Learn how our multi-vector algorithm and real-time socket chat create meaningful matrimonial connections."
      />

      {/* --- AT A GLANCE DIAGRAM --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[36px] p-8 sm:p-12 border border-primary-border/60 shadow-soft">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">At a Glance</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-textPrimary">The RISHTA24 Matrimonial Flow</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-primary-subtle border border-primary-border/40 space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold mx-auto flex items-center justify-center">1</div>
              <h4 className="font-serif font-bold text-base text-textPrimary">Build Profile</h4>
              <p className="text-xs text-textSecondary">Complete 10-step wizard & upload photo dossier.</p>
            </div>

            <div className="p-5 rounded-2xl bg-primary-subtle border border-primary-border/40 space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold mx-auto flex items-center justify-center">2</div>
              <h4 className="font-serif font-bold text-base text-textPrimary">Discover Matches</h4>
              <p className="text-xs text-textSecondary">Inspect 7-vector score breakdowns & Aadhaar badges.</p>
            </div>

            <div className="p-5 rounded-2xl bg-primary-subtle border border-primary-border/40 space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold mx-auto flex items-center justify-center">3</div>
              <h4 className="font-serif font-bold text-base text-textPrimary">Express Interest</h4>
              <p className="text-xs text-textSecondary">Send invitation requests & create mutual matches.</p>
            </div>

            <div className="p-5 rounded-2xl bg-primary-subtle border border-primary-border/40 space-y-2">
              <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold mx-auto flex items-center justify-center">4</div>
              <h4 className="font-serif font-bold text-base text-textPrimary">Socket Chat & Meet</h4>
              <p className="text-xs text-textSecondary">Communicate in private 1-on-1 socket rooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DETAILED 5-STEP TIMELINE --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-primary-light text-primary font-bold text-xs uppercase tracking-wider">Step-by-Step Breakdown</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-textPrimary">5 Steps to Your Life Partner</h2>
        </div>

        <Timeline steps={workflowSteps} />
      </section>

      {/* --- 7-VECTOR ALGORITHM BREAKDOWN --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-white via-primary-subtle to-white rounded-[40px] p-8 sm:p-12 border-2 border-primary-border shadow-card space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Vector Intelligence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-textPrimary">
              The 7 Vectors Behind Your Compatibility Percentage
            </h2>
            <p className="text-textSecondary text-base leading-relaxed">
              Rather than generic algorithms, RISHTA24 computes candidate compatibility using 7 weighted vectors tailored specifically to Indian community preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithmVectors.map((v, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-primary-border/60 shadow-soft space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-textPrimary">{v.vector}</h3>
                  <span className="px-2.5 py-1 rounded-full bg-primary-light text-primary font-extrabold text-xs">
                    {v.weight}
                  </span>
                </div>
                <p className="text-textSecondary text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to explore candidate matches?"
        subtitle="Browse detailed profiles and view multi-vector compatibility scores today."
        buttonText="View User Guide"
        buttonTo="/guide"
      />
    </div>
  );
}
