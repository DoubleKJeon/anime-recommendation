import { RecommendationListProps } from '@/interfaces/types';

export default function RecommendationList({ recommendations, onReset }: RecommendationListProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* 상단 네비게이션 */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#00d26a] to-[#00a854] rounded-lg flex items-center justify-center text-base">
                            🎬
                        </div>
                        <span className="text-lg font-bold tracking-wide">ANILIGHTS</span>
                    </div>

                    <button
                        onClick={onReset}
                        className="text-sm text-[#888] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="hidden sm:inline">다시 추천받기</span>
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-6 pb-32">
                {/* 헤더 섹션 */}
                <div className="mb-8">
                    {/* 성공 배지 */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 border border-[#00d26a]/20 px-4 py-2 rounded-full">
                            <span className="w-2 h-2 bg-[#00d26a] rounded-full animate-pulse" />
                            <span className="text-sm text-[#00d26a]">취향 분석 완료!</span>
                        </div>
                    </div>

                    {/* 메인 타이틀 */}
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                            당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#00ff88]">인생작</span>이 될 수도 있는
                            <br className="sm:hidden" />
                            <span className="text-[#00d26a]"> {recommendations.length}</span>개의 작품
                        </h1>
                        <p className="text-[#666] text-sm sm:text-base">
                            SVD 협업 필터링이 찾아낸 당신 취향 저격 애니메이션
                        </p>
                    </div>

                    {/* 통계 카드 - 예상 적중률 제거 */}
                    <div className="flex justify-center gap-4 mt-6">
                        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-center">
                            <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                {recommendations.length}
                            </div>
                            <div className="text-[10px] text-[#555] uppercase tracking-wider">추천 작품</div>
                        </div>
                        <div className="bg-[#111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-center">
                            <div className="text-2xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                12
                            </div>
                            <div className="text-[10px] text-[#555] uppercase tracking-wider">분석 차원</div>
                        </div>
                    </div>
                </div>

                {/* 추천 그리드 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                    {recommendations.map((rec, idx) => (
                        <div
                            key={rec.anime_id}
                            className="group relative"
                            style={{
                                animation: `fadeInUp 0.5s ease-out ${idx * 0.03}s both`
                            }}
                        >
                            {/* 카드 */}
                            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-10 hover:shadow-2xl hover:shadow-[#00d26a]/10">
                                {/* 순위 배지 (상위 3개) - 카드 안쪽으로 조정 */}
                                {idx < 3 && (
                                    <div className={`absolute top-1.5 left-1.5 z-20 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                                            idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                )}

                                <img
                                    src={rec.image_url || '/placeholder.jpg'}
                                    alt={rec.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                {/* 그라데이션 오버레이 */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* 호버 시 정보 */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 mb-1">
                                        {rec.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] text-[#888]">
                                        <span className="flex items-center gap-0.5 text-[#00d26a]">
                                            🎯 {(rec.match_score * 100).toFixed(0)}%
                                        </span>
                                        {rec.genre && (
                                            <span className="truncate">{rec.genre}</span>
                                        )}
                                    </div>
                                </div>

                                {/* 매칭률 표시 - 항상 표시 */}
                                {rec.match_score && (
                                    <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                                        <span className="text-[10px] text-[#00d26a] font-bold">
                                            {Math.round(rec.match_score * 100)}%
                                        </span>
                                    </div>
                                )}

                                {/* 신호등 평가 버튼 (호버 시) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                    <button className="w-10 h-10 bg-[#00d26a]/90 hover:bg-[#00d26a] rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 shadow-lg">
                                        👍
                                    </button>
                                    <button className="w-10 h-10 bg-[#ff4757]/90 hover:bg-[#ff4757] rounded-full flex items-center justify-center text-lg transition-all hover:scale-110 shadow-lg">
                                        👎
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 빈 상태 */}
                {recommendations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🤔</div>
                        <h3 className="text-xl font-bold mb-2">추천 결과가 없습니다</h3>
                        <p className="text-[#666] mb-6">다른 작품을 선택해서 다시 시도해보세요</p>
                        <button
                            onClick={onReset}
                            className="px-6 py-3 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl"
                        >
                            다시 선택하기
                        </button>
                    </div>
                )}

                {/* 추가 액션 섹션 */}
                {recommendations.length > 0 && (
                    <div className="mt-12 text-center">
                        <div className="inline-block bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 max-w-md">
                            <div className="text-3xl mb-3">🎉</div>
                            <h3 className="text-lg font-bold mb-2">마음에 드는 작품이 있나요?</h3>
                            <p className="text-sm text-[#666] mb-4">
                                평가를 남기면 다음 추천이 더 정확해져요!
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#242424] text-white text-sm rounded-lg transition-colors border border-[#2a2a2a]">
                                    나중에 할게요
                                </button>
                                <button className="px-4 py-2 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black text-sm font-medium rounded-lg">
                                    평가하러 가기 →
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 하단 고정 바 */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="hidden sm:block">
                            <p className="text-xs text-[#555]">
                                💡 팁: 작품에 마우스를 올려 평가해보세요
                            </p>
                        </div>

                        <button
                            onClick={onReset}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl shadow-lg shadow-[#00d26a]/20 hover:shadow-[#00d26a]/40 transition-all active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            다른 취향으로 다시 추천받기
                        </button>
                    </div>
                </div>
            </div>

            {/* 스타일 */}
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

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
