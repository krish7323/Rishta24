import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-primary via-[#E84C77] to-primaryDark text-white shadow-soft hover:shadow-glow hover:brightness-105 border border-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary-light shadow-card border border-secondary/20',
    gold: 'bg-gradient-to-r from-goldDark via-gold to-goldLight text-textPrimary font-bold shadow-soft hover:shadow-goldGlow border border-gold/30',
    outline: 'bg-white/80 backdrop-blur-sm text-primary border border-primary-border hover:bg-primary-subtle hover:border-primary/40 shadow-sm',
    ghost: 'text-textSecondary hover:text-primary hover:bg-primary-light/40',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className={clsx(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className={clsx(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />}
    </>
  );

  const buttonClasses = clsx(baseStyles, variants[variant], sizes[size], className);

  if (to) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Link to={to} className={buttonClasses} onClick={onClick} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses} onClick={onClick} {...props}>
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {content}
    </motion.button>
  );
}
