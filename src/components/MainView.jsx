'use client';

import { useState, useMemo, useEffect } from 'react';
import Flashcard from './Flashcard';

export default function MainView({ allCards }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [shuffledList, setShuffledList] = useState([]);

  // 전체 Day 수 계산
  const totalDays = useMemo(() => {
    if (!allCards || allCards.length === 0) return 1;
    return Math.max(...allCards.map((item) => item.day || 1));
  }, [allCards]);

  // 선택된 단일 Day 카드 필터링
  const filteredList = useMemo(() => {
    if (!allCards) return [];
    return allCards.filter((item) => item.day === selectedDay);
  }, [allCards, selectedDay]);

  // 랜덤 셔플 및 인덱스 초기화
  useEffect(() => {
    if (isRandom) {
      const listCopy = [...filteredList];
      for (let i = listCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listCopy[i], listCopy[j]] = [listCopy[j], listCopy[i]];
      }
      setShuffledList(listCopy);
    } else {
      setShuffledList(filteredList);
    }
    setCurrentIndex(0);
  }, [filteredList, isRandom]);

  const currentItem = shuffledList[currentIndex];

  const handleNext = () => {
    if (shuffledList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % shuffledList.length);
  };

  const handlePrev = () => {
    if (shuffledList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + shuffledList.length) % shuffledList.length);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Daily English</h1>

      {/* 탭 컨트롤러 */}
      <div className="tab-group">
        <button
          onClick={() => setActiveTab('flashcards')}
          className={`tab-button ${activeTab === 'flashcards' ? 'active' : ''}`}
        >
          Flashcard
        </button>
        <button
          onClick={() => setActiveTab('shadowing')}
          className={`tab-button ${activeTab === 'shadowing' ? 'active' : ''}`}
        >
          English
        </button>
        <button
          onClick={() => setActiveTab('reflex')}
          className={`tab-button ${activeTab === 'reflex' ? 'active' : ''}`}
        >
          Korean
        </button>
      </div>

      {/* 상단 옵션 바 (Day 단일 선택) */}
      <div className="options-bar">
        <div className="day-select-group">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="day-select"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Day {d}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsRandom(!isRandom)}
          className={`shuffle-button ${isRandom ? 'active' : ''}`}
        >
          🎲 {isRandom ? 'Random' : 'Order'}
        </button>
      </div>

      {/* 카드 콘텐츠 및 하단 컨트롤 */}
      {currentItem ? (
        <>
          <Flashcard
            key={`${activeTab}-${currentItem.id}-${isRandom}`}
            type={activeTab}
            item={currentItem}
          />

          {/* 하단 내비게이션 (카운터 하단에 미니 프로그레스 바 매립) */}
          <div className="bottom-nav">
            <button onClick={handlePrev} className="nav-button">
              ← Prev
            </button>

            <div className="counter-container">
              <span className="counter-text">
                {currentIndex + 1} / {shuffledList.length}
              </span>
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((currentIndex + 1) / shuffledList.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <button onClick={handleNext} className="nav-button primary">
              Next →
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
          데이터가 존재하지 않습니다.
        </p>
      )}
    </div>
  );
}