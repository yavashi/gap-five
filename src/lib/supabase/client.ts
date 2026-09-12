import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // 開発初期やモック環境で環境変数が未設定の場合のフォールバック
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
