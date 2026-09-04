'use client';

import { useState } from 'react';
import Flashcard from './Flashcard';

export default function MainView({ initialData }) {
  const [activeTab, setActiveTab] = useState('shadowing');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentList = initialData[activeTab] || [];
  const currentItem = currentList[currentIndex];

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* 카테고리 선택 탭 */}
      <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-full justify-between">
        {[
          { key: 'shadowing', label: '🎧 섀도잉' },
          { key: 'reflex', label: '⚡ 스피킹' },
          { key: 'flashcards', label: '🃏 플래시카드' }
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

      {/* 카드 화면 */}
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
              {currentIndex + 1} / {currentList.length}
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
        <p className="text-slate-500 my-10">해당 카테고리에 데이터가 없거나 형식이 틀렸습니다.</p>
      )}
    </div>
  );
}