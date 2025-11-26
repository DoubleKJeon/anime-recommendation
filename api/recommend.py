from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add project root to path to import lib
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(current_dir, '..')
sys.path.append(project_root)

from lib.recommender import get_recommendations

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body)
            selected_ids = data.get('selectedAnimeIds')
            
            if not selected_ids or len(selected_ids) != 5:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': '5개의 애니메이션을 선택해주세요'}).encode('utf-8'))
                return

            # Vercel 환경에서 데이터 파일 경로 찾기 (Robust Search)
            model_filename = 'svd_model.pkl'
            model_path = None
            
            # 1. 일반적인 경로 시도
            possible_paths = [
                os.path.join(os.getcwd(), 'data', model_filename),
                os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', model_filename),
                os.path.join('/var/task/data', model_filename),
                os.path.join('/var/task', model_filename),
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    model_path = path
                    break
            
            # 2. 찾지 못했다면, 전체 디렉토리 검색 (최후의 수단)
            if model_path is None:
                search_root = os.getcwd()
                for root, dirs, files in os.walk(search_root):
                    if model_filename in files:
                        model_path = os.path.join(root, model_filename)
                        break
            
            # 3. 여전히 없다면 디버깅 정보 출력
            if model_path is None:
                debug_info = []
                debug_info.append(f"CWD: {os.getcwd()}")
                debug_info.append(f"Files in CWD: {os.listdir(os.getcwd())}")
                if os.path.exists(os.path.join(os.getcwd(), 'data')):
                     debug_info.append(f"Files in data: {os.listdir(os.path.join(os.getcwd(), 'data'))}")
                
                raise FileNotFoundError(f"Model file not found. Debug: {'; '.join(debug_info)}")

            recommendations = get_recommendations(selected_ids, model_path=model_path)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'recommendations': recommendations}, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
