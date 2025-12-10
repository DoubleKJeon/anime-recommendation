"""
Test synopsis-based recommender API locally
"""
import sys
sys.path.append('.')

from lib.synopsis_recommender import get_synopsis_recommendations, explain_similarity

print("="*60)
print("SYNOPSIS-BASED RECOMMENDATION TEST")
print("="*60)

# Simulate user selecting 5 anime from different genres
test_selections = [
    1,      # Cowboy Bebop (Action, Sci-Fi)
    16498,  # Shingeki no Kyojin (Action, Drama)
    32281,  # Kimi no Na wa (Drama, Romance)
    1535,   # Death Note (Supernatural, Suspense)
    30276   # One Punch Man (Action, Comedy)
]

print(f"\nSelected Anime IDs: {test_selections}")
print("\nGetting top 10 recommendations...")
print("-"*60)

recommendations = get_synopsis_recommendations(test_selections, top_n=10)

if recommendations:
    print(f"\n✅ SUCCESS! Got {len(recommendations)} recommendations\n")
    
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec['title']}")
        print(f"   Genres: {rec['genre'][:70]}")
        print(f"   Score: {rec['score']:.2f} | Match: {rec['match_score']:.4f}\n")
    
    # Test explanation feature
    if len(recommendations) > 0:
        print("="*60)
        print("EXPLAINABILITY TEST")
        print("="*60)
        print(f"\nExplaining why first recommendation is similar to first selection...\n")
        
        explanation = explain_similarity(test_selections[0], recommendations[0]['anime_id'])
        
        print(f"Anime 1: {explanation['anime_1']}")
        print(f"Anime 2: {explanation['anime_2']}")
        print(f"Similarity Score: {explanation['similarity_score']:.4f}\n")
        print("Common Keywords:")
        for i, kw in enumerate(explanation['common_keywords'][:10], 1):
            print(f"  {i}. {kw['keyword']} (importance: {kw['importance']:.3f})")
        
        print("\n" + "="*60)
        print("✅ ALL TESTS PASSED!")
        print("="*60)
else:
    print("\n❌ ERROR: No recommendations returned")
