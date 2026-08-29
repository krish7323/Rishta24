import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, MessageSquare, Check, MapPin, Briefcase, GraduationCap, Crown, Lock, Send, UserCheck, Image, Sliders } from 'lucide-react';

export default function AppPreviewSimulator() {
  const [activeTab, setActiveTab] = useState('match');

  const tabs = [
    { id: 'match', label: '💘 Match Dossier', icon: Heart },
    { id: 'chat', label: '💬 Socket Chat', icon: MessageSquare },
    { id: 'wizard', label: '📝 Profile Setup', icon: UserCheck },
    { id: 'verify', label: '🛡️ Govt Verification', icon: ShieldCheck },
    { id: 'vip', label: '👑 VIP Gold Membership', icon: Crown },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Screen Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-primary-border/60 shadow-soft">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary via-[#E84C77] to-primaryDark text-white shadow-soft scale-105'
                  : 'text-textSecondary hover:text-primary hover:bg-primary-light/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Phone Wrapper */}
      <div className="relative max-w-sm mx-auto aspect-[9/17] min-h-[620px] bg-gradient-to-b from-secondary via-[#3B1220] to-[#210710] rounded-[44px] p-4 shadow-2xl border-8 border-secondary/90 flex flex-col justify-between overflow-hidden">
        {/* Phone Notch Status Bar */}
        <div className="flex items-center justify-between px-6 pt-1.5 pb-2 text-white/70 text-xs font-semibold z-30">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black/60 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mr-1" />
          </div>
          <span>5G</span>
        </div>

        {/* Screen Content Container */}
        <div className="relative flex-1 bg-[#FFFDFE] rounded-[32px] overflow-hidden p-3.5 flex flex-col justify-between z-20 border border-white/30 shadow-inner">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-primary-border/40 pb-2.5 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-serif font-bold text-base text-textPrimary">RISHTA<span className="text-primary">24</span></span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-bg border border-gold/40 text-gold-dark text-[10px] font-bold">
              <Crown className="w-3 h-3 text-gold" />
              <span>Gold Tier</span>
            </div>
          </div>

          {/* Dynamic Animated Screen Switcher */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'match' && (
                <motion.div
                  key="match"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {/* Candidate Photo Header */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary via-primaryDark to-primary p-3 flex flex-col justify-between text-white shadow-card">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-gold-light border border-white/30">
                        ✨ 94% Compatibility
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-white text-white" />
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-lg text-white">Ananya Sharma, 26</h3>
                        <ShieldCheck className="w-4 h-4 text-gold fill-gold/20" />
                      </div>
                      <p className="text-[11px] text-white/80 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> Bengaluru • Hindu Punjabi
                      </p>
                    </div>
                  </div>

                  {/* Vectors Match Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-primary-subtle border border-primary-border/60">
                      <span className="text-textMuted font-medium block">Education</span>
                      <span className="font-bold text-textPrimary truncate block">MBA Finance</span>
                    </div>
                    <div className="p-2 rounded-xl bg-primary-subtle border border-primary-border/60">
                      <span className="text-textMuted font-medium block">Profession</span>
                      <span className="font-bold text-textPrimary truncate block">Investment Banker</span>
                    </div>
                  </div>

                  {/* Express Interest Button */}
                  <div className="py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold text-center shadow-soft flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Express Interest Request</span>
                  </div>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2.5 flex flex-col h-full justify-between"
                >
                  <div className="flex items-center gap-2 pb-2 border-b border-primary-border/40">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">
                      AS
                    </div>
                    <div>
                      <div className="font-bold text-xs text-textPrimary flex items-center gap-1">
                        Ananya Sharma <span className="w-2 h-2 rounded-full bg-success inline-block" />
                      </div>
                      <div className="text-[9px] text-textMuted">Online • Socket.IO Protected</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="bg-primary-subtle p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-primary-border/40">
                      Hi Kabir! It is wonderful to connect with your profile. 😊
                    </div>
                    <div className="bg-primary text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-right shadow-soft">
                      Namaste Ananya! Same here. Are our families speaking this weekend?
                    </div>
                    <div className="bg-primary-subtle p-2.5 rounded-2xl rounded-tl-none max-w-[85%] border border-primary-border/40">
                      Yes! My parents are calling yours tomorrow morning. 🙏
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 border-t border-primary-border/40">
                    <input
                      type="text"
                      readOnly
                      value="Looking forward to it! 😊"
                      className="flex-1 text-[11px] bg-primary-light/40 px-3 py-2 rounded-full border border-primary-border text-textPrimary focus:outline-none"
                    />
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <Send className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'wizard' && (
                <motion.div
                  key="wizard"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-primary-subtle to-primary-light border border-primary-border/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Profile Dossier</span>
                      <h4 className="font-serif font-bold text-sm text-textPrimary">100% Completed</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full border-4 border-primary text-primary font-bold text-xs flex items-center justify-center bg-white shadow-soft">
                      100%
                    </div>
                  </div>

                  <div className="space-y-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-white border border-primary-border/60 flex items-center justify-between">
                      <span className="font-semibold text-textPrimary">Step 1: Personal Details</span>
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-primary-border/60 flex items-center justify-between">
                      <span className="font-semibold text-textPrimary">Step 2: Religion & Gotra</span>
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-primary-border/60 flex items-center justify-between">
                      <span className="font-semibold text-textPrimary">Step 3: Education & Career</span>
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-primary-border/60 flex items-center justify-between">
                      <span className="font-semibold text-textPrimary">Step 4: Partner Preferences</span>
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'verify' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 text-center py-2"
                >
                  <div className="w-16 h-16 rounded-full bg-gold-bg border-2 border-gold text-gold-dark mx-auto flex items-center justify-center shadow-goldGlow">
                    <ShieldCheck className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-base text-textPrimary">Govt ID Verified Desk</h4>
                    <p className="text-[11px] text-textSecondary mt-1">Aadhaar Card & Passport Verified</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-successLight/60 border border-success/30 text-[11px] text-success font-semibold text-left space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> <span>Identity Document Approved</span>
                    </div>
                    <div className="text-[10px] text-textSecondary font-normal pl-5">
                      Issued blue Verified Badge on match search cards.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'vip' && (
                <motion.div
                  key="vip"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary to-[#4A1525] text-white border border-gold/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold uppercase tracking-wider">3 Months Gold</span>
                      <span className="px-2 py-0.5 rounded-full bg-gold text-secondary font-bold text-[9px]">POPULAR</span>
                    </div>
                    <div className="font-serif font-bold text-lg text-white">₹3,499 <span className="text-xs font-normal text-white/60 line-through">₹4,999</span></div>
                  </div>

                  <div className="space-y-1.5 text-[10px] text-textSecondary">
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold" /> <span>Direct Phone Contact Access</span></div>
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold" /> <span>150 Daily Express Interests</span></div>
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold" /> <span>Profile Visitor Tracking List</span></div>
                    <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-gold" /> <span>Incognito Mode & Boost</span></div>
                  </div>

                  <div className="py-2 px-3 rounded-xl bg-gold text-secondary font-bold text-xs text-center shadow-soft">
                    Upgrade to Gold Tier
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Bottom App Navigation Tabs */}
          <div className="pt-2 border-t border-primary-border/40 grid grid-cols-4 gap-1 text-center text-[9px] text-textMuted font-medium">
            <div className={`py-1 rounded-lg ${activeTab === 'match' ? 'text-primary font-bold' : ''}`}>Matches</div>
            <div className={`py-1 rounded-lg ${activeTab === 'chat' ? 'text-primary font-bold' : ''}`}>Chat</div>
            <div className={`py-1 rounded-lg ${activeTab === 'wizard' ? 'text-primary font-bold' : ''}`}>Profile</div>
            <div className={`py-1 rounded-lg ${activeTab === 'vip' ? 'text-primary font-bold' : ''}`}>VIP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
