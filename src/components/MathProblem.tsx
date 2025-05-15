import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathProblem as MathProblemType, Difficulty } from '@/types/math';
import { generateProblem, formatProblem, checkAnswer } from '@/utils/mathUtils';
import { saveProblemResult } from '@/utils/storage';
import Confetti from 'react-confetti';
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface Props {
    difficulty: Difficulty;
    onComplete: () => void;
}

export default function MathProblem({ difficulty, onComplete }: Props) {
    const [problem, setProblem] = useState<MathProblemType>(generateProblem(difficulty));
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        setProblem(generateProblem(difficulty));
        setUserAnswer('');
        setShowResult(false);
        setShowAnswer(false);
    }, [difficulty]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const answer = parseFloat(userAnswer);
        if (isNaN(answer)) return;

        const correct = checkAnswer(problem, answer);
        setIsCorrect(correct);
        setShowResult(true);

        const completedProblem = {
            ...problem,
            userAnswer: answer,
            isCorrect: correct,
        };
        saveProblemResult(completedProblem);
    };

    const handleNext = () => {
        setProblem(generateProblem(difficulty));
        setUserAnswer('');
        setShowResult(false);
        setShowAnswer(false);
        onComplete();
    };

    const getDifficultyColor = (level: Difficulty) => {
        switch (level) {
            case 'easy':
                return 'from-green-400 to-green-500';
            case 'medium':
                return 'from-yellow-400 to-yellow-500';
            case 'hard':
                return 'from-red-400 to-red-500';
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden"
                >
                    {/* 装饰性背景 */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full translate-x-16 translate-y-16"></div>
                    </div>

                    <div className="relative">
                        <motion.h2
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="text-4xl md:text-6xl font-bold mb-8 text-gray-800"
                        >
                            {formatProblem(problem, isCorrect && showResult)}
                        </motion.h2>

                        {!showResult ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        className="w-full text-3xl text-center p-6 border-2 border-gray-200 rounded-xl focus:border-blue-500 
                                          focus:outline-none bg-white/50 backdrop-blur-sm transition-all"
                                        placeholder="输入答案"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex-1 mt-4 bg-gradient-to-r ${getDifficultyColor(difficulty)} 
                                              text-white text-xl py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all
                                              flex items-center justify-center gap-2`}
                                        >
                                            <span>提交答案</span>
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={handleNext}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="mt-4 px-4 py-4 text-gray-500 hover:text-gray-700 bg-gray-100 
                                              hover:bg-gray-200 rounded-xl transition-all text-sm"
                                        >
                                            跳过
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="text-6xl mb-4"
                                >
                                    {isCorrect ? (
                                        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto" />
                                    ) : (
                                        <XCircleIcon className="w-20 h-20 text-red-500 mx-auto" />
                                    )}
                                </motion.div>
                                <p className="text-2xl font-bold mb-4">
                                    {isCorrect ? (
                                        <span className="text-green-500">太棒了！答对了！</span>
                                    ) : (
                                        <span className="text-red-500">加油！再试一次！</span>
                                    )}
                                </p>
                                {!isCorrect && !showAnswer && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowAnswer(true)}
                                        className="w-full bg-gray-500 text-white text-xl py-4 px-6 rounded-xl shadow-lg 
                                          hover:shadow-xl transition-all mb-2"
                                    >
                                        查看答案
                                    </motion.button>
                                )}
                                {showAnswer && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xl mb-4"
                                    >
                                        正确答案是: <span className="font-bold text-2xl">{problem.answer}</span>
                                    </motion.p>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleNext}
                                    className={`w-full bg-gradient-to-r ${getDifficultyColor(difficulty)} 
                                      text-white text-xl py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all
                                      flex items-center justify-center gap-2`}
                                >
                                    <span>下一题</span>
                                    <ArrowRightIcon className="w-5 h-5" />
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
            {showResult && isCorrect && (
                <Confetti
                    numberOfPieces={200}
                    recycle={false}
                    colors={['#60A5FA', '#34D399', '#F472B6', '#FBBF24']}
                />
            )}
        </div>
    );
} 