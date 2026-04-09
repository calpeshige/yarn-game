import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useLangStore, useT } from '../i18n';
import { themes as themesJa } from '../data/themes_ja';
import { themesEn } from '../data/themes_en';
import { Button } from '../components/Button';
import type { Theme } from '../types/game';

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
    <div className="screen-container relative">
      <button 
        className="absolute top-6 left-4 z-50 text-sm text-text-muted hover:text-text-main font-bold flex items-center gap-1 transition-opacity hover:opacity-70 px-2 py-1" 
        onClick={() => navigate('/peek')}
      >
        <span className="text-lg leading-none inline-block -mt-0.5">‹</span> {t('players.back')}
      </button>
      <motion.div 
        className="w-full text-center mb-8 pt-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2 className="font-bold text-2xl text-text-main tracking-wider">{t('theme.title')}</h2>
      </motion.div>

      {hasUserThemes && (
        <motion.div 
          className="flex items-center gap-2 w-full p-1.5 bg-white/50 backdrop-blur-md rounded-2xl mb-6 shadow-sm border border-white/60"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${sourceMode === 'all' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-blue' : 'text-text-muted hover:text-text-secondary'}`}
            onClick={() => handleChangeSource('all')}
          >
            {t('theme.all')}
          </button>
          <button
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${sourceMode === 'original' ? 'bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] text-purple' : 'text-text-muted hover:text-text-secondary'}`}
            onClick={() => handleChangeSource('original')}
          >
            {t('theme.originalOnly')}
          </button>
        </motion.div>
      )}

      <p className="text-sm font-bold text-text-secondary text-center mb-6 opacity-90">{t('theme.instruction')}</p>

      <div className="w-full flex flex-col gap-5 flex-1 relative z-10 px-2">
        {options.map((th, i) => {
          const isSelected = selected?.id === th.id;
          const hue1 = i === 0 ? '340, 80%, 65%' : '210, 80%, 60%';
          const hue2 = i === 0 ? '5, 85%, 60%' : '190, 85%, 55%';
          
          return (
            <motion.button
              key={`slot-${i}`}
              className={`flex-1 w-full relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 text-left overflow-hidden border-2 ${isSelected ? 'border-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] scale-[1.02] z-10' : 'border-white/40 bg-white/60 backdrop-blur-xl shadow-sm hover:scale-[1.01] hover:bg-white/80'} focus:outline-none`}
              onClick={() => setSelected(th)}
              whileTap={{ scale: 0.97 }}
              style={{
                background: isSelected ? `linear-gradient(135deg, hsl(${hue1}) 0%, hsl(${hue2}) 100%)` : ''
              }}
            >
              <h3 className={`font-bold text-2xl mb-4 ${isSelected ? 'text-white' : 'text-text-main'}`}>{th.name}</h3>
              
              <div className="w-full flex items-center justify-between gap-3 text-sm font-bold mt-2">
                <span className={`${isSelected ? 'text-white/90' : 'text-blue text-opacity-80'} whitespace-nowrap`}>1 {th.low}</span>
                <div className={`flex-1 h-1.5 rounded-full ${isSelected ? 'bg-white/40' : 'bg-gradient-to-r from-blue/20 via-pink/20 to-red/20'}`} />
                <span className={`${isSelected ? 'text-white/90' : 'text-red text-opacity-80'} whitespace-nowrap`}>{th.high} 100</span>
              </div>
              
              {isSelected && (
                <motion.div 
                  className="absolute top-4 right-4 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red font-bold shadow-md"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button 
        className="mt-6 mb-2 py-3 px-8 text-sm font-bold text-text-secondary hover:text-blue bg-white/40 hover:bg-white/70 backdrop-blur-sm rounded-full transition-all border border-white/40 shadow-sm"
        onClick={handleShuffle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t('theme.shuffle')}
      </motion.button>

      <motion.div 
        className="w-full mt-auto mb-8 pt-4 relative z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Button variant="primary" size="lg" disabled={!selected} onClick={handleStart} className="w-full py-4 text-lg">
          {t('theme.start')}
        </Button>
      </motion.div>
    </div>
  );
}
