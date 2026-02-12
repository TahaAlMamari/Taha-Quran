'use client';

import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_INSTRUCTION } from '@/lib/constants';
import { generateCompanionContext, generateReflectionPrompt } from '@/lib/context-engine';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

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
      if (!API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured');
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      setResponse({ text, isLoading: false, error: null });
      return text;
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
