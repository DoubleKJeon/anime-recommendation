import pandas as pd

# 원본 데이터
ratings = pd.read_csv('./data/rating_complete.csv')
print(f"원본 평가 데이터: {len(ratings):,} rows")

# 필터링 조건
user_counts = ratings['user_id'].value_counts()
anime_counts = ratings['anime_id'].value_counts()

top_users = user_counts.head(50000).index
popular_anime = anime_counts[anime_counts >= 100].index

# 필터링된 데이터
filtered_ratings = ratings[
    (ratings['user_id'].isin(top_users)) & 
    (ratings['anime_id'].isin(popular_anime))
]

print(f"학습 평가 데이터: {len(filtered_ratings):,} rows")
print(f"감소율: {(1 - len(filtered_ratings)/len(ratings)) * 100:.1f}%")
