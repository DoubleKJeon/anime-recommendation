import sys
import os
import json

# Add lib to path
sys.path.append(os.path.join(os.getcwd(), 'lib'))

try:
    from recommender import get_recommendations
    
    # Test IDs
    test_ids = [1, 5, 20, 50, 100]
    
    # Get recommendations
    recs = get_recommendations(test_ids, top_n=5)
    
    # 결과 파일 저장
    with open('verification_result.txt', 'w', encoding='utf-8') as f:
        f.write(f"추천 결과 {len(recs)}개 중 상위 5개:\n")
        for i, rec in enumerate(recs[:5]):
            f.write(f"{i+1}. {rec['title']} - Match: {rec['match_score']:.4f}\n")
            print(f"{i+1}. {rec['title']} - Match: {rec['match_score']:.4f}")
    
    # Check for 'Unknown' titles
    unknown_count = sum(1 for r in recs if r['title'] == 'Unknown')
    if unknown_count > 0:
        print(f"\n❌ FAILED: Found {unknown_count} items with 'Unknown' title")
        sys.exit(1)
    else:
        print("\n✅ SUCCESS: All items have titles")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
