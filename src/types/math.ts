export type Difficulty = 'easy' | 'medium' | 'hard';

export type Operator = '+' | '-' | '*' | '/';

export interface MathProblem {
    id: string;
    operand1: number;
    operand2: number;
    operator: Operator;
    answer: number;
    difficulty: Difficulty;
    userAnswer?: number;
    isCorrect?: boolean;
    timestamp: number;
}

export interface DailyStats {
    date: string;
    total: number;
    correct: number;
    incorrect: number;
    byDifficulty: {
        easy: { total: number; correct: number };
        medium: { total: number; correct: number };
        hard: { total: number; correct: number };
    };
} 