import { getCategoryData } from '@/lib/cards';
import MainView from '@/components/MainView';

export default function Home() {
  const shadowing = getCategoryData('shadowing');
  const reflex = getCategoryData('reflex');
  const flashcards = getCategoryData('flashcards');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-6">
        🗣️ Real English Trainer
      </h1>
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