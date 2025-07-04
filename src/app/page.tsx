"use client";

import { useState } from "react";
import Canvas from "../components/ui/Canvas";
import NeuralVisualizer from "../components/ui/NeuralNetAnimation";
import ReinforcementPanel from "../components/ui/ReinforcementPanel";
import { ArrowBigRight } from "lucide-react";

export default function Home() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [uploadTriggered, setUploadTriggered] = useState<boolean>(false);

  const handlePredict = async (base64: string) => {
    setImageData(base64);
    setPrediction(null);
    setUploadTriggered(false);

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();
      setPrediction(data.prediction);
      setUploadTriggered(true);

      localStorage.setItem("lastImage", base64);
      localStorage.setItem("lastPrediction", String(data.prediction));
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        🧠 Digit Recognition Visualized Pipeline
      </h1>

      <div className="flex items-start justify-center gap-6">
        {/* Canvas Panel */}
        <div className="flex flex-col items-center">
          <h2 className="font-semibold mb-2">✍️ Draw Digit</h2>
          <Canvas onPredict={handlePredict} />
        </div>

        {/* Arrow to NN */}
        <ArrowBigRight className="w-10 h-10 mt-16 text-gray-400" />

        {/* Neural Network Panel */}
        <div className="flex flex-col items-center">
          <h2 className="font-semibold mb-2">🤖 Neural Net</h2>
          <NeuralVisualizer prediction={prediction} trigger={uploadTriggered} />
        </div>

        {/* Arrow to Feedback */}
        <ArrowBigRight className="w-10 h-10 mt-16 text-gray-400" />

        {/* Feedback Panel */}
        {prediction !== null && imageData && (
          <div className="flex flex-col items-center">
            <h2 className="font-semibold mb-2">📣 Reinforcement</h2>
            <ReinforcementPanel image={imageData} prediction={prediction} />
          </div>
        )}
      </div>
      {/* Educational Section */}
      <section className="mt-16 max-w-4xl mx-auto px-4 space-y-6 ">
        <h2 className="text-2xl font-bold text-center mb-6">
          🧠 How This Neural Network Works
        </h2>

        <p>
          Humans can easily recognize a low-res image of the number "3"
          regardless of slight differences.
        </p>
        <p>
          But telling a computer to do this—to look at a 28x28 grid of pixels
          and output a digit—is extremely hard without machine learning.
        </p>

        <h3 className="text-xl font-semibold mt-6">
          🔢 Neural Networks as Functions
        </h3>
        <p>
          A neural network is just a function that takes an input (784 pixels)
          and returns a set of outputs (10 values representing digits 0–9). Each
          value in the output layer reflects how likely the input is to be that
          digit.
        </p>

        <h3 className="text-xl font-semibold mt-6">
          🧩 Structure of the Network
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Input layer:</strong> 784 neurons, one for each pixel.
          </li>
          <li>
            <strong>Hidden layers:</strong> Two layers with 16 neurons each (in
            this example).
          </li>
          <li>
            <strong>Output layer:</strong> 10 neurons, one for each digit.
          </li>
        </ul>
        <p>Each neuron holds a number (its activation between 0 and 1).</p>

        <h3 className="text-xl font-semibold mt-6">
          🔗 Weights and Biases: The Dials of Learning
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Weight:</strong> How strongly one neuron affects the next.
          </li>
          <li>
            <strong>Bias:</strong> How hard it is to activate a neuron.
          </li>
        </ul>
        <p>These values determine how neurons pass information forward.</p>

        <h3 className="text-xl font-semibold mt-6">
          ➕ From Pixels to Patterns
        </h3>
        <p>
          Lower layers detect edges or small patterns (like a vertical line).
          Higher layers detect parts of digits (like loops). Eventually, the
          output layer interprets all those patterns as a specific digit.
        </p>

        <h3 className="text-xl font-semibold mt-6">
          📈 Activation Functions (Sigmoid or ReLU)
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Sigmoid:</strong> Squeezes values into [0, 1]; useful for
            understanding but outdated.
          </li>
          <li>
            <strong>ReLU:</strong> More modern; outputs 0 for negative input,
            else passes input directly.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">
          📚 Learning = Finding the Right Weights
        </h3>
        <p>
          The network has ~13,000 parameters (weights + biases). Learning is
          adjusting these using training data to minimize prediction errors (via
          gradient descent + backpropagation).
        </p>

        <h3 className="text-xl font-semibold mt-6">📐 Matrix Formulation</h3>
        <pre className="bg-gray-800 text-green-400 text-sm p-4 rounded">
          a' = sigmoid(Wa + b)
        </pre>
        <p>
          This compact matrix-based view makes training scalable and efficient.
        </p>

        <h3 className="text-xl font-semibold mt-6">🌊 Why This Matters</h3>
        <p>
          More complex models (like CNNs, LSTMs, Transformers) build on these
          core ideas. The concept of layered abstraction also applies to
          language processing, speech, robotics, etc.
        </p>

        <p className="mt-4">
          If you're curious to explore, check out the MNIST dataset or try
          building a small network using:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>TensorFlow / Keras</li>
          <li>PyTorch</li>
          <li>Google Teachable Machine</li>
          <li>Google Colab starter notebooks</li>
        </ul>
      </section>
      {/* 🔖 LLM Reference Documents Section */}
      <section className="mt-20 max-w-4xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          📂 Key Documents for LLM Understanding
        </h2>

        <p className="text">
          These documents contain the code, structure, and metadata used in
          building and understanding the digit recognition pipeline. They are
          useful not only for training the model, but also for fine-tuning LLMs
          to reason about digit classification, CNN behavior, or feedback loops.
        </p>

        <ul className="space-y-4">
          <li>
            <div className="bg-gray-800 p-4 rounded shadow">
              <h3 className="font-semibold text-green-400">
                📄 <code>cnn_model.py</code>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Defines the CNN architecture used to classify MNIST digits. This
                file includes the convolutional layers, activations, and linear
                output mapping. A key source for understanding how image
                features are extracted.
              </p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded shadow">
              <h3 className="font-semibold text-green-400">
                📄 <code>train_cnn.py</code>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Handles loading of the MNIST dataset, setting up data loaders,
                training loop, and saving the model weights. Essential for
                demonstrating the learning flow and weight optimization.
              </p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded shadow">
              <h3 className="font-semibold text-green-400">
                📄 <code>feedback_log.json</code>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Stores user feedback on model predictions. Used to extend
                training data and support reinforcement-style learning.
                Demonstrates interactive learning workflows.
              </p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded shadow">
              <h3 className="font-semibold text-green-400">
                📄 <code>app.py</code>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Flask backend serving predictions and handling feedback. This
                file connects the frontend canvas UI to backend ML logic.
              </p>
            </div>
          </li>
          <li>
            <div className="bg-gray-800 p-4 rounded shadow">
              <h3 className="font-semibold text-green-400">
                📄 <code>README.md</code>
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                High-level overview of the project, its motivation, how to run
                it locally, and the model goals. Helps LLMs understand context
                and project intent.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* 📄 PDF Viewer Section */}
      <section className="mt-16">
        <h2 className="text-xl font-semibold  mb-4">
          📄 Documentation PDF
        </h2>
        <div className="w-full h-[600px] border-2 border-gray-600 rounded overflow-hidden">
          <iframe
            src="NIPS-2017-attention-is-all-you-need-Paper.pdf"
            className="w-full h-full"
            title="PDF Viewer"
          ></iframe>
        </div>
      </section>

      {/* 🔗 GitHub & LinkedIn Section */}
      <section className="mt-16 mb-10 flex flex-col items-center space-y-4 text-white">
        <h2 className="text-xl font-semibold text-black">
          🔗 Connect with the Project{" "}
        </h2>

        <div className="flex space-x-6">
          <a
            href="https://github.com/NageshMandal/neural-network.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303...Z"
              />
            </svg>
            GitHub Repo
          </a>

          <a
            href="https://www.linkedin.com/in/nagesh-mandal-134b70237/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded text-sm transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761...Z" />
            </svg>
            LinkedIn Profile
          </a>
        </div>
      </section>
    </main>
  );
}
