import React, { useEffect, useRef, useState } from "react";
import {
  Holistic,
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
  FACEMESH_TESSELATION,
} from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";

// ✅ Custom Styles
const style = document.createElement("style");
style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
  body { font-family: 'Poppins', sans-serif; }
  @keyframes pulse-glow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .animate-glow {
    animation: pulse-glow 1.5s infinite ease-in-out;
  }
`;
document.head.appendChild(style);

export default function RealTimeDetection() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState("Initializing...");
  const [confidence, setConfidence] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [sending, setSending] = useState(false);

  // Reset backend
  const handleNewSign = async () => {
    try {
      await fetch("http://127.0.0.1:5000/reset", { method: "POST" });
      setPrediction("Ready for new sign...");
      setConfidence(0);
    } catch (err) {
      console.error("Reset failed:", err);
      setPrediction("⚠️ Reset failed");
    }
  };

  useEffect(() => {
    let holistic = null;
    let camera = null;
    let sendInterval = null;
    let stopped = false;

    const onResults = (results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, 640, 480);
      canvasCtx.drawImage(results.image, 0, 0, 640, 480);

      // Pose
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, results.poseLandmarks, {
          color: "#FFCC00",
          radius: 3,
        });
      }

      // Hands
      if (results.leftHandLandmarks) {
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
          color: "#FF0000",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
          color: "#FFAAAA",
          radius: 4,
        });
      }
      if (results.rightHandLandmarks) {
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
          color: "#0000FF",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
          color: "#AAAFFF",
          radius: 4,
        });
      }

      // Face
      if (results.faceLandmarks) {
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
          color: "#FFFFFF",
          lineWidth: 0.3,
        });
      }

      canvasCtx.restore();
    };

    const initHolistic = async () => {
      holistic = new Holistic({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      holistic.onResults(onResults);

      camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (!stopped) await holistic.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      setIsCameraReady(true);
      setPrediction("Collecting frames...");

      // Start sending to backend
      sendInterval = setInterval(() => {
        if (sending || stopped) return;
        setSending(true);

        canvasRef.current.toBlob(async (blob) => {
          if (!blob) {
            setSending(false);
            return;
          }
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = reader.result.split(",")[1];
            try {
              const res = await fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 }),
              });
              const data = await res.json();

              if (data.error) {
                console.error("Server error:", data.error);
                setPrediction("⚠️ Model Error");
                setConfidence(0);
              } else if (data.prediction) {
                setPrediction(data.prediction);
                setConfidence((data.confidence * 100).toFixed(1));
              } else {
                setPrediction("Collecting frames...");
              }
            } catch (err) {
              console.error("Prediction failed:", err);
              setPrediction("⚠️ Connection Error");
            } finally {
              setSending(false);
            }
          };
          reader.readAsDataURL(blob);
        }, "image/jpeg");
      }, 100);
    };

    initHolistic();

    // Cleanup when leaving detection page
    return () => {
      stopped = true;
      if (sendInterval) clearInterval(sendInterval);
      if (camera) camera.stop();
      if (holistic) holistic.close();
      setIsCameraReady(false);
      console.log("🛑 Camera + Holistic stopped cleanly.");
    };
  }, []); // reinitialize when page mounts again

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">
        🤖 Real-Time Sign Language Detection
      </h1>

      <div className="relative">
        <video
          ref={videoRef}
          className="rounded-lg shadow-lg"
          width="640"
          height="480"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          width="640"
          height="480"
        />

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-6 py-2 text-center shadow-lg animate-glow">
          <p
            className={`text-xl font-semibold tracking-wide ${
              confidence >= 90
                ? "text-green-400"
                : confidence >= 60
                ? "text-yellow-300"
                : "text-red-400"
            }`}
          >
            {prediction}
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Confidence: {confidence}%
          </p>
        </div>
      </div>

      <button
        onClick={handleNewSign}
        className="mt-8 px-5 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        disabled={!isCameraReady}
      >
        🔄 New Sign
      </button>
    </div>
  );
}
