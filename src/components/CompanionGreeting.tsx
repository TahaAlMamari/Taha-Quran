'use client';

import { useEffect, useState, useRef } from 'react';
import { useGeminiCompanion } from '@/hooks/useGeminiCompanion';
import { useTTS } from '@/hooks/useTTS';
import { updateLastLogin } from '@/lib/context-engine';

export default function CompanionGreeting() {
  const { text, isLoading, error, getGreeting } = useGeminiCompanion();
  const { speak, stop, isSpeaking, isSupported } = useTTS();
  const [hasGreeted, setHasGreeted] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    updateLastLogin();

    const fetchGreeting = async () => {
      const greetingText = await getGreeting();
      if (greetingText) {
        setHasGreeted(true);
        // Auto-trigger TTS
        if (isSupported) {
          // Small delay to let the UI render
          setTimeout(() => speak(greetingText), 300);
        }
      }
    };

    fetchGreeting();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="card-islamic p-5 animate-fade-in">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-islamic-accent/20 flex items-center justify-center">
            <span className="text-lg">&#9734;</span>
          </div>
          <h2 className="text-gold-gradient text-lg font-bold font-arabic">الرفيق</h2>
        </div>
        <p className="text-islamic-muted text-sm font-arabic leading-relaxed">
          تعذر الاتصال بالرفيق. تأكد من إعداد مفتاح Gemini API.
        </p>
      </div>
    );
  }

  return (
    <div className="card-islamic p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-islamic-accent/20 flex items-center justify-center animate-glow">
            <span className="text-islamic-accent text-lg">&#9734;</span>
          </div>
          <h2 className="text-gold-gradient text-lg font-bold font-arabic">الرفيق</h2>
        </div>
        {hasGreeted && isSupported && (
          <button
            onClick={() => isSpeaking ? stop() : speak(text)}
            className="p-2 rounded-full hover:bg-islamic-border/50 transition-colors"
            aria-label={isSpeaking ? 'Stop speaking' : 'Play greeting'}
          >
            {isSpeaking ? (
              <svg className="w-5 h-5 text-islamic-accent" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-islamic-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.5 4.5v15l-7-7.5h-3v-7.5h3zm1 7.5c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zm2.5 0c0 2.57-1.46 4.79-3.6 5.89l.84 1.48c2.75-1.4 4.64-4.26 4.64-7.37s-1.89-5.97-4.64-7.37l-.84 1.48c2.14 1.1 3.6 3.32 3.6 5.89z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-4 loading-shimmer rounded w-full" />
          <div className="h-4 loading-shimmer rounded w-4/5" />
          <div className="h-4 loading-shimmer rounded w-3/5" />
        </div>
      ) : (
        <p className="text-foreground/90 font-arabic text-base leading-loose animate-slide-up">
          {text}
        </p>
      )}

      {isSpeaking && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-islamic-accent rounded-full animate-pulse"
                style={{
                  height: `${12 + Math.random() * 12}px`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <span className="text-islamic-muted text-xs">يتحدث...</span>
        </div>
      )}
    </div>
  );
}
