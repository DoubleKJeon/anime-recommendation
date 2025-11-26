import React, { useState } from 'react';
import popularAnimes from '@/data/popular_animes.json';
import { Recommendation } from '@/interfaces/types';

export default function Anilights() {
  const [selectedAnime, setSelectedAnime] = useState<number[]>([]);
  const [activeGenre, setActiveGenre] = useState("🔥 인기");
  const [currentRating, setCurrentRating] = useState<string | null>(null);
  const [view, setView] = useState<'home' | 'select' | 'loading' | 'result'>('home');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const genres = ["🔥 인기", "⚔️ 액션", "💕 로맨스", "😂 코미디", "🌀 판타지", "🔮 SF", "😱 호러", "🏫 일상"];

  const toggleSelect = (id: number) => {
    if (selectedAnime.includes(id)) {
      setSelectedAnime(selectedAnime.filter(a => a !== id));
    } else if (selectedAnime.length < 5) {
      setSelectedAnime([...selectedAnime, id]);
    }
  };

  const handleGetRecommendations = async () => {
    if (selectedAnime.length !== 5) {
      alert('5개를 모두 선택해주세요!');
      return;
    }

    setView('loading');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAnimeIds: selectedAnime })
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
        setView('result');
      } else {
        alert('추천을 생성하는데 실패했습니다: ' + data.error);
        setView('select');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('추천을 생성하는데 실패했습니다');
      setView('select');
    }
  };

  const handleReset = () => {
    setView('home');
    setSelectedAnime([]);
    setRecommendations([]);
  };

  // Loading State
  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00d26a] mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">SVD 분석 중...</p>
          <p className="text-[#888]">12차원으로 분해하고 있습니다</p>
        </div>
      </div>
    );
  }

  // Result State
  if (view === 'result') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              당신을 위한 추천 작품 <span className="text-[#00d26a]">{recommendations.length}</span>개
            </h1>
            <p className="text-[#888]">취향 기반 큐레이션 결과</p>
          </div>

          {/* 추천 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
            {recommendations.map((rec, idx) => (
              <div key={rec.anime_id} className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#00d26a] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00d26a]/10">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-[#00d26a] leading-none">{idx + 1}</span>
                    <span className="text-[10px] text-[#555] font-medium">RANK</span>
                  </div>
                  <div className="bg-[#00d26a]/10 border border-[#00d26a]/30 px-2 py-1 rounded-md">
                    <span className="text-[#00d26a] text-xs font-bold">
                      {(rec.match_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-tight min-h-[2.5rem]">
                  {rec.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white font-bold">{rec.rating || 'N/A'}</span>
                    </div>
                    <span className="bg-[#2a2a2a] px-2 py-0.5 rounded text-[10px] text-gray-300 font-medium">
                      {rec.type}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#888] truncate">
                    {rec.genre?.split(',').slice(0, 2).join(', ') || '장르 정보 없음'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 버튼 */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-6 z-50">
            <div className="max-w-4xl mx-auto text-center">
              <button
                onClick={handleReset}
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00d26a] to-[#00a854] rounded-lg flex items-center justify-center text-lg">
              🎬
            </div>
            <span className="text-xl font-bold tracking-wider">ANILIGHTS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-[#888]">
            <button onClick={() => setView('home')} className={`hover:text-white transition-colors ${view === 'home' ? 'text-[#00d26a]' : ''}`}>홈</button>
            <button onClick={() => setView('select')} className="hover:text-white transition-colors">뭐볼까</button>
            <button className="hover:text-white transition-colors">랭킹</button>
            <button className="hover:text-white transition-colors">신작</button>
          </div>
          <div className="flex gap-2">
            <button className="hidden md:block px-4 py-2 text-sm text-[#888] hover:text-white transition-colors">
              로그인
            </button>
            <button
              onClick={() => setView('select')}
              className="px-4 py-2 text-sm bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00d26a]/30 transition-all"
            >
              시작하기
            </button>
          </div>
        </div>
      </nav>

      {view === 'home' && (
        <>
          {/* Hero Section */}
          <section className="pt-32 pb-16 px-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#00d26a]/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00d26a]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 border border-[#00d26a]/30 px-4 py-2 rounded-full text-sm text-[#00d26a] mb-6">
                🎯 SVD 협업 필터링으로 분석합니다
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
                볼 애니 고르다<br />
                <span className="text-[#555] line-through">인생 다 간다</span>
                <span className="mx-2">→</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#00ff88]">5분 컷</span>
              </h1>

              <p className="text-[#888] text-lg mb-8 leading-relaxed">
                {popularAnimes.length.toLocaleString()}개 작품 중에서 당신 취향만 쏙쏙 골라드립니다.<br />
                <span className="bg-[#00d26a]/20 px-2 py-0.5 rounded text-[#00d26a]">넷플릭스 추천보다 정확함 (진심)</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setView('select')}
                  className="px-6 py-4 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl hover:shadow-xl hover:shadow-[#00d26a]/30 hover:-translate-y-0.5 transition-all text-lg"
                >
                  🚀 5개만 고르면 끝
                </button>
                <button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-6 py-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl hover:bg-[#242424] hover:border-[#555] transition-all text-lg"
                >
                  어떻게 작동하나요?
                </button>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="flex flex-wrap justify-center gap-8 md:gap-16 py-10 px-4 border-b border-[#2a2a2a]">
            {[
              { value: popularAnimes.length.toLocaleString(), label: "분석된 애니메이션" },
              { value: "100K+", label: "평가 데이터" },
              { value: "94%", label: "취향 적중률" },
              { value: "12", label: "잠재 요인 분석" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#00d26a]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[#888] mt-1">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="max-w-5xl mx-auto py-20 px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">어떻게 추천해주나요?</h2>
              <p className="text-[#888]">3단계면 당신의 덕후력을 파악합니다</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "🎯", num: "01", title: "5개만 골라주세요", desc: "좋아하는 애니 5개만 선택하면 됩니다. 어려우시면 그냥 대충 골라도 돼요. (알고리즘이 똑똑해서)" },
                { icon: "🧠", num: "02", title: "SVD가 분석합니다", desc: "Singular Value Decomposition이 당신의 취향을 12차원으로 분해합니다. 무슨 말인지 몰라도 됩니다." },
                { icon: "✨", num: "03", title: "인생작 발굴", desc: "비슷한 취향의 덕후들이 극찬한 작품을 추천해드립니다. 정주행 각입니다." },
              ].map((step, i) => (
                <div key={i} className="relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[#00d26a] hover:-translate-y-1 hover:shadow-2xl transition-all group">
                  <div className="absolute top-6 right-6 text-6xl font-bold text-[#242424] group-hover:text-[#2a2a2a] transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {step.num}
                  </div>
                  <div className="w-14 h-14 bg-[#00d26a]/10 rounded-xl flex items-center justify-center text-3xl mb-5">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-[#888] text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#141414] border-t border-[#2a2a2a] py-12 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-10">
                <div className="md:col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🎬</span>
                    <span className="text-lg font-bold tracking-wider">ANILIGHTS</span>
                  </div>
                  <p className="text-[#888] text-sm leading-relaxed">
                    덕후들의 시간을 아껴주는<br />
                    AI 애니메이션 추천 서비스
                  </p>
                </div>

                {[
                  { title: "서비스", links: ["추천받기", "랭킹", "신작 캘린더"] },
                  { title: "정보", links: ["이용약관", "개인정보", "FAQ"] },
                  { title: "기술", links: ["SVD 알고리즘", "협업 필터링", "GitHub"] },
                ].map((section, i) => (
                  <div key={i}>
                    <h4 className="text-xs text-[#555] uppercase tracking-wider mb-4">{section.title}</h4>
                    <ul className="space-y-3">
                      {section.links.map((link, j) => (
                        <li key={j}>
                          <a href="#" className="text-[#888] text-sm hover:text-white transition-colors">{link}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-[#2a2a2a] text-xs text-[#555] gap-2">
                <span>© 2024 Anilights. 만든 사람도 덕후입니다.</span>
                <span>데이터 출처: MyAnimeList</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Anime Selection */}
      {view === 'select' && (
        <section className="pt-20 pb-32 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 border border-[#00d26a]/30 px-3 py-1.5 rounded-full text-xs text-[#00d26a] mb-4">
                <span>🎯</span>
                취향 큐레이션 진행 중
              </div>
              <h2 className="text-3xl font-bold mb-3">
                <span className="text-[#00d26a]">5개</span>만 선택해주세요
              </h2>
              <p className="text-[#888] mb-2">가장 마음에 드는 작품을 골라주세요 ({selectedAnime.length}/5)</p>
              <p className="text-xs text-[#555]">어려우시면 그냥 대충 골라도 됩니다 (알고리즘이 똑똑해서 🧠)</p>
            </div>

            {/* Genre Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeGenre === genre
                      ? 'bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#555]'
                    }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Anime Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {popularAnimes.slice(0, 20).map((anime: any) => (
                <div
                  key={anime.anime_id}
                  onClick={() => toggleSelect(anime.anime_id)}
                  className={`relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 ${selectedAnime.includes(anime.anime_id) ? 'ring-[3px] ring-[#00d26a]' : ''
                    }`}
                >
                  <img
                    src={anime.image_url || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="text-sm font-semibold truncate">{anime.title}</div>
                    <div className="text-xs text-[#888]">{anime.premiered || 'N/A'}</div>
                  </div>
                  {selectedAnime.includes(anime.anime_id) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#00d26a] rounded-full flex items-center justify-center text-black text-sm font-bold">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Fixed Action Button */}
            {selectedAnime.length === 5 && (
              <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40 px-4">
                <button
                  onClick={handleGetRecommendations}
                  className="px-8 py-4 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl hover:shadow-xl hover:shadow-[#00d26a]/30 transition-all text-lg animate-bounce"
                >
                  ✨ 추천받기
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Progress Bar */}
      {view === 'select' && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#141414] border-t border-[#2a2a2a] py-4 px-4 z-40">
          <div className="max-w-xl mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#888]">선택 진행률</span>
              <span className="text-[#00d26a] font-semibold">{selectedAnime.length} / 5 선택됨</span>
            </div>
            <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00d26a] to-[#00a854] rounded-full transition-all duration-300"
                style={{ width: `${(selectedAnime.length / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
