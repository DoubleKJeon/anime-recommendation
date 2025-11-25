// 장르 카테고리 정의
export const GENRE_CATEGORIES = [
    'Action & Adventure',
    'Fantasy & Supernatural',
    'Comedy & Slice of Life',
    'Drama & Emotional',
    'Mystery & Suspense'
] as const;

export type GenreCategory = typeof GENRE_CATEGORIES[number];

// Anime 인터페이스 import
import type { Anime } from '@/interfaces/types';
export type { Anime };

// 장르별 점수 (높을수록 해당 카테고리에 강하게 매핑)
const GENRE_SCORES: Record<string, Partial<Record<GenreCategory, number>>> = {
    // Action & Adventure
    'Action': { 'Action & Adventure': 10 },
    'Adventure': { 'Action & Adventure': 10 },
    'Sports': { 'Action & Adventure': 10 },
    'Mecha': { 'Action & Adventure': 10 },

    // Fantasy & Supernatural (우선순위 높임!)
    'Fantasy': { 'Fantasy & Supernatural': 15 },
    'Supernatural': { 'Fantasy & Supernatural': 15 },
    'Sci-Fi': { 'Fantasy & Supernatural': 12 },
    'Magic': { 'Fantasy & Supernatural': 15 },

    // Comedy & Slice of Life
    'Comedy': { 'Comedy & Slice of Life': 10 },
    'Slice of Life': { 'Comedy & Slice of Life': 10 },
    'Gourmet': { 'Comedy & Slice of Life': 10 },

    // Drama & Emotional
    'Drama': { 'Drama & Emotional': 10 },
    'Romance': { 'Drama & Emotional': 10 },
    'School': { 'Drama & Emotional': 8 },
    'Shoujo': { 'Drama & Emotional': 8 },

    // Mystery & Suspense
    'Mystery': { 'Mystery & Suspense': 10 },
    'Suspense': { 'Mystery & Suspense': 10 },
    'Thriller': { 'Mystery & Suspense': 10 },
    'Horror': { 'Mystery & Suspense': 8 },
};

/**
 * 애니메이션의 주요 장르 카테고리 결정 (점수 기반)
 */
export function getAnimeCategory(anime: Anime): GenreCategory {
    const genres = anime.genres.split(',').map(g => g.trim());
    const scores: Partial<Record<GenreCategory, number>> = {};

    // 각 장르에 대해 점수 계산
    genres.forEach(genre => {
        const genreScores = GENRE_SCORES[genre];
        if (genreScores) {
            Object.entries(genreScores).forEach(([category, score]) => {
                scores[category as GenreCategory] = (scores[category as GenreCategory] || 0) + score;
            });
        }
    });

    // 가장 높은 점수의 카테고리 선택
    let maxScore = -1;
    let bestCategory: GenreCategory = 'Action & Adventure';

    Object.entries(scores).forEach(([category, score]) => {
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category as GenreCategory;
        }
    });

    return bestCategory;
}

/**
 * 카테고리별로 애니메이션 분류
 */
export function categorizeAnimes(animes: Anime[]): Record<GenreCategory, Anime[]> {
    const categorized: Record<GenreCategory, Anime[]> = {
        'Action & Adventure': [],
        'Fantasy & Supernatural': [],
        'Comedy & Slice of Life': [],
        'Drama & Emotional': [],
        'Mystery & Suspense': []
    };

    animes.forEach(anime => {
        const category = getAnimeCategory(anime);
        categorized[category].push(anime);
    });

    return categorized;
}

/**
 * 특정 카테고리에서 랜덤하게 N개 선택
 */
export function getRandomAnimesFromCategory(
    animes: Anime[],
    category: GenreCategory,
    count: number = 5
): Anime[] {
    const categorized = categorizeAnimes(animes);
    const categoryAnimes = categorized[category];

    if (categoryAnimes.length <= count) {
        return categoryAnimes;
    }

    // Fisher-Yates shuffle로 랜덤 선택
    const shuffled = [...categoryAnimes];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
}

/**
 * 각 카테고리별로 5개씩 가져오기 (5단계용)
 */
export function getAnimesBySteps(animes: Anime[]): Anime[][] {
    return GENRE_CATEGORIES.map(category =>
        getRandomAnimesFromCategory(animes, category, 5)
    );
}
