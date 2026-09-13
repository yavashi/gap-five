import { redirect } from 'next/navigation';

interface MePageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function MePage({ params }: MePageProps) {
  const { sessionId } = await params;
  redirect(`/result/${sessionId}`);
}
