import { AnimeCardProps } from '@/interfaces/types';

export default function AnimeCard({ anime, selected, onClick }: AnimeCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
                group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300
                ${selected
                    ? 'scale-105 shadow-2xl shadow-red-500/50 ring-4 ring-red-500'
                    : 'hover:scale-105 hover:shadow-xl hover:-translate-y-2'
                }
            `}
            style={{
                background: selected
                    ? 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)'
                    : 'linear-gradient(135deg, #1a1a1a 0%, #252525 100%)'
            }}
        >
            {/* 컬렉터블 카드 테두리 효과 */}
            <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ffd93d, #6BCF7F, #4D96FF, #C77DFF)',
                    backgroundSize: '400% 400%',
                    animation: selected ? 'gradient-shift 3s ease infinite' : 'none',
                    padding: '3px',
                    zIndex: -1
                }}
            />

            {/* 포스터 이미지 */}
            <div className="relative aspect-[2/3] w-full bg-black/30">
                <img
                    src={anime.image_url || '/placeholder-anime.svg'}
                    alt={anime.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${selected ? 'opacity-90 brightness-110' : 'group-hover:opacity-90'
                        }`}
                    onError={(e) => {
                        e.currentTarget.src = '/placeholder-anime.svg';
                    }}
                />

                {/* 선택 시 빛나는 오버레이 */}
                {selected && (
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent animate-pulse" />
                )}

                {/* 평점 뱃지 */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md">
                    <span className="text-yellow-400 font-bold text-xs">★ {anime.score ? anime.score.toFixed(1) : 'N/A'}</span>
                </div>

                {/* 선택 체크 */}
                {selected && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg animate-bounce">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>

            {/* 하단 정보 카드 (컬렉터블 스타일) */}
            <div className="p-3 bg-gradient-to-b from-gray-900/95 to-black/95 border-t-2 border-gray-700">
                <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 leading-tight" style={{ minHeight: '2.5rem' }}>
                    {anime.title}
                </h3>
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span className="truncate max-w-[60%]">{anime.genres?.split(',')[0]}</span>
                    {anime.episodes && <span className="text-gray-500">EP {anime.episodes}</span>}
                </div>
            </div>

            {/* 카드 글oss 효과 */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
    );
}
