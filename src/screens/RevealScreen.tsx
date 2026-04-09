import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { useGameStore } from '../stores/gameStore';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import type { Player } from '../types/game';

const TILE_COLORS = [
  { bg: 'linear-gradient(135deg, #FF4757, #FF6B7A)', glow: 'rgba(255, 71, 87, 0.4)' },
  { bg: 'linear-gradient(135deg, #3742FA, #5F6CFF)', glow: 'rgba(55, 66, 250, 0.4)' },
  { bg: 'linear-gradient(135deg, #2ED573, #7BED9F)', glow: 'rgba(46, 213, 115, 0.4)' },
  { bg: 'linear-gradient(135deg, #FFC312, #FFE066)', glow: 'rgba(255, 195, 18, 0.4)' },
  { bg: 'linear-gradient(135deg, #A55EEA, #D980FA)', glow: 'rgba(165, 94, 234, 0.4)' },
  { bg: 'linear-gradient(135deg, #FF6B3A, #FF9F43)', glow: 'rgba(255, 107, 58, 0.4)' },
  { bg: 'linear-gradient(135deg, #FF6B9D, #FFB8D0)', glow: 'rgba(255, 107, 157, 0.4)' },
  { bg: 'linear-gradient(135deg, #18DCFF, #7EFFF5)', glow: 'rgba(24, 220, 255, 0.4)' },
  { bg: 'linear-gradient(135deg, #FFC312, #FF6B3A)', glow: 'rgba(255, 195, 18, 0.4)' },
  { bg: 'linear-gradient(135deg, #A55EEA, #3742FA)', glow: 'rgba(165, 94, 234, 0.4)' },
];

function PlayerReorderItem({ player, index, color, isRevealed, onToggle }: any) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={player}
      dragListener={false}
      dragControls={dragControls}
      className={`w-full flex flex-shrink-0 items-center gap-3 p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl relative ${isRevealed ? 'text-white' : 'text-text-main border border-white/60 shadow-sm'}`}
      style={isRevealed ? {
        background: color.bg,
        border: '1px solid rgba(255,255,255,0.4)',
      } : {}}
      initial={{ opacity: 0, x: -30 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        transition: { delay: 0.15 + index * 0.08, type: 'spring' } 
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.8 }}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
    >
      <span 
        className={`flex items-center justify-center w-8 h-8 cursor-grab active:cursor-grabbing touch-none ${isRevealed ? 'text-white/60' : 'text-text-muted/50'}`}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </span>
      <span className={`font-black text-xl w-6 text-center font-display ${isRevealed ? 'text-white/80' : 'text-text-muted/40'}`}>{index + 1}</span>
      <button
        className="flex-1 flex justify-between items-center text-left"
        onClick={onToggle}
      >
        <span className={`font-bold text-lg truncate pr-2 ${isRevealed ? 'text-white' : 'text-text-main'}`}>
          {player.name}
        </span>
        <AnimatePresence mode="wait">
          {isRevealed ? (
            <motion.span
              key="num"
              className="font-black text-3xl font-display text-white drop-shadow-md"
              initial={{ scale: 0.5, rotateX: 90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.3, type: 'spring' }}
            >
              {player.cards[0]}
            </motion.span>
          ) : (
            <motion.span
              key="hidden"
              className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center font-black text-text-muted/60 text-lg"
              initial={{ scale: 0.5, rotateX: -90, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.5, rotateX: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              ?
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </Reorder.Item>
  );
}


export function RevealScreen() {
  const { players, goHome, playAgain, mode, resetVotes } = useGameStore();
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

  const handleToVote = () => {
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

  const allRevealed = revealedIds.size === players.length;

  return (
    <div className="screen-container pt-6 pb-8 justify-start h-full relative">
      <button 
        className="absolute top-6 left-4 z-50 text-sm text-text-muted hover:text-text-main font-bold flex items-center gap-1 transition-opacity hover:opacity-70 px-2 py-1" 
        onClick={() => navigate('/discussion')}
      >
        <span className="text-lg leading-none inline-block -mt-0.5">‹</span> {t('players.back')}
      </button>
      <motion.h2
        className="text-3xl font-black text-text-main text-center mb-2 tracking-wide"
        initial={{ y: -20, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {t('reveal.title')}
      </motion.h2>
      <motion.p
        className="text-sm font-bold text-text-secondary text-center mb-6 opacity-90"
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
        className="w-full flex-1 flex flex-col gap-3 py-2 overflow-y-auto custom-scrollbar"
      >
        {orderedPlayers.map((p, i) => {
          const isRevealed = revealedIds.has(p.id);
          const color = TILE_COLORS[i % TILE_COLORS.length];
          return (
            <PlayerReorderItem
              key={p.id}
              player={p}
              index={i}
              color={color}
              isRevealed={isRevealed}
              onToggle={() => handleToggle(p.id)}
            />
          );
        })}
      </Reorder.Group>

      <motion.div
        className="w-full flex flex-col gap-3 mt-auto pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {!allRevealed && (
          <motion.button
            className="text-sm font-bold text-text-secondary hover:text-blue transition-colors py-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full w-40 mx-auto"
            onClick={handleRevealAll}
            whileTap={{ scale: 0.95 }}
          >
            {t('reveal.showAll')}
          </motion.button>
        )}
        {mode === 'insider' ? (
          <Button variant="primary" size="lg" onClick={handleToVote} className="py-4">
            {t('reveal.toVote')}
          </Button>
        ) : (
          <Button variant="primary" size="lg" onClick={handlePlayAgain} className="py-4">
            {t('reveal.playAgain')}
          </Button>
        )}
        <motion.button
          className="text-sm font-bold text-text-muted hover:text-text-main transition-colors py-2"
          onClick={handleGoHome}
          whileTap={{ scale: 0.95 }}
        >
          {t('reveal.home')}
        </motion.button>
      </motion.div>
    </div>
  );
}
