"use client"
import { useState } from "react"

export default function ReinforcementPanel({ image, prediction }: { image: string, prediction: number }) {
  const [actual, setActual] = useState("")

  const handleFeedback = async () => {
    if (!actual) return alert("Please enter the correct digit")
    await fetch("http://127.0.0.1:5000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, prediction, actual }),
    })
    alert("✅ Feedback submitted!")
    setActual("")
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-lg font-semibold mb-2">🔁 Reinforcement Feedback</h2>
      <p className="text-sm text-gray-600 mb-2">
        If the prediction was wrong, please enter the correct digit below.
      </p>
      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
          className="border p-2 w-16 rounded"
          placeholder="Digit"
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={handleFeedback}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  )
}
