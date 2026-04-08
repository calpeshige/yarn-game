import styles from './PlayerBadge.module.css';

interface PlayerBadgeProps {
  name: string;
  isActive?: boolean;
  onRemove?: () => void;
}

export function PlayerBadge({ name, isActive, onRemove }: PlayerBadgeProps) {
  return (
    <div className={`${styles.badge} ${isActive ? styles.active : ''}`}>
      <span className={styles.name}>{name}</span>
      {onRemove && (
        <button className={styles.removeBtn} onClick={onRemove}>
          &times;
        </button>
      )}
    </div>
  );
}
