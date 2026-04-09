import { motion } from 'framer-motion';

interface PlayerBadgeProps {
  name: string;
  isActive?: boolean;
  onRemove?: () => void;
}

export function PlayerBadge({ name, isActive, onRemove }: PlayerBadgeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      className={`relative flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-md border border-white/50 shadow-sm transition-colors ${
        isActive ? 'bg-gradient-to-r from-white/90 to-white/70 shadow-[0_4px_15px_rgba(255,71,87,0.15)] border-red/30 text-red' : 'bg-white/60 text-text-main'
      }`}
    >
      <span className="font-bold text-sm tracking-wide">{name}</span>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="ml-3 w-6 h-6 flex items-center justify-center rounded-full bg-black/5 hover:bg-red/10 text-text-muted hover:text-red transition-colors touch-manipulation"
        >
          &times;
        </button>
      )}
    </motion.div>
  );
}
