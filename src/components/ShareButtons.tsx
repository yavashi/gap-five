'use client';

import React, { useState } from 'react';
import { Copy, Check, Share2, Download, Loader2, MessageSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import { SELF_VISUAL_MAP } from './GapVisualCard';

interface ShareButtonsProps {
  shareUrl: string;
  hostNickname: string;
  isResult?: boolean;
  resultTitle?: string;
  sessionId?: string;
  selfLabel?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  shareUrl,
  hostNickname,
  isResult = false,
  resultTitle,
  sessionId,
  selfLabel,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [isSavingSelfImage, setIsSavingSelfImage] = useState(false);

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

  // 自認イラストデータの取得
  const selfData = selfLabel ? (SELF_VISUAL_MAP[selfLabel] || SELF_VISUAL_MAP['変幻自在のバランサー']) : null;

  const handleSaveSelfImage = async () => {
    if (!selfData) return;
    setIsSavingSelfImage(true);
    try {
      const res = await fetch(selfData.img);
      if (!res.ok) throw new Error('画像の取得に失敗しました');
      const blob = await res.blob();
      const fileName = `gap-five-self-${effectiveName}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      let shared = false;
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `${effectiveName}の自認診断`,
            text: `私の自称ラベルは「${selfLabel}」でした！私の印象を教えてね！ #GAPFIVE`,
          });
          shared = true;
        } catch (shareErr: any) {
          if (shareErr.name === 'AbortError') return;
        }
      }

      if (!shared) {
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
        alert('画像の保存に失敗しました。画像長押しまたは右クリックで保存してください。');
      }
    } finally {
      setIsSavingSelfImage(false);
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

  // メッセージの作成（自認ラベルと解説を盛り込んだ親しみやすく回答しやすい例文）
  const inviteText = selfLabel
    ? `【${effectiveName}の性格診断のお願い🙏】\n` +
      `自分と周りの印象の「ギャップ」を調べる性格診断をやってみたよ！\n` +
      `私の自称ラベルは『${selfLabel}』でした✨\n` +
      (selfData ? `（自認：「${selfData.desc}」）\n\n` : '\n') +
      `でも、みんなから見たら本当はどう見えてる…？\n` +
      `1分（10問）で終わるから、直感で採点してみてほしい！\n` +
      `※会員登録なし・完全匿名集計です\n\n` +
      `👇回答はこちらから（私との相性診断もすぐ見られます）\n` +
      `${currentShareUrl}`
    : `【${effectiveName}の性格診断のお願い🙏】\n` +
      `周りから見た私の印象を教えてもらえると嬉しいです！\n\n` +
      `登録などは一切なく、すぐ始められて1〜2分で終わる簡単なアンケートです（完全匿名）。\n\n` +
      `回答が終わると、私とあなたとの相性診断もすぐに見られます！\n` +
      `${currentShareUrl}`;

  const resultText = isResult
    ? `【自称と実態のギャップ診断】\n私の診断結果は「${resultTitle || ''}」でした！\nみんなの目から見た私はどう見えてる？\n${currentShareUrl} #GAPFIVE`
    : inviteText;

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = resultText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

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

      {/* メッセージ例文プレビュー＆コピーカード */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>LINE送信用メッセージ（例文）</span>
          </span>
          <button
            type="button"
            onClick={handleCopyMessage}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-all active:scale-95"
          >
            {copiedMsg ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>コピー完了！</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>全文コピー</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 bg-white rounded-xl border border-blue-100 text-xs text-slate-700 font-sans leading-relaxed whitespace-pre-line select-all max-h-36 overflow-y-auto">
          {resultText}
        </div>

        <p className="text-[10px] text-slate-500 leading-tight">
          💡「LINEで送る」ボタンを押しても入力欄が空欄だった場合は、上の<strong>「全文コピー」</strong>を押してLINEのトーク画面に貼り付けてください。
        </p>
      </div>

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

      {/* 自己診断直後：自認イラストの保存＆送信ボタン */}
      {!isResult && selfData && (
        <div className="pt-1">
          <button
            type="button"
            onClick={handleSaveSelfImage}
            disabled={isSavingSelfImage}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
          >
            {isSavingSelfImage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>画像を準備中...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>自認イラスト画像を保存（LINEに一緒に送ると効果的！）</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-1">
            ※画像を保存してLINEトークにメッセージと一緒に送ると、友人が興味を持ってすぐ回答してくれます。
          </p>
        </div>
      )}

      {/* 結果確定後：結果カード保存ボタン */}
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