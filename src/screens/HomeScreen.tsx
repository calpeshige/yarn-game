import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useLangStore, useT } from '../i18n';
import { Button } from '../components/Button';
import type { Theme } from '../types/game';

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
    <div className="screen-container justify-center pb-10">
      <motion.div
        className="flex flex-col items-center justify-center pt-8 pb-10 w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="text-7xl mb-6 filter drop-shadow-md"
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
        >
          🧶
        </motion.div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red to-orange mb-3 tracking-wider font-display">YARN</h1>
        <p className="text-text-secondary text-sm font-medium tracking-wide">{t('home.subtitle')}</p>
      </motion.div>

      {/* 言語切替 */}
      <motion.div
        className="flex items-center justify-center p-1.5 bg-white/50 backdrop-blur-md rounded-full mb-12 shadow-sm border border-white/60"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${lang === 'ja' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-blue' : 'text-text-muted hover:text-text-secondary'}`}
          onClick={() => setLang('ja')}
        >
          日本語
        </button>
        <button
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${lang === 'en' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-blue' : 'text-text-muted hover:text-text-secondary'}`}
          onClick={() => setLang('en')}
        >
          English
        </button>
      </motion.div>

      <motion.div
        className="w-full flex flex-col items-center gap-4 mt-auto mb-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Button variant="primary" size="lg" onClick={handleStart}>
          {t('home.start')}
        </Button>

        <motion.button
          className="text-text-secondary text-sm font-medium mt-4 hover:text-blue transition-colors px-4 py-2"
          onClick={() => setShowThemeManager(!showThemeManager)}
          whileTap={{ scale: 0.95 }}
        >
          {showThemeManager ? t('home.themes.close') : t('home.themes')}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showThemeManager && (
          <motion.div
            className="w-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white/60 overflow-hidden"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-bold text-lg mb-5 text-center text-text-main">{t('home.themes.title')}</h3>

            <div className="flex flex-col gap-3 mb-6">
              <input
                className="w-full bg-white/80 border border-white/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 transition-all shadow-inner"
                placeholder={t('home.themes.name')}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <div className="flex gap-3">
                <input
                  className="w-full bg-white/80 border border-white/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 transition-all shadow-inner"
                  placeholder={t('home.themes.low')}
                  value={customLow}
                  onChange={(e) => setCustomLow(e.target.value)}
                />
                <input
                  className="w-full bg-white/80 border border-white/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 transition-all shadow-inner"
                  placeholder={t('home.themes.high')}
                  value={customHigh}
                  onChange={(e) => setCustomHigh(e.target.value)}
                />
              </div>
              <div className="mt-2 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTheme}
                  disabled={!customName.trim()}
                  className="mx-auto"
                >
                  {t('home.themes.add')}
                </Button>
              </div>
            </div>

            {userThemes.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                {userThemes.map((th) => (
                  <motion.div
                    key={th.id}
                    className="flex items-center justify-between bg-white/60 p-3.5 rounded-xl border border-white/60 shadow-sm"
                    layout
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-text-main">{th.name}</span>
                      <span className="text-[11px] text-text-muted mt-0.5">{th.low} ↔ {th.high}</span>
                    </div>
                    <motion.button
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red/10 text-red font-bold hover:bg-red hover:text-white transition-colors"
                      onClick={() => handleRemoveTheme(th.id)}
                      whileTap={{ scale: 0.8 }}
                    >
                      ×
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-text-muted py-6">{t('home.themes.empty')}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
