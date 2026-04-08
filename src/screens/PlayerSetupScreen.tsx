import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import styles from './PlayerSetupScreen.module.css';

const PLAYER_COLORS = [
  '#FF4757', '#3742FA', '#2ED573', '#FFC312',
  '#A55EEA', '#FF6B3A', '#FF6B9D', '#18DCFF',
  '#FBBF24', '#818CF8',
];

export function PlayerSetupScreen() {
  const navigate = useNavigate();
  const { players, addPlayer, removePlayer, startGame } = useGameStore();
  const t = useT();
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed || players.length >= 10) return;
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
    <div className="screen">
      <motion.div
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          {t('players.back')}
        </button>
        <h2 className={styles.heading}>{t('players.title')}</h2>
      </motion.div>

      <p className={styles.instruction}>{t('players.instruction')}</p>

      <motion.div
        className={styles.inputRow}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <input
          className={styles.input}
          type="text"
          placeholder={t('players.placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={10}
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!name.trim() || players.length >= 10}
        >
          {t('players.add')}
        </Button>
      </motion.div>

      <div className={styles.playerList}>
        <AnimatePresence>
          {players.map((p, i) => (
            <motion.div
              key={p.id}
              className={styles.playerCard}
              style={{ '--player-color': PLAYER_COLORS[i % PLAYER_COLORS.length] } as React.CSSProperties}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
              layout
            >
              <div className={styles.playerAvatar}>{p.name[0]}</div>
              <span className={styles.playerName}>{p.name}</span>
              <motion.button
                className={styles.removeBtn}
                onClick={() => removePlayer(p.id)}
                whileTap={{ scale: 0.8, rotate: 90 }}
              >
                &times;
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {players.length > 0 && (
        <motion.p
          className={styles.count}
          key={players.length}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          {players.length}{t('players.count')}
        </motion.p>
      )}

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="primary" size="lg" disabled={!canStart} onClick={handleStart}>
          {t('players.deal')}
        </Button>
      </motion.div>
    </div>
  );
}
