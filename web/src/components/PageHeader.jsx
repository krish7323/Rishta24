import { motion } from 'framer-motion';

export default function PageHeader({
  badge,
  title,
  subtitle,
  className = '',
}) {
  return (
    <div className={`relative pt-32 pb-16 md:pt-40 md:pb-20 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary-border text-primary font-bold text-xs uppercase tracking-wider shadow-sm mb-4"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </motion.div>
      )}

      {title && (
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-textPrimary leading-tight mb-4"
        >
          {title}
        </motion.h1>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-textSecondary text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
