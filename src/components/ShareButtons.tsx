'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, Download, Loader2 } from 'lucide-react';

interface ShareButtonsProps {
  shareUrl: string;
  hostNickname: string;
  isResult?: boolean;
  resultTitle?: string;
  sessionId?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  shareUrl,
  hostNickname,
  isResult = false,
  resultTitle,
  sessionId,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const handleSaveImage = async () => {
    if (!sessionId) return;
    setIsSavingImage(true);
    try {
      const ogUrl = `/api/og/${sessionId}?v=${Date.now()}`;
      const res = await fetch(ogUrl);
      if (!res.ok) throw new Error('画像の生成に失敗しました');
      const blob = await res.blob();
      const fileName = `gap-five-${hostNickname}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // iOS Safari / Android Chrome での写真保存・共有シート
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${hostNickname}さんの性格ギャップ診断結果`,
          text: `私の診断結果は【${resultTitle || ''}】でした！ #GAPFIVE`,
        });
      } else {
        // PC・非対応ブラウザでのダウンロード
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        alert('画像の保存に失敗しました。もう一度お試しいただくか、画面のスクリーンショットをご利用ください。');
      }
    } finally {
      setIsSavingImage(false);
    }
  };

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

      {isResult && sessionId && (
        <button
          type="button"
          onClick={handleSaveImage}
          disabled={isSavingImage}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
        >
          {isSavingImage ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>カード画像を作成中...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>結果画像を保存（写真アプリ / 端末へ保存）</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
