import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';

const PLAYER_COLORS = [
  '#FF4757', '#3742FA', '#2ED573', '#FFC312',
  '#A55EEA', '#FF6B3A', '#FF6B9D', '#18DCFF',
  '#FBBF24', '#818CF8',
];

export function PlayerSetupScreen() {
  const navigate = useNavigate();
  const { players, addPlayer, removePlayer, clearPlayers, startGame, mode, setMode } = useGameStore();
  const t = useT();
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed || players.length >= 100) return;
    addPlayer(trimmed);
    setName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const canStart = players.length >= 2;

  const handleStart = () => {
    startGame();
    navigate('/peek');
  };

  return (
    <div className="screen-container">
      <motion.div
        className="w-full mb-8 pb-4 border-b border-white/30"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button className="text-sm text-text-muted hover:text-text-main font-bold flex items-center gap-1 transition-opacity hover:opacity-70 px-2 py-1" onClick={() => navigate('/')}>
          <span className="text-lg leading-none inline-block -mt-0.5">‹</span> {t('players.back')}
        </button>
      </motion.div>

      <div className="flex items-center w-full p-1.5 bg-white/50 backdrop-blur-md rounded-2xl mb-4 border border-white/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <button
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${mode === 'standard' ? 'bg-white shadow-sm text-blue' : 'text-text-muted hover:text-text-secondary'}`}
          onClick={() => setMode('standard')}
        >
          {t('players.modeStandard')}
        </button>
        <button
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all text-center ${mode === 'insider' ? 'bg-white shadow-sm text-purple' : 'text-text-muted hover:text-text-secondary'}`}
          onClick={() => setMode('insider')}
        >
          {t('players.modeInsider')}
        </button>
      </div>
      
      <AnimatePresence>
        {mode === 'insider' && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[13px] text-text-secondary text-center w-full mb-6 leading-relaxed bg-white/60 p-4 rounded-xl border border-white/60 shadow-inner"
          >
            {t('players.insiderDesc')}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="text-sm text-text-main w-full text-left mb-3 pl-2 font-bold opacity-80">{t('players.instruction')}</p>

      <motion.div
        className="flex gap-3 w-full mb-8 z-10"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <input
          className="flex-1 min-w-0 bg-white/90 backdrop-blur-sm border border-white/80 rounded-2xl px-5 h-14 text-base font-medium focus:outline-none focus:ring-4 focus:ring-blue/20 transition-all shadow-inner"
          type="text"
          placeholder={t('players.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={10}
        />
        <motion.button
          className="h-14 px-5 rounded-2xl shrink-0 bg-white/70 backdrop-blur-md border border-white/80 shadow-[0_4px_15px_rgba(0,0,0,0.05)] text-blue font-black disabled:opacity-50 transition-all hover:bg-white"
          onClick={handleAdd}
          disabled={!name.trim() || players.length >= 100}
          whileTap={{ scale: 0.95 }}
        >
          {t('players.add')}
        </motion.button>
      </motion.div>

      <div className="w-full flex justify-between items-center mb-3 px-2">
        <p className="text-sm font-bold text-text-muted tracking-wide">{players.length} {t('players.count')}</p>
        {players.length > 0 && (
          <button className="text-xs text-red opacity-80 hover:opacity-100 hover:underline font-bold transition-all" onClick={clearPlayers}>
            {t('players.clearAll')}
          </button>
        )}
      </div>

      <div className="w-full flex flex-col gap-3 flex-1 overflow-y-auto mb-4 pb-12 custom-scrollbar pr-1 relative">
        {players.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-3.5 pr-4 rounded-2xl shadow-sm border border-white/60 relative overflow-hidden transition-all hover:shadow-md group"
          >
            <div 
              className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-white shadow-md font-display text-lg"
              style={{ background: `linear-gradient(135deg, ${PLAYER_COLORS[i % PLAYER_COLORS.length]}, ${PLAYER_COLORS[(i+1) % PLAYER_COLORS.length]})` }}
            >
              {p.name[0]}
            </div>
            <span className="font-bold text-lg text-text-main flex-1 tracking-wide truncate">{p.name}</span>
            <button
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-black/5 hover:bg-red/10 text-text-muted hover:text-red transition-all touch-manipulation font-bold text-xl active:scale-90"
              onClick={() => removePlayer(p.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <motion.div
        className="w-full mt-auto mb-8 relative z-20 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="primary" size="lg" disabled={!canStart} onClick={handleStart} className="w-full py-4 text-lg">
          {t('players.deal')}
        </Button>
      </motion.div>
    </div>
  );
}
