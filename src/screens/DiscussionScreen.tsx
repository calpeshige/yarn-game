import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { useTimer } from '../hooks/useTimer';
import { Button } from '../components/Button';
import styles from './DiscussionScreen.module.css';

const TIME_PRESETS = [
  { label: '3', seconds: 180 },
  { label: '5', seconds: 300 },
  { label: '7', seconds: 420 },
];

export function DiscussionScreen() {
  const navigate = useNavigate();
  const { theme, players, setPhase } = useGameStore();
  const t = useT();
  const [timerDuration, setTimerDuration] = useState(180);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showTimerSetup, setShowTimerSetup] = useState(true);
  const [checkingPlayerId, setCheckingPlayerId] = useState<string | null>(null);
  const timer = useTimer(timerDuration);

  if (!theme) return null;

  const handleSetPreset = (seconds: number) => {
    setTimerDuration(seconds);
    timer.reset(seconds);
  };

  const handleSetCustom = () => {
    const mins = parseInt(customMinutes);
    if (mins > 0 && mins <= 60) {
      setTimerDuration(mins * 60);
      timer.reset(mins * 60);
      setCustomMinutes('');
    }
  };

  const handleStartTimer = () => {
    setShowTimerSetup(false);
    timer.start();
  };

  const handleProceed = () => {
    setPhase('reveal');
    navigate('/reveal');
  };

  const handleCheckNumber = (playerId: string) => {
    setCheckingPlayerId(checkingPlayerId === playerId ? null : playerId);
  };

  return (
    <div className="screen">
      <motion.div
        className={styles.themeBanner}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <div>
          <h2 className={styles.themeTitle}>{theme.name}</h2>
          <p className={styles.themeScale}>
            1 = {theme.low} ／ 100 = {theme.high}
          </p>
        </div>
      </motion.div>

      <motion.div
        className={styles.timerArea}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {showTimerSetup ? (
          <>
            <p className={styles.timerLabel}>{t('discussion.timerSetup')}</p>
            <div className={styles.presets}>
              {TIME_PRESETS.map((p) => (
                <motion.button
                  key={p.seconds}
                  className={`${styles.presetBtn} ${timerDuration === p.seconds ? styles.presetActive : ''}`}
                  onClick={() => handleSetPreset(p.seconds)}
                  whileTap={{ scale: 0.9 }}
                >
                  {p.label}{t('discussion.min')}
                </motion.button>
              ))}
            </div>
            <div className={styles.customRow}>
              <input
                className={styles.customInput}
                type="number"
                placeholder={t('discussion.min')}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                min="1"
                max="60"
              />
              <motion.button
                className={styles.customSetBtn}
                onClick={handleSetCustom}
                whileTap={{ scale: 0.9 }}
              >
                {t('discussion.set')}
              </motion.button>
            </div>
            <motion.p
              className={styles.timerDisplay}
              key={timerDuration}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {timer.formattedTime}
            </motion.p>
            <Button variant="primary" size="lg" onClick={handleStartTimer}>
              {t('discussion.timerStart')}
            </Button>
          </>
        ) : (
          <>
            <p className={styles.timerLabel}>{t('discussion.timerLabel')}</p>
            <motion.p
              className={`${styles.timerBig} ${timer.seconds <= 10 && timer.seconds > 0 ? styles.timerUrgent : ''} ${timer.seconds === 0 ? styles.timerDone : ''}`}
              key={timer.seconds}
              animate={timer.seconds <= 10 && timer.seconds > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {timer.formattedTime}
            </motion.p>
            <div className={styles.timerControls}>
              {timer.isRunning ? (
                <Button variant="secondary" size="sm" onClick={timer.pause}>
                  {t('discussion.pause')}
                </Button>
              ) : timer.seconds > 0 ? (
                <Button variant="secondary" size="sm" onClick={timer.start}>
                  {t('discussion.resume')}
                </Button>
              ) : null}
            </div>
          </>
        )}
      </motion.div>

      <motion.div
        className={styles.checkArea}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className={styles.checkLabel}>{t('discussion.checkLabel')}</p>
        <div className={styles.checkGrid}>
          {players.map((p) => (
            <motion.button
              key={p.id}
              className={`${styles.checkTile} ${checkingPlayerId === p.id ? styles.checkRevealed : ''}`}
              onClick={() => handleCheckNumber(p.id)}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait">
                {checkingPlayerId === p.id ? (
                  <motion.span
                    key="num"
                    className={styles.checkNum}
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: -90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.cards[0]}
                  </motion.span>
                ) : (
                  <motion.span
                    key="name"
                    className={styles.checkName}
                    initial={{ rotateY: -90 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    {p.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className={styles.hint}>
        <div className={styles.hintCard}>
          <p>{t('discussion.hint')}</p>
          <motion.p
            className={styles.rule}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {t('discussion.rule')}
          </motion.p>
        </div>
      </div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button variant="primary" size="lg" onClick={handleProceed}>
          {t('discussion.result')}
        </Button>
      </motion.div>
    </div>
  );
}
