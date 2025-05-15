import { DailyStats } from '@/types/math';
import { motion } from 'framer-motion';
import { TrophyIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Props {
    stats: DailyStats;
}

export default function Stats({ stats }: Props) {
    const calculatePercentage = (correct: number, total: number) => {
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    };

    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { text: '太棒了！', icon: '🌟' };
        if (percentage >= 80) return { text: '很不错！', icon: '👍' };
        if (percentage >= 70) return { text: '继续加油！', icon: '💪' };
        if (percentage >= 60) return { text: '还需努力！', icon: '📚' };
        return { text: '要更加努力哦！', icon: '✨' };
    };

    const percentage = calculatePercentage(stats.correct, stats.total);
    const grade = getGrade(percentage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full relative overflow-hidden"
        >
            {/* 装饰性背景 */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-200 rounded-full translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200 rounded-full -translate-x-20 translate-y-20"></div>
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">今日学习统计</h2>
                    <TrophyIcon className="w-8 h-8 text-yellow-400" />
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white mb-8">
                    <div className="text-center">
                        <div className="text-6xl font-bold mb-2">{percentage}%</div>
                        <div className="text-xl">
                            <span className="mr-2">{grade.icon}</span>
                            {grade.text}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                            <CheckCircleIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                            <div className="text-sm text-green-600">正确</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                            <XCircleIcon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                            <div className="text-sm text-red-600">错误</div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">难度分布</h3>
                        <div className="space-y-4">
                            {(['easy', 'medium', 'hard'] as const).map((level) => (
                                <div key={level} className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-2">
                                            {level === 'easy' ? '🟢 简单' : level === 'medium' ? '🟡 中等' : '🔴 困难'}
                                        </span>
                                        <span className="font-medium">
                                            {stats.byDifficulty[level].correct} / {stats.byDifficulty[level].total}
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${calculatePercentage(
                                                    stats.byDifficulty[level].correct,
                                                    stats.byDifficulty[level].total
                                                )}%`,
                                            }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${level === 'easy'
                                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                                    : level === 'medium'
                                                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                                        : 'bg-gradient-to-r from-red-400 to-red-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 