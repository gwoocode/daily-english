'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ type, item }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 카드가 바뀌면 다시 앞면으로 초기화
  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  const speakText = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('이 브라우저는 음성 출력을 지원하지 않습니다.');
    }
  };

  return (
    <div 
      className="w-full max-w-md h-88 cursor-pointer [perspective:1000px] select-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full text-center transition-all duration-500 [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {/* ==================== 카드 앞면 ==================== */}
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-7 flex flex-col justify-between border-2 border-slate-100 dark:border-slate-700/80 [backface-visibility:hidden]">

          {/* 앞면 본문 */}
          <div className="my-auto px-2">
            {type === 'shadowing' && (
              <>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-relaxed mb-4">
                  "{item.english}"
                </p>
                <button
                  onClick={(e) => speakText(e, item.english)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition shadow-sm ${
                    isSpeaking 
                      ? 'bg-indigo-600 text-white animate-pulse' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-slate-700 dark:text-indigo-300'
                  }`}
                >
                  🔊
                </button>
              </>
            )}

            {type === 'reflex' && (
              <>
                <p className="text-xl font-extrabold text-slate-800 dark:text-white leading-relaxed">
                  "{item.korean}"
                </p>
              </>
            )}

            {type === 'flashcards' && (
              <>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-4">
                  {item.word}
                </h2>
                <button
                  onClick={(e) => speakText(e, item.word)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-slate-700 dark:text-amber-300 hover:bg-amber-100 transition"
                >
                🔊
                </button>
              </>
            )}
          </div>
        </div>

        {/* ==================== 카드 뒷면 ==================== */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-3xl shadow-xl p-7 flex flex-col justify-between border-2 border-slate-800 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          
          <div className="flex justify-between items-center w-full">
            <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-widest">
              ANSWER & MEANING
            </span>
          </div>

          {/* 뒷면 본문 */}
          <div className="my-auto px-1 w-full">
            {type === 'shadowing' && (
              <p className="text-xl font-bold text-slate-100 leading-relaxed">
                {item.korean}
              </p>
            )}

            {type === 'reflex' && (
              <>
                <p className="text-xl font-extrabold text-emerald-300 leading-relaxed mb-4">
                  "{item.english}"
                </p>
                <button
                  onClick={(e) => speakText(e, item.english)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition"
                >
                  🔊
                </button>
              </>
            )}

            {type === 'flashcards' && (
              <div className="flex flex-col gap-3 text-left">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase">Meaning</span>
                  <p className="text-xl font-extrabold text-white">{item.meaning}</p>
                </div>
                {item.exampleEng && (
                  <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700/80 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-amber-400 font-bold">EXAMPLE</span>
                      <button
                        onClick={(e) => speakText(e, item.exampleEng)}
                        className="text-slate-300 hover:text-white underline"
                      >
                        🔊 예문 듣기
                      </button>
                    </div>
                    <p className="font-semibold text-slate-100 text-sm mb-1">"{item.exampleEng}"</p>
                    <p className="text-slate-400">{item.exampleKor}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}