import json

# popular_animes.json 파일 로드
with open('data/popular_animes.json', 'r', encoding='utf-8') as f:
    animes = json.load(f)

# 각 애니메이션에 placeholder 이미지 URL 설정
# Picsum을 사용하여 임시 이미지 제공 (anime_id를 seed로 사용하여 일관성 유지)
for anime in animes:
    anime_id = anime['anime_id']
    # 고유한 플레이스홀더 이미지 (200x300 크기, 2:3 비율)
    anime['image_url'] = f"https://picsum.photos/seed/{anime_id}/200/300"

# 업데이트된 데이터 저장
with open('data/popular_animes.json', 'w', encoding='utf-8') as f:
    json.dump(animes, f, ensure_ascii=False, indent=2)

print(f"✅ {len(animes)}개의 애니메이션에 placeholder 이미지가 설정되었습니다.")
print(f"샘플: {animes[0]['title']} -> {animes[0]['image_url']}")
