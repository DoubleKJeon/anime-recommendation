import React, { useState } from 'react';
import AnimeSelector from '@/components/AnimeSelector';
import RecommendationList from '@/components/RecommendationList';
import popularAnimes from '@/data/popular_animes.json';
import { Recommendation } from '@/interfaces/types';
import type { Anime } from '@/utils/genreClassifier';

export default function Anilights() {
  const [view, setView] = useState<'home' | 'select' | 'loading' | 'result'>('home');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00d26a] to-[#00a854] rounded-lg flex items-center justify-center text-lg">
              🎬
            </div>
            <span className="text-xl font-bold tracking-wider">ANILIGHTS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-[#888]">
            <button className="text-[#00d26a] transition-colors">홈</button>
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
            { icon: "🎯", num: "01", title: "5개만 골라주세요", desc: "장르별로 5개 중 1개씩 선택하면 됩니다. 어려우시면 그냥 대충 골라도 돼요. (알고리즘이 똑똑해서)" },
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
    </div>
  );
}
