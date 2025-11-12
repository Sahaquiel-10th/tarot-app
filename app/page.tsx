"use client"

import { useState, useEffect } from "react"
import { CardDrawAnimation } from "@/components/card-draw-animation"
import { TarotCardDisplay } from "@/components/tarot-card-display"
import { ChatInterface } from "@/components/chat-interface"

const LIMIT_FALLBACK_MESSAGE = "今日窥探命运次数太多了，窥探之眼已紧闭"
const formatLimitMessage = (message: string) =>
  message.includes("\n") ? message : message.replace("，", ",\n")

const formatCountdown = (ms?: number | null) => {
  const safeMs = typeof ms === "number" && ms > 0 ? ms : 0
  const totalSeconds = Math.floor(safeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value: number) => value.toString().padStart(2, "0")
  return `${pad(hours)}小时${pad(minutes)}分钟${pad(seconds)}秒`
}

export default function TarotPage() {
  const [stage, setStage] = useState<"drawing" | "display" | "limited">("drawing")
  const [tarotData, setTarotData] = useState<{
    cardName: string
    cardImage: string
    interpretation: string
    isReversed: boolean
  } | null>(null)
  const [limitMessage, setLimitMessage] = useState<string | null>(null)
  const [limitCountdown, setLimitCountdown] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTarotData() {
      try {
        setLimitMessage(null)
        setLimitCountdown(null)
        setStage("drawing")
        const res = await fetch("/api/draw", { method: "POST" })

        if (res.status === 429) {
          const data = await res.json().catch(() => ({}))
          const rawMessage = data?.error || LIMIT_FALLBACK_MESSAGE
          setLimitMessage(formatLimitMessage(rawMessage))
          setLimitCountdown(
            formatCountdown(typeof data?.nextRetryMs === "number" ? data.nextRetryMs : null)
          )
          setStage("limited")
          return
        }

        if (!res.ok) {
          throw new Error("API 请求失败")
        }

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
          cardImage: `/RWS_Tarot_${card?.cardIndex ?? 0}.jpg`, // 从 public 根目录读取
          interpretation: answer || "（暂无解牌文本）",
          isReversed: card?.isReversed ?? false,
        })

        setStage("display") // API 返回后切换到展示阶段
      } catch (e) {
        console.error("API 调用失败:", e)
        setTarotData({
          cardName: "调用失败",
          cardImage: "/placeholder.jpg",
          interpretation: "无法连接智能体，请稍后重试。",
          isReversed: false,
        })
        setStage("display")
      }
    }

    fetchTarotData()
  }, [])

  return (
    <main className="relative min-h-screen bg-background flex flex-col items-center justify-center">
      {stage === "drawing" && <CardDrawAnimation />}
      {stage === "display" && tarotData && (
        <div className="flex flex-col items-center justify-center space-y-6">
          <TarotCardDisplay
            cardName={tarotData.cardName}
            cardImage={tarotData.cardImage}
            interpretation={tarotData.interpretation}
            isReversed={tarotData.isReversed}
          />

          {/* ✅ 将完整解牌文本通过 tarotContent prop 传递给 ChatInterface，确保聊天接口使用该内容作为上下文 */}
          <ChatInterface tarotContent={tarotData.interpretation} />
        </div>
      )}
      {stage === "limited" && limitMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center space-y-4">
          <p className="text-foreground/80 text-2xl sm:text-4xl font-semibold leading-relaxed whitespace-pre-line">
            {limitMessage}
          </p>
          <p className="text-foreground/70 text-lg sm:text-2xl">
            距离下次窥探命运，还剩{" "}
            <span className="font-medium text-primary">
              {limitCountdown ?? formatCountdown()}
            </span>
          </p>
        </div>
      )}
    </main>
  )
}
