'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SURAHS } from '@/lib/constants';

export default function SurahList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.nameAr.includes(searchQuery) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.id).includes(searchQuery)
  );

  return (
    <div className="animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gold-gradient text-xl font-bold font-arabic">السور</h2>
        <span className="text-islamic-muted text-sm">{SURAHS.length} سورة</span>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن سورة..."
          className="w-full bg-islamic-card border border-islamic-border rounded-lg px-4 py-3 text-sm font-arabic placeholder:text-islamic-muted/50 focus:outline-none focus:border-islamic-accent/50 transition-colors"
          dir="rtl"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-islamic-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </div>

      {/* Surah List */}
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pb-4">
        {filteredSurahs.map((surah) => (
          <Link
            key={surah.id}
            href={`/surah/${surah.id}`}
            className="card-islamic p-4 flex items-center justify-between group transition-all duration-200 hover:border-islamic-accent/40 block"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-islamic-accent/10 flex items-center justify-center text-islamic-accent text-sm font-bold rotate-45">
                <span className="-rotate-45">{surah.id}</span>
              </div>
              <div>
                <h3 className="font-arabic font-bold text-base text-foreground/90 group-hover:text-islamic-accent transition-colors">
                  {surah.nameAr}
                </h3>
                <p className="text-islamic-muted text-xs mt-0.5">
                  {surah.nameEn} &middot; {surah.verses} آية
                </p>
              </div>
            </div>
            <div className="text-left">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  surah.type === 'meccan'
                    ? 'bg-islamic-accent/10 text-islamic-accent'
                    : 'bg-islamic-green/10 text-islamic-green'
                }`}
              >
                {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
              </span>
              <p className="text-islamic-muted text-[10px] mt-1">{surah.pages} صفحة</p>
            </div>
          </Link>
        ))}

        {filteredSurahs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-islamic-muted font-arabic">لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}
