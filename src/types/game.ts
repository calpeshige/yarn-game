export type GamePhase =
  | 'setup'
  | 'theme-select'
  | 'card-peek'
  | 'discussion'
  | 'reveal'
  | 'insider-vote'
  | 'insider-result';

export type GameMode = 'standard' | 'insider';

export interface Player {
  id: string;
  name: string;
  cards: number[];
  hasViewed: boolean;
}

export interface Theme {
  id: string;
  name: string;
  low: string;
  high: string;
}

export interface InsiderVote {
  voterId: string;
  targetId: string;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  players: Player[];
  theme: Theme | null;
  currentPeekPlayerIndex: number;
  usedCards: number[];
  insiderId: string | null;
  insiderVotes: InsiderVote[];
  currentVoterIndex: number;
}
