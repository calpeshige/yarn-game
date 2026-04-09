import { motion } from 'framer-motion';

interface LifeCounterProps {
  lives: number;
  maxLives?: number;
}

export function LifeCounter({ lives, maxLives = 3 }: LifeCounterProps) {
  return (
    <div className="flex items-center gap-2 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40 shadow-sm">
      {Array.from({ length: maxLives }, (_, i) => (
        <motion.span
          key={i}
          className="text-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: i * 0.1 }}
          style={{ opacity: i < lives ? 1 : 0.4, filter: i < lives ? 'none' : 'grayscale(100%)' }}
        >
          {i < lives ? '❤️' : '🖤'}
        </motion.span>
      ))}
    </div>
  );
}
