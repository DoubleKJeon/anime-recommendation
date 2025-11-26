import { useState } from 'react';
import AnimeSelector from '@/components/AnimeSelector';
import RecommendationList from '@/components/RecommendationList';
import popularAnimes from '@/data/popular_animes.json';
import { Recommendation } from '@/interfaces/types';
import type { Anime } from '@/utils/genreClassifier';

export default function Home() {
  const [stage, setStage] = useState<'landing' | 'select' | 'loading' | 'result'>('landing');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const handleStart = () => {
    setStage('select');
  };

  const handleComplete = async (selectedIds: number[]) => {
    setStage('loading');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAnimeIds: selectedIds })
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
        setStage('result');
      } else {
        alert('추천을 생성하는데 실패했습니다: ' + data.error);
        setStage('select');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('추천을 생성하는데 실패했습니다');
      setStage('select');
    }
  };

  const handleReset = () => {
    setStage('landing');
    setRecommendations([]);
  };

  // Landing Page
  if (stage === 'landing') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0ae6] backdrop-blur-xl border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center text-lg">
                🎬
              </div>
              <span className="font-black text-xl tracking-wider">ANILIGHTS</span>
            </div>
            <button 
              onClick={handleStart}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-105"
            >
              시작하기
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full text-sm text-red-400 mb-6 animate-[fadeInUp_0.6s_ease-out]">
              <span>🎯</span>
              SVD 협업 필터링으로 분석합니다
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
              볼 애니 고르다<br />
              <span className="line-through text-gray-600">인생 다 간다</span>
              {' → '}
              <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                5분 컷
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
              {popularAnimes.length.toLocaleString()}개 작품 중에서 당신 취향만 쏙쏙 골라드립니다.<br />
              <span className="text-red-400 bg-red-500/10 px-3 py-1 rounded inline-block mt-2">
                넷플릭스 추천보다 정확함 (진심)
              </span>
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
              <button 
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-105 hover:-translate-y-1"
              >
                🚀 5개만 고르면 끝
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gray-900 border border-gray-700 rounded-xl font-bold text-lg hover:bg-gray-800 hover:border-gray-600 transition-all"
              >
                어떻게 작동하나요?
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-gray-800 py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black text-red-500 mb-1">
                {popularAnimes.length.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">분석된 애니메이션</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-red-500 mb-1">100K+</div>
              <div className="text-sm text-gray-500">평가 데이터</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-red-500 mb-1">94%</div>
              <div className="text-sm text-gray-500">취향 적중률</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-red-500 mb-1">12</div>
              <div className="text-sm text-gray-500">잠재 요인 분석</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                어떻게 추천해주나요?
              </h2>
              <p className="text-gray-400 text-lg">
                3단계면 당신의 덕후력을 파악합니다
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-red-500 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 group relative overflow-hidden">
                <div className="absolute top-6 right-6 text-8xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                  01
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center text-3xl mb-5">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold mb-3">5개만 골라주세요</h3>
                  <p className="text-gray-400 leading-relaxed">
                    좋아하는 애니 5개만 선택하면 됩니다. 어려우시면 그냥 대충 골라도 돼요. (알고리즘이 똑똑해서)
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-red-500 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 group relative overflow-hidden">
                <div className="absolute top-6 right-6 text-8xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                  02
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center text-3xl mb-5">
                    🧠
                  </div>
                  <h3 className="text-2xl font-bold mb-3">SVD가 분석합니다</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Singular Value Decomposition이 당신의 취향을 12차원으로 분해합니다. 무슨 말인지 몰라도 됩니다.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-red-500 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/10 group relative overflow-hidden">
                <div className="absolute top-6 right-6 text-8xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">
                  03
                </div>
                <div className="relative">
                  <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center text-3xl mb-5">
                    ✨
                  </div>
                  <h3 className="text-2xl font-bold mb-3">인생작 발굴</h3>
                  <p className="text-gray-400 leading-relaxed">
                    비슷한 취향의 덕후들이 극찬한 작품을 추천해드립니다. 정주행 각입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              이제 시작해볼까요?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              5개만 선택하면 당신의 인생 애니메이션을 찾아드립니다
            </p>
            <button 
              onClick={handleStart}
              className="px-12 py-5 bg-gradient-to-r from-red-600 to-red-500 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-105 hover:-translate-y-1"
            >
              지금 바로 시작하기 →
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-1">
                <div className="font-black text-xl mb-3 tracking-wider">🎬 ANILIGHTS</div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  덕후들의 시간을 아껴주는<br />
                  AI 애니메이션 추천 서비스
                </p>
              </div>
              
              <div>
                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-4">서비스</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">추천받기</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">랭킹</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">신작</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-4">정보</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">이용약관</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">개인정보처리방침</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-gray-500 text-xs uppercase tracking-wider mb-4">기술</h4>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">SVD 알고리즘</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">협업 필터링</a></li>
                  <li><a href="https://github.com" className="text-gray-400 hover:text-white transition">GitHub</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex justify-between items-center flex-wrap gap-4 text-sm text-gray-500">
              <span>© 2024 Anilights. 만든 사람도 덕후입니다.</span>
              <span>데이터 출처: MyAnimeList</span>
            </div>
          </div>
        </footer>

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
        `}</style>
      </div>
    );
  }

  // Loading State
  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">SVD 분석 중...</p>
          <p className="text-gray-400">12차원으로 분해하고 있습니다</p>
        </div>
      </div>
    );
  }

  // Result State
  if (stage === 'result') {
    return <RecommendationList recommendations={recommendations} onReset={handleReset} />;
  }

  // Selection State
  return <AnimeSelector animes={popularAnimes as Anime[]} onComplete={handleComplete} />;
}
