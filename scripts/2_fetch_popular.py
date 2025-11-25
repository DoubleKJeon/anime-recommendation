import requests
import json
import time
import pandas as pd

print("🎬 인기 애니메이션 100개 가져오기...")

# anime.csv에서 인기 애니 100개 추출 (Members 기준)
anime_df = pd.read_csv('./data/anime.csv')
anime_df = anime_df.dropna(subset=['Name', 'Members'])
anime_df = anime_df.sort_values('Members', ascending=False)
top_100 = anime_df.head(100)

popular_animes = []

for idx, row in top_100.iterrows():
    anime_id = int(row['MAL_ID'])
    title = row['Name']
    
    print(f"📡 {len(popular_animes)+1}/100 - Fetching: {title}")
    
    try:
        # Jikan API 호출
        response = requests.get(f"https://api.jikan.moe/v4/anime/{anime_id}")
        
        if response.status_code == 200:
            data = response.json()['data']
            
            popular_animes.append({
                'anime_id': anime_id,
                'title': data.get('title', title),
                'image_url': data.get('images', {}).get('jpg', {}).get('image_url', ''),
                'score': data.get('score', 0),
                'genres': ', '.join([g['name'] for g in data.get('genres', [])]),
                'synopsis': data.get('synopsis', '')[:200] + '...' if data.get('synopsis') else '',
                'episodes': data.get('episodes', 0),
                'year': data.get('year', None)
            })
            
            print(f"   ✅ 성공!")
        else:
            print(f"   ⚠️  실패 (status: {response.status_code})")
            
    except Exception as e:
        print(f"   ❌ 에러: {e}")
    
    # API Rate Limit: 3 requests/second
    time.sleep(0.4)

# JSON 저장
with open('./data/popular_animes.json', 'w', encoding='utf-8') as f:
    json.dump(popular_animes, f, ensure_ascii=False, indent=2)

print(f"\n✅ 총 {len(popular_animes)}개 애니메이션 저장 완료!")
print("📁 저장 위치: ./data/popular_animes.json")
