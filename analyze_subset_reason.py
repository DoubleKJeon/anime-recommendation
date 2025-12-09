import pandas as pd
import numpy as np
import sys

# UTF-8 출력
sys.stdout.reconfigure(encoding='utf-8')

# 평가 데이터 로드
df = pd.read_csv('data/rating_complete.csv')

print("=== SVD 모델이 일부 데이터만 사용한 이유 ===\n")

# 1. 사용자별 평가 수 분석
user_counts = df.groupby('user_id').size().sort_values(ascending=False)
print(f"사용자별 평가 수 분포")
print(f"  - 상위 50,000명의 평가 수: {user_counts.head(50000).sum():,}")
print(f"  - 전체 평가 수: {len(df):,}")
print(f"  - 상위 50,000명이 차지하는 비율: {user_counts.head(50000).sum() / len(df) * 100:.2f}%")
print(f"  - 평균 평가 수 (전체): {user_counts.mean():.1f}")
print(f"  - 평균 평가 수 (상위 50,000명): {user_counts.head(50000).mean():.1f}")
print(f"  - 중앙값 평가 수: {user_counts.median():.1f}")
print()

# 2. 애니메이션별 평가 수 분석
anime_counts = df.groupby('anime_id').size().sort_values(ascending=False)
print(f"애니메이션별 평가 수 분포")
print(f"  - 상위 10,510개의 평가 수: {anime_counts.head(10510).sum():,}")
print(f"  - 전체 평가 수: {len(df):,}")
print(f"  - 상위 10,510개가 차지하는 비율: {anime_counts.head(10510).sum() / len(df) * 100:.2f}%")
print(f"  - 평균 평가 수 (전체): {anime_counts.mean():.1f}")
print(f"  - 평균 평가 수 (상위 10,510개): {anime_counts.head(10510).mean():.1f}")
print(f"  - 중앙값 평가 수: {anime_counts.median():.1f}")
print()

# 3. Long-tail 분석
print(f"Long-tail 분석")
print(f"  - 평가 10개 미만 애니메이션: {(anime_counts < 10).sum():,}개 ({(anime_counts < 10).sum() / len(anime_counts) * 100:.1f}%)")
print(f"  - 평가 100개 미만 애니메이션: {(anime_counts < 100).sum():,}개 ({(anime_counts < 100).sum() / len(anime_counts) * 100:.1f}%)")
print(f"  - 평가 1000개 이상 애니메이션: {(anime_counts >= 1000).sum():,}개")
print()
print(f"  - 평가 10개 미만 사용자: {(user_counts < 10).sum():,}명 ({(user_counts < 10).sum() / len(user_counts) * 100:.1f}%)")
print(f"  - 평가 100개 미만 사용자: {(user_counts < 100).sum():,}명 ({(user_counts < 100).sum() / len(user_counts) * 100:.1f}%)")
print()

# 4. 계산 복잡도
print(f"계산 복잡도 비교")
full_size = len(user_counts) * len(anime_counts)
reduced_size = 50000 * 10510
print(f"  - 전체 매트릭스 크기: {len(user_counts):,} x {len(anime_counts):,} = {full_size:,} elements")
print(f"  - 축소된 매트릭스 크기: 50,000 x 10,510 = {reduced_size:,} elements")
print(f"  - 크기 감소 비율: {(1 - reduced_size / full_size) * 100:.2f}%")
print(f"  - 메모리 절감 (float64 기준): {(full_size - reduced_size) * 8 / 1024 / 1024 / 1024:.2f} GB")
