'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Flashcard from './Flashcard';
import { useBookmarks } from '../hooks/useBookmarks';

export default function MainView({ allCards }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [shuffledList, setShuffledList] = useState([]);

  // 전체 카드에 대한 랜덤 셔플 순서를 고정 유지하기 위한 Ref
  const randomOrderRef = useRef([]);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // 전체 Day 수 계산
  const totalDays = useMemo(() => {
    if (!allCards || allCards.length === 0) return 1;
    return Math.max(...allCards.map((item) => item.day || 1));
  }, [allCards]);

  // 해당 Day의 전체 카드 리스트
  const dayCards = useMemo(() => {
    if (!allCards) return [];
    return allCards.filter((item) => item.day === selectedDay);
  }, [allCards, selectedDay]);

  // 1. Day가 변경되거나 '랜덤 버튼'을 직접 눌렀을 때만 셔플 순서 새로 생성
  useEffect(() => {
    if (isRandom) {
      const listCopy = [...dayCards];
      for (let i = listCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listCopy[i], listCopy[j]] = [listCopy[j], listCopy[i]];
      }
      randomOrderRef.current = listCopy;
    } else {
      randomOrderRef.current = dayCards;
    }
    setCurrentIndex(0);
  }, [selectedDay, isRandom, dayCards]);

  // 2. 셔플된 기준 순서(randomOrderRef)에서 북마크 필터링만 적용
  useEffect(() => {
    const baseList = isRandom ? randomOrderRef.current : dayCards;
    
    let result = baseList;
    if (showOnlyBookmarks) {
      result = baseList.filter((item) => bookmarks.includes(item.id));
    }
    
    setShuffledList(result);
  }, [dayCards, isRandom, showOnlyBookmarks, bookmarks]);

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

      {/* 상단 옵션 바 */}
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

        <div className="options-button-group">
          {/* 북마크 모드 필터 버튼 */}
          <button
            onClick={() => {
              setShowOnlyBookmarks(!showOnlyBookmarks);
              setCurrentIndex(0); // 필터 켜고 끌 때는 첫 번째부터 보기
            }}
            className={`shuffle-button bookmark-filter-button ${showOnlyBookmarks ? 'active' : ''}`}
          >
            ★
          </button>

          {/* 랜덤/순서 버튼 */}
          <button
            onClick={() => setIsRandom(!isRandom)}
            className={`shuffle-button ${isRandom ? 'active' : ''}`}
          >
            <span className="material-icons">
              {isRandom ? 'shuffle' : 'repeat'}
            </span>
          </button>
        </div>
      </div>

      {/* 카드 콘텐츠 및 하단 컨트롤 */}
      {currentItem ? (
        <>
          <Flashcard
            key={`${activeTab}-${currentItem.id}`}
            type={activeTab}
            item={currentItem}
            isBookmarked={isBookmarked(currentItem.id)}
            toggleBookmark={toggleBookmark}
          />

          {/* 하단 내비게이션 */}
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
        <p className="no-data-text">
          {showOnlyBookmarks 
            ? `Day ${selectedDay}에 북마크된 단어가 없습니다.` 
            : '데이터가 존재하지 않습니다.'}
        </p>
      )}
    </div>
  );
}
