import { create } from 'zustand';
import type { GamePhase, GameState, Theme } from '../types/game';
import { dealCards } from '../utils/deck';

interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setTheme: (theme: Theme) => void;
  startGame: () => void;
  markCardViewed: (playerId: string) => void;
  advancePeekPlayer: () => void;
  setPhase: (phase: GamePhase) => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  phase: 'setup',
  players: [],
  theme: null,
  currentPeekPlayerIndex: 0,
  usedCards: [],
};

let nextPlayerId = 1;

export const useGameStore = create<GameStore>()(
  (set, get) => ({
    ...initialState,

    addPlayer: (name) => {
      const id = `p${nextPlayerId++}`;
      set((state) => ({
        players: [...state.players, { id, name, cards: [], hasViewed: false }],
      }));
    },

    removePlayer: (id) => {
      set((state) => ({
        players: state.players.filter((p) => p.id !== id),
      }));
    },

    setTheme: (theme) => set({ theme }),

    startGame: () => {
      const { players } = get();
      const cleanPlayers = players.map((p) => ({
        ...p,
        cards: [],
        hasViewed: false,
      }));

      const totalNeeded = cleanPlayers.length;
      const newCards = dealCards(totalNeeded, []);

      let cardIndex = 0;
      const dealtPlayers = cleanPlayers.map((player) => ({
        ...player,
        cards: [newCards[cardIndex++]],
      }));

      set({
        phase: 'card-peek',
        usedCards: newCards,
        currentPeekPlayerIndex: 0,
        players: dealtPlayers,
        theme: null,
      });
    },

    markCardViewed: (playerId) => {
      set((state) => ({
        players: state.players.map((p) =>
          p.id === playerId ? { ...p, hasViewed: true } : p
        ),
      }));
    },

    advancePeekPlayer: () => {
      const { currentPeekPlayerIndex, players } = get();
      const nextIndex = currentPeekPlayerIndex + 1;
      if (nextIndex >= players.length) {
        set({ currentPeekPlayerIndex: 0 });
      } else {
        set({ currentPeekPlayerIndex: nextIndex });
      }
    },

    setPhase: (phase) => set({ phase }),

    resetGame: () => {
      nextPlayerId = 1;
      set({ ...initialState, players: [] });
    },
  })
);
