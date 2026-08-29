import { motion } from 'framer-motion';
import { Heart, Home, Sparkles, Search } from 'lucide-react';
import Button from './Button';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-28 h-28 mx-auto rounded-full bg-primary-light border-2 border-primary-border flex items-center justify-center text-primary shadow-glow"
        >
          <Heart className="w-14 h-14 text-primary fill-primary/20 animate-pulse" />
          <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-secondary text-gold text-xs font-bold shadow-card">
            404
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-textPrimary">
            Oops! Page Not Found
          </h1>
          <p className="text-textSecondary text-sm sm:text-base leading-relaxed">
            The page you are looking for might have been moved, renamed, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button to="/" variant="primary" size="md" icon={Home} iconPosition="left">
            Back Home
          </Button>
          <Button to="/features" variant="outline" size="md" icon={Sparkles}>
            Explore Features
          </Button>
        </div>
      </div>
    </div>
  );
}
