import { motion } from 'framer-motion';
import StepCard from './StepCard';

export default function Timeline({ steps }) {
  return (
    <div className="relative">
      {/* Connected Line Background for desktop */}
      <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-primary-border via-primary to-primary-border -translate-y-1/2 z-0" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {steps.map((step, idx) => (
          <StepCard key={step.stepNumber} step={step} index={idx} />
        ))}
      </div>
    </div>
  );
}
