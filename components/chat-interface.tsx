"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  tarotContent: string; // 从父组件传入的塔罗牌抽牌结果（即 content）
}

export function ChatInterface({ tarotContent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "我能听见你的心声。请向我提出关于这张塔罗牌的问题吧——",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (ended || !input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_PATH}/api/tarot-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: tarotContent,
          user_ask: userMessage.content,
        }),
      });

      const data = await res.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data?.assistant_answer ?? "（命运似乎暂时沉默了……）",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const userAskCount = messages.filter((m) => m.role === "user").length + 1;
      if (userAskCount >= 2) {
        setEnded(true);
        setInput("因为某种隐秘的存在，启示就到这里。你心中已有答案，不是么？");
      }
    } catch (e) {
      console.error("塔罗对话出错：", e);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "（似乎与命运的连接被风打断了，请稍后再试。）",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-2xl space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif text-primary">深入探索</h2>
          <p className="text-sm text-muted-foreground">与塔罗牌对话，获得更多启示</p>
        </div>

        {/* 对话区域 */}
        <Card
          ref={listRef}
          className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* 输入区（新版 Textarea 自动换行） */}
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              disabled={ended}
              onChange={(e) => setInput(e.target.value)}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={ended ? undefined : "输入你的问题...（Shift+Enter换行）"}
              className={`flex-1 bg-card border-primary/30 focus:border-primary resize-none overflow-hidden transition-all duration-200 ease-in-out ${
                ended ? "opacity-70 cursor-not-allowed" : ""
              }`}
              rows={1}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || ended}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 px-6"
          >
            发送
          </Button>
        </div>
      </div>
    </section>
  );
}
