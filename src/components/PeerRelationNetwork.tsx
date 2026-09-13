'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PeerSessionInfo } from '@/lib/actions/session';
import { 
  Users, 
  Sparkles, 
  HeartHandshake, 
  ArrowRight, 
  ArrowLeftRight, 
  Clock, 
  Send, 
  Check, 
  Copy, 
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export interface PeerRelationItem {
  id: string;
  peer_nickname: string;
  comment?: string;
  created_at: string;
}

interface PeerRelationNetworkProps {
  sessionId: string;
  hostNickname: string;
  peerAnswers: PeerRelationItem[];
  peerSessionMap?: Record<string, PeerSessionInfo>;
  baseUrl: string;
  isHostView?: boolean;
}

export const PeerRelationNetwork: React.FC<PeerRelationNetworkProps> = ({
  sessionId,
  hostNickname,
  peerAnswers,
  peerSessionMap = {},
  baseUrl,
  isHostView = false,
}) => {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [isOpenAll, setIsOpenAll] = useState(false);

  if (!peerAnswers || peerAnswers.length === 0) {
    return null;
  }

  // 重複を除いた回答者リスト
  const uniquePeersMap = new Map<string, PeerRelationItem>();
  peerAnswers.forEach((item) => {
    if (!uniquePeersMap.has(item.peer_nickname)) {
      uniquePeersMap.set(item.peer_nickname, item);
    }
  });
  const uniquePeers = Array.from(uniquePeersMap.values());
  const displayedPeers = isOpenAll || uniquePeers.length <= 2 ? uniquePeers : uniquePeers.slice(0, 2);
  const hiddenCount = uniquePeers.length - 2;

  // 相互関係の内訳カウント
  let mutualCount = 0; // 相互評価成立
  let needHostAnswerCount = 0; // 相手は診断あり、ホスト未回答
  let waitingPeerCreateCount = 0; // 相手はまだ診断未作成

  uniquePeers.forEach((p) => {
    const info = peerSessionMap[p.peer_nickname];
    if (info?.sessionId) {
      if (info.hasAnswered) {
        mutualCount++;
      } else {
        needHostAnswerCount++;
      }
    } else {
      waitingPeerCreateCount++;
    }
  });

  const handleCopyInvite = async (peerName: string) => {
    const reverseInviteUrl = `${baseUrl}/diagnose?fromSession=${sessionId}&name=${encodeURIComponent(peerName)}&returnToHost=${encodeURIComponent(hostNickname)}`;
    const text = `【${peerName}さんへ】\n${hostNickname}です！私の性格診断に回答してくれてありがとう！\n次は私が${peerName}さんの性格を診断したいので、自己診断を作ってみてね（登録不要・2分で終わる無料診断です）！\n${reverseInviteUrl}`;

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
    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-5 text-left">
      {/* ヘッダー */}
      <div className="space-y-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              評価・相互診断の関係マップ
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            回答者 {uniquePeers.length} 名
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          誰が誰を評価したか、お互いを評価し合っているか（相互評価）の関係一覧です。
        </p>
      </div>

      {/* サマリーカウンター */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/60">
          <div className="text-[10px] font-bold text-emerald-800">🤝 相互評価成立</div>
          <div className="text-lg sm:text-xl font-black text-emerald-600">
            {mutualCount} <span className="text-xs font-normal">組</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60">
          <div className="text-[10px] font-bold text-amber-800">⏳ 逆評価待ち</div>
          <div className="text-lg sm:text-xl font-black text-amber-600">
            {needHostAnswerCount} <span className="text-xs font-normal">名</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-bold text-slate-600">✉️ 診断作成待ち</div>
          <div className="text-lg sm:text-xl font-black text-slate-700">
            {waitingPeerCreateCount} <span className="text-xs font-normal">名</span>
          </div>
        </div>
      </div>

      {/* 各回答者との関係リスト */}
      <div className="space-y-3 pt-1">
        {displayedPeers.map((item) => {
          const peerName = item.peer_nickname;
          const info = peerSessionMap[peerName];
          const hasCreatedSession = !!info?.sessionId;
          const hasHostAnswered = !!info?.hasAnswered;

          const isMutual = hasCreatedSession && hasHostAnswered;
          const isNeedHostAnswer = hasCreatedSession && !hasHostAnswered;
          const isWaitingPeerCreate = !hasCreatedSession;

          const reverseInviteUrl = `${baseUrl}/diagnose?fromSession=${sessionId}&name=${encodeURIComponent(peerName)}&returnToHost=${encodeURIComponent(hostNickname)}`;
          const lineInviteText = `【${peerName}さんへ】\n${hostNickname}です！私の性格診断に回答してくれてありがとう！\n次は私が${peerName}さんの性格を診断したいので、自己診断を作ってみてね（登録不要・2分で終わる無料診断です）！\n${reverseInviteUrl}`;
          const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(lineInviteText)}`;
          const isCopied = copiedName === peerName;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isMutual
                  ? 'bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border-emerald-200 shadow-xs'
                  : isNeedHostAnswer
                  ? 'bg-gradient-to-br from-amber-50/60 to-orange-50/30 border-amber-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              {/* ステータスバッジ & 名前 */}
              <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {peerName} さん
                  </span>
                </div>

                {isMutual && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300">
                    <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                    <span>相互評価が成立（両思い）</span>
                  </span>
                )}

                {isNeedHostAnswer && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>あなたからの逆評価待ち</span>
                  </span>
                )}

                {isWaitingPeerCreate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                    <span>相手の診断作成待ち</span>
                  </span>
                )}
              </div>

              {/* 関係ビジュアル図 (A ⇄ B または A ➔ B) */}
              <div className="py-3 px-3 my-2.5 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between text-xs">
                {/* 左：あなた */}
                <div className="flex flex-col items-center gap-0.5 flex-1 text-center">
                  <span className="text-[10px] text-slate-400 font-bold">あなた</span>
                  <span className="font-black text-slate-800 truncate max-w-[90px]">
                    {hostNickname}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                    {isMutual ? '評価済 ✓' : 'ホスト'}
                  </span>
                </div>

                {/* 中央：矢印と関係ステータス */}
                <div className="flex flex-col items-center justify-center px-2 flex-1 text-center">
                  {isMutual ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-emerald-600">
                        <ArrowLeftRight className="w-4 h-4 animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 whitespace-nowrap">
                        お互いに評価済
                      </span>
                    </div>
                  ) : isNeedHostAnswer ? (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-sm">
                        <span>◀━━</span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-700 whitespace-nowrap">
                        片方向（回答待ち）
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-sm">
                        <span>◀┈┈</span>
                      </div>
                      <span className="text-[9px] text-slate-500 whitespace-nowrap">
                        片方向（診断待ち）
                      </span>
                    </div>
                  )}
                </div>

                {/* 右：相手 */}
                <div className="flex flex-col items-center gap-0.5 flex-1 text-center">
                  <span className="text-[10px] text-slate-400 font-bold">友人</span>
                  <span className="font-black text-slate-800 truncate max-w-[90px]">
                    {peerName}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                    評価済 ✓
                  </span>
                </div>
              </div>

              {/* コメントがあれば表示 */}
              {item.comment && (
                <div className="text-xs text-slate-600 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/60 mb-2 italic">
                  「{item.comment}」
                </div>
              )}

              {/* アクションボタン */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                {isMutual && (
                  <>
                    <Link
                      href={`/result/${info.sessionId}`}
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>{peerName} さんの診断結果を見る</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <a
                      href="#pair-card"
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors ml-auto"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>2人の相性カルテ</span>
                    </a>
                  </>
                )}

                {isNeedHostAnswer && (
                  <>
                    <Link
                      href={`/answer/${info.sessionId}`}
                      className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-xs transition-all hover:scale-[1.01]"
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{peerName} さんを逆評価して相互成立させる（1分）</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <a
                      href="#pair-card"
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors ml-auto"
                    >
                      <span>相性カルテ</span>
                    </a>
                  </>
                )}

                {isWaitingPeerCreate && (
                  <>
                    <a
                      href={lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>LINEで{peerName}さんに診断をおねだり</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyInvite(peerName)}
                      className="inline-flex items-center gap-1 py-2 px-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">おねだり文コピー済</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-500" />
                          <span>依頼文コピー</span>
                        </>
                      )}
                    </button>

                    <a
                      href="#pair-card"
                      className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors ml-auto"
                    >
                      <span>相性カルテ</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3名以上の時の折り畳み / 展開ボタン */}
      {uniquePeers.length > 2 && (
        <button
          type="button"
          onClick={() => setIsOpenAll(!isOpenAll)}
          className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          {isOpenAll ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>関係マップを折りたたむ（主要2名のみ表示）</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>全 {uniquePeers.length} 名の関係をすべて見る（残り {hiddenCount} 名を展開）</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
