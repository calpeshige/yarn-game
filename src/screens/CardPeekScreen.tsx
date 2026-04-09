import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function CardPeekScreen() {
  const navigate = useNavigate();
  const { players, currentPeekPlayerIndex, markCardViewed, advancePeekPlayer, mode, insiderId } =
    useGameStore();
  const t = useT();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const currentPlayer = players[currentPeekPlayerIndex];
  if (!currentPlayer) return null;

  const isLastPlayer = currentPeekPlayerIndex >= players.length - 1;

  const handleCardTap = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      markCardViewed(currentPlayer.id);
    } else {
      setIsRevealed(false);
    }
  };

  const handleNext = () => {
    // カードをフリップせずにそのまま次へ遷移
    if (isLastPlayer) {
      navigate('/theme');
    } else {
      // 先にパス画面に切り替えてからisRevealedをリセット
      setShowPass(true);
      setIsRevealed(false);
      advancePeekPlayer();
    }
  };

  const handleReady = () => {
    setShowPass(false);
    setIsRevealed(false);
  };

  const isInsider = mode === 'insider' && currentPlayer.id === insiderId;
  const cardsToShow = currentPlayer.cards;

  if (showPass) {
    return (
      <div className="screen-container justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayer.id}
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
              <p className="text-sm font-bold text-text-muted mb-2 tracking-widest">{t('peek.pass')}</p>
              <motion.p
                className="text-4xl font-black text-text-main mb-8 font-display"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                {currentPlayer.name}
              </motion.p>
              
              <div className="flex items-center gap-2">
                {players.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${i === currentPeekPlayerIndex ? 'w-6 bg-gradient-to-r from-red to-orange' : i < currentPeekPlayerIndex ? 'w-2.5 bg-text-muted/40' : 'w-2.5 bg-white/50 border border-text-muted/20'}`}
                    initial={i === currentPeekPlayerIndex ? { scale: 0 } : {}}
                    animate={i === currentPeekPlayerIndex ? { scale: 1 } : {}}
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
                {t('peek.ready')}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="screen-container relative">
      <motion.p
        className="text-sm font-bold text-text-secondary text-center mt-6 mb-8 block opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isRevealed ? t('peek.tapToHide') : t('peek.tapToReveal')}
      </motion.p>

      <motion.div
        className="flex-1 flex flex-col items-center justify-center gap-6 w-full perspective-1000"
        initial={{ scale: 0.8, opacity: 0, rotateZ: -5 }}
        animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 150, damping: 15 }}
      >
        <div className="flex gap-4 justify-center flex-wrap">
          {cardsToShow.map((value, i) => (
            <div key={i} onClick={handleCardTap}>
              <Card
                value={value}
                isFlipped={isRevealed}
                size={cardsToShow.length > 2 ? 'sm' : cardsToShow.length > 1 ? 'md' : 'lg'}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {isInsider && isRevealed && (
        <motion.div
          className="w-full bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl p-5 rounded-3xl mt-6 shadow-[0_8px_30px_rgba(255,107,58,0.15)] border-2 border-orange/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <p className="text-sm font-black text-orange mb-3 flex items-center gap-2">
            <span className="text-lg">👁️</span> {t('peek.insiderLabel')}
          </p>
          <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar mb-3">
            {players.filter((p) => p.id !== currentPlayer.id).map((p) => (
              <div key={p.id} className="flex justify-between items-center py-2 px-3 bg-orange/5 rounded-xl border border-orange/10">
                <span className="font-bold text-text-main text-sm">{p.name}</span>
                <span className="font-black text-orange text-lg font-display">{p.cards[0]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-text-secondary text-center italic">{t('peek.insiderHint')}</p>
        </motion.div>
      )}

      <motion.div
        className="w-full mt-auto mb-8 relative z-20 pt-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Button variant="primary" size="lg" onClick={handleNext} className="w-full">
          {isLastPlayer ? t('peek.toTheme') : t('peek.next')}
        </Button>
      </motion.div>
    </div>
  );
}
