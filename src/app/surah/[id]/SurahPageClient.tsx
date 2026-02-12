'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SURAHS } from '@/lib/constants';
import { updateReadingSession } from '@/lib/context-engine';
import { useGeminiCompanion } from '@/hooks/useGeminiCompanion';
import { useTTS } from '@/hooks/useTTS';
import BottomNav from '@/components/BottomNav';

type SessionState = 'idle' | 'reading' | 'finished';

export default function SurahPageClient() {
  const params = useParams();
  const router = useRouter();
  const surahId = Number(params.id);
  const surah = SURAHS.find((s) => s.id === surahId);

  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reflection
  const [showReflection, setShowReflection] = useState(false);
  const { text: reflectionText, isLoading: reflectionLoading, getReflection } = useGeminiCompanion();
  const { speak, stop, isSpeaking, isSupported } = useTTS();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!surah) {
    return (
      <main className="geometric-bg min-h-screen flex items-center justify-center pb-20">
        <div className="text-center">
          <p className="text-islamic-muted font-arabic text-lg">السورة غير موجودة</p>
          <button
            onClick={() => router.push('/quran')}
            className="mt-4 text-islamic-accent font-arabic text-sm underline"
          >
            العودة إلى القرآن
          </button>
        </div>
        <BottomNav />
      </main>
    );
  }

  const startReading = () => {
    const now = new Date();
    setStartTime(now);
    setSessionState('reading');
    setElapsed(0);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  };

  const finishReading = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSessionState('finished');
    updateReadingSession(surah.nameAr, surah.pages);
  };

  const handleReflection = async () => {
    setShowReflection(true);
    const text = await getReflection(surah.nameAr, surah.nameEn);
    if (text && isSupported) {
      setTimeout(() => speak(text), 300);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="geometric-bg min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Back button + Header */}
        <header className="animate-fade-in">
          <button
            onClick={() => router.push('/quran')}
            className="flex items-center gap-2 text-islamic-muted hover:text-islamic-accent transition-colors mb-4"
          >
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-arabic">العودة</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-islamic-accent/10 border border-islamic-accent/20 mb-3">
              <span className="text-islamic-accent text-2xl font-bold">{surah.id}</span>
            </div>
            <h1 className="text-gold-gradient text-3xl font-bold font-arabic">{surah.nameAr}</h1>
            <p className="text-islamic-muted text-sm mt-1">{surah.nameEn}</p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-islamic-muted">
              <span>{surah.verses} آية</span>
              <span className="w-1 h-1 rounded-full bg-islamic-muted/50" />
              <span>{surah.pages} صفحة</span>
              <span className="w-1 h-1 rounded-full bg-islamic-muted/50" />
              <span
                className={`px-2 py-0.5 rounded-full ${
                  surah.type === 'meccan'
                    ? 'bg-islamic-accent/10 text-islamic-accent'
                    : 'bg-islamic-green/10 text-islamic-green'
                }`}
              >
                {surah.type === 'meccan' ? 'مكية' : 'مدنية'}
              </span>
            </div>
          </div>
        </header>

        <div className="verse-divider text-islamic-accent/40 text-xs font-arabic">&#1758;</div>

        {/* Reading Session Card */}
        <div className="card-islamic p-6 text-center animate-slide-up">
          {sessionState === 'idle' && (
            <>
              <p className="text-islamic-muted font-arabic mb-4">ابدأ جلسة قراءة لتتبع تقدمك</p>
              <button
                onClick={startReading}
                className="w-full py-3 rounded-xl bg-islamic-accent/20 text-islamic-accent font-arabic font-bold text-lg hover:bg-islamic-accent/30 transition-colors border border-islamic-accent/30"
              >
                ابدأ القراءة
              </button>
            </>
          )}

          {sessionState === 'reading' && (
            <>
              <div className="mb-4">
                <p className="text-islamic-muted font-arabic text-sm mb-2">وقت القراءة</p>
                <p className="text-islamic-accent text-4xl font-bold tabular-nums">{formatTime(elapsed)}</p>
              </div>
              <div className="flex gap-1 justify-center mb-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-islamic-accent animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
              <button
                onClick={finishReading}
                className="w-full py-3 rounded-xl bg-islamic-green/20 text-islamic-green font-arabic font-bold text-lg hover:bg-islamic-green/30 transition-colors border border-islamic-green/30"
              >
                أنهيت القراءة
              </button>
            </>
          )}

          {sessionState === 'finished' && (
            <>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-islamic-green/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-islamic-green" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-islamic-green font-arabic font-bold text-lg mb-1">بارك الله فيك!</p>
              <p className="text-islamic-muted font-arabic text-sm">
                قرأت {surah.pages} صفحة في {formatTime(elapsed)}
              </p>
              <button
                onClick={() => {
                  setSessionState('idle');
                  setElapsed(0);
                }}
                className="mt-4 text-islamic-accent font-arabic text-sm underline"
              >
                جلسة جديدة
              </button>
            </>
          )}
        </div>

        {/* Reflection Mode */}
        <div className="card-islamic p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gold-gradient font-bold font-arabic">تدبر السورة</h3>
            {showReflection && reflectionText && isSupported && (
              <button
                onClick={() => isSpeaking ? stop() : speak(reflectionText)}
                className="p-2 rounded-full hover:bg-islamic-border/50 transition-colors"
              >
                {isSpeaking ? (
                  <svg className="w-4 h-4 text-islamic-accent" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-islamic-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.5 4.5v15l-7-7.5h-3v-7.5h3zm1 7.5c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zm2.5 0c0 2.57-1.46 4.79-3.6 5.89l.84 1.48c2.75-1.4 4.64-4.26 4.64-7.37s-1.89-5.97-4.64-7.37l-.84 1.48c2.14 1.1 3.6 3.32 3.6 5.89z" />
                  </svg>
                )}
              </button>
            )}
          </div>

          {!showReflection ? (
            <button
              onClick={handleReflection}
              className="w-full py-3 rounded-xl bg-islamic-card border border-islamic-border text-islamic-muted font-arabic hover:border-islamic-accent/30 hover:text-islamic-accent transition-all"
            >
              اطلب تأملاً في سورة {surah.nameAr}
            </button>
          ) : reflectionLoading ? (
            <div className="space-y-3 py-2">
              <div className="h-4 loading-shimmer rounded w-full" />
              <div className="h-4 loading-shimmer rounded w-5/6" />
              <div className="h-4 loading-shimmer rounded w-4/6" />
              <div className="h-4 loading-shimmer rounded w-3/6" />
            </div>
          ) : (
            <div>
              <p className="text-foreground/90 font-arabic text-base leading-loose animate-slide-up">
                {reflectionText}
              </p>
              <button
                onClick={() => {
                  setShowReflection(false);
                  stop();
                }}
                className="mt-3 text-islamic-muted text-xs font-arabic underline"
              >
                طلب تأمل جديد
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
