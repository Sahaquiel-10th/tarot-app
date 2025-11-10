"use client"

import { useState, useEffect } from "react"
import { CardDrawAnimation } from "@/components/card-draw-animation"
import { TarotCardDisplay } from "@/components/tarot-card-display"
import { ChatInterface } from "@/components/chat-interface"

// ✅ basePath 全局常量
const BASE_PATH = "/tarot"

export default function TarotPage() {
  const [stage, setStage] = useState<"drawing" | "display">("drawing")
  const [tarotData, setTarotData] = useState<{
    cardName: string
    cardImage: string
    interpretation: string
    isReversed: boolean
  } | null>(null)

  useEffect(() => {
    async function fetchTarotData() {
      try {
        setStage("drawing")

        const res = await fetch(`${BASE_PATH}/api/draw`, { method: "POST" })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        // 提取卡牌信息
        const extractCard = (obj: any): any => {
          if (!obj || typeof obj !== "object") return null
          if (
            typeof obj.cardIndex === "number" &&
            typeof obj.cardName === "string" &&
            typeof obj.isReversed === "boolean"
          ) return obj
          for (const k in obj) {
            const found = extractCard(obj[k])
            if (found) return found
          }
          return null
        }

        // 提取解牌文本
        const extractAnswer = (obj: any): string | null => {
          if (!obj || typeof obj !== "object") return null
          if (typeof obj.content === "string" && obj.content.trim()) return obj.content
          for (const k in obj) {
            const found = extractAnswer(obj[k])
            if (found) return found
          }
          return null
        }

        const card = extractCard(data)
        const answer = extractAnswer(data)

        setTarotData({
          cardName: card?.cardName || "未知塔罗",
          // ✅ 加上 basePath，修复图裂问题
          cardImage: `${BASE_PATH}/RWS_Tarot_${card?.cardIndex ?? 0}.jpg`,
          interpretation: answer || "（暂无解牌文本）",
          isReversed: card?.isReversed ?? false,
        })

        setStage("display")
      } catch (e) {
        console.error("❌ API 调用失败:", e)
        setTarotData({
          cardName: "调用失败",
          cardImage: `${BASE_PATH}/placeholder.jpg`, // ✅ 这里也加上 basePath
          interpretation: "无法连接智能体，请稍后重试。",
          isReversed: false,
        })
        setStage("display")
      }
    }

    fetchTarotData()
  }, [])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center">
      {stage === "drawing" && <CardDrawAnimation />}
      {stage === "display" && tarotData && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <TarotCardDisplay
            cardName={tarotData.cardName}
            cardImage={tarotData.cardImage}
            interpretation={tarotData.interpretation}
            isReversed={tarotData.isReversed}
          />

          <ChatInterface tarotContent={tarotData.interpretation} />
        </div>
      )}
    </main>
  )
}