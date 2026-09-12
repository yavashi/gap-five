import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { getSession, isHostOfSession } from '@/lib/actions/session';
import { AnswerForm } from '@/components/AnswerForm';

interface AnswerPageProps {
  params: Promise<{
    sessionId: string;
  }>;
  searchParams: Promise<{
    as?: string;
    name?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: AnswerPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const { as, name } = await searchParams;
  const session = await getSession(sessionId);

  if (!session) {
    return {
      title: '性格診断に協力してください | GAP-FIVE',
    };
  }

  const effectiveHostName = (as || name || session.host_nickname).trim();
  const title = `${effectiveHostName} さんの性格診断に協力してください！ | GAP-FIVE`;
  const description = `あなたの目から見た${effectiveHostName}さんはどんな人？完全匿名・1分で回答できます。`;
  const ogImageUrl = `/api/og/${sessionId}?v=0`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function AnswerPage({ params, searchParams }: AnswerPageProps) {
  const { sessionId } = await params;
  const { as, name } = await searchParams;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const isHost = await isHostOfSession(sessionId);
  const effectiveHostName = (as || name || session.host_nickname).trim();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-4">
        {/* ホスト本人向け案内バナー */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 rounded-2xl p-4 border border-amber-200 text-amber-950 space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>
              {isHost
                ? '【作成者ご本人】こちらのページを開いています'
                : `あなたが「${effectiveHostName}」さんご本人ですか？`}
            </span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            友達に送ったリンクをご自身で開いた場合は、こちらから回答状況や確定結果を確認できます。
          </p>
          <div className="flex gap-2 pt-1">
            <Link
              href={`/me/${sessionId}`}
              className="flex-1 text-center py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              管理画面（回答状況）へ
            </Link>
            <Link
              href={`/result/${sessionId}`}
              className="flex-1 text-center py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-xs transition-colors"
            >
              確定結果を見る
            </Link>
          </div>
        </div>

        <AnswerForm session={session} customHostName={effectiveHostName} />
      </div>
    </div>
  );
}