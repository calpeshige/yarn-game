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

function PlayerReorderItem({ player, index, color, isRevealed, onToggle }: {
  player: Player;
  index: number;
  color: { bg: string; glow: string };
  isRevealed: boolean;
  onToggle: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={player}
      dragListener={false}
      dragControls={dragControls}
      className={`w-full flex flex-shrink-0 items-center gap-2 p-3.5 pl-2 bg-white/70 backdrop-blur-xl rounded-2xl relative select-none ${isRevealed ? 'text-white' : 'text-text-main border border-white/60 shadow-sm'}`}
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
      whileDrag={{ scale: 1.04, zIndex: 50, boxShadow: '0 12px 40px rgba(0,0,0,0.18)' }}
    >
      {/* ドラッグハンドル */}
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
        className={`flex flex-col items-center justify-center w-10 h-12 cursor-grab active:cursor-grabbing rounded-xl transition-colors ${isRevealed ? 'text-white/80 hover:bg-white/10' : 'text-blue/70 hover:bg-blue/5'}`}
        style={{ touchAction: 'none' }}
        aria-label="長押しして並べ替え"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </div>

      <span className={`font-black text-xl w-6 text-center font-display ${isRevealed ? 'text-white/80' : 'text-text-muted/40'}`}>{index + 1}</span>
      <span className={`font-bold text-lg truncate flex-1 ${isRevealed ? 'text-white' : 'text-text-main'}`}>
        {player.name}
      </span>
      <button
        className="flex items-center justify-center min-w-[48px]"
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
  const [isStampDismissed, setIsStampDismissed] = useState(false);

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
        {!isStampDismissed && isAllCorrect !== null && (
          <motion.div
            key="stamp-overlay"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/40 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* スタンプ本体: 背景をぼかし付きの濃い白にし、色をハッキリさせる */}
            <motion.div
              className={`relative z-10 flex items-center justify-center px-10 py-5 md:px-16 md:py-8 border-[6px] md:border-[10px] rounded-3xl md:rounded-[2.5rem] 
                ${isAllCorrect ? 'border-green text-green' : 'border-red text-red'} bg-white/95
              `}
              style={{
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                transformOrigin: 'center'
              }}
              initial={{ scale: 3.5, opacity: 0, rotate: 25 }}
              animate={{ scale: 1, opacity: 1, rotate: -8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 450, damping: 15, mass: 1.2 }}
            >
              {/* スタンプの枠線を二重線風に見せるための内側の枠線 */}
              <div className={`absolute inset-2 md:inset-3 border-[3px] md:border-[5px] rounded-2xl md:rounded-[1.8rem] opacity-70 ${isAllCorrect ? 'border-green' : 'border-red'}`} />
              
              {/* テキスト本体： 白フチのようなドロップシャドウをつけてどんな環境でも文字を目立たせる */}
              <h2 
                className="relative z-10 text-[11vw] sm:text-5xl md:text-7xl font-black tracking-wider uppercase font-display text-center leading-none"
                style={{ 
                  WebkitTextStroke: isAllCorrect ? '1px var(--color-green)' : '1px var(--color-red)'
                }}
              >
                {isAllCorrect ? t('reveal.success') : t('reveal.fail')}
              </h2>
            </motion.div>

            {/* スタンプ後に下から遅れて表示されるボタン群 */}
            <motion.div
              className="mt-20 w-full max-w-[320px] flex flex-col gap-4 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.3 }}
            >
              <Button variant="secondary" size="lg" onClick={() => setIsStampDismissed(true)} className="w-full py-4 !bg-white/80 hover:!bg-white">
                {t('reveal.checkScores')}
              </Button>
              {mode === 'insider' ? (
                <Button variant="primary" size="lg" onClick={handleToVote} className="w-full py-4 shadow-lg shadow-blue/30">
                  {t('reveal.toVote')}
                </Button>
              ) : (
                <>
                  <Button variant="primary" size="lg" onClick={handlePlayAgain} className="w-full py-4 shadow-lg shadow-blue/30">
                    {t('reveal.playAgain')}
                  </Button>
                  <motion.button
                    className="text-sm font-bold text-text-main/80 hover:text-text-main transition-colors py-2 bg-white/50 backdrop-blur-sm rounded-full mt-2"
                    onClick={handleGoHome}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('reveal.home')}
                  </motion.button>
                </>
              )}
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
        {!allRevealed ? (
          // まだ全員のカードが開かれていない場合：結果を見るボタンだけをメインにする
          <div className="flex w-full items-center justify-center">
            <Button variant="primary" size="lg" onClick={handleRevealAll} className="py-4 shadow-lg shadow-blue/20">
              {t('reveal.showAll')}
            </Button>
          </div>
        ) : (
          // 全員のカードが開かれた後（結果判明後）：次のフローへ進むボタンとホームボタンを出す
          <>
            {mode === 'insider' ? (
              <Button variant="primary" size="lg" onClick={handleToVote} className="py-4 shadow-lg shadow-indigo-500/30">
                {t('reveal.toVote')}
              </Button>
            ) : (
              <>
                <Button variant="primary" size="lg" onClick={handlePlayAgain} className="py-4 shadow-lg shadow-orange/30">
                  {t('reveal.playAgain')}
                </Button>
                <motion.button
                  className="text-sm font-bold text-text-muted hover:text-text-main transition-colors py-2 mt-2"
                  onClick={handleGoHome}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('reveal.home')}
                </motion.button>
              </>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
