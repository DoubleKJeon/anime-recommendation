import { Recommendation } from '@/interfaces/types';

interface RecommendationCardProps {
    recommendation: Recommendation;
    index: number;
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
    return (
        <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 border border-gray-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:-translate-y-1">
            {/* 상단: 랭킹 & 매치율 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-red-500 leading-none">
                        {index + 1}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">RANK</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 px-2 py-1 rounded-md">
                    <span className="text-red-400 text-xs font-bold">
                        {(recommendation.match_score * 100).toFixed(0)}%
                    </span>
                </div>
            </div>

            {/* 중앙: 제목 */}
            <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-tight min-h-[2.5rem]">
                {recommendation.title}
            </h3>

            {/* 하단: 메타 정보 */}
            <div className="space-y-2">
                {/* 평점 & 타입 */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-bold">{recommendation.rating || 'N/A'}</span>
                    </div>
                    <span className="bg-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-300 font-medium">
                        {recommendation.type}
                    </span>
                </div>

                {/* 장르 */}
                <div className="text-[10px] text-gray-400 truncate">
                    {recommendation.genre?.split(',').slice(0, 2).join(', ') || '장르 정보 없음'}
                </div>

                {/* 에피소드 */}
                {recommendation.episodes > 0 && (
                    <div className="text-[10px] text-gray-500">
                        {recommendation.episodes}화
                    </div>
                )}
            </div>

            {/* 호버 시 광택 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
        </div>
    );
}
