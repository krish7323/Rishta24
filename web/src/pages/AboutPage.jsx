import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, Users, Award, Lock, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { usePageTitle } from '../utils/seo';

export default function AboutPage() {
  usePageTitle(
    'About Us — RISHTA24 Matrimonial Vision & Philosophy',
    'Learn about RISHTA24: Our mission to provide a dignified, multi-vector compatibility matrimonial experience for Indian families worldwide.'
  );

  const pillars = [
    {
      title: 'Compatibility Over Swiping',
      desc: 'We replace superficial image swiping with 7-vector weighted scoring across religion, caste, education, location, lifestyle, and family values.',
      icon: Sparkles,
    },
    {
      title: 'Identity & Govt ID Security',
      desc: 'Aadhaar and Passport document inspection ensuring that every profile with a Verified Badge is authentic.',
      icon: ShieldCheck,
    },
    {
      title: 'Family Dignity & Respect',
      desc: 'Designed with Indian family traditions in mind, supporting profile management by individuals or parents with complete privacy.',
      icon: Heart,
    },
    {
      title: 'Real-Time Communication',
      desc: 'Private 1-on-1 socket messaging active only after mutual consent, protecting members from spam or harassment.',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      <PageHeader
        badge="Our Purpose & Philosophy"
        title="Restoring Trust & Dignity to Matrimonial Search"
        subtitle="RISHTA24 (रिश्ता २४) was built on the belief that finding a life partner requires deep cultural alignment, verified authenticity, and complete privacy."
      />

      {/* --- MISSION STATEMENT --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[36px] p-8 sm:p-12 lg:p-14 border border-primary-border/60 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The Vision</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-textPrimary leading-tight">
              “Har Rishta, Ek Nayi Shuruaat”
            </h2>
            <p className="text-textSecondary text-base leading-relaxed">
              In a digital landscape flooded with casual dating applications, RISHTA24 stands dedicated exclusively to matrimonial commitment. We bring together modern mobile technology and traditional Indian matrimonial values to help individuals and families connect with confidence.
            </p>
            <p className="text-textSecondary text-base leading-relaxed">
              Every detail of the platform — from the 10-step profile wizard to 7-vector scoring and Socket.IO real-time chat — is engineered to ensure transparency, security, and respect.
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-light via-primary-subtle to-gold-bg border-4 border-primary-border flex items-center justify-center text-primary shadow-glow">
              <Heart className="w-24 h-24 fill-primary text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-primary-light text-primary font-bold text-xs uppercase tracking-wider">Product Philosophy</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-textPrimary">Built On 4 Core Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-primary-border/60 shadow-soft hover:shadow-card transition-all flex items-start gap-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary flex-shrink-0">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-textPrimary">{p.title}</h3>
                  <p className="text-textSecondary text-sm sm:text-base leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Ready to find your match on RISHTA24?"
        subtitle="Explore features and see how our 7-vector algorithm helps you find aligned life partners."
        buttonText="Explore Features"
        buttonTo="/features"
      />
    </div>
  );
}
