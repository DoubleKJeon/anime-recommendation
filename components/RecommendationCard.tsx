import { Recommendation } from '@/interfaces/types';

interface RecommendationCardProps {
    recommendation: Recommendation;
    index: number;
}

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
    return (
        <div className="group relative flex flex-col h-full min-h-[320px] bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-100">
            {/* 랭킹 번호 영역 */}
            <div className="absolute top-4 left-4 z-10 flex flex-col items-center">
                <span className="text-6xl font-black text-gray-900 leading-none tracking-tighter drop-shadow-sm">
                    {index + 1}
                </span>
                <span className="text-gray-400 text-sm font-bold mt-1">-</span>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col pt-24 px-6 pb-6 text-center">
                {/* 매치율 뱃지 */}
                <div className="mb-4">
                    <span className="inline-block bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-full border border-red-100">
                        {(recommendation.match_score * 100).toFixed(0)}% 일치
                    </span>
                </div>

                {/* 타이틀 */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight break-keep mb-2 line-clamp-3">
                    {recommendation.title}
                </h3>

                {/* 메타 정보 */}
                <div className="mt-auto pt-4 flex flex-col gap-1 text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2 font-medium">
                        <span className="text-gray-900">{recommendation.type}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-gray-900">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {recommendation.rating || 'N/A'}
                        </span>
                    </div>
                    <div className="text-xs text-gray-400 truncate px-2">
                        {recommendation.genre?.split(',').slice(0, 2).join(', ')}
                    </div>
                </div>
            </div>

            {/* 하단 장식 */}
            <div className="h-1 bg-gray-100 group-hover:bg-red-600 transition-colors duration-300" />
        </div>
    );
}
