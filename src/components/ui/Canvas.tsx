'use client'
import { useRef, useEffect, useState } from 'react'

export default function Canvas({ onPredict }: { onPredict: (base64: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    // Fill canvas with black background on mount
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const getOffset = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true)
    draw(e)
  }

  const handleMouseUp = () => setIsDrawing(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return
    draw(e)
  }

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = getOffset(e)
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(x, y, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleUpload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const base64 = canvas.toDataURL('image/png')
    onPredict(base64)
  }

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={28}
        height={28}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="border border-gray-400"
        style={{
          width: '280px',
          height: '280px',
          imageRendering: 'pixelated',
          backgroundColor: 'black',
          cursor: 'crosshair',
        }}
      />
      <div className="space-x-2">
        <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-1 rounded">
          Upload
        </button>
        <button onClick={clearCanvas} className="bg-gray-600 text-white px-4 py-1 rounded">
          Clear
        </button>
      </div>
    </div>
  )
}
