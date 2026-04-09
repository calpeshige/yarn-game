import { create } from 'zustand';
import type { GamePhase, GameMode, GameState, Theme } from '../types/game';
import { dealCards } from '../utils/deck';

interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setTheme: (theme: Theme) => void;
  setMode: (mode: GameMode) => void;
  startGame: () => void;
  markCardViewed: (playerId: string) => void;
  advancePeekPlayer: () => void;
  previousPeekPlayer: () => void;
  setPhase: (phase: GamePhase) => void;
  castVote: (targetId: string) => void;
  advanceVoter: () => void;
  previousVoter: () => void;
  resetVotes: () => void;
  playAgain: () => void;
  goHome: () => void;
  clearPlayers: () => void;
  resetGame: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  phase: 'setup',
  mode: 'standard',
  players: [],
  theme: null,
  currentPeekPlayerIndex: 0,
  usedCards: [],
  insiderId: null,
  insiderVotes: [],
  currentVoterIndex: 0,
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

    setMode: (mode) => set({ mode }),

    startGame: () => {
      const { players, mode } = get();
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

      // Pick random insider
      const insiderId = mode === 'insider'
        ? dealtPlayers[Math.floor(Math.random() * dealtPlayers.length)].id
        : null;

      set({
        phase: 'card-peek',
        usedCards: newCards,
        currentPeekPlayerIndex: 0,
        players: dealtPlayers,
        theme: null,
        insiderId,
        insiderVotes: [],
        currentVoterIndex: 0,
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

    previousPeekPlayer: () => {
      const { currentPeekPlayerIndex } = get();
      if (currentPeekPlayerIndex > 0) {
        set({ currentPeekPlayerIndex: currentPeekPlayerIndex - 1 });
      }
    },

    setPhase: (phase) => set({ phase }),

    castVote: (targetId) => {
      const { players, currentVoterIndex } = get();
      const voter = players[currentVoterIndex];
      if (!voter) return;
      set((state) => ({
        insiderVotes: [...state.insiderVotes, { voterId: voter.id, targetId }],
      }));
    },

    advanceVoter: () => {
      set((state) => ({ currentVoterIndex: state.currentVoterIndex + 1 }));
    },

    previousVoter: () => {
      set((state) => {
        if (state.currentVoterIndex > 0) {
          // 投票を1つ消し、インデックスを1つ戻す
          return {
            currentVoterIndex: state.currentVoterIndex - 1,
            insiderVotes: state.insiderVotes.slice(0, -1),
          };
        }
        return state;
      });
    },

    resetVotes: () => {
      set({ insiderVotes: [], currentVoterIndex: 0 });
    },

    playAgain: () => {
      const { players, mode } = get();
      const totalNeeded = players.length;
      const newCards = dealCards(totalNeeded, []);

      let cardIndex = 0;
      const dealtPlayers = players.map((player) => ({
        ...player,
        cards: [newCards[cardIndex++]],
        hasViewed: false,
      }));

      const insiderId = mode === 'insider'
        ? dealtPlayers[Math.floor(Math.random() * dealtPlayers.length)].id
        : null;

      set({
        phase: 'card-peek',
        usedCards: newCards,
        currentPeekPlayerIndex: 0,
        players: dealtPlayers,
        theme: null,
        insiderId,
        insiderVotes: [],
        currentVoterIndex: 0,
      });
    },

    goHome: () => {
      const { players } = get();
      const cleanPlayers = players.map((p) => ({
        ...p,
        cards: [],
        hasViewed: false,
      }));
      set({
        phase: 'setup',
        theme: null,
        currentPeekPlayerIndex: 0,
        usedCards: [],
        players: cleanPlayers,
        insiderId: null,
        insiderVotes: [],
        currentVoterIndex: 0,
      });
    },

    clearPlayers: () => {
      nextPlayerId = 1;
      set({ players: [] });
    },

    resetGame: () => {
      nextPlayerId = 1;
      set({ ...initialState, players: [] });
    },
  })
);
