import { Difficulty, MathProblem, Operator } from '@/types/math';

const DIFFICULTY_RANGES = {
    easy: {
        max: 10,
        operators: ['+', '-'] as Operator[],
    },
    medium: {
        max: 20,
        operators: ['+', '-', '*'] as Operator[],
    },
    hard: {
        max: 50,
        operators: ['+', '-', '*', '/'] as Operator[],
    },
};

function generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * max) + 1;
}

function generateDivisionProblem(difficulty: Difficulty): { operand1: number; operand2: number; answer: number } {
    const maxNumber = DIFFICULTY_RANGES[difficulty].max;
    const answer = generateRandomNumber(Math.floor(maxNumber / 2));
    const operand2 = generateRandomNumber(Math.floor(maxNumber / answer));
    const operand1 = answer * operand2;
    return { operand1, operand2, answer };
}

export function generateProblem(difficulty: Difficulty): MathProblem {
    const { max, operators } = DIFFICULTY_RANGES[difficulty];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let operand1: number, operand2: number, answer: number;

    if (operator === '/') {
        const divisionProblem = generateDivisionProblem(difficulty);
        operand1 = divisionProblem.operand1;
        operand2 = divisionProblem.operand2;
        answer = divisionProblem.answer;
    } else {
        operand1 = generateRandomNumber(max);
        operand2 = generateRandomNumber(max);

        switch (operator) {
            case '+':
                answer = operand1 + operand2;
                break;
            case '-':
                // Ensure no negative numbers
                if (operand1 < operand2) {
                    [operand1, operand2] = [operand2, operand1];
                }
                answer = operand1 - operand2;
                break;
            case '*':
                // Adjust numbers for multiplication to avoid too large results
                operand1 = generateRandomNumber(Math.floor(Math.sqrt(max)));
                operand2 = generateRandomNumber(Math.floor(Math.sqrt(max)));
                answer = operand1 * operand2;
                break;
            default:
                throw new Error('Invalid operator');
        }
    }

    return {
        id: Math.random().toString(36).substring(2, 9),
        operand1,
        operand2,
        operator,
        answer,
        difficulty,
        timestamp: Date.now(),
    };
}

export function formatProblem(problem: MathProblem, showAnswer: boolean = false): string {
    return `${problem.operand1} ${problem.operator} ${problem.operand2} = ${showAnswer ? problem.answer : '?'}`;
}

export function checkAnswer(problem: MathProblem, userAnswer: number): boolean {
    return Math.abs(problem.answer - userAnswer) < 0.0001; // Handle floating point comparison
}

export function getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
} 