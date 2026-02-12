import { SURAHS } from '@/lib/constants';
import SurahPageClient from './SurahPageClient';

export function generateStaticParams() {
  return SURAHS.map((surah) => ({
    id: String(surah.id),
  }));
}

export default function SurahPage() {
  return <SurahPageClient />;
}
