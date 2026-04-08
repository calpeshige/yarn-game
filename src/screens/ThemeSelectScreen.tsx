import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useLangStore, useT } from '../i18n';
import { themes as themesJa } from '../data/themes_ja';
import { themesEn } from '../data/themes_en';
import { Button } from '../components/Button';
import type { Theme } from '../types/game';
import styles from './ThemeSelectScreen.module.css';

type SourceMode = 'all' | 'original';

function loadUserThemes(): Theme[] {
  try {
    const saved = localStorage.getItem('yarn-user-themes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getTwoRandomThemes(pool: Theme[]): [Theme, Theme] {
  if (pool.length < 2) return [pool[0], pool[0]];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export function ThemeSelectScreen() {
  const navigate = useNavigate();
  const { setTheme } = useGameStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);

  const builtinThemes = lang === 'en' ? themesEn : themesJa;
  const userThemes = useMemo(() => loadUserThemes(), []);
  const hasUserThemes = userThemes.length >= 2;

  const [sourceMode, setSourceMode] = useState<SourceMode>('all');
  const getPool = (mode: SourceMode) =>
    mode === 'original' ? userThemes : [...builtinThemes, ...userThemes];

  const [options, setOptions] = useState<[Theme, Theme]>(() => getTwoRandomThemes(getPool('all')));
  const [selected, setSelected] = useState<Theme | null>(null);

  const handleChangeSource = (mode: SourceMode) => {
    setSourceMode(mode);
    setOptions(getTwoRandomThemes(getPool(mode)));
    setSelected(null);
  };

  const handleShuffle = useCallback(() => {
    setOptions(getTwoRandomThemes(getPool(sourceMode)));
    setSelected(null);
  }, [sourceMode, builtinThemes, userThemes]);

  const handleStart = () => {
    if (!selected) return;
    setTheme(selected);
    navigate('/discussion');
  };

  return (
    <div className="screen">
      <div className={styles.header}>
        <h2 className={styles.heading}>{t('theme.title')}</h2>
      </div>

      {hasUserThemes && (
        <div className={styles.sourceTabs}>
          <button
            className={`${styles.sourceTab} ${sourceMode === 'all' ? styles.sourceActive : ''}`}
            onClick={() => handleChangeSource('all')}
          >
            {t('theme.all')}
          </button>
          <button
            className={`${styles.sourceTab} ${sourceMode === 'original' ? styles.sourceActive : ''}`}
            onClick={() => handleChangeSource('original')}
          >
            {t('theme.originalOnly')}
          </button>
        </div>
      )}

      <p className={styles.instruction}>{t('theme.instruction')}</p>

      <div className={styles.themeCards}>
        {options.map((th, i) => (
          <button
            key={`slot-${i}`}
            className={`${styles.themeCard} ${selected?.id === th.id ? styles.selected : ''}`}
            style={{ '--card-hue': i === 0 ? '340' : '210' } as React.CSSProperties}
            onClick={() => setSelected(th)}
          >
            <span className={styles.themeName}>{th.name}</span>
            <div className={styles.scaleBar}>
              <span className={styles.scaleLow}>1 {th.low}</span>
              <div className={styles.scaleLine} />
              <span className={styles.scaleHigh}>{th.high} 100</span>
            </div>
            {selected?.id === th.id && (
              <div className={styles.checkBadge}>✓</div>
            )}
          </button>
        ))}
      </div>

      <button className={styles.shuffleBtn} onClick={handleShuffle}>
        {t('theme.shuffle')}
      </button>

      <div className={styles.actions}>
        <Button variant="primary" size="lg" disabled={!selected} onClick={handleStart}>
          {t('theme.start')}
        </Button>
      </div>
    </div>
  );
}
