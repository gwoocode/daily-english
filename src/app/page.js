import { getCategoryData } from '@/lib/cards';
import MainView from '@/components/MainView';

export default function Home() {
  const shadowing = getCategoryData('shadowing');
  const reflex = getCategoryData('reflex');
  const flashcards = getCategoryData('flashcards');

  const maxItems = Math.max(shadowing.length, reflex.length, flashcards.length);
  const totalDays = Math.max(1, Math.ceil(maxItems / 50));

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-1">
          🎯 D-Day English
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{totalDays} Day</span>
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