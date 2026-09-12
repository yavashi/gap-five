-- GAP-FIVE データベーススキーマ (PostgreSQL / Supabase)

-- 1. 診断セッションテーブル（ホストの自己評価データ）
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_key UUID DEFAULT gen_random_uuid() NOT NULL, -- ホスト識別・管理用シークレットキー
    host_nickname VARCHAR(30) NOT NULL,
    self_scores JSONB NOT NULL, -- { "E": 5.5, "A": 3.0, "C": 6.0, "S": 2.5, "O": 4.0 }
    self_label VARCHAR(50) NOT NULL, -- 自認二つ名（例: 緻密なグランドデザイナー）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. 他者回答テーブル（友人・知人による他者評価データ）
CREATE TABLE IF NOT EXISTS peer_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    peer_nickname VARCHAR(30) NOT NULL,
    peer_scores JSONB NOT NULL, -- { "E": 3.0, "A": 5.0, "C": 4.5, "S": 5.0, "O": 3.5 }
    comment VARCHAR(100), -- 任意の一言印象コメント（「仕事はできるが私生活は謎」等）
    is_excluded BOOLEAN DEFAULT FALSE NOT NULL, -- ホストによる荒らし除外フラグ
    client_ip_hash VARCHAR(64), -- 連投・スパム防止用
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 高速集計用インデックス
CREATE INDEX IF NOT EXISTS idx_peer_answers_session ON peer_answers(session_id) WHERE is_excluded = FALSE;
CREATE INDEX IF NOT EXISTS idx_sessions_secret ON sessions(id, secret_key);

-- Row Level Security (RLS) ポリシー
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE peer_answers ENABLE ROW LEVEL SECURITY;

-- sessions: 誰でもIDで基本情報（ニックネーム・自認・スコア）を参照可能（結果表示用）
-- ただし secret_key は API 経由で返却を制限するか、ホスト認証時のみ照合
CREATE POLICY "Public read sessions by ID" ON sessions
    FOR SELECT USING (true);

-- sessions: 作成は誰でも可能（診断完了時）
CREATE POLICY "Public insert sessions" ON sessions
    FOR INSERT WITH CHECK (true);

-- peer_answers: 誰でも回答を投稿可能
CREATE POLICY "Public insert peer_answers" ON peer_answers
    FOR INSERT WITH CHECK (true);

-- peer_answers: 除外されていない回答は誰でも参照可能
CREATE POLICY "Public read non-excluded peer_answers" ON peer_answers
    FOR SELECT USING (is_excluded = FALSE);
