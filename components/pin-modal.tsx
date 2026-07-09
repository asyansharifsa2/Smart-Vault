"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatedButton } from "./animated-button"
import { InteractiveIcon } from "./interactive-icon"
import { Fingerprint, X, Check, Calculator } from "lucide-react"

interface PinModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (pin: string) => void
  onBiometric?: () => void
  title: string
  description: string
  showBiometric?: boolean
  showForgotPin?: boolean
  onForgotPin?: () => void
  error?: boolean
}

export function PinModal({
  isOpen,
  onClose,
  onSubmit,
  onBiometric,
  title,
  description,
  showBiometric = true,
  showForgotPin = true,
  onForgotPin,
  error
}: PinModalProps) {
  const [pin, setPin] = useState("")

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className={cn(
          "w-[90%] max-w-sm rounded-3xl bg-card/90 backdrop-blur-xl border border-border/50 p-6",
          "shadow-[0_0_60px_oklch(0.65_0.18_180_/_0.15)]",
          "animate-in fade-in-0 zoom-in-95 duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {showBiometric && onBiometric && (
          <button
            onClick={onBiometric}
            className={cn(
              "mb-4 w-full rounded-xl border border-border/50 bg-secondary/50 p-4",
              "flex items-center justify-center gap-3",
              "text-foreground transition-all",
              "hover:border-primary/30 hover:bg-secondary/80"
            )}
          >
            <InteractiveIcon size="sm" glowColor="oklch(0.65 0.18 180)">
              <span>👆</span>
            </InteractiveIcon>
            <span className="font-medium">Sidik Jari / Face ID</span>
          </button>
        )}

        <div className="relative mb-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
            className={cn(
              "w-full rounded-xl border bg-secondary/50 p-4 text-center text-2xl font-bold tracking-[0.5em]",
              "placeholder:tracking-[0.3em] placeholder:text-muted-foreground/50",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              error && "animate-shake border-destructive text-destructive"
            )}
          />
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <AnimatedButton 
              variant="secondary" 
              size="sm" 
              onClick={onClose}
              className="flex-[0.4]"
            >
              Batal
            </AnimatedButton>
            <AnimatedButton 
              variant="primary" 
              size="sm" 
              onClick={() => {
                onSubmit(pin)
                setPin("")
              }}
              className="flex-[0.6]"
            >
              OK
            </AnimatedButton>
          </div>
          
          {showForgotPin && onForgotPin && (
            <button 
              onClick={onForgotPin}
              className="text-sm text-primary hover:underline"
            >
              Lupa PIN?
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface MathModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (answer: string) => void
  error?: boolean
}

export function MathModal({ isOpen, onClose, onSubmit, error }: MathModalProps) {
  const [answer, setAnswer] = useState("")

  if (!isOpen) return null

  const insertSquareRoot = () => {
    setAnswer((prev) => prev + "√")
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className={cn(
          "w-[90%] max-w-sm rounded-3xl bg-card/90 backdrop-blur-xl border border-border/50 p-6",
          "shadow-[0_0_60px_oklch(0.65_0.18_180_/_0.15)]",
          "animate-in fade-in-0 zoom-in-95 duration-300"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-xl font-bold text-foreground">Ujian Matematika</h3>
          <p className="text-sm text-muted-foreground">
            Luas daerah antara kurva:
            <br />
            <span className="font-mono font-semibold text-foreground">f(x) = 2x² - 4x + 1</span>
            <br />
            <span className="font-mono font-semibold text-foreground">g(x) = -x² + 2x + 4</span>
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Jawaban"
            className={cn(
              "flex-1 rounded-xl border bg-secondary/50 p-4 text-center text-lg font-mono",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              error && "animate-shake border-destructive"
            )}
          />
          <button
            onClick={insertSquareRoot}
            className="rounded-xl border bg-secondary/80 px-4 text-xl font-bold transition-all hover:bg-secondary"
          >
            √
          </button>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
        `}</style>

        <div className="flex gap-3">
          <AnimatedButton variant="secondary" size="sm" onClick={onClose} className="flex-[0.4]">
            Batal
          </AnimatedButton>
          <AnimatedButton
            variant="primary"
            size="sm"
            onClick={() => {
              onSubmit(answer)
              setAnswer("")
            }}
            className="flex-[0.6]"
          >
            OK
          </AnimatedButton>
        </div>
      </div>
    </div>
  )
}
