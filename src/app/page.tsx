'use client';

import CompanionGreeting from '@/components/CompanionGreeting';
import StatsBar from '@/components/StatsBar';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="geometric-bg min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <header className="text-center pt-4 animate-fade-in">
          <h1 className="text-gold-gradient text-3xl font-bold font-arabic mb-1">الرفيق</h1>
          <p className="text-islamic-muted text-sm font-arabic">رفيقك في رحلة القرآن</p>
        </header>

        {/* Companion Greeting */}
        <CompanionGreeting />

        {/* Stats */}
        <StatsBar />

        {/* Quick Actions */}
        <div className="space-y-3 animate-slide-up">
          <Link
            href="/quran"
            className="card-islamic p-4 flex items-center justify-between group transition-all hover:border-islamic-accent/40 block"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-islamic-accent/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-islamic-accent" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <div>
                <h3 className="font-arabic font-bold text-foreground/90 group-hover:text-islamic-accent transition-colors">
                  ابدأ القراءة
                </h3>
                <p className="text-islamic-muted text-xs">اختر سورة وابدأ جلسة قراءة</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-islamic-muted group-hover:text-islamic-accent transition-colors rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Decorative verse divider */}
        <div className="verse-divider text-islamic-accent/40 text-xs font-arabic py-2">
          &#1758;
        </div>

        {/* Inspirational Footer */}
        <div className="text-center pb-4">
          <p className="text-islamic-muted/60 text-xs font-arabic leading-relaxed">
            &laquo; إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ &raquo;
          </p>
          <p className="text-islamic-muted/40 text-[10px] mt-1">الإسراء: ٩</p>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
