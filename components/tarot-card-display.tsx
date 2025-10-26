"use client"

import { Card } from "@/components/ui/card"
import Image from "next/image"

interface TarotCardDisplayProps {
  cardName: string
  cardImage: string
  interpretation: string
}

export function TarotCardDisplay({ cardName, cardImage, interpretation }: TarotCardDisplayProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-start px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-6 space-y-2">
        <h1 className="text-3xl font-serif text-primary tracking-wide">{cardName}</h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
      </div>

      <div className="card-draw mb-6">
        <Card className="w-56 h-80 bg-card border-2 border-primary/30 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <Image src={cardImage || "/placeholder.svg"} alt={cardName} fill className="object-cover" priority />
        </Card>
      </div>

      <div className="max-w-2xl w-full text-center space-y-4 px-6 mb-8">
        <p className="text-foreground leading-relaxed text-balance text-base">{interpretation}</p>
      </div>

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
