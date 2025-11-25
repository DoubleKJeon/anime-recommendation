# 🎬 Anime Recommender System

SVD 기반 협업 필터링을 활용한 애니메이션 추천 시스템

## 🚀 Features

- **협업 필터링**: SVD(특이값 분해)를 사용한 추천 알고리즘
- **심플한 UX**: 5개 선택 → 30개 추천
- **실시간 이미지**: Jikan API 연동
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Python 3, Scipy, Scikit-learn
- **Data**: Kaggle MyAnimeList Dataset
- **API**: Jikan API v4

## 📊 Dataset

- **Rating Data**: 57M ratings
- **Anime Data**: 16,872 애니메이션
- **User Data**: 310,059 유저
- **Source**: [Kaggle - MyAnimeList Anime Recommendation Database 2020](https://www.kaggle.com/datasets/hernan4444/anime-recommendation-database-2020)

## 🏃 Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd anime-recommender

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 2. Download Kaggle Data

> ⚠️ **중요**: Kaggle에서 데이터를 수동으로 다운로드해야 합니다!

1. Kaggle 계정으로 로그인
2. [MyAnimeList Dataset](https://www.kaggle.com/datasets/hernan4444/anime-recommendation-database-2020) 다운로드
3. `anime.csv`와 `rating_complete.csv`를 `data/` 폴더에 저장

또는 Kaggle API 사용:

```bash
# Kaggle API 설치 (없으면)
pip install kaggle

# 데이터셋 다운로드
kaggle datasets download -d hernan4444/anime-recommendation-database-2020

# 압축 해제
unzip anime-recommendation-database-2020.zip -d ./data/
```

### 3. Prepare Data

```bash
# Step 1: 데이터 전처리 및 SVD 모델 학습 (~5-10분 소요)
npm run prepare-data

# Step 2: 인기 애니 100개 + 이미지 가져오기 (~2-3분 소요)
npm run fetch-popular
```

### 4. Run Development Server

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속!

## 📁 Project Structure

```
anime-recommender/
├── components/         # React 컴포넌트
│   ├── AnimeCard.tsx
│   ├── AnimeSelector.tsx
│   └── RecommendationList.tsx
├── pages/             # Next.js 페이지 & API
│   ├── index.tsx
│   └── api/
│       └── recommend.ts
├── lib/               # Python 추천 로직
│   └── recommender.py
├── scripts/           # 데이터 준비 스크립트
│   ├── 1_prepare_data.py
│   └── 2_fetch_popular.py
├── data/              # 데이터 파일
│   ├── anime.csv               # Kaggle에서 다운로드
│   ├── rating_complete.csv     # Kaggle에서 다운로드
│   ├── popular_animes.json     # 스크립트로 생성
│   └── svd_model.pkl           # 학습된 모델
├── interfaces/        # TypeScript 타입 정의
│   └── types.ts
├── public/            # 정적 파일
└── styles/            # CSS 파일
```

## 🎓 Algorithm

### SVD 기반 협업 필터링

1. **User-Anime Matrix 생성**: 사용자-애니메이션 평점 행렬 생성
2. **SVD 분해**: k=12 차원으로 차원 축소
   - U: 사용자 latent factors
   - Σ: singular values
   - V^T: 애니메이션 latent factors
3. **코사인 유사도**: 선택한 애니와 유사한 애니 찾기
4. **점수 집계**: 5개 선택 애니 기반 누적 점수 계산
5. **Top 30 추천**: 최종 추천 결과 반환

### Why SVD?

- **차원 축소**: 57M개 평점 데이터를 12차원으로 압축
- **노이즈 제거**: 중요한 패턴만 추출
- **빠른 계산**: 실시간 추천 가능
- **고품질**: Cold start 문제 최소화

## 🎨 Features Detail

### 1. 애니메이션 선택 (AnimeSelector)
- 100개 인기 애니메이션 그리드 표시
- 실시간 검색 기능
- 진행 바 (0/5 → 5/5)
- 최대 5개 선택 제한

### 2. 추천 결과 (RecommendationList)
- 30개 추천 애니 랭킹
- 매칭률 표시 (%)
- 장르, 타입, 에피소드 정보
- "다시 선택하기" 버튼

## 📝 Scripts

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 데이터 전처리
npm run prepare-data

# 인기 애니 가져오기
npm run fetch-popular
```

## 🔧 Troubleshooting

### Python 명령어가 작동하지 않는 경우

Windows에서 `python`이 안 되면 `python3` 시도:

```bash
# package.json 수정
"prepare-data": "python3 scripts/1_prepare_data.py"
```

### API Rate Limit 에러

Jikan API는 초당 3회 제한이 있습니다. `2_fetch_popular.py`에서 `time.sleep(0.4)` 값을 늘리세요.

### 메모리 부족 에러

SVD 학습 시 메모리 부족이 발생하면:
- k 값을 12에서 8로 줄이기
- 데이터 샘플링하기

## 📄 License

MIT

## 👨‍💻 Author

이 프로젝트는 학습 목적으로 제작되었습니다.

## 🙏 Acknowledgments

- [MyAnimeList](https://myanimelist.net/) - 데이터 제공
- [Jikan API](https://jikan.moe/) - 애니메이션 이미지 API
- [Kaggle](https://www.kaggle.com/) - 데이터셋 호스팅
