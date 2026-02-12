'use client';

import { useState, useEffect } from 'react';
import { getUserState } from '@/lib/context-engine';

export default function StatsBar() {
  const [stats, setStats] = useState({ streak: 0, totalPages: 0, totalSessions: 0 });

  useEffect(() => {
    const state = getUserState();
    setStats({
      streak: state.streak,
      totalPages: state.totalPages,
      totalSessions: state.totalSessions,
    });
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3 animate-slide-up">
      <div className="card-islamic p-3 text-center">
        <p className="text-islamic-accent text-2xl font-bold">{stats.streak}</p>
        <p className="text-islamic-muted text-xs mt-1">ايام متواصلة</p>
      </div>
      <div className="card-islamic p-3 text-center">
        <p className="text-islamic-accent text-2xl font-bold">{stats.totalPages}</p>
        <p className="text-islamic-muted text-xs mt-1">صفحة</p>
      </div>
      <div className="card-islamic p-3 text-center">
        <p className="text-islamic-accent text-2xl font-bold">{stats.totalSessions}</p>
        <p className="text-islamic-muted text-xs mt-1">جلسة</p>
      </div>
    </div>
  );
}
