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

            # Vercel 환경에서 데이터 파일 경로 찾기
            # 1. 현재 작업 디렉토리 기준 (Vercel 루트)
            model_path = os.path.join(os.getcwd(), 'data', 'svd_model.pkl')
            
            # 2. 만약 없다면, 현재 파일 기준 (로컬 테스트용)
            if not os.path.exists(model_path):
                current_file_dir = os.path.dirname(os.path.abspath(__file__))
                model_path = os.path.join(current_file_dir, '..', 'data', 'svd_model.pkl')

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
