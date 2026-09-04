'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Flashcard({ type, item }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // 브라우저 내장 음성 출력 (TTS)
  const speakText = (e, text) => {
    e.stopPropagation(); // 카드 뒤집기 이벤트 방지
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // 속도 (0.9배속)
      window.speechSynthesis.speak(utterance);
    } else {
      alert('이 브라우저는 음성 출력을 지원하지 않습니다.');
    }
  };

  return (
    <div 
      className="w-full max-w-md h-80 cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full text-center transition-all duration-500 [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* ==================== 카드 앞면 ==================== */}
        <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 [backface-visibility:hidden]">
          
          {/* 1. 섀도잉 앞면: 영어 문장 + TTS 버튼 */}
          {type === 'shadowing' && (
            <>
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">Shadowing (듣고 따라하기)</span>
              <p className="text-xl font-bold text-slate-800 dark:text-white my-auto px-2">{item.english}</p>
              <button
                onClick={(e) => speakText(e, item.english)}
                className="my-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-indigo-600 dark:text-indigo-300 rounded-full text-sm font-semibold transition flex items-center gap-1.5"
              >
                🔊 발음 듣기
              </button>
            </>
          )}

          {/* 2. Reflex 앞면: 한글 문장만 보여주기 */}
          {type === 'reflex' && (
            <>
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">Reflex (영어로 바꿔보기)</span>
              <p className="text-xl font-bold text-slate-800 dark:text-white my-auto px-2">{item.korean}</p>
              <p className="text-xs text-slate-400 mb-2">영어로 어떻게 말할까요?</p>
            </>
          )}

          {/* 3. 플래시카드 앞면: 영어 단어 + TTS 버튼 */}
          {type === 'flashcards' && (
            <>
              <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2">Word</span>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white my-auto">{item.word}</h2>
              <button
                onClick={(e) => speakText(e, item.word)}
                className="my-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-amber-600 dark:text-amber-300 rounded-full text-sm font-semibold transition flex items-center gap-1.5"
              >
                🔊 발음 듣기
              </button>
            </>
          )}

          <p className="text-xs text-slate-400 mt-auto">클릭해서 뒤집기 🔄</p>
        </div>

        {/* ==================== 카드 뒷면 ==================== */}
        <div className="absolute inset-0 w-full h-full bg-slate-900 text-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-slate-800 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          
          {/* 1. 섀도잉 뒷면: 한글 뜻 */}
          {type === 'shadowing' && (
            <>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Meaning</span>
              <p className="text-xl font-medium text-slate-100 my-auto px-2">{item.korean}</p>
            </>
          )}

          {/* 2. Reflex 뒷면: 정답 영어 문장 + TTS 버튼 */}
          {type === 'reflex' && (
            <>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Answer</span>
              <p className="text-lg font-bold text-slate-100 my-auto px-2">{item.english}</p>
              <button
                onClick={(e) => speakText(e, item.english)}
                className="my-2 px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 rounded-full text-sm font-semibold transition border border-emerald-800/50 flex items-center gap-1.5"
              >
                🔊 정답 듣기
              </button>
            </>
          )}

          {/* 3. 플래시카드 뒷면: 뜻 / 영어 예문 / 예문 한글 해석 */}
          {type === 'flashcards' && (
            <>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Meaning & Example</span>
              <h3 className="text-2xl font-bold text-amber-300 mb-3">{item.meaning}</h3>
              
              {item.exampleEng && (
                <div className="bg-slate-800/80 p-3 rounded-xl max-w-xs text-left w-full my-auto border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-amber-400 font-medium">Example</p>
                    <button
                      onClick={(e) => speakText(e, item.exampleEng)}
                      className="text-xs text-slate-300 hover:text-white underline"
                    >
                      🔊 예문 듣기
                    </button>
                  </div>
                  <p className="text-sm font-medium text-slate-100 mb-1">"{item.exampleEng}"</p>
                  <p className="text-xs text-slate-400">{item.exampleKor}</p>
                </div>
              )}
            </>
          )}

          <p className="text-xs text-slate-400 mt-auto">클릭해서 뒤집기 🔄</p>
        </div>
      </motion.div>
    </div>
  );
}