// Anime data from popular_animes.json
export interface Anime {
  anime_id: number;
  title: string;
  image_url: string;
  score: number;
  genres: string;
  synopsis?: string;
  episodes?: number | null;
  year?: number | null;
}

// Recommendation result from Python backend
export interface Recommendation {
  anime_id: number;
  title: string;
  genre: string;
  type: string;
  episodes: number;
  rating: string;
  image_url: string;
  match_score: number;
}

// Component Props
export interface AnimeCardProps {
  anime: Anime;
  selected: boolean;
  onClick: () => void;
}

export interface AnimeSelectorProps {
  animes: Anime[];
  onComplete: (selectedIds: number[]) => void;
}

export interface RecommendationListProps {
  recommendations: Recommendation[];
  onReset: () => void;
}
