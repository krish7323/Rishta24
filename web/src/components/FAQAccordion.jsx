import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQAccordion({ items, allowMultiple = false }) {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggle = (idx) => {
    if (allowMultiple) {
      if (openIndices.includes(idx)) {
        setOpenIndices(openIndices.filter((i) => i !== idx));
      } else {
        setOpenIndices([...openIndices, idx]);
      }
    } else {
      setOpenIndices(openIndices.includes(idx) ? [] : [idx]);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-primary-border shadow-soft ring-1 ring-primary-border/60'
                : 'bg-white/80 backdrop-blur-md border-primary-border/50 hover:bg-white hover:border-primary-border'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
            >
              <span className="font-serif font-bold text-base sm:text-lg text-textPrimary flex items-center gap-3">
                <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-textMuted'}`} />
                {item.question}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'bg-primary-light text-primary rotate-180' : 'bg-surfaceSubtle text-textMuted'
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 pt-2 text-textSecondary text-sm sm:text-base leading-relaxed border-t border-primary-border/30">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
