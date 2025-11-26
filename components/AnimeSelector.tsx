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
    const progress = ((currentStep) / 5) * 100;

    // 장르별 이모지 매핑
    const genreEmojis: Record<string, string> = {
        '액션': '⚔️',
        '로맨스': '💕',
        '코미디': '😂',
        '판타지': '🌀',
        'SF': '🔮',
        '드라마': '🎭',
        '스포츠': '⚽',
        '일상': '🏫',
        '호러': '😱',
        '미스터리': '🔍',
    };

    const getGenreEmoji = (genre: string) => genreEmojis[genre] || '🎬';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* 상단 네비게이션 바 */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]">
                <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00d26a] to-[#00a854] rounded-lg flex items-center justify-center text-base">
                            🎬
                        </div>
                        <span className="text-lg font-bold tracking-wide">ANILIGHTS</span>
                    </div>

                    {/* 진행률 표시 (데스크탑) */}
                    <div className="hidden sm:flex items-center gap-3">
                        <span className="text-xs text-[#666]">취향 분석 중</span>
                        <div className="w-32 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#00d26a] to-[#00ff88] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-[#00d26a]">{currentStep}/5</span>
                    </div>

                    {currentStep > 0 && (
                        <button
                            onClick={handleReset}
                            className="text-xs text-[#666] hover:text-white transition-colors"
                        >
                            처음부터
                        </button>
                    )}
                </div>
            </nav>

            {/* 메인 컨텐츠 */}
            <div className="max-w-4xl mx-auto px-4 pt-20 pb-32">
                {/* 헤더 섹션 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 border border-[#00d26a]/20 px-4 py-1.5 rounded-full text-xs text-[#00d26a] mb-4">
                        <span className="w-1.5 h-1.5 bg-[#00d26a] rounded-full animate-pulse" />
                        SVD 협업 필터링 분석 중
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                        <span className="text-[#888] line-through text-lg sm:text-xl">뭐 볼지 고민하다 밤새지 말고</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#00ff88]">
                            5개만 고르면 끝!
                        </span>
                    </h1>

                    <p className="text-sm text-[#666] mt-2">
                        어려우시면 그냥 끌리는 거 고르세요. 알고리즘이 알아서 합니다 🧠
                    </p>
                </div>

                {/* 장르 탭 네비게이션 */}
                <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 min-w-max pb-2">
                        {GENRE_CATEGORIES.map((category, idx) => {
                            const isActive = idx === currentStep;
                            const isCompleted = idx < currentStep;
                            const isPending = idx > currentStep;

                            return (
                                <button
                                    key={category}
                                    disabled={isPending}
                                    onClick={() => {
                                        if (isCompleted) {
                                            setCurrentStep(idx);
                                            setSelectedAnimes(selectedAnimes.slice(0, idx));
                                        }
                                    }}
                                    className={`
                                        relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black shadow-lg shadow-[#00d26a]/20'
                                            : isCompleted
                                                ? 'bg-[#1a1a1a] text-white border border-[#00d26a]/30 cursor-pointer hover:border-[#00d26a]'
                                                : 'bg-[#0f0f0f] text-[#444] border border-[#1a1a1a] cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {isCompleted && <span className="text-[#00d26a]">✓</span>}
                                        {getGenreEmoji(category)} {category}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 현재 단계 정보 */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-2xl">{getGenreEmoji(currentCategory)}</span>
                            {currentCategory}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#666] mt-0.5">
                            이 중에서 가장 마음에 드는 작품 하나만 골라주세요
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-[#00d26a]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                            {currentStep + 1}/5
                        </div>
                        <div className="text-[10px] text-[#555] uppercase tracking-wider">STEP</div>
                    </div>
                </div>

                {/* 선택된 애니메이션 미니 프리뷰 */}
                {selectedAnimes.length > 0 && (
                    <div className="mb-6 p-3 bg-[#111] rounded-xl border border-[#1a1a1a]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[#666]">선택한 작품</span>
                            <span className="text-xs text-[#00d26a]">{selectedAnimes.length}개 선택됨</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {selectedAnimes.map((anime, idx) => (
                                <div
                                    key={anime.anime_id}
                                    className="relative flex-shrink-0 w-12 h-16 rounded-lg overflow-hidden ring-2 ring-[#00d26a]/50"
                                >
                                    <img
                                        src={anime.image_url || '/placeholder.jpg'}
                                        alt={anime.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#00d26a] rounded-full flex items-center justify-center text-[8px] text-black font-bold">
                                        {idx + 1}
                                    </div>
                                </div>
                            ))}
                            {/* 남은 슬롯 표시 */}
                            {Array.from({ length: 5 - selectedAnimes.length }).map((_, idx) => (
                                <div
                                    key={`empty-${idx}`}
                                    className="flex-shrink-0 w-12 h-16 rounded-lg border-2 border-dashed border-[#2a2a2a] flex items-center justify-center"
                                >
                                    <span className="text-[#333] text-lg">?</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 애니메이션 그리드 */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {currentAnimes.map((anime, index) => (
                        <div
                            key={anime.anime_id}
                            className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10"
                            style={{
                                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                            }}
                        >
                            <div
                                onClick={() => handleSelect(anime)}
                                className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group bg-[#1a1a1a]"
                            >
                                <img
                                    src={anime.image_url || '/placeholder.jpg'}
                                    alt={anime.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* 호버 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-sm font-bold text-white leading-tight line-clamp-2">
                                            {anime.title}
                                        </p>
                                        {anime.genres && (
                                            <p className="text-[10px] text-[#888] mt-1 line-clamp-1">
                                                {anime.genres}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* 선택 유도 버튼 (호버 시) */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <div className="w-12 h-12 bg-[#00d26a] rounded-full flex items-center justify-center shadow-lg shadow-[#00d26a]/30 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <span className="text-black text-xl">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 빈 상태 */}
                {currentAnimes.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-[#666]">애니메이션을 불러오는 중...</p>
                    </div>
                )}
            </div>

            {/* 하단 고정 바 */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* 프로그레스 바 */}
                <div className="bg-[#0a0a0a] border-t border-[#1a1a1a]">
                    <div className="h-1 bg-[#1a1a1a]">
                        <div
                            className="h-full bg-gradient-to-r from-[#00d26a] to-[#00ff88] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* 네비게이션 버튼 */}
                <div className="bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-[#0a0a0a]/95 px-4 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        {currentStep > 0 ? (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-5 py-3 bg-[#1a1a1a] hover:bg-[#242424] text-white rounded-xl font-medium transition-all active:scale-95 border border-[#2a2a2a]"
                            >
                                <span>←</span>
                                <span className="hidden sm:inline">이전으로</span>
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="text-center">
                            <p className="text-xs text-[#666]">
                                {5 - selectedAnimes.length}개 더 선택하면 추천 시작!
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {selectedAnimes.length === 5 ? (
                                <button
                                    onClick={() => onComplete(selectedAnimes.map(a => a.anime_id))}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl shadow-lg shadow-[#00d26a]/20 hover:shadow-[#00d26a]/40 transition-all active:scale-95"
                                >
                                    추천받기 🚀
                                </button>
                            ) : (
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${idx < selectedAnimes.length
                                                ? 'bg-[#00d26a]'
                                                : 'bg-[#2a2a2a]'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 애니메이션 스타일 */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
