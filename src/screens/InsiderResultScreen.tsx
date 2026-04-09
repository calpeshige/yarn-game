import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import styles from './InsiderResultScreen.module.css';

export function InsiderResultScreen() {
  const navigate = useNavigate();
  const { players, insiderVotes, insiderId, resetVotes, playAgain, goHome } = useGameStore();
  const t = useT();
  const [showInsider, setShowInsider] = useState(false);

  const playerMap = useMemo(() => {
    const map = new Map<string, string>();
    players.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [players]);

  // Count votes per target
  const voteCounts = useMemo(() => {
    const counts = new Map<string, number>();
    insiderVotes.forEach((v) => {
      counts.set(v.targetId, (counts.get(v.targetId) || 0) + 1);
    });
    return counts;
  }, [insiderVotes]);

  // Find max vote count and who has it
  const maxVotes = Math.max(...voteCounts.values(), 0);
  const topVotedIds = [...voteCounts.entries()]
    .filter(([, count]) => count === maxVotes)
    .map(([id]) => id);

  const isTie = topVotedIds.length > 1;
  const topVotedName = topVotedIds.map((id) => playerMap.get(id)).join(', ');
  const caught = !isTie && topVotedIds[0] === insiderId;

  const handleRevote = () => {
    resetVotes();
    navigate('/insider-vote');
  };

  const handlePlayAgain = () => {
    playAgain();
    navigate('/peek');
  };

  const handleGoHome = () => {
    goHome();
    navigate('/');
  };

  return (
    <div className="screen">
      <motion.h2
        className={styles.heading}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {t('result.title')}
      </motion.h2>

      <div className={styles.voteList}>
        {insiderVotes.map((v, i) => (
          <motion.div
            key={i}
            className={styles.voteRow}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <span className={styles.voterName}>{playerMap.get(v.voterId)}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.targetName}>{playerMap.get(v.targetId)}</span>
          </motion.div>
        ))}
      </div>

      {isTie ? (
        <motion.div
          className={styles.resultArea}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.tieNames}>{topVotedName}</p>
          <p className={styles.tieText}>{t('result.tie')}</p>
          <Button variant="primary" size="lg" onClick={handleRevote}>
            {t('result.revote')}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className={styles.resultArea}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className={styles.topVoted}>
            {topVotedName}{t('result.topVoted')}
          </p>

          {!showInsider ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button variant="primary" size="lg" onClick={() => setShowInsider(true)}>
                {t('result.insiderWas')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className={styles.revealArea}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <p className={styles.insiderName}>{playerMap.get(insiderId!)}</p>
              <p className={caught ? styles.caughtText : styles.escapedText}>
                {caught ? t('result.caught') : t('result.escaped')}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {showInsider && (
        <motion.div
          className={styles.bottomActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="primary" size="lg" onClick={handlePlayAgain}>
            {t('reveal.playAgain')}
          </Button>
          <motion.button
            className={styles.homeBtn}
            onClick={handleGoHome}
            whileTap={{ scale: 0.95 }}
          >
            {t('reveal.home')}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
