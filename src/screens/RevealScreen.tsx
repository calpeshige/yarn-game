import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import styles from './RevealScreen.module.css';

const TILE_COLORS = [
  { bg: 'linear-gradient(135deg, #FF4757, #FF6B7A)', glow: 'rgba(255, 71, 87, 0.3)' },
  { bg: 'linear-gradient(135deg, #3742FA, #5F6CFF)', glow: 'rgba(55, 66, 250, 0.3)' },
  { bg: 'linear-gradient(135deg, #2ED573, #7BED9F)', glow: 'rgba(46, 213, 115, 0.3)' },
  { bg: 'linear-gradient(135deg, #FFC312, #FFE066)', glow: 'rgba(255, 195, 18, 0.3)' },
  { bg: 'linear-gradient(135deg, #A55EEA, #D980FA)', glow: 'rgba(165, 94, 234, 0.3)' },
  { bg: 'linear-gradient(135deg, #FF6B3A, #FF9F43)', glow: 'rgba(255, 107, 58, 0.3)' },
  { bg: 'linear-gradient(135deg, #FF6B9D, #FFB8D0)', glow: 'rgba(255, 107, 157, 0.3)' },
  { bg: 'linear-gradient(135deg, #18DCFF, #7EFFF5)', glow: 'rgba(24, 220, 255, 0.3)' },
  { bg: 'linear-gradient(135deg, #FFC312, #FF6B3A)', glow: 'rgba(255, 195, 18, 0.3)' },
  { bg: 'linear-gradient(135deg, #A55EEA, #3742FA)', glow: 'rgba(165, 94, 234, 0.3)' },
];

export function RevealScreen() {
  const { players, goHome, playAgain } = useGameStore();
  const navigate = useNavigate();
  const t = useT();
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => b.cards[0] - a.cards[0]),
    [players],
  );

  const handleToggle = (playerId: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  };

  const handleRevealAll = () => {
    setRevealedIds(new Set(players.map((p) => p.id)));
  };

  const handlePlayAgain = () => {
    playAgain();
    navigate('/peek');
  };

  const handleGoHome = () => {
    goHome();
    navigate('/');
  };

  const allRevealed = revealedIds.size === players.length;

  return (
    <div className="screen">
      <motion.h2
        className={styles.heading}
        initial={{ y: -20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {t('reveal.title')}
      </motion.h2>
      <motion.p
        className={styles.subHeading}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t('reveal.instruction')}
      </motion.p>

      <div className={styles.playerList}>
        {sortedPlayers.map((p, i) => {
          const isRevealed = revealedIds.has(p.id);
          const color = TILE_COLORS[i % TILE_COLORS.length];
          return (
            <motion.button
              key={p.id}
              className={`${styles.playerRow} ${isRevealed ? styles.revealed : ''}`}
              style={isRevealed ? {
                background: color.bg,
                boxShadow: `0 4px 20px ${color.glow}`,
                borderColor: 'transparent',
              } : {}}
              onClick={() => handleToggle(p.id)}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 200 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.rank}>{i + 1}</span>
              <span className={`${styles.playerName} ${isRevealed ? styles.playerNameRevealed : ''}`}>
                {p.name}
              </span>
              <AnimatePresence mode="wait">
                {isRevealed ? (
                  <motion.span
                    key="num"
                    className={styles.playerNumber}
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: -90, opacity: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                  >
                    {p.cards[0]}
                  </motion.span>
                ) : (
                  <motion.span
                    key="hidden"
                    className={styles.playerHidden}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ?
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        className={styles.bottomActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {!allRevealed && (
          <motion.button
            className={styles.revealAllBtn}
            onClick={handleRevealAll}
            whileTap={{ scale: 0.95 }}
          >
            {t('reveal.showAll')}
          </motion.button>
        )}
        <Button variant="primary" size="lg" onClick={handlePlayAgain}>
          {t('reveal.playAgain')}
        </Button>
        <motion.button
          className={styles.revealAllBtn}
          onClick={handleGoHome}
          whileTap={{ scale: 0.95 }}
        >
          {t('reveal.home')}
        </motion.button>
      </motion.div>
    </div>
  );
}
