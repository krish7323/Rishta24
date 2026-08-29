import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function StepCard({ step, index = 0 }) {
  const { stepNumber, title, description, iconName, detail } = step;
  const IconComponent = Icons[iconName] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-primary-border/60 shadow-soft hover:shadow-card transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-6">
        <span className="font-serif font-extrabold text-3xl sm:text-4xl text-gradient-rose">
          {stepNumber}
        </span>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>

      <h3 className="font-serif text-xl font-bold text-textPrimary mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-textSecondary text-sm sm:text-base leading-relaxed mb-4">
        {description}
      </p>

      {detail && (
        <div className="p-3.5 rounded-2xl bg-primary-subtle/70 border border-primary-border/40 text-xs text-textSecondary leading-relaxed">
          {detail}
        </div>
      )}
    </motion.div>
  );
}
