import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';

export function InsiderVoteScreen() {
  const navigate = useNavigate();
  const { players, currentVoterIndex, castVote, advanceVoter } = useGameStore();
  const t = useT();
  const [showPass, setShowPass] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentVoter = players[currentVoterIndex];
  if (!currentVoter) {
    navigate('/insider-result');
    return null;
  }

  const isLastVoter = currentVoterIndex >= players.length - 1;

  const handleReady = () => {
    setShowPass(false);
    setSelectedId(null);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    castVote(selectedId);

    if (isLastVoter) {
      advanceVoter();
      navigate('/insider-result');
    } else {
      advanceVoter();
      setShowPass(true);
      setSelectedId(null);
    }
  };

  if (showPass) {
    return (
      <div className="screen-container justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVoter.id}
            className="w-full flex flex-col items-center flex-1 justify-center relative z-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 flex flex-col items-center justify-center w-full max-w-[340px] shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white mb-10"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
            >
              <p className="text-sm font-bold text-text-muted mb-2 tracking-widest">{t('vote.pass')}</p>
              <motion.p
                className="text-4xl font-black text-text-main mb-8 font-display text-center break-words w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                {currentVoter.name}
              </motion.p>
              <div className="flex items-center gap-2 flex-wrap justify-center max-w-full">
                {players.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${i === currentVoterIndex ? 'w-6 bg-gradient-to-r from-blue to-purple' : i < currentVoterIndex ? 'w-2.5 bg-text-muted/40' : 'w-2.5 bg-white/50 border border-text-muted/20'}`}
                    initial={i === currentVoterIndex ? { scale: 0 } : {}}
                    animate={i === currentVoterIndex ? { scale: 1 } : {}}
                    transition={{ type: 'spring', stiffness: 400 }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              className="w-full max-w-[300px]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Button variant="primary" size="lg" onClick={handleReady} className="w-full">
                {t('vote.ready')}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="screen-container pt-6">
      <motion.h2
        className="text-3xl font-black text-text-main text-center mb-2 tracking-wide mt-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t('vote.title')}
      </motion.h2>
      <motion.p
        className="text-sm font-bold text-text-secondary text-center mb-6 opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('vote.instruction')}
      </motion.p>

      <div className="w-full flex-1 flex flex-col gap-3 py-2 px-1 overflow-y-auto custom-scrollbar">
        {players
          .filter((p) => p.id !== currentVoter.id)
          .map((p, i) => {
            const isSelected = selectedId === p.id;
            return (
              <motion.button
                key={p.id}
                className={`flex justify-between items-center p-4 rounded-2xl transition-all border outline-none ${isSelected ? 'bg-gradient-to-r from-blue/10 to-transparent border-blue/40 shadow-[0_4px_15px_rgba(55,66,250,0.15)] scale-[1.02]' : 'bg-white/70 backdrop-blur-md border-white/60 shadow-sm hover:bg-white'}`}
                onClick={() => setSelectedId(p.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className={`font-bold text-lg ${isSelected ? 'text-blue' : 'text-text-main'}`}>{p.name}</span>
                {isSelected && (
                  <motion.span
                    className="w-7 h-7 rounded-full bg-blue flex items-center justify-center text-white shadow-md"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.span>
                )}
              </motion.button>
            );
          })}
      </div>

      <motion.div
        className="w-full mt-auto pt-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedId}
          onClick={handleConfirm}
          className="w-full py-4"
        >
          {t('vote.confirm')}
        </Button>
      </motion.div>
    </div>
  );
}
