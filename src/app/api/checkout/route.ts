import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, hostNickname, itemType = 'report', peerNickname } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    const isPair = itemType === 'pair' && peerNickname;
    const origin = req.headers.get('origin') || 'https://gap-five-nine.vercel.app';
    
    const successUrl = isPair
      ? `${origin}/result/${sessionId}?pairUnlocked=${encodeURIComponent(peerNickname)}&paid=true#pair-card`
      : `${origin}/result/${sessionId}?premium=unlocked&paid=true#premium-card`;
      
    const cancelUrl = `${origin}/result/${sessionId}#${isPair ? 'pair-card' : 'premium-card'}`;

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    // Stripeのキーが未設定の場合は、シミュレーションモードとして即時成功URLを返す
    if (!stripeKey) {
      console.log('STRIPE_SECRET_KEY not found. Running in simulation mode for:', itemType);
      return NextResponse.json({ url: successUrl });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const productName = isPair
      ? `GAP-FIVE 個別相性カルテ詳細版（${hostNickname || 'あなた'} × ${peerNickname}）`
      : `GAP-FIVE 深層心理トリセツ完全版（${hostNickname || 'あなた'}編）`;

    const productDesc = isPair
      ? `${peerNickname}さんから見たあなたの魅力、2人が高め合えるポイント、すれ違い地雷と解決策、魔法の会話テーマ詳細解説`
      : '仕事・キャリア適性、恋愛の地雷と絶対条件、公式取扱説明書5箇条、メンタル＆エナジー処方箋の大容量分析レポート';

    const unitAmount = isPair ? 100 : 300; // 個別相性は100円、全体レポートは300円

    const session = await stripe.checkout.sessions.create({
      // payment_method_typesを省略することでStripeの動的決済手段（Dynamic Payment Methods）が有効になり、
      // 端末やブラウザに応じて Apple Pay, Google Pay, PayPay, Link, クレジットカードが自動表示されます
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: productName,
              description: productDesc,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      submit_type: 'pay',
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        sessionId,
        itemType,
        peerNickname: peerNickname || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message || '決済の開始に失敗しました' }, { status: 500 });
  }
}
