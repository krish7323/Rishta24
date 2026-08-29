import { motion } from 'framer-motion';
import { Mail, HelpCircle, ShieldCheck, MessageSquare, Clock, ArrowRight, FileText } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../utils/seo';

export default function ContactPage() {
  usePageTitle(
    'Contact & Support — RISHTA24 Matrimonial Help Desk',
    'Get in touch with the RISHTA24 customer support team for help with profile setup, ID verification, VIP membership, or general inquiries.'
  );

  const helpTopics = [
    {
      title: 'Govt ID Verification Desk',
      desc: 'Questions about submitting Aadhaar or Passport documents for blue Verified Badges.',
      email: 'verification@rishta24.test',
      icon: ShieldCheck,
    },
    {
      title: 'VIP Gold Billing & Razorpay',
      desc: 'Inquiries regarding payment receipts, order generation, or subscription upgrades.',
      email: 'billing@rishta24.test',
      icon: MessageSquare,
    },
    {
      title: 'General Support & Account Help',
      desc: 'Profile wizard assistance, password resets, or general platform inquiries.',
      email: 'support@rishta24.test',
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <PageHeader
        badge="24/7 Help Desk"
        title="Contact RISHTA24 Support"
        subtitle="We are here to help you navigate your matrimonial search smoothly and securely."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Support Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {helpTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-primary-border/60 shadow-soft hover:shadow-card transition-all text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary mx-auto">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-textPrimary">{topic.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed">{topic.desc}</p>
                <div className="pt-2">
                  <a
                    href={`mailto:${topic.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-primary-light/60 px-3 py-1.5 rounded-full border border-primary-border/60"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{topic.email}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Support Information Box */}
        <div className="bg-white rounded-[36px] p-8 sm:p-12 border border-primary-border/60 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Response Time Commitment</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-textPrimary">
              Dedicated Customer Care & Moderation Team
            </h2>
            <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
              Our moderation desk operates 24/7 to review ID verification submissions and safety reports. General customer inquiries sent to <code className="bg-primary-subtle px-2 py-0.5 rounded text-primary font-mono text-xs">support@rishta24.test</code> are responded to within 12 to 24 business hours.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-textSecondary font-medium">
              <span className="flex items-center gap-1.5 text-success">
                <Clock className="w-4 h-4" /> Average Response: &lt; 24 Hours
              </span>
              <span className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="w-4 h-4" /> Priority ID Desk Handling
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-primary-subtle rounded-3xl p-6 border border-primary-border/60 space-y-4">
            <h3 className="font-serif font-bold text-base text-textPrimary">Quick Resource Links</h3>
            <div className="space-y-2 text-xs font-semibold">
              <Link to="/faq" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-primary-border/40 text-textPrimary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-primary" /> Browse FAQ Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/guide" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-primary-border/40 text-textPrimary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Read User Manual</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/privacy-policy" className="flex items-center justify-between p-3 rounded-2xl bg-white border border-primary-border/40 text-textPrimary hover:text-primary transition-colors">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Privacy & Data Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTASection
        title="Ready to explore RISHTA24?"
        subtitle="Discover how 7-vector matching and verified security help you find the right match."
        buttonText="Explore Features"
        buttonTo="/features"
      />
    </div>
  );
}
