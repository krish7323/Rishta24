import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import Button from './Button';

export default function CTASection({
  title = 'Ready to find your lifelong connection?',
  subtitle = 'Join thousands of verified members finding meaningful relationships on RISHTA24.',
  buttonText = 'Explore Features',
  buttonTo = '/features',
}) {
  return (
    <section className="relative my-16 sm:my-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-[40px] bg-gradient-to-r from-secondary via-[#611E33] to-primaryDark text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl border border-primary-border/20"
      >
        {/* Background Glowing Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Start Your Matrimonial Journey Today</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {title}
          </h2>

          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              href="/downloads/rishta24-app.apk"
              download="rishta24-app.apk"
              variant="gold"
              size="lg"
              icon={Download}
            >
              Download App (APK)
            </Button>
            <Button to={buttonTo} variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white" icon={ArrowRight}>
              {buttonText}
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-white/10 text-xs text-white/70">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold" /> Govt ID Verified Profiles
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary fill-primary" /> 7-Vector Smart Matching
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
