'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { TIPI_ITEMS } from '@/lib/core/tipi';
import { LikertScale } from '@/components/LikertScale';
import { createHostSession } from '@/lib/actions/session';
import { User, Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DiagnosePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [nickname, setNickname] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  const answeredCount = Object.keys(answers).length;
  const isComplete = nickname.trim().length > 0 && answeredCount === 10;

  const handleAnswerChange = (index: number, val: number) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('ニックネームを入力してください。');
      return;
    }
    if (answeredCount < 10) {
      setError(`まだ回答していない設問があります（残り ${10 - answeredCount} 問）。`);
      return;
    }

    setError(null);

    // インデックス順の配列に変換
    const answersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => answers[i]);

    startTransition(async () => {
      try {
        const result = await createHostSession(nickname, answersArray);
        if (result.success) {
          router.push(`/me/${result.sessionId}`);
        }
      } catch (err: any) {
        setError(err.message || '診断の作成に失敗しました。もう一度お試しください。');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>トップへ戻る</span>
          </Link>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            自己診断モード
          </span>
        </div>

        {/* タイトル & 進捗 */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            あなたの性格を自己評価
          </h1>
          <p className="text-sm text-slate-500">
            直感で「普段のあなた」に最も近い数字を選んでください。
          </p>

          <div className="pt-3">
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5 px-1">
              <span>進捗状況</span>
              <span className="text-blue-600">{answeredCount} / 10 完了</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ニックネーム入力 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <User className="w-4 h-4 text-blue-600" />
              <span>あなたのニックネーム</span>
              <span className="text-xs text-rose-500 font-normal">※必須</span>
            </label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="例: たろう、ミカ"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            <p className="text-[11px] text-slate-400">
              友人に回答を依頼する際に表示される名前です。
            </p>
          </div>

          {/* 10問の設問 */}
          <div className="space-y-4">
            {TIPI_ITEMS.map((item, index) => (
              <LikertScale
                key={item.id}
                questionNumber={item.id}
                questionText={item.selfText}
                value={answers[index] ?? null}
                onChange={(val) => handleAnswerChange(index, val)}
              />
            ))}
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          {/* 送信ボタン */}
          <div className="sticky bottom-4 pt-2">
            <button
              type="submit"
              disabled={isPending || !isComplete}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${
                isComplete && !isPending
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>診断セッションを作成中...</span>
                </>
              ) : isComplete ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>自己診断を完了して共有URLを発行</span>
                </>
              ) : (
                <span>
                  {!nickname.trim()
                    ? 'ニックネームを入力してください'
                    : `残り ${10 - answeredCount} 問 回答してください`}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}