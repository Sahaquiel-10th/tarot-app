"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface TarotCardDisplayProps {
  cardName: string
  cardImage: string
  interpretation: string
  isReversed?: boolean
}

export function TarotCardDisplay({
  cardName,
  cardImage,
  interpretation,
  isReversed = false,
}: TarotCardDisplayProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-wide">{cardName}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
      </div>

      {/* 卡面展示区域 */}
      <div className="card-draw mb-6 flex justify-center">
        <Card className="w-[16rem] h-[28.4rem] bg-card border-2 border-primary/30 shadow-2xl overflow-hidden flex items-center justify-center">
          <div
            className="transition-transform duration-700 ease-in-out flex items-center justify-center"
            style={{
              transform: isReversed ? "rotate(180deg)" : "none",
              transformOrigin: "center center",
            }}
          >
            <Image
              src={cardImage || "/placeholder.svg"}
              alt={cardName}
              width={1100 / 5}   // 保持原图比例缩放
              height={1920 / 5}  // 高度比例匹配
              className="rounded-md object-contain select-none"
              priority
            />
          </div>
        </Card>
      </div>

      {/* 解牌文字 */}
      <div className="max-w-2xl w-full text-center space-y-4 px-6 mb-8">
        <p className="text-foreground leading-relaxed text-balance text-base whitespace-pre-wrap">
          {interpretation}
        </p>
      </div>

      {/* 向下滑动提示 */}
      <div className="flex-1 flex flex-col justify-end pb-8">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <p className="text-sm text-muted-foreground">{"向下滑动继续探索"}</p>
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}