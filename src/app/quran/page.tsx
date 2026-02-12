'use client';

import SurahList from '@/components/SurahList';
import BottomNav from '@/components/BottomNav';

export default function QuranPage() {
  return (
    <main className="geometric-bg min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center pt-4 mb-6 animate-fade-in">
          <h1 className="text-gold-gradient text-2xl font-bold font-arabic mb-1">القرآن الكريم</h1>
          <p className="text-islamic-muted text-sm font-arabic">اختر سورة لبدء القراءة</p>
        </header>

        <SurahList />
      </div>

      <BottomNav />
    </main>
  );
}
