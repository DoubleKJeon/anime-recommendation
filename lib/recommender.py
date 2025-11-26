import sys
import json
import pickle
import numpy as np
from scipy.spatial.distance import cosine

def get_recommendations(selected_anime_ids, top_n=30, model_path=None):
    """
    선택한 애니메이션 기반 추천
    
    Args:
        selected_anime_ids: 사용자가 선택한 애니메이션 ID 리스트 [1, 5, 20, 50, 100]
        top_n: 추천할 애니메이션 개수 (기본 30개)
        model_path: 모델 파일 경로 (선택 사항)
    
    Returns:
        추천 애니메이션 리스트
    """
    
    # 모델 로드
    if model_path is None:
        import os
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, '..', 'data', 'svd_model.pkl')
    
    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    
    U = model['U']
    sigma = model['sigma']
    Vt = model['Vt']
    anime_ids = model['anime_ids']
    anime_info = model['anime_info']
    
    # 추천 점수 저장
    recommendations = {}
    
    valid_selected_count = 0
    for anime_id in selected_anime_ids:
        if anime_id not in anime_ids:
            continue
        
        valid_selected_count += 1
        anime_idx = anime_ids.index(anime_id)
        
        # 해당 애니메이션의 latent vector
        anime_vector = Vt[:, anime_idx]
        
        # 모든 애니메이션과 코사인 유사도 계산
        for i, other_anime_id in enumerate(anime_ids):
            if other_anime_id in selected_anime_ids:
                continue
            
            other_vector = Vt[:, i]
            
            # 코사인 유사도
            similarity = 1 - cosine(anime_vector, other_vector)
            
            # 누적 점수
            if other_anime_id in recommendations:
                recommendations[other_anime_id] += similarity
            else:
                recommendations[other_anime_id] = similarity
    
    # 점수 정규화 (평균)
    if valid_selected_count > 0:
        for anime_id in recommendations:
            recommendations[anime_id] /= valid_selected_count
    
    # 점수 높은 순으로 정렬
    sorted_recs = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:top_n]
    
    # 애니메이션 정보 추가
    result = []
    for anime_id, score in sorted_recs:
        if anime_id in anime_info:
            info = anime_info[anime_id]
            result.append({
                'anime_id': int(anime_id),
                'title': info.get('Name', 'Unknown'),
                'genre': info.get('Genres', ''),
                'type': info.get('Type', ''),
                'episodes': int(info.get('Episodes', 0)) if info.get('Episodes') else 0,
                'rating': info.get('Score', ''),
                'match_score': float(score)
            })
    
    return result

if __name__ == '__main__':
    # CLI에서 실행할 경우
    if len(sys.argv) > 1:
        selected_ids = json.loads(sys.argv[1])
        recommendations = get_recommendations(selected_ids)
        print(json.dumps(recommendations, ensure_ascii=False))
    else:
        # 테스트
        test_ids = [1, 5, 20, 50, 100]
        print(f"테스트 입력: {test_ids}")
        recommendations = get_recommendations(test_ids)
        print(f"\n추천 결과 {len(recommendations)}개:")
        for idx, rec in enumerate(recommendations[:5], 1):
            print(f"{idx}. {rec['title']} (매치: {rec['match_score']:.2f})")
