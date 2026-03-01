import React, { useState, useRef, useEffect, useCallback } from 'react';

// 🔥 FIXED: All GIFs use public/fsl/ + lowercase hyphens
const signDictionary = [
  { word: "hindi alam", image: "/fsl/hindi-alam.gif", label: "Don't understand", tutorial: "Shake head + palms up shrug" },
  { word: "kumusta", image: "/fsl/kumusta.gif", label: "How are you", tutorial: "Hand to forehead then forward" },
  { word: "hindi maintindihan", image: "/fsl/hindi-maintindihan.gif", label: "Don't understand", tutorial: "Cross arms + shake head" },
  { word: "ayos lang ako", image: "/fsl/mabuti-naman.gif", label: "I'm fine", tutorial: "Thumbs up + nod head" },
  { word: "magandang umaga", image: "/fsl/magandang-umaga.gif", label: "Good morning", tutorial: "Sunrise motion + GOOD sign" },
  { word: "magandang hapon", image: "/fsl/magandang-hapon.gif", label: "Good afternoon", tutorial: "Sun high + GOOD sign" },
  { word: "magandang gabi", image: "/fsl/magandang-gabi.gif", label: "Good evening", tutorial: "Moon motion + GOOD sign" },
  { word: "ikinagagalak", image: "/fsl/ikinagagalak.gif", label: "Nice to meet you", tutorial: "Shake hands twice" },
  { word: "hindi", image: "/fsl/hindi.gif", label: "No", tutorial: "Shake head side-to-side" },
  { word: "oo", image: "/fsl/oo.gif", label: "Yes", tutorial: "Nod head forward twice" },
  { word: "salamat", image: "/fsl/salamat.gif", label: "Thank you", tutorial: "Hand to chest + nod head" },
  { word: "kita tayo bukas", image: "/fsl/kita-tayo-bukas.gif", label: "See you tomorrow", tutorial: "Wave + tomorrow motion" },
  { word: "walang anuman", image: "/fsl/walang-anuman.gif", label: "You're welcome", tutorial: "Wave hand dismissively" }
];

export default function VoiceToSign() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [signImages, setSignImages] = useState([]);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const recognitionRef = useRef(null);
  const processedWords = useRef(new Set());

  const startListening = useCallback(() => {
    setError('');
    processedWords.current.clear();
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported. Use Chrome please! 🖥️');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fil-PH';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('✅ Microphone ON');
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase().trim();
      console.log('🎤 Heard:', text);
      setTranscript(text);
      findSignImages(text);
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech error:', event.error);
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setError('');
  };

  const findSignImages = (text) => {
    const lowerText = text.toLowerCase();
    const foundSigns = [];

    // Phrase matching first
    signDictionary.forEach(sign => {
      if (lowerText.includes(sign.word)) {
        if (!processedWords.current.has(sign.word)) {
          foundSigns.push({ ...sign, matchedWord: sign.word });
          processedWords.current.add(sign.word);
          console.log('✅ MATCH:', sign.word);
        }
      }
    });

    if (foundSigns.length === 0) {
      const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 1);
      words.forEach(word => {
        const match = signDictionary.find(item => item.word === word);
        if (match && !processedWords.current.has(word)) {
          foundSigns.push({ ...match, matchedWord: word });
          processedWords.current.add(word);
        }
      });
    }

    if (foundSigns.length === 0) {
      setSignImages([{ 
        word: "No FSL match 😔", 
        image: "/fsl/no-match.gif",
        label: "Try: kumusta, salamat, oo, hindi",
        tutorial: "Speak clearly in Tagalog"
      }]);
    } else {
      setSignImages(foundSigns.slice(0, 4));
      setShowTutorial(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 relative">
        {/* Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6 bg-zinc-900/50 px-6 py-3 rounded-full backdrop-blur-xl">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#e99b63] to-orange-500 shadow-lg shadow-[#e99b63]/25" />
            <span className="uppercase tracking-[0.2em] text-lg font-bold text-zinc-200">WeSign • FSL GIFs</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-[-0.05em] mb-6 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Voice to FSL
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Speak Tagalog → Watch FSL GIFs play instantly! 🎬🇵🇭
          </p>
        </div>

        {/* 🎤 Voice Control - SAME */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex justify-center">
            <button
              onClick={isListening ? stopListening : startListening}
              className="group relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center rounded-full transition-all duration-700 hover:scale-110 active:scale-95 shadow-2xl"
            >
              {isListening ? (
                <>
                  <div className="absolute inset-0 rounded-full border-8 border-red-400/40 bg-gradient-to-r from-red-500/20 animate-ping" />
                  <div className="absolute inset-4 rounded-full border-4 border-red-400/50 bg-gradient-to-br from-red-500/30 to-red-700/20 backdrop-blur-xl" />
                  <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-red-600/40 to-red-800/30 border-4 border-red-400 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40">
                    <span className="text-5xl md:text-6xl">⏹️</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-[#e99b63]/30 bg-gradient-to-r from-[#e99b63]/20 backdrop-blur-xl animate-pulse" />
                  <div className="w-32 h-32 md:w-36 md:h-36 bg-gradient-to-br from-zinc-900/90 to-black/80 border-6 border-[#e99b63]/60 rounded-full flex items-center justify-center shadow-2xl shadow-[#e99b63]/50 group-hover:shadow-[#e99b63]/70 backdrop-blur-2xl hover:border-[#e99b63]">
                    <span className="text-6xl md:text-7xl text-[#e99b63] group-hover:scale-110 transition-all duration-300 animate-bounce">🎤</span>
                  </div>
                </>
              )}
            </button>
          </div>

          {isListening && (
            <div className="flex items-center justify-center gap-4 bg-zinc-900/70 backdrop-blur-xl px-8 py-4 rounded-3xl border border-zinc-700/50">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
              <span className="text-xl font-bold text-green-400 uppercase tracking-wide">🔴 LIVE • Speak now!</span>
            </div>
          )}
        </div>

        {/* Transcript - SAME */}
        {transcript && (
          <div className="max-w-4xl mx-auto text-center animate-in slide-in-from-top duration-700">
            <div className="bg-gradient-to-r from-zinc-900/95 via-black/90 to-zinc-900/95 backdrop-blur-3xl border border-zinc-700/40 rounded-3xl p-12 shadow-2xl">
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/30 to-emerald-600/20 rounded-3xl flex items-center justify-center border-4 border-green-500/40 backdrop-blur-xl">
                  <span className="text-4xl">✓</span>
                </div>
                <span className="uppercase text-lg tracking-[0.3em] text-zinc-400 font-bold">Perfect recognition</span>
              </div>
              <p className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent leading-tight">
                "{transcript}"
              </p>
            </div>
          </div>
        )}

        {/* 🔥 FIXED GIF PLAYER */}
        {signImages.length > 0 && (
          <div className="w-full space-y-12 animate-in slide-in-from-bottom duration-1000">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-black tracking-[-0.05em] bg-gradient-to-r from-[#e99b63] via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-4">
                Your FSL Signs ✨
              </h2>
              <div className="inline-flex items-center gap-4 bg-zinc-900/50 px-6 py-3 rounded-2xl backdrop-blur-xl border border-zinc-700/50 text-zinc-400 uppercase tracking-wider font-bold text-sm">
                <span>Filipino Sign Language GIFs</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Auto-playing</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {signImages.map((sign, index) => (
                <div 
                  key={`${sign.word}-${index}`}
                  className="group relative bg-gradient-to-br from-zinc-900/95 to-black/80 backdrop-blur-2xl border-2 border-zinc-800/30 hover:border-[#e99b63]/70 rounded-4xl p-10 hover:scale-105 hover:shadow-2xl hover:shadow-[#e99b63]/30 transition-all duration-700 overflow-hidden cursor-pointer"
                >
                  {/* 🔥 FIXED GIF CONTAINER - NO LOADING OVERLAY */}
<div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-8 bg-black/30 rounded-3xl flex items-center justify-center border-4 border-zinc-700 shadow-2xl overflow-hidden">
  {/* GIF - NO LOADING SPINNER */}
  <img 
    src={sign.image}
    alt={`FSL ${sign.word}`}
    className="w-full h-full object-contain"
    // GIF auto-play settings
    playsInline
    loop
    autoPlay
    muted
    onLoad={() => console.log('✅ GIF loaded:', sign.image)} // Debug
    onError={(e) => {
      console.error('❌ GIF failed:', sign.image);
      e.target.src = 'https://via.placeholder.com/400x400/34495e/ffffff?text=GIF+NOT+FOUND';
    }}
  />
  {/* Loop indicator ONLY */}
  <div className="absolute top-6 right-6 w-12 h-12 bg-[#e99b63]/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl font-bold text-black shadow-lg">
    ↻
  </div>
</div>


                  {/* Sign Details */}
                  <div className="text-center space-y-4">
                    <p className="text-3xl md:text-4xl font-black uppercase tracking-widest bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
                      {sign.matchedWord || sign.word}
                    </p>
                    <p className="text-zinc-400 text-xl font-semibold uppercase tracking-wider">
                      {sign.label}
                    </p>

                    {/* Tutorial */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-r from-[#e99b63]/20 to-orange-500/20 backdrop-blur-sm border-2 border-[#e99b63]/40 rounded-3xl p-6">
                      <p className="text-lg font-bold text-[#e99b63] uppercase tracking-wider mb-4 flex items-center gap-2 justify-center">
                        👋 How to sign:
                      </p>
                      <p className="text-zinc-200 text-base leading-relaxed tracking-wide text-center">{sign.tutorial}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints */}
        {!isListening && (
          <div className="text-center pt-24 pb-12 border-t-4 border-zinc-800/50 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold text-zinc-300 uppercase tracking-wider mb-8">Test these phrases! 🎤</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div className="group p-6 rounded-3xl hover:bg-zinc-900/50 transition-all bg-zinc-900/30 border border-zinc-700/50">
                <div className="text-3xl mb-3">🎬</div>
                <p className="font-bold text-[#e99b63]">"kumusta"</p>
              </div>
              <div className="group p-6 rounded-3xl hover:bg-zinc-900/50 transition-all bg-zinc-900/30 border border-zinc-700/50">
                <div className="text-3xl mb-3">🙏</div>
                <p className="font-bold text-[#e99b63]">"salamat"</p>
              </div>
              <div className="group p-6 rounded-3xl hover:bg-zinc-900/50 transition-all bg-zinc-900/30 border border-zinc-700/50">
                <div className="text-3xl mb-3">✅</div>
                <p className="font-bold text-[#e99b63]">"oo"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
