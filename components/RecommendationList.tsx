import { RecommendationListProps } from '@/interfaces/types';
import RecommendationCard from './RecommendationCard';

export default function RecommendationList({ recommendations, onReset }: RecommendationListProps) {
    return (
        <div className="min-h-screen bg-[#141414] text-white pb-24">
            <div className="max-w-[1800px] mx-auto px-4 py-8">
                {/* 헤더 (간결하게) */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">
                        당신을 위한 추천 작품 <span className="text-red-500">{recommendations.length}</span>개
                    </h1>
                    <p className="text-gray-400 text-sm">취향 기반 큐레이션 결과</p>
                </div>

                {/* 추천 그리드 (5x6 = 30개) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
                    {recommendations.map((rec, idx) => (
                        <RecommendationCard
                            key={rec.anime_id}
                            recommendation={rec}
                            index={idx}
                        />
                    ))}
                </div>

                {/* 하단 고정 버튼 */}
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <button
                            onClick={onReset}
                            className="px-8 py-3 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            다시 추천받기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
