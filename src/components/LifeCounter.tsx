import styles from './LifeCounter.module.css';

interface LifeCounterProps {
  lives: number;
  maxLives?: number;
}

export function LifeCounter({ lives, maxLives = 3 }: LifeCounterProps) {
  return (
    <div className={styles.container}>
      {Array.from({ length: maxLives }, (_, i) => (
        <span
          key={i}
          className={`${styles.heart} ${i < lives ? styles.active : styles.lost}`}
        >
          {i < lives ? '\u2764\uFE0F' : '\u{1F5A4}'}
        </span>
      ))}
    </div>
  );
}
