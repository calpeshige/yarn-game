import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useT, useLangStore } from '../i18n';
import { Button } from '../components/Button';
import { BackButton } from '../components/BackButton';

export function InsiderResultScreen() {
  const navigate = useNavigate();
  const { players, insiderVotes, insiderId, resetVotes, playAgain, goHome } = useGameStore();
  const t = useT();
  const lang = useLangStore((s) => s.lang);
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
    <div className="screen-container pt-8 justify-start h-full pb-8 relative">
      <BackButton onClick={() => navigate('/insider-vote')} />
      <h2 className="text-3xl font-black text-text-main text-center mb-6 tracking-wide drop-shadow-sm">
        {t('result.title')}
      </h2>

      <div className="w-full flex-1 flex flex-col gap-2.5 overflow-y-auto mb-6 pr-1 custom-scrollbar px-1">
        {insiderVotes.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-white/70 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all group"
          >
            <span className="font-bold text-base text-text-main group-hover:text-blue transition-colors flex-1">{playerMap.get(v.voterId)}</span>
            <span className="font-black text-blue/40 mx-4 px-2 tracking-widest text-lg group-hover:text-blue/80 transition-colors">➔</span>
            <span className="font-bold text-base text-text-main text-right flex-1">{playerMap.get(v.targetId)}</span>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-white mb-2 text-center relative overflow-hidden">
        {isTie ? (
          <>
            <p className="text-xl font-bold text-text-main mb-2 tracking-wide leading-relaxed">{topVotedName}</p>
            <p className="text-sm font-bold text-red mb-8 tracking-widest opacity-90">{t('result.tie')}</p>
            <Button variant="primary" size="lg" onClick={handleRevote} className="w-full">
              {t('result.revote')}
            </Button>
          </>
        ) : (
          <>
            {!showInsider && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue/40 via-purple/40 to-pink/40" />
            )}
            {showInsider && (
              <div className={`absolute top-0 inset-x-0 h-2 ${caught ? 'bg-gradient-to-r from-green via-teal to-blue' : 'bg-gradient-to-r from-red via-orange to-red animate-pulse'}`} />
            )}

            <p className="text-xl font-bold text-text-main mb-6 leading-relaxed">
              <span className="text-blue font-black underline decoration-blue/30 decoration-4 underline-offset-4 mr-1">{topVotedName}</span>
              {t('result.topVoted')}
            </p>

            {!showInsider ? (
              <div className="w-full">
                <Button variant="primary" size="lg" onClick={() => setShowInsider(true)} className="w-full py-4 bg-gradient-to-r from-purple to-pink border-transparent text-white shadow-[0_4px_15px_rgba(217,128,250,0.3)] hover:shadow-[0_6px_20px_rgba(217,128,250,0.4)]">
                  {t('result.insiderWas')}
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center mt-2 relative">
                <p className="text-sm font-bold text-text-muted mb-1 tracking-widest">
                   {lang === 'en' ? 'The True Clairvoyant was:' : '正解の千里眼は…'}
                </p>
                <p className="text-[2.5rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple to-pink mb-4 drop-shadow-sm font-display tracking-wide">{playerMap.get(insiderId!)}</p>
                <div className={`px-6 py-2.5 rounded-full font-black text-sm tracking-widest uppercase shadow-inner ${caught ? 'bg-green/10 text-green border border-green/20' : 'bg-red/10 text-red border border-red/20'}`}>
                  {caught ? t('result.caught') : t('result.escaped')}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showInsider && (
        <div className="w-full mt-auto flex flex-col gap-3 pt-6 z-10">
          <Button variant="primary" size="lg" onClick={handlePlayAgain} className="w-full py-4 text-lg">
            {t('reveal.playAgain')}
          </Button>
          <button
            className="text-sm font-bold text-text-muted hover:text-text-main transition-colors py-2 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full w-40 mx-auto"
            onClick={handleGoHome}
          >
            {t('reveal.home')}
          </button>
        </div>
      )}
    </div>
  );
}
