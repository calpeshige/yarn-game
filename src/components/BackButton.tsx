import { useT } from '../i18n';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed left-4 top-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] z-50 flex items-center gap-1 rounded-full border border-white/60 bg-white/80 px-3.5 py-2 text-sm font-bold text-text-secondary shadow-[0_4px_12px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform active:scale-95"
    >
      <span className="-mt-0.5 inline-block text-base leading-none">‹</span>
      <span>{t('players.back')}</span>
    </button>
  );
}
