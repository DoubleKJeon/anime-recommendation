import { AnimeCardProps } from '@/interfaces/types';

export default function AnimeCard({ anime, selected, onClick }: AnimeCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                group relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300
                ${selected
                    ? 'ring-2 ring-red-600 shadow-xl scale-[1.02]'
                    : 'hover:scale-[1.02] hover:shadow-lg'
                }
            `}
        >
            {/* 포스터 이미지 (세로형) */}
            <div className="relative aspect-[2/3] w-full bg-[#1f1f1f]">
                <img
                    src={anime.image_url || '/placeholder-anime.svg'}
                    alt={anime.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${selected ? 'opacity-40' : 'group-hover:opacity-80'}`}
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder-anime.svg';
                    }}
                />

                {/* 선택 시 체크 오버레이 */}
                {selected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-bounce">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* 평점 뱃지 (좌측 상단) */}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-yellow-400 border border-white/10">
                    ★ {anime.score ? anime.score.toFixed(1) : 'N/A'}
                </div>
            </div>

            {/* 하단 정보 (심플하게) */}
            <div className="mt-2 px-1">
                <h3 className="text-sm font-medium text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
                    {anime.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                    <span>{anime.genres?.split(',')[0]}</span>
                    {anime.episodes && <span>· {anime.episodes}화</span>}
                </div>
            </div>
        </div>
    );
}
