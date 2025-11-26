# Anime Recommendation System - SVD Matrix Factorization
# Machine Learning-based Data Analysis
# Practice: Collaborative Filtering Recommendation System

## [1] Problem Define: 문제정의
"""
애니메이션 추천 시스템 - 협업 필터링 Matrix Factorization

- 목표: 사용자의 취향에 맞는 애니메이션을 추천합니다.
- Data: MyAnimeList 데이터셋
    - y = f(x)
    - y: 애니메이션 추천
    - x: 애니메이션 데이터, 사용자 평점 데이터
"""

## [2] 라이브러리 불러오기 (Libraries Setting)
import numpy as np  # Numeric Python
import pandas as pd  # Data Processing and Database
import matplotlib.pyplot as plt  # Visualization
import seaborn as sns  # Visualization
import pickle

from scipy.sparse.linalg import svds  # Recommendations (SVD)

"""
[SVD: Singular Value Decomposition (특이값 분해)]

- 왜 사용할까요?
- 특이값 분해의 목적: 행렬을 분해하는 방법 중 하나입니다.
    - 인수분해가 이차방정식의 해를 구하기 위한 도구인 것처럼,
    - SVD는 행렬을 차원축소 하기위한 도구로 쓰입니다.
    - 개념상 비유: SVD == 인수분해

- 특이값 분해의 활용:
    - 데이터 전체 공간의 차원보다 낮은 차원으로 근사시켜 적합(fit)시킬 수 있습니다.
    - 행렬 A를 k차원으로 축소한 행렬 B를 찾는 데 사용됩니다.
"""

## [3] 데이터 수집하기 (Data Collection)
# 애니메이션 평점 데이터 (사용자가 애니메이션에 대해 매긴 점수)
rating_data = pd.read_csv('./data/rating_complete.csv')

# 애니메이션 정보 데이터
anime_data = pd.read_csv('./data/anime_with_synopsis.csv')

print("Rating Data Shape:", rating_data.shape)
print("Anime Data Shape:", anime_data.shape)
print("\n=== Rating Data Sample ===")
print(rating_data.head())

"""
해석:
- user_id가 같다는 의미는 한 사람임을 알려줍니다.
- 한 사람이 여러 애니메이션을 볼 수 있습니다.
- 한 사람이 여러 애니메이션들에 대해 점수를 매길 수 있습니다.
"""

print("\n=== Anime Data Sample ===")
print(anime_data.head())

"""
해석:
- 두 개의 파일은 사용자-평점 데이터와 애니메이션 데이터로 나뉘어져 있습니다.
- 이 두개의 파일은 공통적으로 anime_id를 가지고 있습니다.
- anime_id를 활용하면 하나로 합칠 수 있습니다.
"""

## [4] 데이터 탐색하기 (Data Exploration)

### [데이터 셋 구조]
print("\n=== Data Shape ===")
print("Anime Data:", anime_data.shape)
print("Rating Data:", rating_data.shape)

### [데이터 타입]
print("\n=== Anime Data Info ===")
print(anime_data.info())

print("\n=== Rating Data Info ===")
print(rating_data.info())

### [데이터 통계]
print("\n=== Anime Data Statistics ===")
print(anime_data.describe())

print("\n=== Rating Data Statistics ===")
print(rating_data.describe())

### [중복 제거하여 사용자 수 확인]
user_id_unique = rating_data['user_id'].nunique()
print(f"\n총 사용자 수: {user_id_unique}명")

anime_id_unique = rating_data['anime_id'].nunique()
print(f"평가된 애니메이션 수: {anime_id_unique}개")

## [5] 전처리하기 (Preprocessing)

# 필요한 컬럼만 선택
rating_data_clean = rating_data[['user_id', 'anime_id', 'rating']].copy()

# -1 평점 제거 (평가하지 않은 경우)
rating_data_clean = rating_data_clean[rating_data_clean['rating'] != -1]

# 애니메이션 정보에서 필요한 컬럼 선택
anime_data_clean = anime_data[['MAL_ID', 'Name', 'Score', 'Genres', 
                                'Episodes', 'Type']].copy()
anime_data_clean = anime_data_clean.rename(columns={'MAL_ID': 'anime_id'})

print("\n=== Cleaned Rating Data ===")
print(rating_data_clean.head())
print("Shape:", rating_data_clean.shape)

print("\n=== Cleaned Anime Data ===")
print(anime_data_clean.head())
print("Shape:", anime_data_clean.shape)

# 데이터 샘플링 (메모리 효율성을 위해)
# 평점이 많은 상위 사용자와 애니메이션만 사용
print("\n=== Sampling Data for Efficiency ===")

# 애니메이션별 평점 개수
anime_rating_counts = rating_data_clean['anime_id'].value_counts()
popular_animes = anime_rating_counts[anime_rating_counts >= 100].index

# 사용자별 평가 개수
user_rating_counts = rating_data_clean['user_id'].value_counts()
active_users = user_rating_counts[user_rating_counts >= 50].index

# 필터링
rating_data_sampled = rating_data_clean[
    (rating_data_clean['anime_id'].isin(popular_animes)) &
    (rating_data_clean['user_id'].isin(active_users))
]

print(f"Sampled Data Shape: {rating_data_sampled.shape}")
print(f"Users: {rating_data_sampled['user_id'].nunique()}")
print(f"Animes: {rating_data_sampled['anime_id'].nunique()}")

# User-Anime Pivot Table 생성
"""
- rating을 value로 사용합니다.
- user_id를 인덱스로 사용합니다.
- anime_id를 컬럼으로 사용합니다.
- rating이 없는 경우는 value를 0으로 할당합니다.
"""

user_anime_rating = rating_data_sampled.pivot_table(
    'rating', 
    index='user_id', 
    columns='anime_id'
).fillna(0)

print("\n=== User-Anime Rating Matrix ===")
print(user_anime_rating.shape)
print(user_anime_rating.head())

# 사용자 수와 애니메이션 수
print(f"\n사용자 수: {user_anime_rating.shape[0]}명")
print(f"애니메이션 수: {user_anime_rating.shape[1]}개")

## [6] 모델링하기 (Modeling)

## [6.1] 품목 추천 (Item-based Recommendations)

from sklearn.decomposition import TruncatedSVD

# 행렬 전치 (애니메이션 기준으로)
anime_user_rating = user_anime_rating.values.T

print("\n=== Item-based Matrix (Anime x User) ===")
print(f"Shape: {anime_user_rating.shape}")

# Truncated SVD 적용
SVD = TruncatedSVD(n_components=12, random_state=42)
matrix_svd = SVD.fit_transform(anime_user_rating)

print(f"\n차원 축소 후 Shape: {matrix_svd.shape}")
print(f"사용자 {anime_user_rating.shape[1]}명의 평점을 12개 차원으로 압축")

# 애니메이션 간 상관관계 계산 (피어슨 상관계수)
"""
np.corrcoef(): 피어슨 상관계수 값을 계산합니다.
행을 기준으로 값들을 변수로 생각해서, 그 변수에 대한 상관계수를 구합니다.
애니메이션-애니메이션 간의 상관관계를 봅니다.
"""
corr = np.corrcoef(matrix_svd)
print(f"\n상관계수 행렬 Shape: {corr.shape}")

# 특정 애니메이션과 유사한 애니메이션 추천
anime_titles = list(user_anime_rating.columns)
anime_title_to_index = {title: idx for idx, title in enumerate(anime_titles)}

# 예시: 특정 애니메이션 ID로 유사한 애니메이션 찾기
sample_anime_id = anime_titles[0]  # 첫 번째 애니메이션
sample_anime_idx = 0

corr_sample = corr[sample_anime_idx]
similar_animes_idx = np.argsort(corr_sample)[::-1][1:11]  # 자기 자신 제외 상위 10개

print(f"\n=== 애니메이션 ID {sample_anime_id}와 유사한 작품 ===")
for idx in similar_animes_idx:
    anime_id = anime_titles[idx]
    similarity = corr_sample[idx]
    anime_info = anime_data_clean[anime_data_clean['anime_id'] == anime_id]
    if not anime_info.empty:
        print(f"상관계수 {similarity:.3f}: {anime_info.iloc[0]['Name']}")

## [6.2] 사용자에게 개인맞춤 추천하기 (Personalized Recommendations)

print("\n\n=== Personalized Recommendations using SVD ===")

# 원본 데이터 재로드 (이전 변수와 혼동 방지)
df_ratings = rating_data_sampled.copy()
df_animes = anime_data_clean.copy()

# User-Anime Pivot Table
df_user_anime_ratings = df_ratings.pivot_table(
    values='rating',
    index='user_id',
    columns='anime_id'
).fillna(0)

print(f"User-Anime Matrix Shape: {df_user_anime_ratings.shape}")
print(df_user_anime_ratings.iloc[:10, :5])

"""
해석:
- 사용자-애니메이션 pivot table을 만들었습니다.
- 이제 아래와 같이 데이터를 변경해서 진행하겠습니다:
    1. pivot table을 matrix로 변환
    2. np.mean(axis=1)로 사용자들이 매기는 애니메이션 평점 평균 구함
    3. (특정 사용자가 매긴 점수 - 평균) 으로 데이터 정규화
        - 평균 기점으로 +이면 긍정, -이면 부정
"""

# Matrix 변환
matrix = df_user_anime_ratings.to_numpy()

# 사용자별 평점 평균
user_ratings_mean = np.mean(matrix, axis=1)

# 평균 차이로 정규화
matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)

print(f"\nMatrix Shape: {matrix.shape}")
print(f"User Ratings Mean Shape: {user_ratings_mean.shape}")
print(f"Normalized Matrix Shape: {matrix_user_mean.shape}")

# SVD 적용
U, sigma, Vt = svds(matrix_user_mean, k=12)

print(f"\nU Shape: {U.shape}")
print(f"Sigma Shape: {sigma.shape}")
print(f"Vt Shape: {Vt.shape}")

# Sigma를 대각행렬로 변환
sigma = np.diag(sigma)
print(f"Sigma Diagonal Matrix Shape: {sigma.shape}")

# 예측 평점 계산 (원본 행렬로 복원)
svd_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)

df_svd_preds = pd.DataFrame(
    svd_user_predicted_ratings,
    columns=df_user_anime_ratings.columns,
    index=df_user_anime_ratings.index
)

print("\n=== Predicted Ratings DataFrame ===")
print(df_svd_preds.head())

# 추천 함수 정의
def recommend_animes(df_svd_preds, user_id, ori_animes_df, 
                     ori_ratings_df, num_recommendations=10):
    """
    사용자에게 애니메이션 추천
    
    Args:
        df_svd_preds: SVD 예측 평점 DataFrame
        user_id: 사용자 ID
        ori_animes_df: 원본 애니메이션 정보
        ori_ratings_df: 원본 평점 데이터
        num_recommendations: 추천 개수
    
    Returns:
        user_history: 사용자가 본 애니메이션
        recommendations: 추천 애니메이션
    """
    
    # 사용자 ID로 예측 평점 정렬
    if user_id not in df_svd_preds.index:
        print(f"사용자 ID {user_id}가 존재하지 않습니다.")
        return None, None
    
    sorted_user_predictions = df_svd_preds.loc[user_id].sort_values(ascending=False)
    
    # 사용자가 본 애니메이션
    user_data = ori_ratings_df[ori_ratings_df['user_id'] == user_id]
    user_history = user_data.merge(
        ori_animes_df, 
        on='anime_id'
    ).sort_values(['rating'], ascending=False)
    
    # 사용자가 보지 않은 애니메이션
    recommendations = ori_animes_df[
        ~ori_animes_df['anime_id'].isin(user_history['anime_id'])
    ]
    
    # 예측 평점과 결합
    recommendations = recommendations.merge(
        pd.DataFrame(sorted_user_predictions).reset_index(),
        on='anime_id'
    )
    
    # 컬럼 이름 변경 및 정렬
    recommendations = recommendations.rename(
        columns={user_id: 'Predictions'}
    ).sort_values('Predictions', ascending=False).iloc[:num_recommendations, :]
    
    return user_history, recommendations


# 예시: 특정 사용자에게 추천
sample_user_id = df_user_anime_ratings.index[0]

already_rated, predictions = recommend_animes(
    df_svd_preds, 
    sample_user_id, 
    df_animes, 
    df_ratings, 
    10
)

print(f"\n=== 사용자 {sample_user_id}가 본 애니메이션 (상위 10개) ===")
if already_rated is not None:
    print(already_rated[['Name', 'rating', 'Score', 'Type']].head(10))

print(f"\n=== 사용자 {sample_user_id}에게 추천하는 애니메이션 ===")
if predictions is not None:
    print(predictions[['Name', 'Predictions', 'Score', 'Type', 'Genres']])

# 모델 저장
print("\n=== Saving Model ===")
model_data = {
    'U': U,
    'sigma': sigma,
    'Vt': Vt,
    'anime_ids': list(df_user_anime_ratings.columns),
    'user_ratings_mean': user_ratings_mean,
    'anime_info': df_animes.set_index('anime_id').to_dict('index')
}

with open('./data/svd_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("모델이 './data/svd_model.pkl'에 저장되었습니다.")

"""
결론:
- SVD를 이용한 협업 필터링으로 애니메이션 추천 시스템을 구현했습니다.
- Item-based: 특정 애니메이션과 유사한 작품 추천
- Personalized: 사용자 맞춤 추천
- 사용자별로 다르게 추천됨을 확인할 수 있습니다.
"""
