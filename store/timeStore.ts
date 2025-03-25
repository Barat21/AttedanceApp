import { create } from 'zustand';
import { useAuthStore } from './authStore';

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
      const user = useAuthStore.getState().user;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('https://people-pilot.onrender.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: user.id,
          type: 'clock_in',
          clock_in: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to punch in');
      }

      set({
        currentSession: {
          id: Date.now().toString(),
          punchIn: new Date(),
          punchOut: null,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to punch in');
    }
  },
  punchOut: async () => {
    try {
      const position = await getCurrentPosition();
      const user = useAuthStore.getState().user;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('https://people-pilot.onrender.com/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: user.id,
          type: 'clock_out',
          clock_in: false,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to punch out');
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
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to punch out');
    }
  },
}));