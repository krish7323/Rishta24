import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import clsx from 'clsx';

export default function FeatureCard({
  feature,
  index = 0,
  className = '',
}) {
  const { title, shortDesc, fullDesc, iconName, badge, highlight } = feature;
  const IconComponent = Icons[iconName] || Icons.Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className={clsx(
        'group relative p-6 sm:p-8 rounded-3xl transition-all duration-300',
        highlight
          ? 'bg-gradient-to-br from-white via-primary-subtle to-white border-2 border-primary-border shadow-card hover:shadow-glow'
          : 'bg-white/90 backdrop-blur-md border border-primary-border/60 shadow-soft hover:shadow-card hover:border-primary-border',
        className
      )}
    >
      {/* Top Badge */}
      {badge && (
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary-light text-primary border border-primary-border/60">
            {badge}
          </span>
        </div>
      )}

      {!badge && (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-light to-primary-subtle border border-primary-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm mb-4">
          <IconComponent className="w-6 h-6" />
        </div>
      )}

      <h3 className="font-serif text-xl font-bold text-textPrimary mb-2.5 group-hover:text-primary transition-colors">
        {title}
      </h3>

      <p className="text-textSecondary text-sm sm:text-base leading-relaxed font-normal">
        {fullDesc || shortDesc}
      </p>

      {/* Subtle hover accent line */}
      <div className="mt-6 pt-4 border-t border-primary-border/40 flex items-center text-xs font-semibold text-primary opacity-90 group-hover:translate-x-1 transition-transform">
        <span>Learn how it works</span>
        <Icons.ArrowRight className="w-3.5 h-3.5 ml-1" />
      </div>
    </motion.div>
  );
}
