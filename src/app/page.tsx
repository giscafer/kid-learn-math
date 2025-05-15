'use client';

import { useState, useEffect } from 'react';
import { Difficulty } from '@/types/math';
import MathProblem from '@/components/MathProblem';
import Stats from '@/components/Stats';
import { getDailyStats } from '@/utils/storage';
import { motion } from 'framer-motion';
import { StarIcon, ChartBarIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [stats, setStats] = useState(getDailyStats());
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Update stats when a problem is completed
    const interval = setInterval(() => {
      setStats(getDailyStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
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
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-4 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-16 right-1/4 w-80 h-80 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 inline-block">
              趣味学数学
            </h1>
            <div className="flex justify-center">
              <StarIcon className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-6 mt-8">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDifficultyChange(level)}
                className={`px-8 py-3 rounded-xl text-lg font-medium transition-all shadow-lg
                  ${difficulty === level
                    ? `bg-gradient-to-r ${getDifficultyColor(level)} text-white scale-105`
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
                  }`}
              >
                {level === 'easy' ? '简单' : level === 'medium' ? '中等' : '困难'}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowStats(!showStats)}
            className="mb-6 px-8 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl text-lg font-medium 
              hover:bg-white transition-all shadow-lg flex items-center justify-center mx-auto gap-2"
          >
            <ChartBarIcon className="w-5 h-5" />
            {showStats ? '继续答题' : '查看统计'}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {showStats ? (
            <Stats stats={stats} />
          ) : (
            <MathProblem
              difficulty={difficulty}
              onComplete={() => setStats(getDailyStats())}
            />
          )}
        </motion.div>
      </div>
    </main>
  );
}
