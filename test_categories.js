const popularAnimes = require('./data/popular_animes.json');

// 장르 카테고리 정의
const GENRE_CATEGORIES = [
    'Action & Adventure',
    'Fantasy & Supernatural',
    'Comedy & Slice of Life',
    'Drama & Emotional',
    'Mystery & Suspense'
];

// 장르별 점수 (업데이트됨)
const GENRE_SCORES = {
    'Action': { 'Action & Adventure': 10 },
    'Adventure': { 'Action & Adventure': 10 },
    'Sports': { 'Action & Adventure': 10 },
    'Mecha': { 'Action & Adventure': 10 },

    'Fantasy': { 'Fantasy & Supernatural': 15 },
    'Supernatural': { 'Fantasy & Supernatural': 15 },
    'Sci-Fi': { 'Fantasy & Supernatural': 12 },
    'Magic': { 'Fantasy & Supernatural': 15 },

    'Comedy': { 'Comedy & Slice of Life': 10 },
    'Slice of Life': { 'Comedy & Slice of Life': 10 },
    'Gourmet': { 'Comedy & Slice of Life': 10 },

    'Drama': { 'Drama & Emotional': 10 },
    'Romance': { 'Drama & Emotional': 10 },
    'School': { 'Drama & Emotional': 8 },
    'Shoujo': { 'Drama & Emotional': 8 },

    'Mystery': { 'Mystery & Suspense': 10 },
    'Suspense': { 'Mystery & Suspense': 10 },
    'Thriller': { 'Mystery & Suspense': 10 },
    'Horror': { 'Mystery & Suspense': 8 },
};

function getAnimeCategory(anime) {
    const genres = anime.genres.split(',').map(g => g.trim());
    const scores = {};

    genres.forEach(genre => {
        const genreScores = GENRE_SCORES[genre];
        if (genreScores) {
            Object.entries(genreScores).forEach(([category, score]) => {
                scores[category] = (scores[category] || 0) + score;
            });
        }
    });

    let maxScore = -1;
    let bestCategory = 'Action & Adventure';

    Object.entries(scores).forEach(([category, score]) => {
        if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
        }
    });

    return bestCategory;
}

function categorizeAnimes(animes) {
    const categorized = {
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

// 실행
const categorized = categorizeAnimes(popularAnimes);

console.log('\n=== FINAL 카테고리별 애니메이션 개수 ===');
GENRE_CATEGORIES.forEach((category, index) => {
    const count = categorized[category].length;
    console.log(`Step ${index + 1}: ${category} - ${count}개`);
    if (count > 0) {
        console.log(`  예시: ${categorized[category].slice(0, 3).map(a => a.title).join(', ')}`);
    } else {
        console.log(`  ❌ 애니메이션이 없습니다!`);
    }
});

console.log(`\n총 애니메이션 개수: ${popularAnimes.length}`);

// 5개 미만인 카테고리 경고
let hasIssue = false;
GENRE_CATEGORIES.forEach((category, index) => {
    const count = categorized[category].length;
    if (count < 5) {
        console.log(`\n⚠️  WARNING: Step ${index + 1} (${category})는 ${count}개만 있습니다!`);
        hasIssue = true;
    }
});

if (!hasIssue) {
    console.log('\n✅ 모든 스텝에 충분한 애니메이션이 있습니다!');
}
