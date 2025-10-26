"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我可以帮你解答关于这张塔罗牌的任何问题，或者为你提供更深入的指引。",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 这里应该调用你的API
    // 示例：模拟API响应
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: "这是一个示例回复。请将此处替换为你的API调用。",
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-2xl space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif text-primary">{"深入探索"}</h2>
          <p className="text-sm text-muted-foreground">{"与塔罗牌对话，获得更多启示"}</p>
        </div>

        {/* 对话区域 */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 p-6 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* 输入区域 */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 bg-card border-primary/30 focus:border-primary"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {"发送"}
          </Button>
        </div>
      </div>
    </section>
  )
}
