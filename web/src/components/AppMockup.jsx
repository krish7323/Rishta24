import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, MessageSquare, Check, MapPin, Briefcase, GraduationCap, Crown } from 'lucide-react';

export default function AppMockup() {
  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-[9/16] max-h-[640px] bg-gradient-to-b from-secondary to-[#2B0B16] rounded-[42px] p-4 shadow-2xl border-8 border-secondary/80 flex flex-col justify-between overflow-hidden group">
      {/* Mobile Top Status Notch Bar */}
      <div className="flex items-center justify-between px-6 pt-2 pb-1 text-white/60 text-xs font-semibold z-20">
        <span>9:41</span>
        <div className="w-20 h-4 bg-black/40 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary/80 mr-1" />
        </div>
        <span>5G</span>
      </div>

      {/* Main Mockup Screen Body */}
      <div className="relative flex-1 bg-[#FFF9FA] rounded-[32px] overflow-hidden p-4 flex flex-col justify-between z-10 border border-white/20">
        {/* App Top Header Bar */}
        <div className="flex items-center justify-between border-b border-primary-border/40 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-serif font-bold text-lg text-textPrimary">RISHTA<span className="text-primary">24</span></span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-bg border border-gold/40 text-gold-dark text-[11px] font-bold">
            <Crown className="w-3.5 h-3.5 text-gold" />
            <span>3 Months Gold</span>
          </div>
        </div>

        {/* Profile Card Mockup */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative bg-white rounded-3xl p-4 shadow-card border border-primary-border/60 space-y-3"
        >
          {/* Card Header & Compatibility Badge */}
          <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-tr from-secondary via-primaryDark to-primary p-3 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white">
                <Sparkles className="w-3.5 h-3.5 text-gold-light" />
                <span>94% Compatibility</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Heart className="w-4.5 h-4.5 fill-white text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-serif font-bold text-xl text-white">Ananya Sharma, 26</h4>
                <ShieldCheck className="w-5 h-5 text-gold fill-gold/20" />
              </div>
              <p className="text-xs text-white/80 flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Bengaluru</span>
                <span>•</span>
                <span>Hindu Brahmin</span>
              </p>
            </div>
          </div>

          {/* Mini Details Tags */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-textSecondary font-medium">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-primary-subtle border border-primary-border/40">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">MBA Finance</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-primary-subtle border border-primary-border/40">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">Investment Banker</span>
            </div>
          </div>

          {/* Connection Action Pill */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <div className="flex-1 py-2 px-3 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft">
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Interest Accepted</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center border border-primary-border">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Floating Socket Chat Pill Mockup */}
        <motion.div
          animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-soft border border-primary-border/80 flex items-center gap-3 mt-2"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primaryDark text-white flex items-center justify-center font-bold text-xs">
            K
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-textPrimary">Kabir Kapoor</span>
              <span className="text-[9px] text-textMuted">Just now</span>
            </div>
            <p className="text-[11px] text-textSecondary truncate">“Speaking with your family this weekend! 😊”</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-success animate-ping" />
        </motion.div>
      </div>

      {/* Floating Decorative Gold Badge */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 bg-gradient-to-r from-goldDark via-gold to-goldLight text-textPrimary p-3 rounded-2xl shadow-goldGlow border border-gold/40 flex items-center gap-2 z-30"
      >
        <ShieldCheck className="w-5 h-5 text-textPrimary" />
        <div className="text-[11px] font-bold leading-tight">
          <div>Govt ID Verified</div>
          <div className="text-[9px] font-medium text-textPrimary/80">Aadhaar / Passport</div>
        </div>
      </motion.div>
    </div>
  );
}
