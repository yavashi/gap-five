'use client';

import React, { useState, useTransition, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TIPI_ITEMS } from '@/lib/core/tipi';
import { LikertScale } from '@/components/LikertScale';
import { createHostSession } from '@/lib/actions/session';
import { User, Sparkles, Loader2, ArrowLeft, ShieldCheck, HeartHandshake, EyeOff, HelpCircle } from 'lucide-react';
import Link from 'next/link';

function DiagnoseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const fromSession = searchParams?.get('fromSession') || '';
  const paramName = searchParams?.get('name') || '';
  const returnToHost = searchParams?.get('returnToHost') || '';

  // step: 0 = 名前入力, 1〜10 = 設問, 11 = 送信中
  const [step, setStep] = useState<number>(0);

  // 管理用ニックネーム（非公開）
  const [privateNickname, setPrivateNickname] = useState(paramName);
  // 相手に見せる表示名（公開用）
  const [publicNickname, setPublicNickname] = useState(paramName);
  const [isCustomPublic, setIsCustomPublic] = useState(false);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paramName && !privateNickname) {
      setPrivateNickname(paramName);
      setPublicNickname(paramName);
    }
  }, [paramName]);

  const effectivePublicName = isCustomPublic ? publicNickname : privateNickname;
  const answeredCount = Object.keys(answers).length;

  const handlePrivateNameChange = (val: string) => {
    setPrivateNickname(val);
    if (!isCustomPublic) {
      setPublicNickname(val);
    }
  };

  const handleStartQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = effectivePublicName.trim() || privateNickname.trim();
    if (!finalName) {
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
    const finalName = effectivePublicName.trim() || privateNickname.trim();
    if (!finalName) {
      setError('ニックネームが未入力です。最初に戻ってください。');
      setStep(0);
      return;
    }

    setStep(11); // 送信ローディング画面
    setError(null);

    const answersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => finalAnswers[i] ?? 4);

    startTransition(async () => {
      try {
        const result = await createHostSession(finalName, answersArray);
        if (result.success) {
          try {
            localStorage.setItem(
              'gap_recent_session',
              JSON.stringify({
                sessionId: result.sessionId,
                nickname: finalName,
                privateNickname: privateNickname.trim(),
              })
            );

            if (fromSession && returnToHost) {
              localStorage.setItem(
                `gap_mutual_${result.sessionId}`,
                JSON.stringify({
                  targetSessionId: fromSession,
                  targetHostName: returnToHost,
                })
              );
            }
          } catch {}
          router.push(`/me/${result.sessionId}`);
        }
      } catch (err: any) {
        setError(err.message || '診断の作成に失敗しました。もう一度お試しください。');
        setStep(10); // エラー時は設問10に戻す
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          {step === 0 ? (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>トップへ戻る</span>
            </Link>
          ) : step <= 10 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? '名前入力に戻る' : '前の質問に戻る'}</span>
            </button>
          ) : (
            <div />
          )}

          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {fromSession ? '相互診断モード' : '自己診断（所要時間1分）'}
          </span>
        </div>

        {/* 相互診断特別ヘッダーバナー */}
        {fromSession && returnToHost && step === 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200">
              <HeartHandshake className="w-4 h-4 text-pink-300" />
              <span>相互診断ループ開設中</span>
            </div>
            <p className="text-sm font-black">
              【{returnToHost}】さんへの逆評価依頼ルームを作成します
            </p>
            <p className="text-[11px] text-indigo-100 leading-relaxed">
              あなたの診断を作成すると、{returnToHost}さんに「{privateNickname || 'あなた'}」の印象を評価してもらう専用リンクが自動発行されます！
            </p>
          </div>
        )}

        {/* プログレスバー（設問回答中のみ表示） */}
        {step >= 1 && step <= 10 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
              <span className="text-indigo-600 font-black">QUESTION {step} / 10</span>
              <span>残り {10 - answeredCount} 問</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
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

        {/* STEP 0: ニックネーム入力画面 */}
        {step === 0 && (
          <form onSubmit={handleStartQuestions} className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                あなたの性格を自己評価
              </h1>
              <p className="text-sm text-slate-500">
                まずはニックネームを設定し、10問の直感診断をはじめましょう。
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 space-y-5">
              {/* 管理用ニックネーム */}
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-indigo-600" />
                    あなたのニックネーム
                    <span className="text-xs text-rose-500 font-normal">※必須</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <EyeOff className="w-3 h-3" />
                    外部非公開
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder="例: けい、ミカ、たろう"
                  value={privateNickname}
                  onChange={(e) => handlePrivateNameChange(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold"
                  autoFocus
                />
                <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>プライバシー安心設計：</strong>このニックネームはあなた専用の管理用です。外部やSNSに意図せず公開されることはありません。
                  </span>
                </div>
              </div>

              {/* 公開名の使い分けオプション */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    相手に見せる表示名（公開用）
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCustomPublic(!isCustomPublic)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                  >
                    {isCustomPublic ? '管理名と同じにする' : '別の表示名を設定する'}
                  </button>
                </div>

                {isCustomPublic ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      maxLength={20}
                      placeholder="例: 田中先輩、サトシ、リーダー"
                      value={publicNickname}
                      onChange={(e) => setPublicNickname(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-indigo-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                    />
                    <p className="text-[11px] text-indigo-600">
                      友達が回答する際、「{publicNickname.trim() || '〇〇'} さんの印象を教えてください」と表示されます。
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    送る相手（サークル・職場・親友）に合わせて、後からいつでも表示名を変えたURLを発行できます。
                  </p>
                )}
              </div>

              {/* 開始ボタン */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!privateNickname.trim()}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                    privateNickname.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>診断をはじめる（全10問・約1分）</span>
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
              questionText={TIPI_ITEMS[step - 1].selfText}
              value={answers[step - 1] ?? null}
              onChange={(val) => {
                setAnswers((prev) => ({ ...prev, [step - 1]: val }));
              }}
              onSelectAndAdvance={(val) => handleAnswerSelect(step - 1, val)}
              onPrev={() => setStep((prev) => Math.max(0, prev - 1))}
              canPrev={true}
              themeColor="blue"
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
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors py-2 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                >
                  次の質問へ →
                </button>
              )}

              {step === 10 && answers[9] && (
                <button
                  type="button"
                  onClick={() => submitAll(answers)}
                  className="text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 px-4 rounded-xl shadow-md"
                >
                  診断を完了する ✨
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 11: 分析中ローディング画面 */}
        {step === 11 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200 text-center space-y-6 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                あなたの性格特性を分析中...
              </h2>
              <p className="text-sm text-slate-500">
                自認ラベルを算出し、友人への招待ルームを準備しています。
              </p>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-indigo-600 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <DiagnoseContent />
    </Suspense>
  );
}