import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { Button } from '../components/Button';

const TIME_PRESETS = [
  { label: '3', seconds: 180 },
  { label: '5', seconds: 300 },
  { label: '7', seconds: 420 },
];

export function DiscussionScreen() {
  const navigate = useNavigate();
  const { theme, players, setPhase } = useGameStore();
  const t = useT();
  const [timerDuration, setTimerDuration] = useState(180);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showTimerSetup, setShowTimerSetup] = useState(true);
  const [checkingPlayerId, setCheckingPlayerId] = useState<string | null>(null);
  const timer = useTimer(timerDuration);

  if (!theme) return null;

  const handleSetPreset = (seconds: number) => {
    setTimerDuration(seconds);
    timer.reset(seconds);
  };

  const handleSetCustom = () => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins <= 60) {
      setTimerDuration(mins * 60);
      timer.reset(mins * 60);
      setCustomMinutes('');
    }
  };

  const handleStartTimer = () => {
    setShowTimerSetup(false);
    timer.start();
  };

  const handleProceed = () => {
    setPhase('reveal');
    navigate('/reveal');
  };

  const handleCheckNumber = (playerId: string) => {
    setCheckingPlayerId(checkingPlayerId === playerId ? null : playerId);
  };

  return (
    <div className="screen-container">
      <motion.div
        className="w-full bg-white/70 backdrop-blur-xl rounded-3xl p-6 mb-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/60 relative overflow-hidden"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red via-orange to-yellow opacity-80" />
        <h2 className="text-2xl font-black text-text-main mb-3">{theme.name}</h2>
        <p className="text-sm font-bold text-text-secondary">
          <span className="text-blue">1</span> = {theme.low} <span className="mx-2 text-text-muted">/</span> <span className="text-red">100</span> = {theme.high}
        </p>
      </motion.div>

      <motion.div
        className="w-full flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-2xl rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-white/50 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {showTimerSetup ? (
          <>
            <p className="text-sm font-bold text-text-muted mb-4">{t('discussion.timerSetup')}</p>
            <div className="flex gap-3 mb-6 w-full max-w-[280px]">
              {TIME_PRESETS.map((p) => (
                <motion.button
                  key={p.seconds}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all text-sm border ${timerDuration === p.seconds ? 'bg-white text-blue border-blue/20 shadow-md scale-105' : 'bg-white/40 text-text-secondary border-white/40 hover:bg-white/80'}`}
                  onClick={() => handleSetPreset(p.seconds)}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl font-display mr-1">{p.label}</span>
                  {t('discussion.min')}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 w-full max-w-[280px] mb-8">
              <input
                className="flex-1 bg-white/80 border border-white/80 rounded-2xl px-5 py-3 text-base text-center font-display font-bold focus:outline-none focus:ring-4 focus:ring-blue/20 transition-all shadow-inner"
                type="number"
                placeholder={t('discussion.min')}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                min="1"
                max="60"
              />
              <motion.button
                className="px-6 py-3 bg-text-secondary text-white font-bold rounded-2xl shadow-sm"
                onClick={handleSetCustom}
                whileTap={{ scale: 0.9 }}
              >
                {t('discussion.set')}
              </motion.button>
            </div>
            
            <motion.p
              className="text-[4rem] leading-none mb-8 font-black font-display text-text-main drop-shadow-sm tracking-tighter"
              key={timerDuration}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {timer.formattedTime}
            </motion.p>
            <Button variant="primary" size="lg" onClick={handleStartTimer} className="w-full max-w-[280px]">
              {t('discussion.timerStart')}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm font-bold text-text-muted mb-2 tracking-widest uppercase">{t('discussion.timerLabel')}</p>
            <motion.p
              className={`text-[5rem] leading-none mb-8 font-black font-display drop-shadow-sm tracking-tighter ${timer.seconds <= 10 && timer.seconds > 0 ? 'text-red animate-pulse' : timer.seconds === 0 ? 'text-text-muted' : 'text-text-main'}`}
              key={timer.seconds}
              animate={timer.seconds <= 10 && timer.seconds > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {timer.formattedTime}
            </motion.p>
            <div className="flex gap-4">
              {timer.isRunning ? (
                <Button variant="secondary" size="md" onClick={timer.pause} className="w-32 bg-white/80">
                  {t('discussion.pause')}
                </Button>
              ) : timer.seconds > 0 ? (
                <Button variant="secondary" size="md" onClick={timer.start} className="w-32 bg-white shadow-md text-blue border-blue/20">
                  {t('discussion.resume')}
                </Button>
              ) : null}
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        className="w-full flex-1 mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm font-bold text-text-secondary text-center mb-4 opacity-90">{t('discussion.checkLabel')}</p>
        <div className="grid grid-cols-2 gap-3">
          {players.map((p) => (
            <motion.button
              key={p.id}
              className={`relative h-14 rounded-2xl flex items-center justify-center font-bold text-base transition-all perspective-1000 ${checkingPlayerId === p.id ? 'bg-gradient-to-br from-red to-orange text-white shadow-[0_4px_15px_rgba(255,71,87,0.3)] border-transparent' : 'bg-white/60 text-text-main border-white/60 backdrop-blur-sm border shadow-sm hover:bg-white'}`}
              onClick={() => handleCheckNumber(p.id)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {checkingPlayerId === p.id ? (
                  <motion.span
                    key="num"
                    className="font-black text-2xl font-display drop-shadow-sm"
                    initial={{ rotateX: 90 }}
                    animate={{ rotateX: 0 }}
                    exit={{ rotateX: -90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.cards[0]}
                  </motion.span>
                ) : (
                  <motion.span
                    key="name"
                    className="truncate px-2"
                    initial={{ rotateX: -90 }}
                    animate={{ rotateX: 0 }}
                    exit={{ rotateX: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="w-full mb-8">
        <div className="bg-blue/5 border border-blue/10 rounded-2xl p-4 text-center">
          <p className="text-sm text-text-secondary font-medium mb-1">{t('discussion.hint')}</p>
          <motion.p
            className="text-blue font-bold tracking-wide"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {t('discussion.rule')}
          </motion.p>
        </div>
      </div>

      <motion.div
        className="w-full mt-auto mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button variant="primary" size="lg" onClick={handleProceed} className="w-full py-4 text-lg">
          {t('discussion.result')}
        </Button>
      </motion.div>
    </div>
  );
}
