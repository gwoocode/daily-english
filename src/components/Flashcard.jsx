'use client';

import { useState, useEffect } from 'react';

export default function Flashcard({ type, item }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [item]);

  const examplesList = item?.examples || (item?.exampleEng ? [{ eng: item.exampleEng, kor: item.exampleKor }] : []);

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
    }
  };

  const firstExample = examplesList[0] || { eng: '', kor: '' };

  return (
    <div className="card-wrapper" onClick={() => setIsFlipped(!isFlipped)}>
      <div className="card-inner" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        
        {/* 앞면 */}
        <div className="card-front">
          <div className="badge-label">FRONT</div>
          <div className="card-content-center">
            {type === 'shadowing' && (
              <>
                <p className="text-body">"{firstExample.eng}"</p>
                <button
                  onClick={(e) => speakText(e, firstExample.eng)}
                  className={`audio-button ${isSpeaking ? 'speaking' : ''}`}
                >
                  🔊 Listen
                </button>
              </>
            )}

            {type === 'reflex' && (
              <p className="text-body">"{firstExample.kor}"</p>
            )}

            {type === 'flashcards' && (
              <>
                <h2 className="text-title">{item.word}</h2>
                <button onClick={(e) => speakText(e, item.word)} className="audio-button">
                  🔊 Pronounce
                </button>
              </>
            )}
          </div>
        </div>

        {/* 뒷면 */}
        <div className="card-back">
          <div className="badge-label">ANSWER & DETAILS</div>
          <div className="card-content-center">
            {type === 'shadowing' && (
              <p className="text-body">{firstExample.kor}</p>
            )}

            {type === 'reflex' && (
              <>
                <p className="text-body text-green">"{firstExample.eng}"</p>
                <button onClick={(e) => speakText(e, firstExample.eng)} className="audio-button">
                  🔊 Listen
                </button>
              </>
            )}

            {type === 'flashcards' && (
              <div className="flashcard-back-container">
                <div className="meaning-section">
                  <span className="label">Meaning</span>
                  <p className="value">{item.meaning}</p>
                </div>

                {examplesList.length > 0 && (
                  <div className="examples-box">
                    {examplesList.map((ex, idx) => (
                      <div key={idx} className={`example-item ${idx > 0 ? 'bordered' : ''}`}>
                        <div className="example-header">
                          <span className="example-num">#{idx + 1} EXAMPLE</span>
                          <button onClick={(e) => speakText(e, ex.eng)} className="audio-link">
                            🔊 Listen
                          </button>
                        </div>
                        <p className="example-eng">"{ex.eng}"</p>
                        <p className="example-kor">{ex.kor}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}