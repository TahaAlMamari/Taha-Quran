/**
 * Context Engine - Generates contextual data for the AI Companion
 * Gathers time of day, user state, and activity to create a rich prompt context.
 */

export interface UserState {
  lastLogin: string | null; // ISO date string
  streak: number;
  totalPages: number;
  totalSessions: number;
  currentSurah: string | null;
}

export interface CompanionContext {
  timeContext: string;
  userStateContext: string;
  activityContext: string;
  fullPrompt: string;
}

function getTimeOfDay(): { period: string; arabicPeriod: string; isFriday: boolean } {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 5 = Friday

  let period: string;
  let arabicPeriod: string;

  if (hour >= 3 && hour < 6) {
    period = 'fajr';
    arabicPeriod = 'وقت الفجر';
  } else if (hour >= 6 && hour < 12) {
    period = 'morning';
    arabicPeriod = 'وقت الصباح';
  } else if (hour >= 12 && hour < 15) {
    period = 'dhuhr';
    arabicPeriod = 'وقت الظهر';
  } else if (hour >= 15 && hour < 17) {
    period = 'asr';
    arabicPeriod = 'وقت العصر';
  } else if (hour >= 17 && hour < 19) {
    period = 'maghrib';
    arabicPeriod = 'وقت المغرب';
  } else if (hour >= 19 && hour < 21) {
    period = 'isha';
    arabicPeriod = 'وقت العشاء';
  } else {
    period = 'late_night';
    arabicPeriod = 'وقت متأخر من الليل';
  }

  return { period, arabicPeriod, isFriday: day === 5 };
}

function getDaysSinceLastLogin(lastLogin: string | null): number {
  if (!lastLogin) return -1; // First-time user
  const last = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getUserState(): UserState {
  if (typeof window === 'undefined') {
    return { lastLogin: null, streak: 0, totalPages: 0, totalSessions: 0, currentSurah: null };
  }

  return {
    lastLogin: localStorage.getItem('alrafiq_lastLogin'),
    streak: parseInt(localStorage.getItem('alrafiq_streak') || '0', 10),
    totalPages: parseInt(localStorage.getItem('alrafiq_totalPages') || '0', 10),
    totalSessions: parseInt(localStorage.getItem('alrafiq_totalSessions') || '0', 10),
    currentSurah: localStorage.getItem('alrafiq_currentSurah'),
  };
}

export function updateLastLogin(): void {
  if (typeof window === 'undefined') return;

  const now = new Date().toISOString();
  const lastLogin = localStorage.getItem('alrafiq_lastLogin');
  const daysSince = getDaysSinceLastLogin(lastLogin);

  // Update streak logic
  if (daysSince === -1 || daysSince > 1) {
    // First time or broke streak
    localStorage.setItem('alrafiq_streak', '1');
  } else if (daysSince === 1) {
    // Consecutive day
    const currentStreak = parseInt(localStorage.getItem('alrafiq_streak') || '0', 10);
    localStorage.setItem('alrafiq_streak', String(currentStreak + 1));
  }
  // daysSince === 0 means same day, don't increment streak

  localStorage.setItem('alrafiq_lastLogin', now);
}

export function updateReadingSession(surahName: string, pages: number): void {
  if (typeof window === 'undefined') return;

  const totalPages = parseInt(localStorage.getItem('alrafiq_totalPages') || '0', 10);
  const totalSessions = parseInt(localStorage.getItem('alrafiq_totalSessions') || '0', 10);

  localStorage.setItem('alrafiq_totalPages', String(totalPages + pages));
  localStorage.setItem('alrafiq_totalSessions', String(totalSessions + 1));
  localStorage.setItem('alrafiq_currentSurah', surahName);
}

export function generateCompanionContext(surahName?: string): CompanionContext {
  const userState = getUserState();
  const { arabicPeriod, isFriday } = getTimeOfDay();
  const daysSinceLastLogin = getDaysSinceLastLogin(userState.lastLogin);

  // --- Time Context ---
  let timeContext = `الوقت الآن: ${arabicPeriod}.`;
  if (isFriday) {
    timeContext += ' واليوم هو يوم الجمعة المبارك.';
  }

  // --- User State Context ---
  let userStateContext: string;

  if (daysSinceLastLogin === -1) {
    // First-time user
    userStateContext = 'هذا المستخدم يفتح التطبيق لأول مرة. رحب به ترحيبًا حارًا وشجعه على بدء رحلته مع القرآن.';
  } else if (daysSinceLastLogin > 3) {
    userStateContext = `المستخدم غائب منذ ${daysSinceLastLogin} أيام. كن لطيفًا في عتابه، وأظهر شيئًا من الحزن على غيابه، لكن شجعه بحنان على العودة. ذكّره بأن باب الله مفتوح دائمًا.`;
  } else if (daysSinceLastLogin >= 1) {
    userStateContext = `المستخدم عاد بعد ${daysSinceLastLogin} يوم. رحب بعودته.`;
  } else {
    userStateContext = 'المستخدم نشط اليوم بالفعل.';
  }

  if (userState.streak > 3) {
    userStateContext += ` المستخدم في سلسلة متواصلة من ${userState.streak} أيام! كن فخورًا به وشجعه على المواصلة.`;
  }

  if (userState.totalPages > 0) {
    userStateContext += ` قرأ المستخدم إجمالي ${userState.totalPages} صفحة في ${userState.totalSessions} جلسة.`;
  }

  // --- Activity Context ---
  let activityContext = '';
  const activeSurah = surahName || userState.currentSurah;

  if (activeSurah) {
    activityContext = `المستخدم يتعامل مع سورة ${activeSurah}.`;
  }

  if (isFriday && !surahName) {
    activityContext += ' ذكّر المستخدم بفضل قراءة سورة الكهف يوم الجمعة.';
  }

  // --- Compose Full Prompt ---
  const fullPrompt = `${timeContext}

${userStateContext}

${activityContext}

أنت رفيق المستخدم في رحلته مع القرآن الكريم. تكلم بإيجاز ووضوح. ردك يجب أن يكون بين ٣ إلى ٥ جمل فقط. لا تستخدم النقاط أو القوائم. اجعل كلامك كأنه حديث شخصي مباشر.`.trim();

  return {
    timeContext,
    userStateContext,
    activityContext,
    fullPrompt,
  };
}

export function generateReflectionPrompt(surahNameAr: string, surahNameEn: string): string {
  return `المستخدم يطلب تأملاً (تدبرًا) في سورة ${surahNameAr} (${surahNameEn}).

قدّم تأملاً روحيًا عميقًا في أبرز محاور السورة وأهم الدروس المستفادة منها. اربط ذلك بحياة المسلم المعاصرة.

اجعل ردك مختصرًا (٤ إلى ٦ جمل) وعميقًا. تكلم وكأنك شيخ حكيم يجلس مع تلميذه.`;
}
