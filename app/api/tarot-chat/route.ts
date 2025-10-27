// app/api/tarot-chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { content, user_ask } = await req.json();

    // 打印入参方便调试
    console.log("🛰️ /api/tarot-chat 入参:", {
      contentPreview: typeof content === "string" ? content.slice(0, 40) : typeof content,
      user_ask,
    });

    const apiUrl = "https://api.cn.reai.com/app/blocks/api/60f7a35981fc4d8fbe571/run";
    const apiKey = process.env.WAINAO_API_KEY;

    if (!apiKey) {
      console.error("❌ 缺少 WAINAO_API_KEY");
      return NextResponse.json(
        { assistant_answer: "（缺少后端密钥）" },
        { status: 500 }
      );
    }

    // 调用智能体 API
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: { content, user_ask },
        version: "^0.2.0",
      }),
      cache: "no-store",
    });

    const rawText = await res.text();
    console.log("📦 对话智能体原始返回:", rawText.slice(0, 500));

    if (!res.ok) {
      console.error("❌ 上游接口错误:", res.status, rawText);
      return NextResponse.json(
        { assistant_answer: "（上游智能体短暂失语，请稍后再试。）" },
        { status: 502 }
      );
    }

    // 尝试解析 JSON
    let data: any = null;
    try {
      data = JSON.parse(rawText);
      // 👇 加这一行，用于查看 data.data 的实际结构
      console.log("🧠 data.data 部分预览:", JSON.stringify(data.data, null, 2).slice(0, 500));
    } catch (e) {
      console.error("❌ 返回不是合法 JSON:", e);
      return NextResponse.json(
        { assistant_answer: "（返回格式异常，请稍后再试。）" },
        { status: 502 }
      );
    }

    // 工具函数：在任意层级中提取字符串字段
    const pickString = (obj: any, key: string): string | null => {
      if (!obj || typeof obj !== "object") return null;
      if (key in obj && typeof obj[key] === "string" && obj[key].trim()) return obj[key];
      for (const k of Object.keys(obj)) {
        const found = pickString(obj[k], key);
        if (found) return found;
      }
      return null;
    };

    // 更鲁棒的多路径提取逻辑
    let answer =
      pickString(data, "assistant_answer") ??
      pickString(data, "content") ??
      pickString(data, "text") ??
      pickString(data, "text_1") ??
      pickString(data?.data, "outputText") ??
      pickString(data?.data, "text_1") ??
      pickString(data?.data?.outputJSON, "text_1") ??
      pickString(data?.data?.result?.[0], "textJSON") ??
      pickString(data?.data?.result?.[0], "text_1");

    console.log("🧩 提取到的回答预览:", answer?.slice?.(0, 100));

    if (!answer) {
      return NextResponse.json(
        {
          assistant_answer: "（命运暂时沉默了……）",
          __debug: {
            keysTopLevel: Object.keys(data ?? {}),
            keysData: Object.keys(data?.data ?? {}),
            hasOutputJSON: !!data?.data?.outputJSON,
            hasResult: !!data?.data?.result,
          },
        },
        { status: 200 }
      );
    }

    // 前端统一字段 assistant_answer
    return NextResponse.json({ assistant_answer: answer }, { status: 200 });
  } catch (error) {
    console.error("❌ /api/tarot-chat 异常:", error);
    return NextResponse.json(
      { assistant_answer: "（与命运的连接被打断，请稍后再试。）" },
      { status: 500 }
    );
  }
}