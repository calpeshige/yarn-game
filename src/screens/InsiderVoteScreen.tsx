import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import styles from './InsiderVoteScreen.module.css';

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
      <div className="screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVoter.id}
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
              <p className={styles.passLabel}>{t('vote.pass')}</p>
              <motion.p
                className={styles.playerName}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: 'spring', stiffness: 300 }}
              >
                {currentVoter.name}
              </motion.p>
              <div className={styles.progressDots}>
                {players.map((_, i) => (
                  <motion.div
                    key={i}
                    className={`${styles.dot} ${i === currentVoterIndex ? styles.dotActive : i < currentVoterIndex ? styles.dotDone : ''}`}
                    initial={i === currentVoterIndex ? { scale: 0 } : {}}
                    animate={i === currentVoterIndex ? { scale: 1.3 } : {}}
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
                {t('vote.ready')}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="screen">
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t('vote.title')}
      </motion.h2>
      <motion.p
        className={styles.instruction}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t('vote.instruction')}
      </motion.p>

      <div className={styles.candidateList}>
        {players
          .filter((p) => p.id !== currentVoter.id)
          .map((p, i) => (
            <motion.button
              key={p.id}
              className={`${styles.candidateRow} ${selectedId === p.id ? styles.candidateSelected : ''}`}
              onClick={() => setSelectedId(p.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.candidateName}>{p.name}</span>
              {selectedId === p.id && (
                <motion.span
                  className={styles.checkMark}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                />
              )}
            </motion.button>
          ))}
      </div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedId}
          onClick={handleConfirm}
        >
          {t('vote.confirm')}
        </Button>
      </motion.div>
    </div>
  );
}
