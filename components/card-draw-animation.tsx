"use client"

import { useEffect, useState } from "react"

export function CardDrawAnimation() {
  const [cards, setCards] = useState<number[]>([])

  useEffect(() => {
    // 创建多张卡牌的扇形排列
    const cardArray = Array.from({ length: 7 }, (_, i) => i)
    setCards(cardArray)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
      {/* 背景星光效果 */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 卡牌扇形排列 */}
      <div className="relative w-full max-w-md h-96 flex items-center justify-center">
        {cards.map((card, index) => {
          const totalCards = cards.length
          const angle = (index - (totalCards - 1) / 2) * 15 // 每张卡片间隔15度
          const delay = index * 0.1

          return (
            <div
              key={card}
              className="absolute w-32 h-48 transition-all duration-700"
              style={{
                transform: `rotate(${angle}deg) translateY(-20px)`,
                animationDelay: `${delay}s`,
                zIndex: index === Math.floor(totalCards / 2) ? 10 : 1,
              }}
            >
              <div className="w-full h-full bg-card border-2 border-primary/30 rounded-lg shadow-2xl shimmer relative overflow-hidden">
                {/* 卡背图案 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary/50 rounded-full" />
                  <div className="absolute w-16 h-16 border-2 border-secondary/50 rounded-full" />
                  <div className="absolute w-12 h-12 border-2 border-accent/50 rounded-full" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 提示文字 */}
      <div className="absolute bottom-20 text-center">
        <p className="text-lg text-muted-foreground animate-pulse">{"正在为你抽取塔罗牌..."}</p>
      </div>
    </div>
  )
}
