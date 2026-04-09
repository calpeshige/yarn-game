import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
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

function PlayerReorderItem({ player, index, color, isRevealed, onToggle }: {
  player: Player;
  index: number;
  color: { bg: string; glow: string };
  isRevealed: boolean;
  onToggle: () => void;
}) {
  return (
    <Reorder.Item
      value={player}
      className={`w-full flex flex-shrink-0 items-center gap-3 p-3.5 bg-white/70 backdrop-blur-xl rounded-2xl relative cursor-grab active:cursor-grabbing touch-none ${isRevealed ? 'text-white' : 'text-text-main border border-white/60 shadow-sm'}`}
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
      <span className={`font-black text-xl w-6 text-center font-display ${isRevealed ? 'text-white/80' : 'text-text-muted/40'}`}>{index + 1}</span>
      <span className={`font-bold text-lg truncate flex-1 ${isRevealed ? 'text-white' : 'text-text-main'}`}>
        {player.name}
      </span>
      <button
        className="touch-auto flex items-center justify-center min-w-[48px]"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        onPointerDown={(e) => e.stopPropagation()}
      >
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
  const [showStamp, setShowStamp] = useState(false);

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

  // 全公開時に順番が全て正しいか判定
  const isAllCorrect = allRevealed
    ? orderedPlayers.every((p, i, arr) => i === 0 || arr[i - 1].cards[0] >= p.cards[0])
    : null;

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

      <AnimatePresence>
        {showStamp && isAllCorrect !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`relative z-10 flex items-center justify-center px-10 py-4 md:px-16 md:py-6 border-[8px] md:border-[12px] border-double rounded-[2rem] 
                ${isAllCorrect ? 'border-[#2ED573] text-[#2ED573] bg-[#2ED573]/20' : 'border-[#FF4757] text-[#FF4757] bg-[#FF4757]/20'}
              `}
              style={{
                boxShadow: isAllCorrect ? '0 0 60px rgba(46, 213, 115, 0.5), inset 0 0 40px rgba(46, 213, 115, 0.4)' : '0 0 60px rgba(255, 71, 87, 0.5), inset 0 0 40px rgba(255, 71, 87, 0.4)',
                transformOrigin: 'center'
              }}
              initial={{ scale: 4, opacity: 0, rotate: 20 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 350, damping: 12, mass: 1 }}
            >
              <h2 
                className="text-6xl md:text-8xl font-black tracking-widest uppercase font-display"
                style={{ 
                  textShadow: isAllCorrect ? '0 6px 30px rgba(46, 213, 115, 0.9)' : '0 6px 30px rgba(255, 71, 87, 0.9)'
                }}
              >
                {isAllCorrect ? t('reveal.success') : t('reveal.fail')}
              </h2>
            </motion.div>

            {/* スタンプ後に下から遅れて表示されるボタン群 */}
            <motion.div
              className="mt-16 w-full max-w-[320px] flex flex-col gap-4 z-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
            >
              <Button variant="secondary" size="lg" onClick={() => setShowStamp(false)} className="w-full py-4 !bg-white/80 hover:!bg-white">
                点数を確認する
              </Button>
              {mode === 'insider' ? (
                <Button variant="primary" size="lg" onClick={handleToVote} className="w-full py-4 shadow-lg shadow-blue/30">
                  {t('reveal.toVote')}
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handlePlayAgain} className="w-full py-4 shadow-lg shadow-blue/30">
                  {t('reveal.playAgain')}
                </Button>
              )}
              <motion.button
                className="text-sm font-bold text-text-main/80 hover:text-text-main transition-colors py-2 bg-white/50 backdrop-blur-sm rounded-full mt-2"
                onClick={handleGoHome}
                whileTap={{ scale: 0.95 }}
              >
                {t('reveal.home')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
