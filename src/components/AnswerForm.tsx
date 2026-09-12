'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { TIPI_ITEMS } from '@/lib/core/tipi';
import { LikertScale } from '@/components/LikertScale';
import { submitPeerAnswer } from '@/lib/actions/peer';
import { SessionData } from '@/lib/core/types';
import { User, MessageSquare, Loader2, HeartHandshake } from 'lucide-react';

interface AnswerFormProps {
  session: SessionData;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ session }) => {
  const router = useRouter();
  const hostName = session.host_nickname;
  const sessionId = session.id;

  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
      setError('あなたのニックネームを入力してください。');
      return;
    }
    if (answeredCount < 10) {
      setError(`まだ回答していない設問があります（残り ${10 - answeredCount} 問）。`);
      return;
    }

    setError(null);
    const answersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => answers[i]);

    startTransition(async () => {
      try {
        const res = await submitPeerAnswer(sessionId, nickname, answersArray, comment);
        if (res.success) {
          router.push(
            `/answer/${sessionId}/thanks?host=${encodeURIComponent(hostName)}&aid=${res.answerId}`
          );
        }
      } catch (err: any) {
        setError(err.message || '回答の送信に失敗しました。もう一度お試しください。');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ヘッダーバナー */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-md space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
          <HeartHandshake className="w-4 h-4" />
          <span>他者評価リクエスト</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          {hostName} さんの印象を教えてください
        </h1>
        <p className="text-pink-100 text-xs sm:text-sm leading-relaxed">
          あなたの回答は平均値として集計され、個人の採点スコアは本人の画面でも完全非公開です。忖度なく直感でお答えください！（所要時間1分）
        </p>
      </div>

      {/* 進捗状況 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>進捗</span>
          <span className="text-rose-600">{answeredCount} / 10 完了</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / 10) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 回答者のニックネーム */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <User className="w-4 h-4 text-rose-500" />
            <span>あなたのニックネーム</span>
            <span className="text-xs text-rose-500 font-normal">※必須</span>
          </label>
          <input
            type="text"
            required
            maxLength={20}
            placeholder="例: サトシ、ゆき"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-slate-400">
            {hostName}さんに「回答してくれた人」として名前のみ通知されます。
          </p>
        </div>

        {/* 10問の設問 */}
        <div className="space-y-4">
          {TIPI_ITEMS.map((item, index) => (
            <LikertScale
              key={item.id}
              questionNumber={item.id}
              questionText={item.peerTextTemplate(hostName)}
              value={answers[index] ?? null}
              onChange={(val) => handleAnswerChange(index, val)}
            />
          ))}
        </div>

        {/* 任意の一言コメント */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>{hostName}さんへ一言メッセージ / 印象（任意）</span>
          </label>
          <textarea
            maxLength={100}
            rows={2}
            placeholder="例: 仕事はデキるけどたまに抜けてて面白い！"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
          />
          <p className="text-[11px] text-slate-400">
            診断結果画面に匿名カードとして掲載されます（100文字以内）。
          </p>
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
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99]'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>回答を送信中...</span>
              </>
            ) : isComplete ? (
              <span>回答を送信する</span>
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
  );
};
