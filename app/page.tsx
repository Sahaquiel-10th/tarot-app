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
    // 模拟抽卡动画完成后获取数据
    const timer = setTimeout(() => {
      // 这里应该调用你的API获取真实数据
      // 示例数据
      setTarotData({
        cardName: "愚者",
        cardImage: "/tarot-card-the-fool-mystical-design.jpg",
        interpretation:
          "愚者代表新的开始、纯真和冒险精神。这张牌鼓励你以开放的心态迎接未知，相信直觉，勇敢地踏上新的旅程。",
      })
      setStage("display")
    }, 2500)

    return () => clearTimeout(timer)
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
