import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import styles from './CardPeekScreen.module.css';

export function CardPeekScreen() {
  const navigate = useNavigate();
  const { players, currentPeekPlayerIndex, mode, markCardViewed, advancePeekPlayer } =
    useGameStore();
  const t = useT();
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPass, setShowPass] = useState(true);

  const currentPlayer = players[currentPeekPlayerIndex];
  if (!currentPlayer) return null;

  const handleCardTap = () => {
    if (!isRevealed) {
      setIsRevealed(true);
      markCardViewed(currentPlayer.id);
    } else {
      setIsRevealed(false);
    }
  };

  const handleNext = () => {
    setIsRevealed(false);
    setShowPass(true);

    const isLast = currentPeekPlayerIndex >= players.length - 1;
    if (isLast) {
      navigate('/theme');
    } else {
      advancePeekPlayer();
    }
  };

  const handleReady = () => {
    setShowPass(false);
  };

  const cardsToShow = currentPlayer.cards;

  if (showPass) {
    return (
      <div className="screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayer.id}
            className={styles.passScreen}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
          >
            <motion.div
              className={styles.passCard}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
            >
              <p className={styles.passLabel}>{t('peek.pass')}</p>
              <motion.p
                className={styles.playerName}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                {currentPlayer.name}
              </motion.p>
              <div className={styles.progressDots}>
                {players.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`${styles.dot} ${i === currentPeekPlayerIndex ? styles.dotActive : i < currentPeekPlayerIndex ? styles.dotDone : ''}`}
                    initial={i === currentPeekPlayerIndex ? { scale: 0 } : {}}
                    animate={i === currentPeekPlayerIndex ? { scale: 1.3 } : {}}
                    transition={{ type: 'spring', stiffness: 400 }}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Button variant="primary" size="lg" onClick={handleReady}>
                {t('peek.ready')}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="screen">
      <motion.p
        className={styles.tapHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {isRevealed ? t('peek.tapToHide') : t('peek.tapToReveal')}
      </motion.p>

      <motion.div
        className={styles.cardArea}
        initial={{ scale: 0.6, opacity: 0, rotateZ: -5 }}
        animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 150 }}
      >
        {cardsToShow.map((value, i) => (
          <div key={i} onClick={handleCardTap}>
            <Card
              value={value}
              isFlipped={isRevealed}
              size={cardsToShow.length > 2 ? 'sm' : cardsToShow.length > 1 ? 'md' : 'lg'}
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Button variant="primary" size="lg" onClick={handleNext}>
          {t('peek.next')}
        </Button>
      </motion.div>
    </div>
  );
}
