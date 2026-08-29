import { motion } from 'framer-motion';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className = '',
}) {
  return (
    <div className={`space-y-3 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary-border text-primary font-semibold text-xs uppercase tracking-wider shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {badge}
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-textPrimary leading-tight"
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-textSecondary text-base sm:text-lg leading-relaxed font-normal"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
