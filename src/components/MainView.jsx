'use client';

import { useState, useMemo, useEffect } from 'react';
import Flashcard from './Flashcard';

const ITEMS_PER_DAY = 50;

export default function MainView({ initialData }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [selectedStartDay, setSelectedStartDay] = useState(1);
  const [selectedEndDay, setSelectedEndDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRandom, setIsRandom] = useState(false);
  const [shuffledList, setShuffledList] = useState([]);

  const fullList = initialData[activeTab] || [];
  const totalDays = Math.max(1, Math.ceil(fullList.length / ITEMS_PER_DAY));

  const baseFilteredList = useMemo(() => {
    const startIndex = (selectedStartDay - 1) * ITEMS_PER_DAY;
    const endIndex = selectedEndDay * ITEMS_PER_DAY;
    return fullList.slice(startIndex, endIndex);
  }, [fullList, selectedStartDay, selectedEndDay]);

  useEffect(() => {
    if (isRandom) {
      const listCopy = [...baseFilteredList];
      for (let i = listCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [listCopy[i], listCopy[j]] = [listCopy[j], listCopy[i]];
      }
      setShuffledList(listCopy);
    } else {
      setShuffledList(baseFilteredList);
    }
    setCurrentIndex(0);
  }, [baseFilteredList, isRandom]);

  const currentItem = shuffledList[currentIndex];

  const handleNext = () => {
    if (shuffledList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % shuffledList.length);
  };

  const handlePrev = () => {
    if (shuffledList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + shuffledList.length) % shuffledList.length);
  };

  // 키보드 방향키 조작 지원
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shuffledList]);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      {/* 1. 카테고리 선택 탭 */}
      <div className="grid grid-cols-3 gap-1 bg-slate-200 dark:bg-slate-800/80 p-1.5 rounded-2xl w-full">
        {[
          { key: 'shadowing', label: '🎧 섀도잉' },
          { key: 'reflex', label: '⚡ Reflex' },
          { key: 'flashcards', label: '🎴 플래시카드' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentIndex(0);
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Day 범위 선택 및 셔플 컨트롤러 */}
      <div className="flex items-center justify-between w-full bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm text-sm">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-700 dark:text-slate-300 text-xs">
            📅 Day 범위:
          </span>
          <select
            value={selectedStartDay}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedStartDay(val);
              if (val > selectedEndDay) setSelectedEndDay(val);
            }}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs focus:outline-none"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
              <option key={`start-${d}`} value={d}>
                Day {d}
              </option>
            ))}
          </select>
          <span className="text-slate-400 font-black text-xs">~</span>
          <select
            value={selectedEndDay}
            onChange={(e) => setSelectedEndDay(Number(e.target.value))}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-600 text-xs focus:outline-none"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1)
              .filter((d) => d >= selectedStartDay)
              .map((d) => (
                <option key={`end-${d}`} value={d}>
                  Day {d}
                </option>
              ))}
          </select>
        </div>

        <button
          onClick={() => setIsRandom(!isRandom)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
            isRandom
              ? 'bg-amber-500 text-white shadow-md scale-105'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          🎲 {isRandom ? '랜덤 셔플 ON' : '순서대로'}
        </button>
      </div>

      {/* 3. 진행 상황 프로그레스 바 */}
      {shuffledList.length > 0 && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 dark:bg-indigo-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / shuffledList.length) * 100}%` }}
          />
        </div>
      )}

      {/* 4. 카드 디스플레이 */}
      {currentItem ? (
        <>
          <Flashcard 
            key={`${activeTab}-${currentItem.id}-${isRandom}`} 
            type={activeTab} 
            item={currentItem} 
          />

          {/* 컨트롤 하단 버튼 */}
          <div className="flex items-center gap-4 w-full justify-between px-1">
            <button
              onClick={handlePrev}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow hover:bg-slate-100 transition font-bold border border-slate-200 dark:border-slate-700"
            >
              ← 이전
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-extrabold tracking-wide">
              {currentIndex + 1} / {shuffledList.length} CARDS
            </span>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition font-bold"
            >
              다음 →
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl w-full border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-2">선택한 범위에 데이터가 없습니다.</p>
          <p className="text-xs text-slate-400">src/data/{activeTab}/day001.md 파일이 존재하는지 확인해 주세요.</p>
        </div>
      )}
    </div>
  );
}