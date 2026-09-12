'use client';

import React, { useEffect, useState } from 'react';
import { HeartHandshake, ArrowRight, Sparkles, Send, Copy, Check, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface PeerItem {
  id: string;
  peer_nickname: string;
  comment?: string;
  created_at: string;
}

interface MutualDiagnosisCardProps {
  sessionId: string;
  hostNickname: string;
  peerAnswers: PeerItem[];
  baseUrl: string;
}

export const MutualDiagnosisCard: React.FC<MutualDiagnosisCardProps> = ({
  sessionId,
  hostNickname,
  peerAnswers,
  baseUrl,
}) => {
  const [mutualTarget, setMutualTarget] = useState<{
    targetSessionId: string;
    targetHostName: string;
  } | null>(null);

  const [copiedName, setCopiedName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`gap_mutual_${sessionId}`);
      if (stored) {
        setMutualTarget(JSON.parse(stored));
      }
    } catch {}
  }, [sessionId]);

  const handleCopyReverseInvite = async (peerName: string) => {
    const reverseUrl = `${baseUrl}/diagnose?fromSession=${sessionId}&name=${encodeURIComponent(peerName)}&returnToHost=${encodeURIComponent(hostNickname)}`;
    const text = `【${peerName}さんへ】\n${hostNickname}です！私の性格診断に回答してくれてありがとう！\n次は私が${peerName}さんの性格を診断したいので、自己診断を作ってみてね（登録などはなく2分くらいで終わる簡単なものです。月額課金等もありません）！\n${reverseUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedName(peerName);
      setTimeout(() => setCopiedName(null), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedName(peerName);
      setTimeout(() => setCopiedName(null), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* 自身が逆評価ルームとして作成された場合の特設バナー */}
      {mutualTarget && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-md border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <HeartHandshake className="w-4 h-4 text-pink-300" />
              相互診断モード中
            </span>
            <span className="text-[11px] text-indigo-200">
              ペア：{hostNickname} × {mutualTarget.targetHostName}
            </span>
          </div>

          <div>
            <h3 className="text-base font-black text-slate-100">
              【{mutualTarget.targetHostName}】さんに逆評価してもらいましょう！
            </h3>
            <p className="text-xs text-indigo-100/80 leading-relaxed mt-1">
              あなたの自己診断ルームが開設されました。{mutualTarget.targetHostName}さんに回答してもらうことで、お互いを評価し合う「完全相互診断マトリクス」が完成します。
            </p>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(
                `【${mutualTarget.targetHostName}さんへ】\n${hostNickname}です！先ほど診断に回答しました！\n私の診断ルームも作ったので、${mutualTarget.targetHostName}さんから見た私の印象も教えてください（1分・完全匿名）！\n${baseUrl}/answer/${sessionId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{mutualTarget.targetHostName}さんにLINEで逆評価を頼む</span>
            </a>
            <Link
              href={`/answer/${mutualTarget.targetSessionId}`}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
            >
              <span>{mutualTarget.targetHostName}さんの診断へ戻る</span>
            </Link>
          </div>
        </div>
      )}

      {/* 回答者一覧（相互診断・逆診断アクション付き） */}
      {peerAnswers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>回答してくれた友人（{peerAnswers.length}名）とお返し相互診断</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            あなたを診断してくれた友人を、今度はあなたが逆診断しましょう！「相互診断リンク」を送れば、相手も自己診断を作って相互評価が成立します。
          </p>

          <div className="space-y-3">
            {peerAnswers.map((item) => {
              const reverseInviteUrl = `${baseUrl}/diagnose?fromSession=${sessionId}&name=${encodeURIComponent(item.peer_nickname)}&returnToHost=${encodeURIComponent(hostNickname)}`;
              const lineInviteText = `【${item.peer_nickname}さんへ】\n${hostNickname}です！私の性格診断に回答してくれてありがとう！\n次は私が${item.peer_nickname}さんの性格を診断したいので、自己診断を作ってみてね（登録などはなく2分くらいで終わる簡単なものです。月額課金等もありません）！\n${reverseInviteUrl}`;
              const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineInviteText)}`;
              const isCopied = copiedName === item.peer_nickname;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 transition-all hover:border-slate-300"
                >
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{item.peer_nickname} さん</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                          回答完了
                        </span>
                      </div>
                      {item.comment && (
                        <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <span className="italic">「{item.comment}」</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">
                      {new Date(item.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>

                  {/* 相互診断アクションボタン群 */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <a
                      href={lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>{item.peer_nickname}さんに逆診断依頼をLINE送信</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyReverseInvite(item.peer_nickname)}
                      className="inline-flex items-center gap-1 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">依頼文コピー済</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>依頼文コピー</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/result/${sessionId}`}
                      className="inline-flex items-center gap-1 py-2 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors ml-auto"
                    >
                      <span>2人の相性を見る</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            ※忖度を防ぐため、個人の採点スコアは非公開です（平均値として反映されます）。
          </p>
        </div>
      )}
    </div>
  );
};