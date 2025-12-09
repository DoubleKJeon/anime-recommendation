import pandas as pd
import pickle
import sys

# 출력을 파일로 저장
output_file = 'dataset_stats.txt'
sys.stdout = open(output_file, 'w', encoding='utf-8')

# 평가 데이터 로드
print("=== 학습 데이터셋 통계 ===\n")

# rating_complete.csv 분석
df = pd.read_csv('data/rating_complete.csv')
print(f"📊 평가 데이터 (rating_complete.csv)")
print(f"  - 총 평가 수 (rows): {len(df):,}")
print(f"  - 고유 사용자 수: {df['user_id'].nunique():,}")
print(f"  - 고유 애니메이션 수: {df['anime_id'].nunique():,}")
print(f"  - 평균 평점: {df['rating'].mean():.2f}")
print(f"  - 데이터 밀도: {(len(df) / (df['user_id'].nunique() * df['anime_id'].nunique()) * 100):.4f}%")
print()

# anime.csv 분석
anime_df = pd.read_csv('data/anime.csv')
print(f"📺 애니메이션 정보 (anime.csv)")
print(f"  - 총 애니메이션 수: {len(anime_df):,}")
print()

# SVD 모델 정보
with open('data/svd_model.pkl', 'rb') as f:
    model = pickle.load(f)

print(f"🧮 SVD 모델")
print(f"  - 모델에 포함된 애니메이션 수: {len(model['anime_ids']):,}")
print(f"  - 잠재 요인 차원 (k): {model['Vt'].shape[0]}")
print(f"  - 사용자 latent matrix shape: {model['U'].shape}")
print(f"  - 애니메이션 latent matrix shape: {model['Vt'].shape}")

sys.stdout.close()
print(f"결과가 {output_file}에 저장되었습니다.", file=sys.__stdout__)
