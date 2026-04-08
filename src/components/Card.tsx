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
      <motion.div
        className={styles.card}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* 裏面 */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.yarnPattern}>
            <div className={styles.yarnBall} />
          </div>
          <span className={styles.backLabel}>YARN</span>
        </div>

        {/* 表面 */}
        <div className={`${styles.face} ${styles.front}`}>
          <span className={styles.number}>{value ?? '?'}</span>
        </div>
      </motion.div>
    </div>
  );
}
