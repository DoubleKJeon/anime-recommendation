import requests
import json

# API 테스트
url = "http://localhost:3000/api/recommend"
data = {
    "selectedAnimeIds": [5114, 40028, 9253, 38524, 28977]
}

print("API 테스트 시작...")
print(f"요청 URL: {url}")
print(f"데이터: {data}")

try:
    response = requests.post(url, json=data, timeout=30)
    print(f"\n응답 상태 코드: {response.status_code}")
    print(f"응답 헤더: {dict(response.headers)}")
    
    if response.ok:
        result = response.json()
        print(f"\n✅ 성공!")
        print(f"추천 개수: {len(result.get('recommendations', []))}")
        
        if result.get('recommendations'):
            print(f"\n첫 번째 추천:")
            first = result['recommendations'][0]
            for key, value in first.items():
                print(f"  {key}: {value}")
    else:
        print(f"\n❌ 실패:")
        print(response.text[:500])
except Exception as e:
    print(f"\n❌ 에러 발생: {e}")
