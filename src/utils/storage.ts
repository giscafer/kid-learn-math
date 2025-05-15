import { DailyStats, MathProblem } from '@/types/math';
import { getTodayDateString } from './mathUtils';

const STORAGE_KEYS = {
    DAILY_STATS: 'math_daily_stats',
    HISTORY: 'math_history',
};

const isClient = typeof window !== 'undefined';

export function saveProblemResult(problem: MathProblem): void {
    if (!isClient) return;

    const history = getProblemHistory();
    history.push(problem);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    updateDailyStats(problem);
}

export function getProblemHistory(): MathProblem[] {
    if (!isClient) return [];

    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return historyStr ? JSON.parse(historyStr) : [];
}

export function getDailyStats(): DailyStats {
    if (!isClient) {
        return {
            date: getTodayDateString(),
            total: 0,
            correct: 0,
            incorrect: 0,
            byDifficulty: {
                easy: { total: 0, correct: 0 },
                medium: { total: 0, correct: 0 },
                hard: { total: 0, correct: 0 },
            },
        };
    }

    const today = getTodayDateString();
    const statsStr = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    const stats = statsStr ? JSON.parse(statsStr) : {};

    if (!stats[today]) {
        stats[today] = {
            date: today,
            total: 0,
            correct: 0,
            incorrect: 0,
            byDifficulty: {
                easy: { total: 0, correct: 0 },
                medium: { total: 0, correct: 0 },
                hard: { total: 0, correct: 0 },
            },
        };
        localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
    }

    return stats[today];
}

function updateDailyStats(problem: MathProblem): void {
    if (!isClient) return;

    const today = getTodayDateString();
    const statsStr = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    const stats = statsStr ? JSON.parse(statsStr) : {};

    if (!stats[today]) {
        stats[today] = {
            date: today,
            total: 0,
            correct: 0,
            incorrect: 0,
            byDifficulty: {
                easy: { total: 0, correct: 0 },
                medium: { total: 0, correct: 0 },
                hard: { total: 0, correct: 0 },
            },
        };
    }

    const todayStats = stats[today];
    todayStats.total++;

    if (problem.isCorrect) {
        todayStats.correct++;
        todayStats.byDifficulty[problem.difficulty].correct++;
    } else {
        todayStats.incorrect++;
    }

    todayStats.byDifficulty[problem.difficulty].total++;

    localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
} 