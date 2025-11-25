import sys
import os
import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix
import pickle
import warnings
import traceback
warnings.filterwarnings('ignore')

# UTF-8 인코딩 강제
if sys.platform == 'win32':
    os.system('chcp 65001 > nul')
    sys.stdout.reconfigure(encoding='utf-8')

try:
    print("🚀 데이터 로딩 중...")
    
    # 데이터 로드
    ratings = pd.read_csv('./data/rating_complete.csv')
    anime = pd.read_csv('./data/anime.csv')
    
    print(f"✅ Ratings: {ratings.shape}")
    print(f"✅ Anime: {anime.shape}")
    
    # 메모리 절약을 위해 상위 활성 유저와 인기 애니메이션만 사용
    print("\n🔍 데이터 필터링 중...")
    
    # 각 유저가 평가한 애니 개수
    user_counts = ratings['user_id'].value_counts()
    # 상위 50,000명의 활성 유저만 선택 (메모리 절약)
    top_users = user_counts.head(50000).index
    
    # 각 애니메이션의 평가 개수
    anime_counts = ratings['anime_id'].value_counts()
    # 100개 이상 평가받은 애니만
    popular_anime = anime_counts[anime_counts >= 100].index
    
    # 필터링
    filtered_ratings = ratings[
        (ratings['user_id'].isin(top_users)) & 
        (ratings['anime_id'].isin(popular_anime))
    ]
    
    print(f"✅ 필터링된 데이터: {filtered_ratings.shape}")
    print(f"   활성 유저: {filtered_ratings['user_id'].nunique():,}명")
    print(f"   인기 애니: {filtered_ratings['anime_id'].nunique():,}개")
    
    # User-Anime 매트릭스 생성 (벡터화된 방법)
    print("\n📊 User-Anime 매트릭스 생성 중...")
    
    # 유저와 애니 ID를 인덱스로 변환
    unique_users = filtered_ratings['user_id'].unique()
    unique_animes = filtered_ratings['anime_id'].unique()
    
    user_to_idx = {user: idx for idx, user in enumerate(unique_users)}
    anime_to_idx = {anime: idx for idx, anime in enumerate(unique_animes)}
    
    # 매트릭스 생성
    n_users = len(unique_users)
    n_animes = len(unique_animes)
    
    print(f"   매트릭스 크기: ({n_users}, {n_animes})")
    
    # 빈 매트릭스 생성
    user_anime_matrix = np.zeros((n_users, n_animes))
    
    # 벡터화된 방식으로 평점 채우기 (훨씬 빠름)
    print("   평점 데이터 채우기 (벡터화 방식)...")
    user_indices = filtered_ratings['user_id'].map(user_to_idx).values
    anime_indices = filtered_ratings['anime_id'].map(anime_to_idx).values
    ratings_values = filtered_ratings['rating'].values
    
    user_anime_matrix[user_indices, anime_indices] = ratings_values
    
    print(f"✅ Matrix shape: {user_anime_matrix.shape}")
    
    # Matrix가 너무 작으면 에러 발생
    if min(user_anime_matrix.shape) < 13:
        print(f"❌ 에러: Matrix가 너무 작습니다. Shape: {user_anime_matrix.shape}")
        print("   필터링 조건을 완화해야 합니다.")
        exit(1)
    
    # SVD 학습
    print("\n🧠 SVD 모델 학습 중...")
    user_ratings_mean = np.mean(user_anime_matrix, axis=1)
    matrix_user_mean = user_anime_matrix - user_ratings_mean.reshape(-1, 1)
    
    # k 값을 matrix 크기에 맞게 조정
    k = min(12, min(user_anime_matrix.shape) - 1)
    print(f"   Matrix shape: {user_anime_matrix.shape}")
    print(f"   k={k} 차원으로 분해 중...")
    
    if k < 1:
        print(f"❌ 에러: k 값이 너무 작습니다 (k={k})")
        exit(1)
    
    U, sigma, Vt = svds(matrix_user_mean, k=k)
    sigma = np.diag(sigma)
    
    print("✅ SVD 학습 완료!")
    
    # 애니메이션 정보 정리
    print("\n📝 애니메이션 메타데이터 준비 중...")
    
    # 실제 컬럼명 확인 후 필요한 컬럼만 선택
    available_columns = ['MAL_ID', 'Name']
    optional_columns = ['Genres', 'Type', 'Episodes', 'Score', 'Members']
    
    # 사용 가능한 컬럼만 선택
    columns_to_use = available_columns.copy()
    for col in optional_columns:
        if col in anime.columns:
            columns_to_use.append(col)
    
    anime_info = anime[columns_to_use].copy()
    anime_info = anime_info.dropna(subset=['Name'])
    anime_info_dict = anime_info.set_index('MAL_ID').to_dict('index')
    
    print(f"✅ {len(anime_info_dict):,}개 애니메이션 정보 준비 완료")
    
    # 모델 저장
    print("\n💾 모델 저장 중...")
    model_data = {
        'U': U,
        'sigma': sigma,
        'Vt': Vt,
        'user_ratings_mean': user_ratings_mean,
        'anime_ids': unique_animes.tolist(),
        'anime_info': anime_info_dict
    }
    
    with open('./data/svd_model.pkl', 'wb') as f:
        pickle.dump(model_data, f)
    
    print("✅ 모델 저장 완료: ./data/svd_model.pkl")
    print(f"✅ 총 {len(model_data['anime_ids'])}개 애니메이션 학습 완료!")
    print(f"\n다음 단계: npm run fetch-popular")

except Exception as e:
    print(f"\n❌ 에러 발생: {e}")
    print("\n상세 오류:")
    traceback.print_exc()
    exit(1)
