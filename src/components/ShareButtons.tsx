'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface ShareButtonsProps {
  shareUrl: string;
  hostNickname: string;
  isResult?: boolean;
  resultTitle?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  shareUrl,
  hostNickname,
  isResult = false,
  resultTitle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // フォールバック
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // メッセージの作成
  const inviteText = `${hostNickname}さんの性格診断に協力してください！\nあなたの目から見た${hostNickname}さんはどんな人？（所要時間1分・完全匿名）\n${shareUrl}`;
  const resultText = isResult
    ? `【自称と実態のギャップ診断】\n私の診断結果は「${resultTitle || ''}」でした！\nみんなの目から見た私はどう見えてる？\n${shareUrl} #GAPFIVE`
    : inviteText;

  // LINE共有URL
  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(resultText)}`;

  // X (Twitter) 共有URL
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="bg-transparent flex-1 text-xs text-slate-600 px-2 outline-none font-mono select-all truncate"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>URLコピー</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-sm shadow-sm transition-all"
        >
          <span>LINEで送る</span>
        </a>
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all"
        >
          <span>Xでシェア</span>
        </a>
      </div>
    </div>
  );
};