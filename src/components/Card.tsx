import { motion } from 'framer-motion';
import styles from './Card.module.css';

interface CardProps {
  value?: number;
  isFlipped: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function Card({ value, isFlipped, onClick, size = 'md' }: CardProps) {
  return (
    <div className={`${styles.cardContainer} ${styles[size]}`} onClick={onClick}>
      <div className={styles.card}>
        {/* 裏面 */}
        <motion.div
          className={`${styles.face} ${styles.back}`}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={styles.yarnPattern}>
            <div className={styles.yarnBall} />
          </div>
          <span className={styles.backLabel}>YARN</span>
        </motion.div>

        {/* 表面 */}
        <motion.div
          className={`${styles.face} ${styles.front}`}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className={styles.number}>{value ?? '?'}</span>
        </motion.div>
      </div>
    </div>
  );
}
