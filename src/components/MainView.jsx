'use client';

import { useState, useMemo } from 'react';
import Flashcard from './Flashcard';

const ITEMS_PER_DAY = 50; // Day당 카드 개수

export default function MainView({ initialData }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [selectedStartDay, setSelectedStartDay] = useState(1);
  const [selectedEndDay, setSelectedEndDay] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 현재 선택된 카테고리의 전체 데이터
  const fullList = initialData[activeTab] || [];

  // 전체 데이터 기반으로 총 Day 수 계산 (최소 1 Day)
  const totalDays = Math.max(1, Math.ceil(fullList.length / ITEMS_PER_DAY));

  // 선택한 Day 범위에 맞게 카드 필터링
  const filteredList = useMemo(() => {
    const startIndex = (selectedStartDay - 1) * ITEMS_PER_DAY;
    const endIndex = selectedEndDay * ITEMS_PER_DAY;
    return fullList.slice(startIndex, endIndex);
  }, [fullList, selectedStartDay, selectedEndDay]);

  const currentItem = filteredList[currentIndex];

  // 탭 변경 시 초기화
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentIndex(0);
  };

  // Day 변경 시 인덱스 초기화
  const handleStartDayChange = (e) => {
    const val = Number(e.target.value);
    setSelectedStartDay(val);
    if (val > selectedEndDay) setSelectedEndDay(val);
    setCurrentIndex(0);
  };

  const handleEndDayChange = (e) => {
    const val = Number(e.target.value);
    setSelectedEndDay(val);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      {/* 1. 카테고리 선택 탭 */}
      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-full justify-between">
        {[
          { key: 'shadowing', label: '🎧 1. 섀도잉' },
          { key: 'reflex', label: '⚡ 2. Reflex' },
          { key: 'flashcards', label: '🎴 3. 플래시카드' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. Day 범위 선택 셀렉터 */}
      <div className="flex items-center justify-between w-full bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
          📅 학습 범위:
        </span>
        <div className="flex items-center gap-2">
          <select
            value={selectedStartDay}
            onChange={handleStartDayChange}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-1 px-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none"
          >
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
              <option key={`start-${d}`} value={d}>
                Day {d}
              </option>
            ))}
          </select>
          <span className="text-slate-400 font-bold">~</span>
          <select
            value={selectedEndDay}
            onChange={handleEndDayChange}
            className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-1 px-2 rounded-md border border-slate-300 dark:border-slate-600 focus:outline-none"
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
      </div>

      {/* 3. 카드 화면 */}
      {currentItem ? (
        <>
          <Flashcard 
            key={`${activeTab}-${currentItem.id}`} 
            type={activeTab} 
            item={currentItem} 
          />

          {/* 이전 / 다음 컨트롤 버튼 */}
          <div className="flex items-center gap-4 w-full justify-between px-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg shadow hover:bg-slate-100 transition font-medium border border-slate-200 dark:border-slate-700"
            >
              ← 이전
            </button>
            <span className="text-sm text-slate-500 font-medium">
              {currentIndex + 1} / {filteredList.length} 카드
            </span>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
            >
              다음 →
            </button>
          </div>
        </>
      ) : (
        <p className="text-slate-500 my-10">선택한 범위에 데이터가 없습니다.</p>
      )}
    </div>
  );
}