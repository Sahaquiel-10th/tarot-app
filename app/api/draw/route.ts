// app/api/draw/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const apiUrl = 'https://api.cn.reai.com/app/blocks/api/dbf5acb1241645f58b4a6/run';
  const apiKey = process.env.WAINAO_API_KEY;

  console.log("✅ Key 前缀:", apiKey?.slice(0, 8));
  console.log("✅ 调用的 API 地址:", apiUrl);

  if (!apiKey) {
    return NextResponse.json({ error: '缺少 API Key' }, { status: 500 });
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { trigger: "auto" },
        version: "^1.0.0"
      }),
      cache: 'no-store',
    });

    const text = await res.text();
    console.log("🧩 API 原始返回内容:", text);

    if (!res.ok) {
      return NextResponse.json({ error: 'API 调用失败', detail: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (err: any) {
    console.error('❌ Fetch error:', err);
    return NextResponse.json({ error: '请求异常', detail: err.message }, { status: 500 });
  }
}