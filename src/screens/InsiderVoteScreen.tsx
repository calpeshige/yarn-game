import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';

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

  const handleBack = () => {
    if (currentVoterIndex === 0) {
      if (showPass) {
        navigate('/reveal');
      } else {
        setShowPass(true);
      }
    } else {
      if (showPass) {
        useGameStore.getState().previousVoter();
        setShowPass(false);
      } else {
        setShowPass(true);
      }
    }
  };

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
        <BackButton onClick={handleBack} />
        <div key={currentVoter.id} className="w-full flex flex-col items-center flex-1 justify-center relative z-20">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 flex flex-col items-center justify-center w-full max-w-[340px] shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-white mb-10">
            <p className="text-sm font-bold text-text-muted mb-2 tracking-widest">{t('vote.pass')}</p>
            <p className="text-4xl font-black text-text-main mb-8 font-display text-center break-words w-full">
              {currentVoter.name}
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center max-w-full">
              {players.map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${i === currentVoterIndex ? 'w-6 bg-gradient-to-r from-blue to-purple' : i < currentVoterIndex ? 'w-2.5 bg-text-muted/40' : 'w-2.5 bg-white/50 border border-text-muted/20'}`}
                />
              ))}
            </div>
          </div>
          <div className="w-full max-w-[300px]">
            <Button variant="primary" size="lg" onClick={handleReady} className="w-full">
              {t('vote.ready')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container pt-6 relative">
      <BackButton onClick={handleBack} />
      <h2 className="text-3xl font-black text-text-main text-center mb-2 tracking-wide mt-2">
        {t('vote.title')}
      </h2>
      <p className="text-sm font-bold text-text-secondary text-center mb-6 opacity-90">
        {t('vote.instruction')}
      </p>

      <div className="w-full flex-1 flex flex-col gap-3 py-2 px-1 overflow-y-auto custom-scrollbar">
        {players
          .filter((p) => p.id !== currentVoter.id)
          .map((p) => {
            const isSelected = selectedId === p.id;
            return (
              <button
                key={p.id}
                className={`flex justify-between items-center p-4 rounded-2xl transition-all border outline-none ${isSelected ? 'bg-gradient-to-r from-blue/10 to-transparent border-blue/40 shadow-[0_4px_15px_rgba(55,66,250,0.15)] scale-[1.02]' : 'bg-white/70 backdrop-blur-md border-white/60 shadow-sm hover:bg-white'}`}
                onClick={() => setSelectedId(p.id)}
              >
                <span className={`font-bold text-lg ${isSelected ? 'text-blue' : 'text-text-main'}`}>{p.name}</span>
                {isSelected && (
                  <span className="w-7 h-7 rounded-full bg-blue flex items-center justify-center text-white shadow-md">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
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
