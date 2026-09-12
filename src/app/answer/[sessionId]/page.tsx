import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSession } from '@/lib/actions/session';
import { AnswerForm } from '@/components/AnswerForm';

interface AnswerPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function generateMetadata({ params }: AnswerPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    return {
      title: '性格診断に協力してください | GAP-FIVE',
    };
  }

  const title = `${session.host_nickname} さんの性格診断に協力してください！ | GAP-FIVE`;
  const description = `あなたの目から見た${session.host_nickname}さんはどんな人？完全匿名・1分で回答できます。`;
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

export default async function AnswerPage({ params }: AnswerPageProps) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <AnswerForm session={session} />
      </div>
    </div>
  );
}