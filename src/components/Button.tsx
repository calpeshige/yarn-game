import { type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  
  const baseClasses = "relative font-bold rounded-2xl flex items-center justify-center transition-colors focus:outline-none";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base h-12 w-full max-w-[300px] mx-auto",
    lg: "px-8 py-4 text-lg h-14 w-full max-w-[340px] mx-auto"
  };

  const variantClasses = {
    primary: "bg-gradient-to-br from-red to-orange text-white shadow-[0_4px_20px_var(--color-red-glow)]",
    secondary: "bg-white/70 backdrop-blur-md text-text-main border border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.05)]",
    danger: "bg-white/70 backdrop-blur-md text-red border border-red/20 shadow-[0_4px_20px_var(--color-red-glow)]",
    ghost: "bg-transparent text-text-secondary hover:bg-white/20"
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
