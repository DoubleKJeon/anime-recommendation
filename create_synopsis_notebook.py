"""
Generate Synopsis-Based Recommendation System Jupyter Notebook

This script creates a new notebook following the same structure as the original
but using TF-IDF + Cosine Similarity instead of SVD collaborative filtering.
"""

import nbformat as nbf
from datetime import datetime

# Create new notebook
nb = nbf.v4.new_notebook()

# Title and structure
cells = []

# Cell 1: Title
cells.append(nbf.v4.new_markdown_cell("""### Machine Learning-based Data Analysis with Case Study
### [Practice 4] : Anime Recommendation System (Synopsis-Based)
    1. 문제정의하기(Problem Define)
    2. 라이브러리 불러오기(Libraries Setting)
    3. 데이터 수집하기(Data Collection)
    4. 데이터 탐색하기(Data Exploration)
    5. 전처리하기(Preprocessing)
    6. 모델링하기(Modeling)
        - 6.1 시놉시스 기반 추천 (Synopsis-based Content Filtering)
        - 6.2 추천 결과 분석 및 설명 (Explainability)"""))

# Cell 2: Problem Define
cells.append(nbf.v4.new_markdown_cell("""#### [1]: Problem Define : 문제정의
- 애니메이션 추천 시스템 - **시놉시스 기반 콘텐츠 필터링** : 애니메이션을 추천합니다.

**기존 방식 (SVD 협업 필터링)의 문제점:**
- 유사도 측정 근거가 불명확 (평점 패턴만 고려)
- 콜드 스타트 문제 (신규 사용자/애니메이션 추천 불가)
- 설명 불가능 (왜 비슷한지 알 수 없음)

**새로운 방식 (시놉시스 기반)의 장점:**
- ✅ 명확한 유사도 근거 (시놉시스 내용 유사성)
- ✅ 콜드 스타트 해결 (평점 불필요)
- ✅ 설명 가능 (공통 키워드 제시)

- Data: MyAnimeList Dataset
     - y = f(x)
     - y: 애니메이션 추천
     - x: 애니메이션 시놉시스 + 장르 데이터"""))

# Cell 3: Libraries
cells.append(nbf.v4.new_markdown_cell("""#### [2] 라이브러리 불러오기(Libraries Setting)"""))

cells.append(nbf.v4.new_code_cell("""import numpy as np  # Numeric Python
import pandas as pd  # Data Processing and Database
import matplotlib.pyplot as plt  # Visualization
import seaborn as sns  # Visualization

# TF-IDF and Similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

import pickle
import warnings
warnings.filterwarnings('ignore')"""))

# Cell 4: Data Collection
cells.append(nbf.v4.new_markdown_cell("""#### [3] 데이터 수집하기(Data Collection)"""))

cells.append(nbf.v4.new_code_cell("""# 시놉시스가 포함된 애니메이션 데이터 로드
anime_df = pd.read_csv('./data/anime_with_synopsis.csv')

print(f"Total anime: {len(anime_df)}")
print(f"Columns: {anime_df.columns.tolist()}")

anime_df.head()"""))

# Cell 5: Data Exploration
cells.append(nbf.v4.new_markdown_cell("""#### [4] 데이터 탐색하기(Data Exploration)

**해석:**
- 애니메이션별로 시놉시스(줄거리)와 장르 정보가 있습니다.
- 시놉시스는 애니메이션의 내용을 텍스트로 설명합니다.
- 이 텍스트 유사도를 기반으로 추천을 수행합니다."""))

cells.append(nbf.v4.new_code_cell("""# 데이터 구조 확인
print("\\n=== 데이터 정보 ===")
anime_df.info()

print("\\n=== 통계 ===")
anime_df.describe()

print("\\n=== 시놉시스 샘플 ===")
print(anime_df.iloc[0]['sypnopsis'][:300])"""))

# Cell 6: Check synopsis availability
cells.append(nbf.v4.new_code_cell("""# 시놉시스 데이터 확인
print(f"Total anime: {len(anime_df)}")
print(f"Anime with synopsis: {anime_df['sypnopsis'].notna().sum()}")
print(f"Coverage: {anime_df['sypnopsis'].notna().sum() / len(anime_df) * 100:.2f}%")

# 시놉시스 길이 분포
synopsis_lengths = anime_df['sypnopsis'].dropna().str.len()
print(f"\\nSynopsis length - Mean: {synopsis_lengths.mean():.0f}, Max: {synopsis_lengths.max()}")

# 시각화
plt.figure(figsize=(10, 4))
plt.hist(synopsis_lengths, bins=50, color='#00d26a', alpha=0.7)
plt.xlabel('Synopsis Length (characters)')
plt.ylabel('Count')
plt.title('Distribution of Synopsis Lengths')
plt.show()"""))

# Cell 7: Preprocessing
cells.append(nbf.v4.new_markdown_cell("""#### [5] 전처리하기(Preprocessing)

시놉시스와 장르를 결합하여 텍스트 데이터를 준비합니다."""))

cells.append(nbf.v4.new_code_cell("""# 시놉시스 + 장르 결합
anime_df['combined_text'] = (
    anime_df['sypnopsis'].fillna('') + ' ' + 
    anime_df['Genres'].fillna('')
)

# 결측치 제거
anime_df_clean = anime_df[anime_df['combined_text'].str.strip() != ''].copy()

print(f"Anime after cleaning: {len(anime_df_clean)}")
print(f"\\nSample combined text:")
print(anime_df_clean.iloc[0]['combined_text'][:200])"""))

# Cell 8: Modeling - TF-IDF
cells.append(nbf.v4.new_markdown_cell("""#### [6] 모델링하기(Modeling)

#### [6.1] 시놉시스 기반 추천 (Synopsis-based Content Filtering)

**TF-IDF (Term Frequency-Inverse Document Frequency):**
- 각 단어의 중요도를 계산
- 자주 나오지만 모든 문서에 나오는 단어는 중요도 낮음
- 특정 애니메이션에만 나오는 단어는 중요도 높음"""))

cells.append(nbf.v4.new_code_cell("""# TF-IDF Vectorization
tfidf = TfidfVectorizer(
    stop_words='english',    # 영어 불용어 제거
    max_features=5000,       # 상위 5000개 단어만 사용
    ngram_range=(1, 2),      # 1단어 + 2단어 조합
    min_df=2                 # 최소 2개 문서에 나와야 함
)

print("TF-IDF 벡터화 진행 중...")
tfidf_matrix = tfidf.fit_transform(anime_df_clean['combined_text'])

print(f"TF-IDF Matrix shape: {tfidf_matrix.shape}")
print(f"(애니메이션 수, 단어 수)")
print(f"\\nMatrix 크기: {tfidf_matrix.data.nbytes / 1024 / 1024:.2f} MB")

# Feature names
feature_names = tfidf.get_feature_names_out()
print(f"\\nSample features: {feature_names[:20].tolist()}")"""))

# Cell 9: Cosine Similarity
cells.append(nbf.v4.new_markdown_cell("""#### 코사인 유사도(Cosine Similarity)

두 애니메이션의 시놉시스가 얼마나 비슷한지 측정합니다.
- 1에 가까울수록 매우 유사
- 0에 가까울수록 전혀 다름"""))

cells.append(nbf.v4.new_code_cell("""# 코사인 유사도 계산 (샘플 1000개로 테스트)
print("코사인 유사도 계산 중...")
sample_size = 1000
sample_matrix = tfidf_matrix[:sample_size]

cosine_sim_sample = cosine_similarity(sample_matrix, sample_matrix)

print(f"Similarity matrix shape: {cosine_sim_sample.shape}")
print(f"\\nSample similarities (anime 0 with others):")
print(cosine_sim_sample[0][:10])"""))

# Cell 10: Recommendation Function
cells.append(nbf.v4.new_markdown_cell("""#### 추천 함수 구현"""))

cells.append(nbf.v4.new_code_cell("""def get_recommendations(anime_id, top_n=10):
    \"\"\"
    특정 애니메이션과 유사한 애니메이션 추천
    
    Args:
        anime_id: MyAnimeList ID
        top_n: 추천할 개수
    
    Returns:
        추천 애니메이션 DataFrame
    \"\"\"
    # 전체 유사도 계산
    full_cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # 해당 애니메이션 찾기
    idx = anime_df_clean[anime_df_clean['MAL_ID'] == anime_id].index
    
    if len(idx) == 0:
        print(f"Anime ID {anime_id} not found!")
        return None
    
    idx = idx[0]
    
    # 유사도 점수 가져오기
    sim_scores = list(enumerate(full_cosine_sim[idx]))
    
    # 자기 자신 제외하고 정렬
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:top_n+1]
    
    # 인덱스 추출
    anime_indices = [i[0] for i in sim_scores]
    similarity_scores = [i[1] for i in sim_scores]
    
    # 결과 DataFrame
    recommendations = anime_df_clean.iloc[anime_indices][['MAL_ID', 'Name', 'Score', 'Genres']].copy()
    recommendations['Similarity'] = similarity_scores
    
    return recommendations


# 테스트: Cowboy Bebop (ID=1)와 유사한 애니메이션
print("=== Cowboy Bebop과 유사한 애니메이션 ===")
print(f"원작: {anime_df_clean[anime_df_clean['MAL_ID']==1]['Name'].values[0]}")
print(f"장르: {anime_df_clean[anime_df_clean['MAL_ID']==1]['Genres'].values[0]}\\n")

recommendations = get_recommendations(1, top_n=10)
print(recommendations.to_string(index=False))"""))

# Cell 11: Explainability
cells.append(nbf.v4.new_markdown_cell("""#### [6.2] 추천 결과 분석 및 설명 (Explainability)

**핵심 차별점:** 왜 이 애니메이션들이 추천되었는지 설명할 수 있습니다."""))

cells.append(nbf.v4.new_code_cell("""def explain_similarity(anime_id_1, anime_id_2, top_keywords=10):
    \"\"\"
    두 애니메이션의 유사도를 설명 (공통 키워드)
    
    Args:
        anime_id_1: 첫 번째 애니메이션 ID
        anime_id_2: 두 번째 애니메이션 ID
        top_keywords: 표시할 키워드 수
    
    Returns:
        공통 키워드와 중요도
    \"\"\"
    # 인덱스 찾기
    idx1 = anime_df_clean[anime_df_clean['MAL_ID'] == anime_id_1].index[0]
    idx2 = anime_df_clean[anime_df_clean['MAL_ID'] == anime_id_2].index[0]
    
    # TF-IDF 벡터 가져오기
    vec1 = tfidf_matrix[idx1].toarray()[0]
    vec2 = tfidf_matrix[idx2].toarray()[0]
    
    # 공통 키워드 찾기
    feature_names = tfidf.get_feature_names_out()
    common_keywords = []
    
    for i, (v1, v2) in enumerate(zip(vec1, vec2)):
        if v1 > 0 and v2 > 0:
            importance = min(v1, v2)
            common_keywords.append((feature_names[i], importance))
    
    # 중요도순 정렬
    common_keywords.sort(key=lambda x: x[1], reverse=True)
    
    # 애니메이션 정보
    name1 = anime_df_clean.iloc[idx1]['Name']
    name2 = anime_df_clean.iloc[idx2]['Name']
    
    # 유사도 계산
    similarity = cosine_similarity(
        tfidf_matrix[idx1:idx1+1], 
        tfidf_matrix[idx2:idx2+1]
    )[0][0]
    
    print(f"=== {name1} ⟷ {name2} ===")
    print(f"유사도 점수: {similarity:.4f}\\n")
    print(f"공통 키워드 (상위 {top_keywords}개):")
    for keyword, importance in common_keywords[:top_keywords]:
        print(f"  - {keyword} (중요도: {importance:.3f})")
    
    return common_keywords[:top_keywords]


# 예시: Cowboy Bebop과 추천된 첫 번째 애니메이션
first_rec_id = recommendations.iloc[0]['MAL_ID']
explain_similarity(1, first_rec_id, top_keywords=10)"""))

# Cell 12: Multiple anime recommendations
cells.append(nbf.v4.new_markdown_cell("""#### 여러 애니메이션 기반 추천 (콜드 스타트 시나리오)

사용자가 좋아하는 애니메이션 여러 개를 선택했을 때의 추천"""))

cells.append(nbf.v4.new_code_cell("""def get_multi_recommendations(anime_ids, top_n=10):
    \"\"\"
    여러 애니메이션을 좋아하는 사용자에게 추천
    
    Args:
        anime_ids: 좋아하는 애니메이션 ID 리스트
        top_n: 추천할 개수
    
    Returns:
        추천 애니메이션 DataFrame
    \"\"\"
    # 전체 유사도 계산
    full_cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # 각 애니메이션의 인덱스 찾기
    indices = []
    for anime_id in anime_ids:
        idx = anime_df_clean[anime_df_clean['MAL_ID'] == anime_id].index
        if len(idx) > 0:
            indices.append(idx[0])
    
    if not indices:
        print("No valid anime IDs found!")
        return None
    
    # 각 선택한 애니메이션과의 평균 유사도 계산
    avg_similarities = []
    for i in range(len(anime_df_clean)):
        if i in indices:
            avg_similarities.append(0)  # 자기 자신 제외
        else:
            similarities = [full_cosine_sim[idx][i] for idx in indices]
            avg_similarities.append(np.mean(similarities))
    
    # 상위 N개 선택
    top_indices = np.argsort(avg_similarities)[::-1][:top_n]
    top_scores = [avg_similarities[i] for i in top_indices]
    
    # 결과 DataFrame
    recommendations = anime_df_clean.iloc[top_indices][['MAL_ID', 'Name', 'Score', 'Genres']].copy()
    recommendations['Avg_Similarity'] = top_scores
    
    return recommendations


# 테스트: 여러 애니메이션 선택 (다양한 장르)
selected_ids = [
    1,      # Cowboy Bebop (Action, Sci-Fi)
    1535,   # Death Note (Supernatural, Suspense)
    30276   # One Punch Man (Action, Comedy)
]

print("=== 선택한 애니메이션 ===")
for aid in selected_ids:
    anime_info = anime_df_clean[anime_df_clean['MAL_ID'] == aid]
    if len(anime_info) > 0:
        print(f"- {anime_info.iloc[0]['Name']} ({anime_info.iloc[0]['Genres']})")

print("\\n=== 추천 결과 ===")
multi_recs = get_multi_recommendations(selected_ids, top_n=10)
print(multi_recs.to_string(index=False))"""))

# Cell 13: Save model
cells.append(nbf.v4.new_markdown_cell("""#### 모델 저장

추천 시스템을 배포하기 위해 TF-IDF 모델을 저장합니다."""))

cells.append(nbf.v4.new_code_cell("""# 모델 저장
model_data = {
    'tfidf_vectorizer': tfidf,
    'tfidf_matrix': tfidf_matrix,
    'anime_data': anime_df_clean[['MAL_ID', 'Name', 'Score', 'Genres']].reset_index(drop=True),
    'feature_names': feature_names
}

with open('./data/synopsis_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("✅ Model saved to ./data/synopsis_model.pkl")
print(f"   - Anime count: {len(anime_df_clean)}")
print(f"   - Features: {len(feature_names)}")
print(f"   - Matrix size: {tfidf_matrix.data.nbytes / 1024 / 1024:.2f} MB")"""))

# Cell 14: Conclusion
cells.append(nbf.v4.new_markdown_cell("""## 결론

### 시놉시스 기반 추천 시스템의 장점

1. **설명 가능성 (Explainability)**
   - 공통 키워드를 통해 왜 비슷한지 명확히 설명 가능
   - 예: "school", "magic", "friendship" 같은 공통 테마

2. **콜드 스타트 해결**
   - 사용자 평점 데이터 없이도 추천 가능
   - 신규 애니메이션도 시놉시스만 있으면 즉시 추천 가능

3. **내용 기반 유사성**
   - 실제 스토리 내용이 비슷한 애니메이션 추천
   - 평점 패턴이 아닌 콘텐츠 자체의 유사성

### 협업 필터링 vs 시놉시스 기반

| 항목 | 협업 필터링 (SVD) | 시놉시스 기반 (TF-IDF) |
|------|------------------|----------------------|
| 데이터 요구 | 사용자 평점 필요 | 시놉시스만 필요 |
| 콜드 스타트 | 문제 있음 ❌ | 해결 ✅ |
| 설명 가능성 | 어려움 ❌ | 쉬움 ✅ |
| 유사도 근거 | 평점 패턴 | 내용 유사성 |
| 추천 다양성 | 높음 | 중간 |

### 개선 방향

- 한글 형태소 분석 적용
- 장르별 가중치 조정
- 하이브리드 방식 (협업 필터링 + 콘텐츠 필터링)"""))

nb['cells'] = cells

# Save notebook
output_path = './Synopsis_Based_Recommendation_System.ipynb'
with open(output_path, 'w', encoding='utf-8') as f:
    nbf.write(nb, f)

print(f"✅ Notebook created: {output_path}")
print(f"   Total cells: {len(cells)}")
print(f"   Markdown cells: {sum(1 for c in cells if c['cell_type'] == 'markdown')}")
print(f"   Code cells: {sum(1 for c in cells if c['cell_type'] == 'code')}")
