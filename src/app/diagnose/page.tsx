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
  const isComplete = privateNickname.trim().length > 0 && answeredCount === 10;

  const handlePrivateNameChange = (val: string) => {
    setPrivateNickname(val);
    if (!isCustomPublic) {
      setPublicNickname(val);
    }
  };

  const handleAnswerChange = (index: number, val: number) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = effectivePublicName.trim() || privateNickname.trim();
    if (!finalName) {
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
        const result = await createHostSession(finalName, answersArray);
        if (result.success) {
          try {
            // ローカル保存
            localStorage.setItem(
              'gap_recent_session',
              JSON.stringify({
                sessionId: result.sessionId,
                nickname: finalName,
                privateNickname: privateNickname.trim(),
              })
            );

            // 相互診断の紐付けがあれば保存
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
            {fromSession ? '相互診断モード' : '自己診断モード'}
          </span>
        </div>

        {/* 相互診断特別ヘッダーバナー */}
        {fromSession && returnToHost && (
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
          {/* ニックネーム入力＆プライバシー安心設計 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-4">
            {/* 管理用ニックネーム（非公開） */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-sm font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  あなたのニックネーム（管理用）
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
                placeholder="例: たろう、ミカ、本人専用名"
                value={privateNickname}
                onChange={(e) => handlePrivateNameChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>プライバシー安心設計：</strong>この管理名は診断結果画面でのあなた専用の識別用です。外部の友達やSNSには一切漏れません。
                </span>
              </div>
            </div>

            {/* 公開名の使い分けオプション */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <span>相手に見せる表示名（公開用）</span>
                  <span className="text-[10px] text-slate-400 font-normal">※相手によって後から変更可能</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomPublic(!isCustomPublic)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  {isCustomPublic ? '管理名と同じにする' : '別の名前を設定する'}
                </button>
              </div>

              {isCustomPublic ? (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="例: 田中先輩、サトシ、たっくん"
                    value={publicNickname}
                    onChange={(e) => setPublicNickname(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-blue-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <p className="text-[11px] text-blue-600">
                    友達が回答する際、「{publicNickname.trim() || '〇〇'} さんの印象を教えてください」と表示されます。
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  現在は「<strong>{privateNickname.trim() || '（未入力）'}</strong>」として相手に表示されます。管理画面から、送る相手（職場・友達・SNS）に合わせていつでも表示名を変えたリンクを発行できます。
                </p>
              )}
            </div>
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
                  <span>
                    {fromSession
                      ? `自己診断を完了して【${returnToHost}】さんへの逆評価リンクを発行`
                      : '自己診断を完了して共有URLを発行'}
                  </span>
                </>
              ) : (
                <span>
                  {!privateNickname.trim()
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

export default function DiagnosePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <DiagnoseContent />
    </Suspense>
  );
}