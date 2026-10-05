'use client';

import { useState, useMemo, useEffect } from 'react';
import Flashcard from './Flashcard';
import { useBookmarks } from '../hooks/useBookmarks';

export default function MainView({ allCards }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [shuffledList, setShuffledList] = useState([]);

  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  // 전체 Day 수 계산
  const totalDays = useMemo(() => {
    if (!allCards || allCards.length === 0) return 1;
    return Math.max(...allCards.map((item) => item.day || 1));
  }, [allCards]);

  // 선택된 Day 카드 및 북마크 필터링
  const filteredList = useMemo(() => {
    if (!allCards) return [];
    
    if (showOnlyBookmarks) {
      return allCards.filter(
        (item) => item.day === selectedDay && bookmarks.includes(item.id)
      );
    }

    return allCards.filter((item) => item.day === selectedDay);
  }, [allCards, selectedDay, showOnlyBookmarks, bookmarks]);

  // 1. Day, 필터 모드, 셔플 토글 시 리스트 재구성 및 인덱스 초기화
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
  }, [selectedDay, showOnlyBookmarks, isRandom]);

  // 2. 일반 모드에서 북마크 토글 시: 현재 보고 있던 랜덤/순서 상태를 유지하며 리스트 갱신
  useEffect(() => {
    if (!showOnlyBookmarks) {
      if (isRandom) {
        // 랜덤 모드일 때는 기존 shuffledList에 현재 filteredList 항목들을 유지하도록 업데이트
        setShuffledList((prevShuffled) => {
          const currentIds = new Set(filteredList.map((item) => item.id));
          const updated = prevShuffled.filter((item) => currentIds.has(item.id));
          
          // 새로 추가된 카드가 있다면 끝에 추가
          const existingIds = new Set(updated.map((item) => item.id));
          const newItems = filteredList.filter((item) => !existingIds.has(item.id));
          return [...updated, ...newItems];
        });
      } else {
        setShuffledList(filteredList);
      }
    }
  }, [filteredList, showOnlyBookmarks, isRandom]);

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
            onClick={() => setShowOnlyBookmarks(!showOnlyBookmarks)}
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
