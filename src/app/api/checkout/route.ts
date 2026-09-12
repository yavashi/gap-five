import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, hostNickname } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const origin = req.headers.get('origin') || 'https://gap-five-nine.vercel.app';
    const successUrl = `${origin}/result/${sessionId}?premium=unlocked&paid=true`;
    const cancelUrl = `${origin}/result/${sessionId}`;

    // Stripeのキーが未設定の場合は、シミュレーションモードとして即時成功URLを返す
    if (!stripeKey) {
      console.log('STRIPE_SECRET_KEY not found. Running in simulation mode.');
      return NextResponse.json({ url: successUrl });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `GAP-FIVE 深層心理トリセツ完全版（${hostNickname || 'あなた'}編）`,
              description: '仕事・キャリア適性、恋愛の地雷と最高の相性、ストレス処方箋の3大深層分析レポート',
            },
            unit_amount: 300, // 300円
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        sessionId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message || '決済の開始に失敗しました' }, { status: 500 });
  }
}
