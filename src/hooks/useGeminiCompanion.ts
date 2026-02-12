'use client';

import { useState, useCallback } from 'react';
import { generateCompanionContext, generateReflectionPrompt } from '@/lib/context-engine';

interface CompanionResponse {
  text: string;
  isLoading: boolean;
  error: string | null;
}

export function useGeminiCompanion() {
  const [response, setResponse] = useState<CompanionResponse>({
    text: '',
    isLoading: false,
    error: null,
  });

  const callCompanion = useCallback(async (prompt: string) => {
    setResponse({ text: '', isLoading: true, error: null });

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to get companion response');
      }

      const data = await res.json();
      setResponse({ text: data.text, isLoading: false, error: null });
      return data.text as string;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setResponse({ text: '', isLoading: false, error: message });
      return null;
    }
  }, []);

  const getGreeting = useCallback(async () => {
    const context = generateCompanionContext();
    return callCompanion(context.fullPrompt);
  }, [callCompanion]);

  const getReflection = useCallback(async (surahNameAr: string, surahNameEn: string) => {
    const prompt = generateReflectionPrompt(surahNameAr, surahNameEn);
    return callCompanion(prompt);
  }, [callCompanion]);

  const getSurahGreeting = useCallback(async (surahNameAr: string) => {
    const context = generateCompanionContext(surahNameAr);
    return callCompanion(context.fullPrompt);
  }, [callCompanion]);

  return {
    ...response,
    getGreeting,
    getReflection,
    getSurahGreeting,
  };
}
