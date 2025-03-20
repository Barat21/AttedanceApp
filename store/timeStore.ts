import { create } from 'zustand';

interface TimeEntry {
  id: string;
  punchIn: Date;
  punchOut: Date | null;
}

interface TimeState {
  currentSession: TimeEntry | null;
  history: TimeEntry[];
  punchIn: () => void;
  punchOut: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  currentSession: null,
  history: [],
  punchIn: () => set((state) => ({
    currentSession: {
      id: Date.now().toString(),
      punchIn: new Date(),
      punchOut: null,
    },
  })),
  punchOut: () => set((state) => {
    if (!state.currentSession) return state;
    
    const completedSession = {
      ...state.currentSession,
      punchOut: new Date(),
    };

    return {
      currentSession: null,
      history: [completedSession, ...state.history],
    };
  }),
}));