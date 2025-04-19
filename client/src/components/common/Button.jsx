import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';
  
  const variants = {
    primary: 'bg-primary-main text-primary-contrastText hover:bg-primary-dark focus:ring-primary-main',
    secondary: 'bg-secondary-main text-secondary-contrastText hover:bg-secondary-dark focus:ring-secondary-main',
    accent: 'bg-accent-main text-accent-contrastText hover:bg-accent-dark focus:ring-accent-main',
    outline: 'border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-primary-contrastText focus:ring-primary-main',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button; 