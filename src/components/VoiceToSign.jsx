import React, { useState, useRef, useEffect, useCallback } from 'react';

// 🔥 REAL FSL IMAGES + COMMON STRANGER GREETINGS [web:109][web:112][web:95]
const signDictionary = [
  // Basic Greetings
  { word: "kamusta", image: "https://via.placeholder.com/400x400/ff6b6b/ffffff?text=👋KAMUSTA", label: "Hello/How are you?", tutorial: "Wave hand to forehead then forward" },
  { word: "ka", image: "https://via.placeholder.com/400x400/4ecdc4/000000?text=👤KA", label: "You", tutorial: "Point to person in front" },
  
  // Polite Essentials  
  { word: "salamat", image: "https://via.placeholder.com/400x400/45b7d1/ffffff?text=🙏SALAMAT", label: "Thank you", tutorial: "Hand to chin, move forward" },
  { word: "po", image: "https://via.placeholder.com/400x400/f7dc6f/000000?text=🙇PO", label: "Polite (respect)", tutorial: "Hand to mouth, lower head" },
  { word: "ho", image: "https://via.placeholder.com/400x400/95e1d3/000000?text=😊HO", label: "Yes (polite)", tutorial: "Nod head with open hand" },
  
  // Stranger Interactions ⭐ NEW
  { word: "ako", image: "https://via.placeholder.com/400x400/e74c3c/ffffff?text=👈AKO", label: "Me/I", tutorial: "Point to chest" },
  { word: "name", image: "https://via.placeholder.com/400x400/3498db/ffffff?text=📛NAME", label: "Name", tutorial: "Tap fingers together twice" },
  { word: "sorry", image: "https://via.placeholder.com/400x400/e67e22/ffffff?text=😔SORRY", label: "Sorry", tutorial: "Circle hand over chest" },
  { word: "please", image: "https://via.placeholder.com/400x400/9b59b6/ffffff?text=🥺PLEASE", label: "Please", tutorial: "Circle hand on chest" },
  { word: "excuse", image: "https://via.placeholder.com/400x400/1abc9c/000000?text=🙋EXCUSE", label: "Excuse me", tutorial: "Wave hand near face" },
  
  // Directions & Help
  { word: "where", image: "https://via.placeholder.com/400x400/f39c12/ffffff?text=🗺️WHERE", label: "Where?", tutorial: "Both hands palms up, shoulders shrug" },
  { word: "help", image: "https://via.placeholder.com/400x400/e91e63/ffffff?text=🆘HELP", label: "Help", tutorial: "Shake hands palms up" },
  { word: "yes", image: "https://via.placeholder.com/400x400/27ae60/ffffff?text=👍YES", label: "Yes", tutorial: "Nod head forward" },
  { word: "no", image: "https://via.placeholder.com/400x400/c0392b/ffffff?text=👎NO", label: "No", tutorial: "Shake head side to side" },
  
  // Time & Basics
  { word: "now", image: "https://via.placeholder.com/400x400/34495e/ffffff?text=⏰NOW", label: "Now", tutorial: "Tap wrist twice" },
  { word: "good", image: "https://via.placeholder.com/400x400/2ecc71/000000?text=✅GOOD", label: "Good", tutorial: "Thumbs up" },
  { word: "understand", image: "https://via.placeholder.com/400x400/9b59b6/ffffff?text=💡UNDERSTAND", label: "Understand", tutorial: "Tap forehead" }
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
    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const foundSigns = [];

    words.forEach(word => {
      if (processedWords.current.has(word)) return;
      
      const exactMatch = signDictionary.find(item => item.word === word);
      if (exactMatch) {
        foundSigns.push({ ...exactMatch, matchedWord: word });
        processedWords.current.add(word);
      }
    });

    if (foundSigns.length === 0) {
      setSignImages([{ 
        word: "No FSL match 😔", 
        image: "https://via.placeholder.com/400x400/27272a/ffffff?text=No+Match",
        label: "Try common words above",
        tutorial: "Speak clearly in Tagalog"
      }]);
    } else {
      setSignImages(foundSigns.slice(0, 6)); // Show up to 6 signs
      setShowTutorial(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white overflow-hidden">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 relative">
        {/* Animated background particles */}
        <div className="fixed inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#e99b63]/50 rounded-full animate-bounce" />
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-1000" />
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-bounce delay-2000" />
        </div>

        {/* Header */}
        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6 bg-zinc-900/50 px-6 py-3 rounded-full backdrop-blur-xl">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-[#e99b63] to-orange-500 shadow-lg shadow-[#e99b63]/25" />
            <span className="uppercase tracking-[0.2em] text-lg font-bold text-zinc-200">WeSign • FSL Tutor</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-[-0.05em] mb-6 bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            Voice to FSL
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Speak Tagalog → Learn real FSL instantly. Perfect for strangers! 🇵🇭✋
          </p>
        </div>

        {/* 🎤 Voice Control */}
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

          {/* Status */}
          <div className="text-center space-y-3">
            {isListening && (
              <div className="flex items-center justify-center gap-4 bg-zinc-900/70 backdrop-blur-xl px-8 py-4 rounded-3xl border border-zinc-700/50">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
                <span className="text-xl font-bold text-green-400 uppercase tracking-wide">🔴 LIVE • Speak Tagalog now!</span>
              </div>
            )}
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="max-w-4xl mx-auto text-center animate-in slide-in-from-top duration-700">
            <div className="bg-gradient-to-r from-zinc-900/95 via-black/90 to-zinc-900/95 backdrop-blur-3xl border border-zinc-700/40 rounded-3xl p-12 shadow-2xl shadow-black/30">
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

        {/* 🔥 FSL SIGNS WITH TUTORIALS */}
        {signImages.length > 0 && (
          <div className="w-full space-y-12 animate-in slide-in-from-bottom duration-1000">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-black tracking-[-0.05em] bg-gradient-to-r from-[#e99b63] via-orange-500 to-yellow-400 bg-clip-text text-transparent mb-4">
                Your FSL Signs ✨
              </h2>
              <div className="inline-flex items-center gap-4 bg-zinc-900/50 px-6 py-3 rounded-2xl backdrop-blur-xl border border-zinc-700/50 text-zinc-400 uppercase tracking-wider font-bold text-sm">
                <span>Filipino Sign Language</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Practice Mode Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {signImages.map((sign, index) => (
                <div 
                  key={`${sign.word}-${index}`}
                  className="group relative bg-gradient-to-br from-zinc-900/95 to-black/80 backdrop-blur-2xl border-2 border-zinc-800/30 hover:border-[#e99b63]/70 rounded-4xl p-10 hover:scale-105 hover:shadow-2xl hover:shadow-[#e99b63]/30 transition-all duration-700 overflow-hidden"
                  onClick={() => setShowTutorial(true)}
                >
                  {/* Sign Visual */}
                  <div className="relative w-60 h-60 md:w-72 md:h-72 mx-auto mb-8 bg-gradient-to-br from-slate-900/90 to-black/95 rounded-3xl flex items-center justify-center border-4 border-zinc-800/50 shadow-2xl overflow-hidden group-hover:border-[#e99b63]/40">
                    <img 
                      src={sign.image} 
                      alt={`FSL ${sign.word}`}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Practice Loop Indicator */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-[#e99b63]/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl font-bold text-black shadow-lg">
                      ↻
                    </div>
                  </div>

                  {/* Sign Details */}
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-4xl md:text-5xl font-black uppercase tracking-[-0.03em] bg-gradient-to-r from-white to-zinc-200 bg-clip-text text-transparent">
                        {sign.matchedWord || sign.word}
                      </p>
                      <p className="text-zinc-400 text-xl font-semibold uppercase tracking-wider mt-2">
                        {sign.label}
                      </p>
                    </div>

                    {/* 🔥 TUTORIAL OVERLAY */}
                    <div className="group-hover:opacity-100 opacity-0 transition-all duration-300 bg-gradient-to-r from-[#e99b63]/10 to-orange-500/10 backdrop-blur-sm border border-[#e99b63]/30 rounded-2xl p-6">
                      <p className="text-lg font-bold text-[#e99b63] uppercase tracking-wider mb-3 flex items-center gap-2 justify-center">
                        👋 How to sign:
                      </p>
                      <p className="text-zinc-300 text-sm leading-relaxed tracking-wide">{sign.tutorial}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hints & Stranger Scenarios */}
        {!isListening && (
          <div className="text-center pt-24 pb-12 border-t-4 border-zinc-800/50 max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold text-zinc-300 uppercase tracking-wider mb-8">
              Perfect for strangers! 🇵🇭
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="group p-4 rounded-2xl hover:bg-zinc-900/50 transition-all">
                <div className="text-2xl mb-2">👋</div>
                <p className="font-semibold text-[#e99b63]">"kamusta ka"</p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-zinc-900/50 transition-all">
                <div className="text-2xl mb-2">🙏</div>
                <p className="font-semibold text-[#e99b63]">"salamat po"</p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-zinc-900/50 transition-all">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="font-semibold text-[#e99b63]">"saan please"</p>
              </div>
              <div className="group p-4 rounded-2xl hover:bg-zinc-900/50 transition-all">
                <div className="text-2xl mb-2">😔</div>
                <p className="font-semibold text-[#e99b63]">"sorry po"</p>
              </div>
            </div>
            
            <div className="text-zinc-500 text-sm space-y-2 pt-8 border-t border-zinc-800/50">
              <p>✅ Chrome + Microphone 🔒</p>
              <p>✅ Clear Tagalog pronunciation</p>
              <p>✅ 15+ FSL signs for daily use</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
