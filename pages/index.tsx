import React, { useState } from 'react';
import AnimeSelector from '@/components/AnimeSelector';
import RecommendationList from '@/components/RecommendationList';
import popularAnimes from '@/data/popular_animes.json';
import { Recommendation } from '@/interfaces/types';
import type { Anime } from '@/utils/genreClassifier';

export default function Anilights() {
  const [view, setView] = useState<'home' | 'select' | 'loading' | 'result'>('home');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleComplete = async (selectedIds: number[]) => {
    setView('loading');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAnimeIds: selectedIds })
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
    return <RecommendationList recommendations={recommendations} onReset={handleReset} />;
  }

  // Selection State - Use AnimeSelector component
  if (view === 'select') {
    return <AnimeSelector animes={popularAnimes as Anime[]} onComplete={handleComplete} />;
  }

  // Home Page - Anilights Landing
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#00d26a] to-[#00a854] rounded-lg flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-[#00d26a]/20">
              🎬
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold tracking-wider">ANILIGHTS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 text-sm text-[#888]">
            <button className="text-[#00d26a] font-medium transition-colors">홈</button>
            <button onClick={() => setView('select')} className="hover:text-white transition-colors">뭐볼까</button>
            <button className="hover:text-white transition-colors">랭킹</button>
            <button className="hover:text-white transition-colors">신작</button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-[#888] hover:text-white transition-colors">
              로그인
            </button>
            <button
              onClick={() => setView('select')}
              className="px-5 py-2.5 text-sm bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00d26a]/30 transition-all hover:-translate-y-0.5"
            >
              시작하기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setView('select')}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-semibold rounded-lg shadow-md"
            >
              시작하기
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#888] hover:text-white transition-colors"
              aria-label="메뉴"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-[#1a1a1a] animate-[fadeInDown_0.2s_ease-out]">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              <button
                onClick={() => { setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-[#00d26a] font-medium rounded-lg bg-[#00d26a]/10 border border-[#00d26a]/20"
              >
                홈
              </button>
              <button
                onClick={() => { setView('select'); setMobileMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                뭐볼까
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                랭킹
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                신작
              </button>
              <div className="pt-2 border-t border-[#1a1a1a]">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm text-[#888] hover:text-white transition-colors"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00d26a]/10 via-[#00d26a]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] bg-[#00d26a]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 border border-[#00d26a]/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-[#00d26a] mb-4 sm:mb-6 animate-[fadeInDown_0.6s_ease-out]">
            <span className="hidden sm:inline">🎯</span>
            SVD 협업 필터링으로 분석합니다
          </div>

          <h1 className="font-black leading-tight mb-4 sm:mb-5 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">볼 애니 고르다</span>
            <span className="block mt-2 sm:mt-3">
              <span className="text-[#555] line-through text-lg sm:text-xl md:text-2xl lg:text-3xl">인생 다 간다</span>
              <span className="mx-2 text-[#888]">→</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d26a] to-[#00ff88] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">5분 컷</span>
            </span>
          </h1>

          <p className="text-[#888] text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed px-4 animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
            <span className="block sm:inline">{popularAnimes.length.toLocaleString()}개 작품 중에서 당신 취향만 쏙쏙 골라드립니다.</span>
            <br className="hidden sm:block" />
            <span className="inline-block mt-2 sm:mt-0 bg-[#00d26a]/20 px-2 sm:px-3 py-1 rounded text-[#00d26a] text-xs sm:text-sm font-medium">넷플릭스 추천보다 정확함 (진심)</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
            <button
              onClick={() => setView('select')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#00d26a] to-[#00a854] text-black font-bold rounded-xl hover:shadow-xl hover:shadow-[#00d26a]/30 hover:-translate-y-0.5 transition-all text-base sm:text-lg active:scale-95 shadow-lg shadow-[#00d26a]/20"
            >
              🚀 5개만 고르면 끝
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#111] border border-[#2a2a2a] rounded-xl hover:bg-[#1a1a1a] hover:border-[#00d26a]/50 transition-all text-base sm:text-lg active:scale-95"
            >
              <span className="hidden sm:inline">어떻게 작동하나요?</span>
              <span className="sm:hidden">작동 원리</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {[
            { value: popularAnimes.length.toLocaleString(), label: "분석된 애니메이션" },
            { value: "100K+", label: "평가 데이터" },
            { value: "94%", label: "취향 적중률" },
            { value: "12", label: "잠재 요인 분석" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 sm:p-6 rounded-xl bg-[#111]/50 border border-[#1a1a1a] hover:border-[#00d26a]/30 transition-all"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00d26a] mb-1 sm:mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[#666] leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">어떻게 추천해주나요?</h2>
          <p className="text-[#888] text-sm sm:text-base">3단계면 당신의 덕후력을 파악합니다</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            { icon: "🎯", num: "01", title: "5개만 골라주세요", desc: "장르별로 5개 중 1개씩 선택하면 됩니다. 어려우시면 그냥 대충 골라도 돼요. (알고리즘이 똑똑해서)" },
            { icon: "🧠", num: "02", title: "SVD가 분석합니다", desc: "Singular Value Decomposition이 당신의 취향을 12차원으로 분해합니다. 무슨 말인지 몰라도 됩니다." },
            { icon: "✨", num: "03", title: "인생작 발굴", desc: "비슷한 취향의 덕후들이 극찬한 작품을 추천해드립니다. 정주행 각입니다." },
          ].map((step, i) => (
            <div
              key={i}
              className="relative bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 hover:border-[#00d26a] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00d26a]/10 transition-all group"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.15}s both` }}
            >
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 text-5xl sm:text-6xl font-bold text-[#1a1a1a] group-hover:text-[#2a2a2a] transition-colors select-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {step.num}
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#00d26a]/10 rounded-xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-5 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{step.title}</h3>
              <p className="text-[#888] text-xs sm:text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎬</span>
              <span className="text-base sm:text-lg font-bold tracking-wider">ANILIGHTS</span>
            </div>
            <p className="text-[#666] text-xs sm:text-sm">
              AI 애니메이션 추천 서비스
            </p>
            <div className="text-xs text-[#555]">
              머신러닝과 사업기획 과제 · 데이터 출처: MyAnimeList
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
