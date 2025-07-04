"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const layerSizes = [25, 20, 20, 10] // Input, Hidden1, Hidden2, Output
const dotSize = 10
const verticalGap = 16
const horizontalGap = 130

type LineID = string // Format: "layerIdx-i-j"

export default function NeuralVisualizer({
  prediction,
  trigger,
}: {
  prediction: number | null
  trigger: boolean
}) {
  const [activeLayer, setActiveLayer] = useState(-1)
  const [showFinal, setShowFinal] = useState(false)
  const [activeLines, setActiveLines] = useState<Set<LineID>>(new Set())

  useEffect(() => {
    if (trigger) {
      setShowFinal(false)
      setActiveLayer(-1)
      const selectedLines = new Set<LineID>()

      // Random lines for hidden layers
      layerSizes.forEach((count, layerIdx) => {
        if (layerIdx === 0 || layerIdx === layerSizes.length - 1) return

        const prevCount = Math.min(layerSizes[layerIdx - 1], 28)
        const currCount = Math.min(count, 28)
        const linesPerLayer = 30

        for (let i = 0; i < linesPerLayer; i++) {
          const randFrom = Math.floor(Math.random() * prevCount)
          const randTo = Math.floor(Math.random() * currCount)
          selectedLines.add(`${layerIdx}-${randTo}-${randFrom}`)
        }
      })

      setActiveLines(selectedLines)

      // Animate each layer step-by-step
      layerSizes.forEach((_, i) => {
        setTimeout(() => setActiveLayer(i), i * 700)
      })

      setTimeout(() => {
        setShowFinal(true)
      }, layerSizes.length * 700 + 500)
    }
  }, [trigger])

  const getY = (index: number, total: number) =>
    index * verticalGap - ((total - 1) * verticalGap) / 2

  return (
    <div className="relative mt-10 w-full overflow-x-auto">
      <svg
        width={layerSizes.length * horizontalGap + 100}
        height={450}
        className="mx-auto"
      >
        {/* Lines */}
        {layerSizes.map((count, layerIdx) => {
          const nodes = Array.from({ length: Math.min(count, 28) })
          return nodes.flatMap((_, i) => {
            const cx = layerIdx * horizontalGap + 40
            const cy = 250 + getY(i, nodes.length)

            if (layerIdx > 0) {
              const prevCount = Math.min(layerSizes[layerIdx - 1], 28)
              return Array.from({ length: prevCount }).map((_, j) => {
                const prevX = (layerIdx - 1) * horizontalGap + 40
                const prevY = 250 + getY(j, prevCount)

                // FINAL LAYER: only connect to predicted node
                const isFinalLayer = layerIdx === layerSizes.length - 1
                if (isFinalLayer && prediction !== null && i !== prediction) return null

                const id = `${layerIdx}-${i}-${j}`
                const isHighlighted = isFinalLayer || activeLines.has(id)

                return (
                  <motion.line
                    key={`line-${id}`}
                    x1={prevX}
                    y1={prevY}
                    x2={cx}
                    y2={cy}
                    strokeWidth={1}
                    initial={{ stroke: "#444" }}
                    animate={{
                      stroke:
                        activeLayer >= layerIdx
                          ? isHighlighted
                            ? "#4ade80"
                            : "#333"
                          : "#444",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )
              })
            }

            return []
          })
        })}

        {/* Dots */}
        {layerSizes.map((count, layerIdx) => {
          const nodes = Array.from({ length: Math.min(count, 28) })
          return nodes.map((_, i) => {
            const cx = layerIdx * horizontalGap + 40
            const cy = 250 + getY(i, nodes.length)
            const isActive = layerIdx === layerSizes.length - 1 && prediction === i

            return (
              <motion.circle
                key={`node-${layerIdx}-${i}`}
                cx={cx}
                cy={cy}
                r={dotSize / 2}
                fill={isActive ? "#22c55e" : "#3b82f6"}
                animate={{ scale: activeLayer >= layerIdx ? 1.2 : 0.8 }}
                transition={{ duration: 0.4 }}
              />
            )
          })
        })}
        
      </svg>

      {/* Final Prediction Text */}
      {showFinal && prediction !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center text-6xl font-bold text-green-400 mt-4"
        >
          Predicted: {prediction}
        </motion.div>
      )}
    </div>
  )
}
