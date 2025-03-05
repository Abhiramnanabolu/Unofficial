"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

type LoaderType =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "pulse-dots"
  | "circle-spinner"
  | "bar-progress"
  | "fade-squares"
  | "circular-progress"

type LoaderProps = {
  type: LoaderType
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Loader({ type, className, size = "md" }: LoaderProps) {
  // Map size to dimensions
  const sizeMap = {
    sm: "scale-75",
    md: "",
    lg: "scale-125",
  }

  // Determine which loader to render based on type
  const renderLoader = () => {
    switch (type) {
      case "1":
      case "pulse-dots":
        return <PulseDotsLoader />
      case "2":
      case "circle-spinner":
        return <CircleSpinnerLoader />
      case "3":
      case "bar-progress":
        return <BarProgressLoader />
      case "4":
      case "fade-squares":
        return <FadeSquaresLoader />
      case "5":
      case "circular-progress":
        return <CircularProgressLoader />
      default:
        return <PulseDotsLoader />
    }
  }

  return <div className={cn("flex items-center justify-center", sizeMap[size], className)}>{renderLoader()}</div>
}

// Loader 1: Pulse Dots - Inspired by the forum card design
function PulseDotsLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
      <div className="w-3 h-3 rounded-full bg-green-600 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
      <div className="w-3 h-3 rounded-full bg-amber-600 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
    </div>
  )
}

// Loader 2: Circle Spinner - Clean, minimal spinner with gradient
function CircleSpinnerLoader() {
  return (
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-green-600 border-b-amber-600 border-l-transparent animate-spin"></div>
    </div>
  )
}

// Loader 3: Bar Progress - Horizontal progress bar with animation
function BarProgressLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-600 via-green-600 to-amber-600 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  )
}

// Loader 4: Fade Squares - Grid of squares that fade in and out
function FadeSquaresLoader() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-sm bg-blue-600 opacity-0 animate-pulse"
          style={{
            animationDelay: `${i * 0.1}s`,
            backgroundColor: i % 3 === 0 ? "#2563eb" : i % 3 === 1 ? "#16a34a" : "#d97706",
          }}
        ></div>
      ))}
    </div>
  )
}

// Loader 5: Circular Progress - SVG-based circular progress indicator
function CircularProgressLoader() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 6) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-12 h-12">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray="251.2"
          strokeDashoffset="125.6"
          strokeLinecap="round"
          style={{ transform: `rotate(${rotation}deg)`, transformOrigin: "center" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

