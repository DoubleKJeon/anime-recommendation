"""
Synopsis-based Content Filtering Recommendation System

Uses TF-IDF and cosine similarity on anime synopses to provide
explainable, content-based recommendations.

Advantages over collaborative filtering:
- Explainable: Can show why animes are similar
- Cold start: Works without user rating data
- Content-based: Actual storyline similarity
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Cache for TF-IDF model
_tfidf_model = None
_similarity_matrix = None
_anime_data = None


def load_data_and_model():
    """Load anime data and build TF-IDF model (cached)"""
    global _tfidf_model, _similarity_matrix, _anime_data
    
    if _anime_data is not None:
        return _anime_data, _tfidf_model, _similarity_matrix
    
    # Load anime dataset with synopsis
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, '..', 'data', 'anime_with_synopsis.csv')
    
    df = pd.read_csv(data_path)
    
    # Combine synopsis and genres for richer text representation
    # Note: 'sypnopsis' is a typo in the CSV
    texts = df['sypnopsis'].fillna('') + ' ' + df['Genres'].fillna('')
    
    # TF-IDF Vectorization
    tfidf = TfidfVectorizer(
        stop_words='english',
        max_features=5000,
        ngram_range=(1, 2),  # unigrams and bigrams
        min_df=2  # ignore terms that appear in less than 2 documents
    )
    
    tfidf_matrix = tfidf.fit_transform(texts)
    
    # Compute cosine similarity (memory efficient - don't store full matrix)
    # We'll compute on-demand instead
    
    _anime_data = df
    _tfidf_model = {
        'vectorizer': tfidf,
        'tfidf_matrix': tfidf_matrix,
        'feature_names': tfidf.get_feature_names_out()
    }
    
    return _anime_data, _tfidf_model, None


def get_synopsis_recommendations(selected_anime_ids, top_n=30):
    """
    Get recommendations based on synopsis similarity
    
    Args:
        selected_anime_ids: List of MAL_IDs user selected [1, 5, 20, etc.]
        top_n: Number of recommendations to return (default 30)
    
    Returns:
        List of recommended anime with similarity scores
    """
    
    # Load data and model
    df, model, _ = load_data_and_model()
    tfidf_matrix = model['tfidf_matrix']
    
    # Get indices of selected anime
    selected_indices = []
    for anime_id in selected_anime_ids:
        idx = df[df['MAL_ID'] == anime_id].index
        if len(idx) > 0:
            selected_indices.append(idx[0])
    
    if not selected_indices:
        return []
    
    # Compute similarity scores for selected anime
    selected_vectors = tfidf_matrix[selected_indices]
    
    # Compute cosine similarity between selected anime and all anime
    similarity_scores = cosine_similarity(selected_vectors, tfidf_matrix)
    
    # Average similarity across all selected anime
    avg_similarity = similarity_scores.mean(axis=0)
    
    # Get top N most similar (excluding selected ones)
    similar_indices = avg_similarity.argsort()[::-1]
    
    # Filter out selected anime and get top N
    recommendations = []
    for idx in similar_indices:
        if idx not in selected_indices:
            anime = df.iloc[idx]
            recommendations.append({
                'anime_id': int(anime['MAL_ID']),
                'title': anime['Name'],
                'genre': anime['Genres'],
                'score': float(anime['Score']) if pd.notna(anime['Score']) else 0.0,
                'match_score': float(avg_similarity[idx]),
                'image_url': ''  # Will be filled from popular_animes.json if available
            })
            
            if len(recommendations) >= top_n:
                break
    
    # Try to add image URLs from popular_animes.json
    current_dir = os.path.dirname(os.path.abspath(__file__))
    popular_path = os.path.join(current_dir, '..', 'data', 'popular_animes.json')
    
    if os.path.exists(popular_path):
        import json
        with open(popular_path, 'r', encoding='utf-8') as f:
            popular_animes = json.load(f)
            image_map = {a['anime_id']: a.get('image_url', '') for a in popular_animes}
            
            for rec in recommendations:
                if rec['anime_id'] in image_map:
                    rec['image_url'] = image_map[rec['anime_id']]
    
    return recommendations


def explain_similarity(anime_id_1, anime_id_2, top_keywords=10):
    """
    Explain why two anime are similar by showing common keywords
    
    Args:
        anime_id_1: First anime MAL_ID
        anime_id_2: Second anime MAL_ID
        top_keywords: Number of top keywords to show
    
    Returns:
        Dictionary with common keywords and their importance
    """
    
    df, model, _ = load_data_and_model()
    tfidf_matrix = model['tfidf_matrix']
    feature_names = model['feature_names']
    
    # Get indices
    idx1 = df[df['MAL_ID'] == anime_id_1].index
    idx2 = df[df['MAL_ID'] == anime_id_2].index
    
    if len(idx1) == 0 or len(idx2) == 0:
        return {'error': 'Anime not found'}
    
    idx1, idx2 = idx1[0], idx2[0]
    
    # Get TF-IDF vectors
    vec1 = tfidf_matrix[idx1].toarray()[0]
    vec2 = tfidf_matrix[idx2].toarray()[0]
    
    # Find common keywords (both have non-zero values)
    common_keywords = []
    for i, (v1, v2) in enumerate(zip(vec1, vec2)):
        if v1 > 0 and v2 > 0:
            importance = min(v1, v2)  # Use minimum as importance
            common_keywords.append({
                'keyword': feature_names[i],
                'importance': float(importance)
            })
    
    # Sort by importance
    common_keywords.sort(key=lambda x: x['importance'], reverse=True)
    
    return {
        'anime_1': df.iloc[idx1]['Name'],
        'anime_2': df.iloc[idx2]['Name'],
        'common_keywords': common_keywords[:top_keywords],
        'similarity_score': float(cosine_similarity(
            tfidf_matrix[idx1:idx1+1], 
            tfidf_matrix[idx2:idx2+1]
        )[0][0])
    }


if __name__ == '__main__':
    # Test the recommender
    import json
    
    # Test with some popular anime IDs
    test_ids = [1, 5, 20]  # Cowboy Bebop, etc.
    
    print(f"Testing synopsis-based recommender with IDs: {test_ids}")
    print("="*60)
    
    recommendations = get_synopsis_recommendations(test_ids, top_n=10)
    
    print(f"\nTop 10 Recommendations:")
    print("-"*60)
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec['title']}")
        print(f"   Score: {rec['score']:.2f} | Match: {rec['match_score']:.3f}")
        print(f"   Genres: {rec['genre'][:60]}...")
    
    # Test explanation
    if len(recommendations) >= 2:
        print(f"\n\nExplaining similarity between:")
        print(f"Anime ID {test_ids[0]} and Recommendation 1 ({recommendations[0]['anime_id']})")
        print("="*60)
        
        explanation = explain_similarity(test_ids[0], recommendations[0]['anime_id'])
        
        print(f"{explanation['anime_1']} ⟷ {explanation['anime_2']}")
        print(f"Similarity Score: {explanation['similarity_score']:.3f}")
        print(f"\nCommon Keywords:")
        for kw in explanation['common_keywords'][:5]:
            print(f"  - {kw['keyword']} (importance: {kw['importance']:.3f})")
