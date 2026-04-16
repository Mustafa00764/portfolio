import { useState } from 'react';

export interface Score {
  name: string;
  score: number;
  date: string;
}

export const useHighScores = (maxScores = 10) => {
  // Ленивая инициализация: читаем localStorage при первом рендере
  const [scores, setScores] = useState<Score[]>(() => {
    const stored = localStorage.getItem('geometryDashScores');
    return stored ? JSON.parse(stored) : [];
  });

  const addScore = (name: string, score: number) => {
    const newScore: Score = { name, score, date: new Date().toISOString() };
    const newScores = [...scores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, maxScores);
    setScores(newScores);
    localStorage.setItem('geometryDashScores', JSON.stringify(newScores));
  };

  return { scores, addScore };
};