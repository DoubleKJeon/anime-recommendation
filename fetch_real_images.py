import json
import requests
import time
from tqdm import tqdm

# popular_animes.json 파일 로드
with open('data/popular_animes.json', 'r', encoding='utf-8') as f:
    animes = json.load(f)

print(f"총 {len(animes)}개의 애니메이션 이미지를 가져옵니다...")
print("⏱️  예상 소요 시간: 약 10-15분 (API rate limit 준수)")
print("📝 진행 상황이 자동으로 저장되므로 중단해도 괜찮습니다.\n")

updated_count = 0
failed_count = 0
skipped_count = 0

# 진행 상황 표시
for i, anime in enumerate(tqdm(animes, desc="이미지 가져오는 중")):
    anime_id = anime['anime_id']
    
    # 이미 실제 이미지가 있으면 건너뛰기 (picsum이 아닌 경우)
    if anime.get('image_url') and 'picsum' not in anime['image_url'] and anime['image_url'].startswith('http'):
        skipped_count += 1
        continue
    
    try:
        # Jikan API v4 사용
        response = requests.get(f"https://api.jikan.moe/v4/anime/{anime_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data and 'images' in data['data']:
                # JPG 이미지 URL 가져오기 (large 버전)
                image_url = data['data']['images']['jpg'].get('large_image_url') or \
                           data['data']['images']['jpg'].get('image_url')
                
                if image_url:
                    anime['image_url'] = image_url
                    updated_count += 1
                else:
                    failed_count += 1
        elif response.status_code == 429:
            # Rate limit 초과
            print(f"\n⚠️  Rate limit 도달. 60초 대기 중...")
            time.sleep(60)
            continue
        else:
            failed_count += 1
            
        # API rate limit 준수 (초당 3개, 안전하게 초당 2.5개)
        time.sleep(0.4)
        
        # 100개마다 중간 저장
        if (i + 1) % 100 == 0:
            with open('data/popular_animes.json', 'w', encoding='utf-8') as f:
                json.dump(animes, f, ensure_ascii=False, indent=2)
            print(f"\n💾 중간 저장 완료: {updated_count}개 성공, {failed_count}개 실패, {skipped_count}개 건너뜀")
        
    except requests.exceptions.Timeout:
        failed_count += 1
        time.sleep(1)
    except Exception as e:
        failed_count += 1
        time.sleep(1)

# 최종 저장
with open('data/popular_animes.json', 'w', encoding='utf-8') as f:
    json.dump(animes, f, ensure_ascii=False, indent=2)

print(f"\n✅ 완료!")
print(f"   성공: {updated_count}개")
print(f"   실패: {failed_count}개")
print(f"   건너뜀: {skipped_count}개")

if updated_count > 0:
    # 샘플 확인
    for anime in animes[:5]:
        if anime.get('image_url') and 'myanimelist' in anime['image_url']:
            print(f"\n📺 샘플: {anime['title']}")
            print(f"   이미지: {anime['image_url'][:80]}...")
            break
