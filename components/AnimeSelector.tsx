import { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import { AnimeSelectorProps } from '@/interfaces/types';
import { GENRE_CATEGORIES, getAnimesBySteps, type Anime } from '@/utils/genreClassifier';

export default function AnimeSelector({ animes, onComplete }: AnimeSelectorProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnimes, setSelectedAnimes] = useState<Anime[]>([]);
    const [stepAnimes, setStepAnimes] = useState<Anime[][]>([]);

    // 초기화: 각 단계별 애니메이션 준비
    useEffect(() => {
        const animesBySteps = getAnimesBySteps(animes as Anime[]);
        setStepAnimes(animesBySteps);
    }, [animes]);

    const handleSelect = (anime: Anime) => {
        const newSelected = [...selectedAnimes, anime];
        setSelectedAnimes(newSelected);

        // 마지막 단계가 아니면 자동으로 다음 단계로
        if (currentStep < 4) {
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 300);
        } else {
            // 5개 모두 선택 완료
            setTimeout(() => {
                onComplete(newSelected.map(a => a.anime_id));
            }, 500);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setSelectedAnimes(selectedAnimes.slice(0, -1));
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
        setSelectedAnimes([]);
    };

    const currentCategory = GENRE_CATEGORIES[currentStep];
    const currentAnimes = stepAnimes[currentStep] || [];
    const progress = ((currentStep + 1) / 5) * 100;

    return (
        <div className="min-h-screen bg-[#141414] text-white pb-24">
            <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
                {/* 헤더 */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                        당신의 취향을 찾아드립니다
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        각 단계에서 마음에 드는 애니메이션을 선택하세요
                    </p>
                </div>

                {/* 상단 탭바 (장르 네비게이션) */}
                <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    <div className="flex gap-2 min-w-max">
                        {GENRE_CATEGORIES.map((category, idx) => {
                            const isActive = idx === currentStep;
                            const isCompleted = idx < currentStep;

                            return (
                                <div
                                    key={category}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border
                                        ${isActive
                                            ? 'bg-white text-black border-white shadow-lg scale-105'
                                            : isCompleted
                                                ? 'bg-gray-800 text-gray-400 border-gray-700'
                                                : 'bg-transparent text-gray-400 border-gray-800'
                                        }
                                    `}
                                >
                                    {category}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 메인 타이틀 & 설명 */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1" style={{ color: '#ffffff' }}>
                        {currentCategory} 애니메이션 선택
                    </h2>
                    <p className="text-sm text-gray-400">
                        가장 마음에 드는 작품을 하나 골라주세요 ({currentStep + 1}/5)
                    </p>
                </div>

                {/* 애니메이션 그리드 */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                    {currentAnimes.map((anime) => (
                        <div
                            key={anime.anime_id}
                            className="transform transition-all duration-300"
                        >
                            <AnimeCard
                                anime={anime}
                                selected={false}
                                onClick={() => handleSelect(anime)}
                            />
                        </div>
                    ))}
                </div>

                {/* 하단 네비게이션 */}
                {currentStep > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-50">
                        <div className="max-w-3xl mx-auto">
                            <button
                                onClick={handleBack}
                                className="w-full sm:w-auto px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 active:scale-95 transition-all shadow-lg"
                            >
                                ← 이전 단계로
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
