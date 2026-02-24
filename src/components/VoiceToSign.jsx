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
      alert('🎤 Speech recognition not supported. Please use Chrome.');
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
      const text = event.results[0][0].transcript.toLowerCase().trim();
      setTranscript(text);
      findSignImages(text);
      setIsLoading(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
      setIsLoading(false);
      alert('Speech recognition failed. Please try again.');
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
      setSignImages([{ 
        word: "No matching sign found", 
        image: "https://via.placeholder.com/400x400/27272a/ffffff?text=No+Match" 
      }]);
    } else {
      setSignImages(foundImages);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
      <div className="max-w-3xl w-full mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[#e99b63] animate-pulse" />
            <span className="uppercase tracking-[0.125em] text-xs font-medium text-zinc-400">WeSign • Real-time</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-none mb-4">
            Voice to Sign
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 tracking-wide max-w-md mx-auto">
            Speak Tagalog.<br />Watch FSL signs appear instantly.
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            className="group relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center rounded-full transition-all duration-500 active:scale-95 hover:scale-105 focus:outline-none"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full border border-[#e99b63]/20" />
            
            {/* Pulsing ring when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-[#e99b63] animate-ping opacity-30" />
                <div className="absolute inset-2 rounded-full border border-[#e99b63]/40" />
              </>
            )}

            {/* Button face */}
            <div className={`relative w-36 h-36 md:w-40 md:h-40 rounded-full flex items-center justify-center border-4 transition-all duration-300 overflow-hidden
              ${isListening 
                ? 'bg-red-500/10 border-red-400/50 shadow-[0_0_80px_-10px] shadow-red-500' 
                : 'bg-zinc-900 border-[#e99b63]/30 hover:border-[#e99b63] shadow-[0_0_70px_-15px] shadow-[#e99b63]'
              }`}
            >
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              ) : isListening ? (
                <span className="text-6xl text-red-400">⏹︎</span>
              ) : (
                <span className="text-7xl text-[#e99b63] transition-transform group-hover:scale-110">🎤</span>
              )}
            </div>
          </button>
        </div>

        {/* Status */}
        <div className="text-center">
          {isListening && (
            <p className="text-[#e99b63] text-sm uppercase tracking-[0.125em] font-medium animate-pulse">
              Listening… Speak now
            </p>
          )}
          {isLoading && !isListening && (
            <p className="text-zinc-400 text-sm">Processing your voice…</p>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-zinc-900/70 backdrop-blur-2xl border border-zinc-800 rounded-3xl p-9 text-center transition-all">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="text-[#e99b63]">🎧</div>
              <span className="uppercase text-xs tracking-[0.2em] font-medium text-zinc-500">Heard clearly</span>
            </div>
            <p className="text-3xl md:text-4xl font-medium text-white tracking-wide leading-tight">
              “{transcript}”
            </p>
          </div>
        )}

        {/* Sign Results */}
        {signImages.length > 0 && (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Your Signs</h2>
              <div className="text-xs uppercase tracking-widest text-zinc-500">Filipino Sign Language</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {signImages.map((sign, index) => (
                <div 
                  key={index}
                  className="group bg-zinc-900 border border-zinc-800 hover:border-[#e99b63]/30 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e99b63]/10"
                >
                  <div className="aspect-square bg-black flex items-center justify-center p-8">
                    <img 
                      src={sign.image} 
                      alt={sign.word}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400/27272a/ffffff?text=Sign+Unavailable";
                      }}
                    />
                  </div>
                  
                  <div className="p-8 text-center">
                    <p className="text-2xl font-semibold uppercase tracking-widest text-white">
                      {sign.word}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        <div className="pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm tracking-wide">
            Try saying: <span className="text-[#e99b63] font-medium">"kamusta ka"</span> •{" "}
            <span className="text-[#e99b63] font-medium">"salamat po"</span> •{" "}
            <span className="text-[#e99b63] font-medium">"magandang umaga"</span>
          </p>
          <p className="text-[10px] text-zinc-600 mt-6">Works best in Chrome • Filipino language only</p>
        </div>
      </div>
    </div>
  );
}