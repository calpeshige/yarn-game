import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Lang = 'ja' | 'en';

interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangStore>()(
  persist(
    (set) => ({
      lang: 'ja',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'yarn-lang' }
  )
);

// ---- UI Text Dictionary ----
const dict = {
  // Home
  'home.subtitle': { ja: '糸でつながる言葉のゲーム', en: 'A word game connected by threads' },
  'home.start': { ja: 'ゲームを始める', en: 'Start Game' },
  'home.themes': { ja: 'お題を追加・管理', en: 'Add / Manage Topics' },
  'home.themes.close': { ja: '閉じる', en: 'Close' },
  'home.themes.title': { ja: 'オリジナルお題', en: 'Custom Topics' },
  'home.themes.name': { ja: 'お題名（例: こわいもの）', en: 'Topic name (e.g. Scary things)' },
  'home.themes.low': { ja: '1に近い方', en: 'Low end (1)' },
  'home.themes.high': { ja: '100に近い方', en: 'High end (100)' },
  'home.themes.add': { ja: '追加する', en: 'Add' },
  'home.themes.empty': { ja: 'まだお題がありません', en: 'No custom topics yet' },

  // Player Setup
  'players.title': { ja: 'プレイヤー登録', en: 'Player Setup' },
  'players.instruction': { ja: 'プレイヤーを追加（2〜10人）', en: 'Add players (2-10)' },
  'players.placeholder': { ja: '名前を入力...', en: 'Enter name...' },
  'players.add': { ja: '追加', en: 'Add' },
  'players.count': { ja: '人参加', en: ' players' },
  'players.deal': { ja: 'カードを配る', en: 'Deal Cards' },
  'players.clearAll': { ja: '全員削除', en: 'Remove All' },
  'players.back': { ja: '戻る', en: 'Back' },

  // Player Mode
  'players.modeStandard': { ja: '通常モード', en: 'Standard' },
  'players.modeInsider': { ja: '千里眼モード', en: 'Clairvoyant' },
  'players.insiderDesc': { ja: '1人だけ全員の数字が見える「千里眼」が紛れます。議論の後、千里眼が誰か当てよう！', en: 'One player secretly sees all numbers. After discussion, guess who the Clairvoyant is!' },

  // Card Peek
  'peek.pass': { ja: 'スマホを渡してね', en: 'Pass the phone to' },
  'peek.ready': { ja: '準備OK', en: 'Ready' },
  'peek.tapToReveal': { ja: 'カードをタップして確認', en: 'Tap the card to reveal' },
  'peek.tapToHide': { ja: 'もう一度タップで隠す', en: 'Tap again to hide' },
  'peek.next': { ja: '次の人へ', en: 'Next Player' },
  'peek.toTheme': { ja: 'お題を選ぶ', en: 'Pick a Topic' },
  'peek.insiderLabel': { ja: 'あなたは千里眼です！全員の数字：', en: "You're the Clairvoyant! Everyone's numbers:" },
  'peek.insiderHint': { ja: 'バレないように議論を誘導しよう', en: 'Guide the discussion without getting caught' },

  // Theme Select
  'theme.title': { ja: 'お題を選ぼう', en: 'Pick a Topic' },
  'theme.instruction': { ja: '2つのお題からひとつ選んでね', en: 'Choose one of the two topics' },
  'theme.all': { ja: 'すべて', en: 'All' },
  'theme.originalOnly': { ja: 'オリジナルのみ', en: 'Custom Only' },
  'theme.shuffle': { ja: 'ほかのお題を見る', en: 'Show others' },
  'theme.start': { ja: 'このお題で遊ぶ', en: 'Play with this topic' },

  // Discussion
  'discussion.timerSetup': { ja: '話し合いの時間を決めよう', en: 'Set discussion time' },
  'discussion.timerStart': { ja: 'タイマースタート', en: 'Start Timer' },
  'discussion.timerLabel': { ja: '話し合いタイム', en: 'Discussion Time' },
  'discussion.pause': { ja: '一時停止', en: 'Pause' },
  'discussion.resume': { ja: '再開', en: 'Resume' },
  'discussion.set': { ja: '設定', en: 'Set' },
  'discussion.min': { ja: '分', en: 'min' },
  'discussion.checkLabel': { ja: '数字を忘れた？名前をタップ', en: 'Forgot your number? Tap a name' },
  'discussion.hint': { ja: 'テーマに沿ってヒントで伝えよう', en: 'Give hints based on the topic' },
  'discussion.rule': { ja: '数字を直接言うのはNG！', en: 'Do NOT say the number directly!' },
  'discussion.result': { ja: '結果を見る', en: 'See Results' },
  'discussion.reselectTheme': { ja: 'お題を決め直す', en: 'Reselect Topic' },

  // Reveal
  'reveal.title': { ja: '結果発表', en: 'Results' },
  'reveal.instruction': { ja: '並べ替えて予想しよう / タップで数字を確認', en: 'Drag to reorder / Tap to reveal' },
  'reveal.showAll': { ja: '全員のカードを見る', en: 'Reveal all cards' },
  'reveal.home': { ja: 'ホームに戻る', en: 'Back to Home' },
  'reveal.playAgain': { ja: 'もう一度遊ぶ', en: 'Play Again' },
  'reveal.toVote': { ja: '千里眼を当てよう', en: 'Find the Clairvoyant' },
  'reveal.success': { ja: '成功！', en: 'Success!' },
  'reveal.fail': { ja: '失敗...', en: 'Failed...' },

  // Insider Vote
  'vote.title': { ja: '千里眼は誰？', en: 'Who is the Clairvoyant?' },
  'vote.pass': { ja: 'スマホを渡してね', en: 'Pass the phone to' },
  'vote.ready': { ja: '投票する', en: 'Vote' },
  'vote.instruction': { ja: '千里眼だと思う人を選んでね', en: 'Choose who you think is the Clairvoyant' },
  'vote.confirm': { ja: '決定', en: 'Confirm' },
  'vote.next': { ja: '次の人へ', en: 'Next' },

  // Insider Result
  'result.title': { ja: '投票結果', en: 'Vote Results' },
  'result.tie': { ja: '同票です！もう一度投票してください', en: "It's a tie! Vote again" },
  'result.revote': { ja: '再投票', en: 'Vote Again' },
  'result.topVoted': { ja: 'が最多票！', en: ' got the most votes!' },
  'result.insiderWas': { ja: '千里眼は...', en: 'The Clairvoyant was...' },
  'result.caught': { ja: '千里眼を見破った！', en: 'The Clairvoyant was caught!' },
  'result.escaped': { ja: '千里眼が逃げ切った！', en: 'The Clairvoyant escaped!' },
} as const;

type DictKey = keyof typeof dict;

export function t(key: DictKey, lang: Lang): string {
  return dict[key]?.[lang] ?? key;
}

// Hook for convenience
export function useT() {
  const lang = useLangStore((s) => s.lang);
  return (key: DictKey) => t(key, lang);
}
