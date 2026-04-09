import { motion } from 'framer-motion';

interface CardProps {
  value?: number;
  isFlipped: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ value, isFlipped, onClick, size = 'md' }: CardProps) {
  const sizeClasses = {
    sm: "w-[100px] h-[150px]",
    md: "w-[160px] h-[240px]",
    lg: "w-[200px] h-[300px]"
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} cursor-pointer perspective-1000 inline-block`} 
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* 裏面 */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-orange to-yellow rounded-2xl shadow-[0_8px_30px_rgba(255,107,58,0.3)] border border-white/30 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-md shadow-inner flex items-center justify-center mb-4 relative overflow-hidden">
             {/* 毛糸玉の光沢 */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-white/90 rounded-full" />
          </div>
          <span className="text-white font-bold tracking-widest text-sm opacity-90 drop-shadow-md">YARN</span>
        </div>

        {/* 表面 */}
        <div 
          className="absolute inset-0 backface-hidden bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border-2 border-white/80 flex items-center justify-center"
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red to-orange drop-shadow-sm font-display">
            {value ?? '?'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
