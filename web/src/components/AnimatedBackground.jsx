import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedBackground() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FFF9FA]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-light/40 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-bg rounded-full blur-3xl opacity-50" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top Right Rose Blob */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-primary-light/60 via-primary-subtle to-transparent rounded-full blur-3xl opacity-70"
      />

      {/* Bottom Left Burgundy & Gold Blob */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-gold-bg/80 via-primary-light/30 to-transparent rounded-full blur-3xl opacity-60"
      />

      {/* Middle Floating Accent Glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-primary-border/20 rounded-full blur-3xl pointer-events-none"
      />
    </div>
  );
}
