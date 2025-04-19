import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  label,
  helperText,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <motion.input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-2 rounded-lg border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent',
          error
            ? 'border-error-main focus:ring-error-main'
            : 'border-neutral-300 hover:border-neutral-400',
          className
        )}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      {helperText && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-sm',
            error ? 'text-error-main' : 'text-neutral-500'
          )}
        >
          {helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 