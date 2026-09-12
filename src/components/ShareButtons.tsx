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

      let shared = false;
      // iOS Safari / Android Chrome での写真保存・共有シート
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${hostNickname}さんの性格ギャップ診断結果`,
            text: `私の診断結果は【${resultTitle || ''}】でした！ #GAPFIVE`,
          });
          shared = true;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') {
            return;
          }
          console.warn('Web Share API failed, falling back to direct download:', shareErr);
        }
      }

      if (!shared) {
        // PC・非対応ブラウザ・共有失敗時のダウンロード
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

  // 相手別ニックネーム使い分けステート
  const [customAlias, setCustomAlias] = useState('');
  const [showAliasInput, setShowAliasInput] = useState(false);

  const effectiveName = customAlias.trim() || hostNickname;
  const currentShareUrl = customAlias.trim()
    ? `${shareUrl}${shareUrl.includes('?') ? '&' : '?'}as=${encodeURIComponent(customAlias.trim())}`
    : shareUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // フォールバック
      const textarea = document.createElement('textarea');
      textarea.value = currentShareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // メッセージの作成（誠実で安心感があり、メリットが伝わる表現）
  const inviteText = `【${effectiveName}の性格診断のお願い】\n周りから見た私の印象を教えてもらえると嬉しいです！\n\n登録などは一切なく、すぐ始められて2分くらいで終わる簡単なアンケートです（月額課金などのサービスもありません）。\n\n回答が終わると、私とあなたとの相性診断やコミュニケーションのヒントもすぐに見られます！\n${currentShareUrl}`;
  const resultText = isResult
    ? `【自称と実態のギャップ診断】\n私の診断結果は「${resultTitle || ''}」でした！\nみんなの目から見た私はどう見えてる？\n${currentShareUrl} #GAPFIVE`
    : inviteText;

  // LINE共有URL
  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(resultText)}`;

  // X (Twitter) 共有URL
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(resultText)}`;

  return (
    <div className="space-y-3">
      {/* ニックネーム使い分け（エイリアス）切り替えボタン＆パネル */}
      {!isResult && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>相手に見せる表示名：</span>
              <strong className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {effectiveName}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setShowAliasInput(!showAliasInput)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {showAliasInput ? '閉じる' : '相手ごとに名前を変える'}
            </button>
          </div>

          {showAliasInput && (
            <div className="pt-2 border-t border-slate-200 space-y-2 animate-fadeIn">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                職場の上司、学生時代の友人、SNSなど、<strong>送る相手によって呼ばれ方を変えたい場合</strong>はここで設定できます（あなたの管理名自体は非公開のまま保持されます）。
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={15}
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder={`例: ${hostNickname}くん、山田、たっちゃん`}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {customAlias && (
                  <button
                    type="button"
                    onClick={() => setCustomAlias('')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold transition-colors"
                  >
                    リセット
                  </button>
                )}
              </div>

              {/* クイックサジェスト */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold">サジェスト例:</span>
                {[`${hostNickname}さん`, `${hostNickname}くん`, `${hostNickname}先輩`, `${hostNickname}ちゃん`].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setCustomAlias(sug)}
                    className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 px-2 py-0.5 rounded-md transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200">
        <input
          type="text"
          readOnly
          value={currentShareUrl}
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
