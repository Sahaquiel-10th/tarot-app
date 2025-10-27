"use client"

import { useState, useEffect } from "react"
import { CardDrawAnimation } from "@/components/card-draw-animation"
import { TarotCardDisplay } from "@/components/tarot-card-display"
import { ChatInterface } from "@/components/chat-interface"

export default function TarotPage() {
  const [stage, setStage] = useState<"drawing" | "display">("drawing")
  const [tarotData, setTarotData] = useState<{
    cardName: string
    cardImage: string
    interpretation: string
  } | null>(null)

  useEffect(() => {
    async function fetchTarotData() {
      try {
        const res = await fetch("/api/draw", { method: "POST" })
        const data = await res.json()
        // 假设智能体返回结构包含 interpretation 字段
        setTarotData({
          cardName: data.cardName || "未知塔罗",
          cardImage: "/tarot-card-the-fool-mystical-design.jpg",
          interpretation: data.interpretation || JSON.stringify(data, null, 2),
        })
        setStage("display")
      } catch (err) {
        console.error("API 调用失败:", err)
        setTarotData({
          cardName: "调用失败",
          cardImage: "/tarot-card-the-fool-mystical-design.jpg",
          interpretation: "无法连接智能体，请稍后重试。",
        })
        setStage("display")
      }
    }

    fetchTarotData()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {stage === "drawing" && <CardDrawAnimation />}
      {stage === "display" && tarotData && (
        <div className="flex flex-col">
          <TarotCardDisplay
            cardName={tarotData.cardName}
            cardImage={tarotData.cardImage}
            interpretation={tarotData.interpretation}
          />
          <ChatInterface />
        </div>
      )}
    </main>
  )
}
