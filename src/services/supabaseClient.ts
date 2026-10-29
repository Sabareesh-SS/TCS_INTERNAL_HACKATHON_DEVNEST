/**
 * Supabase Client Configuration & Realtime Interface
 * Compatible with Supabase JS client and local offline mock for demo / development.
 */

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mock-campus-av.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-key';

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

type RealtimeCallback = (payload: { event: string; new: unknown; old: unknown }) => void;

class MockRealtimeChannel {
  private subscribers: RealtimeCallback[] = [];

  constructor(public channelName: string) {}

  on(_event: string, callback: RealtimeCallback) {
    this.subscribers.push(callback);
    return this;
  }

  subscribe(): RealtimeSubscription {
    return {
      unsubscribe: () => {
        this.subscribers = [];
      },
    };
  }

  emit(event: string, newRecord: unknown, oldRecord?: unknown) {
    this.subscribers.forEach((cb) => cb({ event, new: newRecord, old: oldRecord }));
  }
}

export const mockRealtimeHub = {
  incidentChannel: new MockRealtimeChannel('public:incidents'),
};

export const supabaseClient = {
  url: SUPABASE_URL,
  isRealtimeConnected: true,
  channel: (channelName: string) => {
    if (channelName === 'incidents') return mockRealtimeHub.incidentChannel;
    return new MockRealtimeChannel(channelName);
  },
};
