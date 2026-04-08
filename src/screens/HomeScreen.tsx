import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useLangStore, useT } from '../i18n';
import { Button } from '../components/Button';
import type { Theme } from '../types/game';
import styles from './HomeScreen.module.css';

function loadUserThemes(): Theme[] {
  try {
    const saved = localStorage.getItem('yarn-user-themes');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveUserThemes(themes: Theme[]) {
  localStorage.setItem('yarn-user-themes', JSON.stringify(themes));
}

export function HomeScreen() {
  const navigate = useNavigate();
  const { goHome } = useGameStore();
  const t = useT();
  const { lang, setLang } = useLangStore();

  const [showThemeManager, setShowThemeManager] = useState(false);
  const [userThemes, setUserThemes] = useState<Theme[]>(loadUserThemes);
  const [customName, setCustomName] = useState('');
  const [customLow, setCustomLow] = useState('');
  const [customHigh, setCustomHigh] = useState('');

  const handleStart = () => {
    goHome();
    navigate('/players');
  };

  const handleAddTheme = () => {
    const name = customName.trim();
    if (!name) return;
    const newTheme: Theme = {
      id: `user_${Date.now()}`,
      name,
      low: customLow.trim() || (lang === 'ja' ? '1に近い' : 'Low'),
      high: customHigh.trim() || (lang === 'ja' ? '100に近い' : 'High'),
    };
    const updated = [...userThemes, newTheme];
    setUserThemes(updated);
    saveUserThemes(updated);
    setCustomName('');
    setCustomLow('');
    setCustomHigh('');
  };

  const handleRemoveTheme = (id: string) => {
    const updated = userThemes.filter((t) => t.id !== id);
    setUserThemes(updated);
    saveUserThemes(updated);
  };

  return (
    <div className="screen">
      <motion.div
        className={styles.titleArea}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.span
          className={styles.logoIcon}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🧶
        </motion.span>
        <h1 className={styles.title}>YARN</h1>
        <p className={styles.subtitle}>{t('home.subtitle')}</p>
      </motion.div>

      {/* 言語切替 */}
      <motion.div
        className={styles.langSwitch}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          className={`${styles.langBtn} ${lang === 'ja' ? styles.langActive : ''}`}
          onClick={() => setLang('ja')}
        >
          日本語
        </button>
        <button
          className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
          onClick={() => setLang('en')}
        >
          English
        </button>
      </motion.div>

      <motion.div
        className={styles.startArea}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <Button variant="primary" size="lg" onClick={handleStart}>
          {t('home.start')}
        </Button>

        <motion.button
          className={styles.themeToggle}
          onClick={() => setShowThemeManager(!showThemeManager)}
          whileTap={{ scale: 0.95 }}
        >
          {showThemeManager ? t('home.themes.close') : t('home.themes')}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showThemeManager && (
          <motion.div
            className={styles.themeManager}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={styles.tmTitle}>{t('home.themes.title')}</h3>

            <div className={styles.tmForm}>
              <input
                className={styles.tmInput}
                placeholder={t('home.themes.name')}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <div className={styles.tmRow}>
                <input
                  className={styles.tmInput}
                  placeholder={t('home.themes.low')}
                  value={customLow}
                  onChange={(e) => setCustomLow(e.target.value)}
                />
                <input
                  className={styles.tmInput}
                  placeholder={t('home.themes.high')}
                  value={customHigh}
                  onChange={(e) => setCustomHigh(e.target.value)}
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddTheme}
                disabled={!customName.trim()}
              >
                {t('home.themes.add')}
              </Button>
            </div>

            {userThemes.length > 0 ? (
              <div className={styles.tmList}>
                {userThemes.map((th) => (
                  <motion.div
                    key={th.id}
                    className={styles.tmItem}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className={styles.tmItemInfo}>
                      <span className={styles.tmItemName}>{th.name}</span>
                      <span className={styles.tmItemScale}>{th.low} ↔ {th.high}</span>
                    </div>
                    <motion.button
                      className={styles.tmRemove}
                      onClick={() => handleRemoveTheme(th.id)}
                      whileTap={{ scale: 0.8 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className={styles.tmEmpty}>{t('home.themes.empty')}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
