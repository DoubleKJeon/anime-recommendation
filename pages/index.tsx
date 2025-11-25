import { useState } from 'react';
import AnimeSelector from '@/components/AnimeSelector';
import RecommendationList from '@/components/RecommendationList';
import popularAnimes from '@/data/popular_animes.json';
import { Recommendation } from '@/interfaces/types';
import type { Anime } from '@/utils/genreClassifier';

export default function Home() {
  const [stage, setStage] = useState<'select' | 'loading' | 'result'>('select');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

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
    setStage('select');
    setRecommendations([]);
  };

  if (stage === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">추천 계산 중...</p>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (stage === 'result') {
    return <RecommendationList recommendations={recommendations} onReset={handleReset} />;
  }

  return <AnimeSelector animes={popularAnimes as Anime[]} onComplete={handleComplete} />;
}
