import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Red/Orange Blob */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--color-red-light) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Blue/Purple Blob */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--color-blue-light) 0%, transparent 70%)',
          bottom: '-20%',
          right: '-10%',
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      {/* Yellow Blob */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--color-yellow) 0%, transparent 70%)',
          top: '40%',
          left: '30%',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );
}
