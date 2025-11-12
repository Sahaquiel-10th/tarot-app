// app/api/draw/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MAX_DAILY_REQUESTS = 50;
const RATE_LIMIT_MESSAGE = '今日窥探命运次数太多了，窥探之眼已紧闭';
const RATE_LIMIT_TIMEZONE = 'Asia/Shanghai';

type UsageRecord = { count: number; resetAt: number };
const ipUsage = new Map<string, UsageRecord>();

const getClientIp = (request: NextRequest) => {
  const candidates = [
    'x-real-ip',
    'x-vercel-forwarded-for',
    'cf-connecting-ip',
    'x-forwarded-for',
    'x-client-ip',
  ];

  for (const header of candidates) {
    const value = request.headers.get(header);
    if (value) {
      return header === 'x-forwarded-for'
        ? value.split(',')[0]?.trim() ?? ''
        : value.trim();
    }
  }

  return request.ip ?? '';
};

const nextMidnightMs = (tz = RATE_LIMIT_TIMEZONE) => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts = formatter.formatToParts(now).reduce<Record<string, number>>((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = Number(part.value);
    }
    return acc;
  }, {});

  const year = parts.year ?? now.getUTCFullYear();
  const month = parts.month ? parts.month - 1 : now.getUTCMonth();
  const day = parts.day ?? now.getUTCDate();
  const hour = parts.hour ?? 0;
  const minute = parts.minute ?? 0;
  const second = parts.second ?? 0;

  const zonedNowUtc = Date.UTC(year, month, day, hour, minute, second);
  const offset = zonedNowUtc - now.getTime();
  const nextMidnightUtc = Date.UTC(year, month, day + 1, 0, 0, 0);
  return nextMidnightUtc - offset;
};

const canInvoke = (ip: string) => {
  if (!ip) {
    return { allowed: true, remaining: MAX_DAILY_REQUESTS, resetAfterMs: 0 };
  }

  const now = Date.now();
  let record = ipUsage.get(ip);

  if (!record || now >= record.resetAt) {
    record = { count: 1, resetAt: nextMidnightMs() };
    ipUsage.set(ip, record);
    return {
      allowed: true,
      remaining: MAX_DAILY_REQUESTS - record.count,
      resetAfterMs: record.resetAt - now,
    };
  }

  if (record.count >= MAX_DAILY_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAfterMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: MAX_DAILY_REQUESTS - record.count,
    resetAfterMs: Math.max(0, record.resetAt - now),
  };
};

export async function POST(request: NextRequest) {
  const apiUrl = 'https://api.cn.reai.com/app/blocks/api/5fe50a3798b84e6b87836/run';
  const apiKey = process.env.WAINAO_API_KEY;
  const clientIp = getClientIp(request);

  const verdict = canInvoke(clientIp);

  if (!verdict.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil(verdict.resetAfterMs / 1000));
    return new NextResponse(
      JSON.stringify({
        error: RATE_LIMIT_MESSAGE,
        nextRetryMs: verdict.resetAfterMs,
        remaining: verdict.remaining,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSeconds),
        },
      }
    );
  }

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
