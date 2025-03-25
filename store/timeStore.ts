import { create } from 'zustand';

interface TimeEntry {
  id: string;
  punchIn: Date;
  punchOut: Date | null;
}

interface TimeState {
  currentSession: TimeEntry | null;
  history: TimeEntry[];
  punchIn: () => Promise<void>;
  punchOut: () => Promise<void>;
}

async function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

export const useTimeStore = create<TimeState>((set) => ({
  currentSession: null,
  history: [],
  punchIn: async () => {
    try {
      const position = await getCurrentPosition();
      const response = await fetch('https://people-pilot.onrender.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: 'EMP001',
          type: 'clock_in',
          clock_in: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to punch in');
      }

      set({
        currentSession: {
          id: Date.now().toString(),
          punchIn: new Date(),
          punchOut: null,
        },
      });
    } catch (error) {
      console.error('Punch in error:', error);
      throw error;
    }
  },
  punchOut: async () => {
    try {
      const position = await getCurrentPosition();
      const response = await fetch('https://people-pilot.onrender.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: 'EMP001',
          type: 'clock_out',
          clock_in: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to punch out');
      }

      set((state) => {
        if (!state.currentSession) return state;
        
        const completedSession = {
          ...state.currentSession,
          punchOut: new Date(),
        };

        return {
          currentSession: null,
          history: [completedSession, ...state.history],
        };
      });
    } catch (error) {
      console.error('Punch out error:', error);
      throw error;
    }
  },
}));