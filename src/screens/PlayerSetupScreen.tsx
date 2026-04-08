import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const { players, addPlayer, removePlayer, clearPlayers, startGame } = useGameStore();
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
        {players.map((p, i) => (
          <div
            key={p.id}
            className={styles.playerCard}
            style={{ '--player-color': PLAYER_COLORS[i % PLAYER_COLORS.length] } as React.CSSProperties}
          >
            <div className={styles.playerAvatar}>{p.name[0]}</div>
            <span className={styles.playerName}>{p.name}</span>
            <button
              className={styles.removeBtn}
              onClick={() => removePlayer(p.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {players.length > 0 && (
        <div className={styles.countRow}>
          <p className={styles.count}>{players.length}{t('players.count')}</p>
          <button className={styles.clearBtn} onClick={clearPlayers}>
            {t('players.clearAll')}
          </button>
        </div>
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
