import { getCategoryData } from '@/lib/cards';
import MainView from '@/components/MainView';

export default function Home() {
  const shadowing = getCategoryData('shadowing');
  const reflex = getCategoryData('reflex');
  const flashcards = getCategoryData('flashcards');

  // 가장 데이터가 많은 카테고리 기준으로 총 Day 계산
  const maxItems = Math.max(shadowing.length, reflex.length, flashcards.length);
  const currentTotalDays = Math.max(1, Math.ceil(maxItems / 50));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* 헤더 부분 */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight mb-1">
          🎯 D-Day English
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          현재 <span className="text-indigo-500 font-bold">Day {currentTotalDays}</span> 진행 중 🚀
        </p>
      </div>

      <MainView 
        initialData={{
          shadowing,
          reflex,
          flashcards
        }} 
      />
    </main>
  );
}