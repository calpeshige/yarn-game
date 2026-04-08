import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const CARD_EMOJIS = ['🎪', '🎨', '🎭', '🎯', '🎲', '🎸', '🌈', '🎠'];

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
  const [shuffleKey, setShuffleKey] = useState(0);

  const handleChangeSource = (mode: SourceMode) => {
    setSourceMode(mode);
    setOptions(getTwoRandomThemes(getPool(mode)));
    setSelected(null);
    setShuffleKey((k) => k + 1);
  };

  const handleShuffle = useCallback(() => {
    setOptions(getTwoRandomThemes(getPool(sourceMode)));
    setSelected(null);
    setShuffleKey((k) => k + 1);
  }, [sourceMode, builtinThemes, userThemes]);

  const handleStart = () => {
    if (!selected) return;
    setTheme(selected);
    navigate('/discussion');
  };

  const emoji1 = CARD_EMOJIS[shuffleKey % CARD_EMOJIS.length];
  const emoji2 = CARD_EMOJIS[(shuffleKey + 1) % CARD_EMOJIS.length];

  return (
    <div className="screen">
      <motion.div
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className={styles.heading}>{t('theme.title')}</h2>
      </motion.div>

      {hasUserThemes && (
        <motion.div
          className={styles.sourceTabs}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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
        </motion.div>
      )}

      <motion.p
        className={styles.instruction}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('theme.instruction')}
      </motion.p>

      <div className={styles.themeCards}>
        {options.map((th, i) => (
          <motion.button
            key={`${shuffleKey}-${th.id}`}
            className={`${styles.themeCard} ${selected?.id === th.id ? styles.selected : ''}`}
            style={{ '--card-hue': i === 0 ? '340' : '210' } as React.CSSProperties}
            onClick={() => setSelected(th)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className={styles.themeEmoji}>
              {i === 0 ? emoji1 : emoji2}
            </span>
              <span className={styles.themeName}>{th.name}</span>
              <div className={styles.scaleBar}>
                <span className={styles.scaleLow}>1 {th.low}</span>
                <div className={styles.scaleLine} />
                <span className={styles.scaleHigh}>{th.high} 100</span>
              </div>
              {selected?.id === th.id && (
                <motion.div
                  className={styles.checkBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  ✓
                </motion.div>
              )}
          </motion.button>
        ))}
      </div>

      <motion.button
        className={styles.shuffleBtn}
        onClick={handleShuffle}
        whileTap={{ scale: 0.92, rotate: 180 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {t('theme.shuffle')}
      </motion.button>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="primary" size="lg" disabled={!selected} onClick={handleStart}>
          {t('theme.start')}
        </Button>
      </motion.div>
    </div>
  );
}
