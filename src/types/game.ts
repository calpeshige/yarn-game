export type GamePhase =
  | 'setup'
  | 'theme-select'
  | 'card-peek'
  | 'discussion'
  | 'reveal';

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

export interface GameState {
  phase: GamePhase;
  players: Player[];
  theme: Theme | null;
  currentPeekPlayerIndex: number;
  usedCards: number[];
}
