import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Lock, Users, MessageSquare, Sliders, CheckCircle2, UserCheck, XCircle, Check, Award, Download, Smartphone } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';
import Timeline from '../components/Timeline';
import FAQAccordion from '../components/FAQAccordion';
import AppMockup from '../components/AppMockup';
import CTASection from '../components/CTASection';
import { features } from '../data/features';
import { workflowSteps } from '../data/steps';
import { faqs } from '../data/faqs';
import { usePageTitle } from '../utils/seo';
import { Link } from 'react-router-dom';

export default function HomePage() {
  usePageTitle(
    'RISHTA24 — Har Rishta, Ek Nayi Shuruaat',
    'RISHTA24 is a production-ready matrimonial application featuring multi-vector compatibility matching, real-time socket chat, and Govt ID verified security.'
  );

  const previewFeatures = features.slice(0, 6);
  const previewFaqs = faqs.slice(0, 5);

  const problemCards = [
    {
      badTitle: 'Superficial Swiping',
      badDesc: 'Generic dating apps judge people solely on photos, ignoring cultural alignment and family values.',
      goodTitle: '7-Vector Compatibility Scoring',
      goodDesc: 'RISHTA24 calculates a weighted match score across Age, Religion/Caste, Location, Education, Family, and Lifestyle.',
      icon: Sliders,
    },
    {
      badTitle: 'Fake & Unverified Profiles',
      badDesc: 'Impersonators and unverified profiles waste your time and compromise security.',
      goodTitle: 'Govt ID Document Verification',
      goodDesc: 'Inspect Aadhaar and Passport credentials to earn a blue Verified Badge.',
      icon: ShieldCheck,
    },
    {
      badTitle: 'Delayed Message Delivery',
      badDesc: 'Traditional portals rely on email notifications or slow messaging queues.',
      goodTitle: 'Real-Time 1-on-1 Socket Chat',
      goodDesc: 'Instant messaging powered by Socket.IO with typing indicators, photo attachments, and read receipts.',
      icon: MessageSquare,
    },
    {
      badTitle: 'Uncontrolled Contact Leaks',
      badDesc: 'Personal phone numbers exposed to public search engines without privacy consent.',
      goodTitle: 'Granular Visibility Controls',
      goodDesc: 'Set phone and photo gallery visibility to Public, Members Only, or Mutual Matches Only.',
      icon: Lock,
    },
  ];

  const benefits = [
    { title: 'Cultural & Vector Alignment', desc: 'Weighted compatibility score built for Indian family traditions.', icon: Sparkles },
    { title: 'Aadhaar & Passport Checked', desc: 'Administrative moderation desk issuing official Verified Badges.', icon: ShieldCheck },
    { title: 'Real-Time Socket Messaging', desc: 'Private 1-on-1 chat rooms with instant photo sharing and read receipts.', icon: MessageSquare },
    { title: 'Granular Privacy Rules', desc: 'Hide phone numbers and photo galleries until mutual interest is accepted.', icon: Lock },
    { title: 'VIP Gold Member Privileges', desc: 'Razorpay integration unlocking direct contacts and top profile placement.', icon: Award },
    { title: '10-Step Profile Dossier', desc: 'Comprehensive guided wizard ensuring 100% profile completeness.', icon: UserCheck },
  ];

  const userJourney = [
    { stage: 'Discover', text: 'Browse candidates with location, religion, and age filters.' },
    { stage: 'Evaluate', text: 'Inspect 7-vector sub-scores and verified credentials.' },
    { stage: 'Connect', text: 'Send an Express Interest request with a personal note.' },
    { stage: 'Engage', text: 'Unlock private Socket.IO chat once mutual interest is accepted.' },
    { stage: 'Unite', text: 'Verify credentials and take the next step toward marriage.' },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pt-28 pb-16">
      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary-border text-primary font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              <Heart className="w-4 h-4 fill-primary" />
              <span>Har Rishta, Ek Nayi Shuruaat</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-textPrimary leading-tight"
            >
              Every Meaningful Relationship Begins With <span className="text-gradient-rose">Trust & Compatibility</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-textSecondary text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            >
              RISHTA24 (रिश्ता २४) is a modern matrimonial application engineered with a 7-vector compatibility matching algorithm, real-time socket messaging, and Aadhaar/Passport verified security.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                href="/downloads/rishta24-app.apk"
                download="rishta24-app.apk"
                variant="gold"
                size="lg"
                icon={Download}
              >
                Download App (APK)
              </Button>
              <Button to="/features" variant="primary" size="lg" icon={ArrowRight}>
                Explore Features
              </Button>
              <Button to="/how-it-works" variant="outline" size="lg" icon={Sparkles}>
                How It Works
              </Button>
            </motion.div>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-6 grid grid-cols-3 gap-4 border-t border-primary-border/40 max-w-md mx-auto lg:mx-0 text-left"
            >
              <div>
                <div className="font-serif font-extrabold text-2xl text-primary">7 Vectors</div>
                <div className="text-xs text-textMuted font-medium">Smart Score</div>
              </div>
              <div>
                <div className="font-serif font-extrabold text-2xl text-secondary">Govt ID</div>
                <div className="text-xs text-textMuted font-medium">Verified Desk</div>
              </div>
              <div>
                <div className="font-serif font-extrabold text-2xl text-gold-dark">Socket.IO</div>
                <div className="text-xs text-textMuted font-medium">Instant Chat</div>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Visual Column (App Mockup) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full"
            >
              <AppMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM STATEMENT SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why RISHTA24?"
          title="Designed to Solve Real Matrimonial Challenges"
          subtitle="Modern matrimonial search requires more than superficial photos. Here is how RISHTA24 fixes traditional matching pitfalls."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-border/60 shadow-soft hover:shadow-card transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center border border-primary-border">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-textPrimary">{card.goodTitle}</h3>
                </div>

                <div className="space-y-4">
                  {/* Bad Way */}
                  <div className="p-3.5 rounded-2xl bg-errorLight/50 border border-error/20 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs uppercase text-error tracking-wider block mb-0.5">The Old Way</span>
                      <p className="text-xs sm:text-sm text-textSecondary">{card.badDesc}</p>
                    </div>
                  </div>

                  {/* RISHTA24 Solution */}
                  <div className="p-3.5 rounded-2xl bg-successLight/60 border border-success/30 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs uppercase text-success tracking-wider block mb-0.5">RISHTA24 Standard</span>
                      <p className="text-xs sm:text-sm text-textPrimary font-medium">{card.goodDesc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- FEATURES PREVIEW SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Platform Capabilities"
          title="Everything You Need for a Lifelong Connection"
          subtitle="Explore the key features built into RISHTA24 to help you evaluate, communicate, and connect with confidence."
        />

        <div className="mt-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {previewFeatures.map((feature, idx) => (
              <FeatureCard key={feature.id} feature={feature} index={idx} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Button to="/features" variant="outline" size="lg" icon={ArrowRight}>
              View All Features & Capabilities
            </Button>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-primary-subtle/50 py-16 sm:py-24 rounded-[44px] border border-primary-border/40">
        <SectionHeading
          badge="Step-by-Step Guide"
          title="How RISHTA24 Works"
          subtitle="From profile creation to mutual match and real-time chat, here is your 5-step path to finding your match."
        />

        <div className="mt-14">
          <Timeline steps={workflowSteps} />
        </div>

        <div className="text-center mt-12">
          <Button to="/how-it-works" variant="primary" size="lg" icon={Sparkles}>
            Deep Dive Into Algorithm & Workflow
          </Button>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Key Benefits"
          title="Why Families Choose RISHTA24"
          subtitle="Built around dignity, transparency, and modern engineering excellence."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-primary-border/60 shadow-soft hover:shadow-card transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-textPrimary mb-2">{b.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* --- USER JOURNEY SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="End-to-End Experience"
          title="The Complete Matrimonial User Journey"
          subtitle="A seamless progression designed for clarity and security at every stage."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
          {userJourney.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 border border-primary-border/60 shadow-soft text-center space-y-3 relative group hover:border-primary"
            >
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-sm mx-auto flex items-center justify-center border border-primary-border">
                {idx + 1}
              </div>
              <h3 className="font-serif font-bold text-base text-textPrimary group-hover:text-primary transition-colors">
                {step.stage}
              </h3>
              <p className="text-textSecondary text-xs leading-relaxed">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PRIVACY & TRUST SPOTLIGHT --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-secondary to-[#321820] text-white rounded-[40px] p-8 sm:p-12 lg:p-14 shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-gold text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>Your Privacy Matters</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Strict Contact Privacy & Data Isolation Controls
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              RISHTA24 enforces 256-bit token authentication and strict database isolation. Your personal phone number, full name, and private photo gallery are never exposed without your explicit consent settings.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-white/70">
              <Link to="/privacy-policy" className="text-gold font-bold hover:underline flex items-center gap-1">
                <span>Read Privacy Policy</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/terms" className="text-white hover:underline flex items-center gap-1">
                <span>Terms of Use</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-gold/40 flex items-center justify-center text-gold shadow-goldGlow">
              <ShieldCheck className="w-16 h-16 text-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ PREVIEW SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Got Questions?"
          title="Frequently Asked Questions"
          subtitle="Find quick answers to common questions about matching, verification, and privacy."
        />

        <div className="mt-12 space-y-8">
          <FAQAccordion items={previewFaqs} />

          <div className="text-center pt-4">
            <Button to="/faq" variant="outline" size="md" icon={ArrowRight}>
              View All Frequently Asked Questions
            </Button>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <CTASection
        title="Ready to begin your matrimonial search?"
        subtitle="Learn how RISHTA24's 7-vector matching algorithm and verified security help you find the right match."
        buttonText="Explore All Features"
        buttonTo="/features"
      />
    </div>
  );
}
