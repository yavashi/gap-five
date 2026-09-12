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
  customHostName?: string;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ session, customHostName }) => {
  const router = useRouter();
  const hostName = customHostName?.trim() || session.host_nickname;
  const sessionId = session.id;

  // step: 0 = ニックネーム・メッセージ入力, 1〜10 = 設問, 11 = 送信中
  const [step, setStep] = useState<number>(0);

  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const answeredCount = Object.keys(answers).length;

  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('ニックネームを入力してください。');
      return;
    }
    setError(null);
    setStep(1);
  };

  const handleAnswerSelect = (index: number, val: number) => {
    const nextAnswers = { ...answers, [index]: val };
    setAnswers(nextAnswers);

    // 次のステップへ自動送り
    if (index < 9) {
      setStep(index + 2); // index 0 (Q1) -> step 2 (Q2)
    } else {
      // 10問目完了 -> 自動送信
      submitAll(nextAnswers);
    }
  };

  const submitAll = (finalAnswers: Record<number, number>) => {
    if (!nickname.trim()) {
      setError('ニックネームが未入力です。最初に戻ってください。');
      setStep(0);
      return;
    }

    setStep(11); // 送信中ローディング画面
    setError(null);

    const answersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => finalAnswers[i] ?? 4);

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
        setStep(10); // エラー時は設問10に戻す
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ナビゲーション */}
      {step >= 1 && step <= 10 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <span>{step === 1 ? '← 名前入力に戻る' : '← 前の質問に戻る'}</span>
          </button>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {hostName} さんへの他者評価
          </span>
        </div>
      )}

      {/* プログレスバー（設問中のみ表示） */}
      {step >= 1 && step <= 10 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
            <span className="text-rose-600 font-black">QUESTION {step} / 10</span>
            <span>残り {10 - answeredCount} 問</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(answeredCount / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold text-center animate-fadeIn">
          {error}
        </div>
      )}

      {/* STEP 0: ニックネーム ＆ 一言入力画面 */}
      {step === 0 && (
        <form onSubmit={handleStartQuestions} className="space-y-6 animate-fadeIn">
          {/* ヘッダーバナー */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-md space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>完全匿名・1分で回答</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {hostName} さんの印象を教えてください
            </h1>
            <p className="text-pink-100 text-xs sm:text-sm leading-relaxed">
              あなたの回答は平均値として集計され、採点スコアは本人の画面でも完全非公開です。直感でお答えください！
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
            {/* ニックネーム */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-rose-500" />
                  あなたのニックネーム
                  <span className="text-xs text-rose-500 font-normal">※必須</span>
                </span>
              </label>
              <input
                type="text"
                required
                maxLength={20}
                placeholder="例: サトシ、ゆき、同僚A"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all font-bold"
                autoFocus
              />
              <p className="text-[11px] text-slate-400">
                {hostName} さんには「回答してくれた友達一覧」として名前のみ通知されます。
              </p>
            </div>

            {/* 任意の一言コメント */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                <span>{hostName} さんへ一言メッセージ / 印象（任意）</span>
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

            {/* 回答開始ボタン */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!nickname.trim()}
                className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                  nickname.trim()
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>10問の採点をはじめる（約1分） →</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 1〜10: 1問1答画面 */}
      {step >= 1 && step <= 10 && (
        <div className="space-y-4">
          <LikertScale
            questionNumber={step}
            totalQuestions={10}
            questionText={TIPI_ITEMS[step - 1].peerTextTemplate(hostName)}
            value={answers[step - 1] ?? null}
            onChange={(val) => {
              setAnswers((prev) => ({ ...prev, [step - 1]: val }));
            }}
            onSelectAndAdvance={(val) => handleAnswerSelect(step - 1, val)}
            onPrev={() => setStep((prev) => Math.max(0, prev - 1))}
            canPrev={true}
            themeColor="rose"
            subjectName={hostName}
          />

          {/* ナビゲーション補助ボタン */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-2 px-3 rounded-xl hover:bg-slate-200/60"
            >
              ← {step === 1 ? '名前入力に戻る' : '前の質問'}
            </button>

            {answers[step - 1] && step < 10 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev + 1)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200"
              >
                次の質問へ →
              </button>
            )}

            {step === 10 && answers[9] && (
              <button
                type="button"
                onClick={() => submitAll(answers)}
                className="text-xs font-black text-white bg-rose-500 hover:bg-rose-600 transition-colors py-2 px-4 rounded-xl shadow-md"
              >
                回答を送信する ✨
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 11: 送信中ローディング画面 */}
      {step === 11 && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-center space-y-6 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              回答を送信しています...
            </h2>
            <p className="text-sm text-slate-500">
              {hostName} さんの診断結果に集計しています。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};