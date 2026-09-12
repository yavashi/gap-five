import { SessionData, PeerAnswerData } from '../core/types';

// グローバルなインメモリストア（Supabase未設定時または開発用フォールバック）
interface MemoryDatabase {
  sessions: Map<string, SessionData>;
  peerAnswers: Map<string, PeerAnswerData[]>;
}

// globalThisに保存してNext.jsの開発リロードでもデータが消えないようにする
const globalForStore = globalThis as unknown as {
  memoryDb?: MemoryDatabase;
};

export const memoryDb: MemoryDatabase =
  globalForStore.memoryDb ?? {
    sessions: new Map<string, SessionData>(),
    peerAnswers: new Map<string, PeerAnswerData[]>(),
  };

if (process.env.NODE_ENV !== 'production') {
  globalForStore.memoryDb = memoryDb;
}