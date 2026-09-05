import { getAllDaysData } from '@/lib/cards';
import MainView from '@/components/MainView';

export default function Page() {
  const allCards = getAllDaysData();

  return <MainView allCards={allCards} />;
}