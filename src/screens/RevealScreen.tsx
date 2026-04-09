import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import type { Player } from '../types/game';
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
  const [orderedPlayers, setOrderedPlayers] = useState<Player[]>([...players]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

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

      <Reorder.Group
        axis="y"
        values={orderedPlayers}
        onReorder={setOrderedPlayers}
        className={styles.playerList}
      >
        {orderedPlayers.map((p, i) => {
          const isRevealed = revealedIds.has(p.id);
          const color = TILE_COLORS[i % TILE_COLORS.length];
          return (
            <Reorder.Item
              key={p.id}
              value={p}
              className={`${styles.playerRow} ${isRevealed ? styles.revealed : ''}`}
              style={isRevealed ? {
                background: color.bg,
                boxShadow: `0 4px 20px ${color.glow}`,
                borderColor: 'transparent',
              } : {}}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, type: 'spring', stiffness: 200 }}
              whileDrag={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
            >
              <span className={styles.dragHandle}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="5" cy="3" r="1.5" />
                  <circle cx="11" cy="3" r="1.5" />
                  <circle cx="5" cy="8" r="1.5" />
                  <circle cx="11" cy="8" r="1.5" />
                  <circle cx="5" cy="13" r="1.5" />
                  <circle cx="11" cy="13" r="1.5" />
                </svg>
              </span>
              <span className={styles.rank}>{i + 1}</span>
              <button
                className={styles.tapArea}
                onClick={() => handleToggle(p.id)}
              >
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
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

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
