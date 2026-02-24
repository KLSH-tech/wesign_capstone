import React, { useState, useRef } from 'react';

const signDictionary = [
  { word: "kamusta", image: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=KAMUSTA" },
  { word: "ka", image: "https://via.placeholder.com/400x400/4ecdc4/ffffff?text=KA" },
  { word: "salamat", image: "https://via.placeholder.com/400x400/45b7d1/ffffff?text=SALAMAT" },
  { word: "po", image: "https://via.placeholder.com/400x400/f7dc6f/000000?text=PO" },
  { word: "ho", image: "https://via.placeholder.com/400x400/95e1d3/000000?text=HO" }
];

export default function VoiceToSign() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [signImages, setSignImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('🎤 Speech recognition not supported. Use Chrome browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fil-PH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setIsLoading(true);
      setTranscript('');
      setSignImages([]);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      setTranscript(text);
      findSignImages(text);
      setIsLoading(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      setIsLoading(false);
      alert('Speech recognition failed. Try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsLoading(false);
  };

  const findSignImages = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const foundImages = words
      .map(word => {
        const match = signDictionary.find(item => 
          item.word === word || 
          word.includes(item.word) || 
          item.word.includes(word)
        );
        return match;
      })
      .filter(Boolean);

    if (foundImages.length === 0) {
      setSignImages([{ word: "No sign found 😢", image: "https://via.placeholder.com/400x400/6c757e/ffffff?text=No+Match" }]);
    } else {
      setSignImages(foundImages);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-8 text-white">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            🎤 Voice to Sign Language
          </h1>
          <p className="text-xl text-gray-300 mb-8">Speak Tagalog → See FSL signs instantly!</p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className="w-28 h-28 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 flex items-center justify-center text-white text-3xl font-bold transform hover:scale-110 active:scale-95 border-4 border-white/20"
          >
            {isLoading ? (
              <span>⏳</span>
            ) : isListening ? (
              <span>⏹️</span>
            ) : (
              <span>🎤</span>
            )}
          </button>

          {transcript && (
            <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 text-center max-w-md mx-auto border border-white/20">
              <p className="text-lg font-semibold mb-4 text-blue-300">🎧 Heard:</p>
              <p className="text-2xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">
                "{transcript}"
              </p>
            </div>
          )}

          {signImages.length > 0 && (
            <div className="space-y-6 w-full">
              <p className="text-center font-bold text-xl text-green-400">✨ Sign Language Results:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {signImages.map((sign, index) => (
                  <div key={index} className="flex flex-col items-center p-6 bg-black/40 rounded-2xl backdrop-blur-sm border border-white/20 hover:scale-105 transition-all">
                    <img 
                      src={sign.image} 
                      alt={sign.word}
                      className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-xl shadow-2xl border-4 border-white/30"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400/gray/ffffff?text=Image+Error";
                      }}
                    />
                    <p className="mt-4 font-bold text-xl capitalize text-center px-4 min-h-[2rem]">
                      {sign.word.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-lg text-gray-300 bg-black/30 rounded-xl p-4">
          💡 Try: "kamusta ka", "salamat po", "magandang umaga"
        </div>
      </div>
    </div>
  );
}
