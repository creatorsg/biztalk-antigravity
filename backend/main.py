import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import convert

app = FastAPI(
    title="업무 말투 변환기 API",
    description="Upstage Solar-Pro3 모델을 활용하여 정중한 업무용 어조로 변환해주는 API 서버입니다.",
    version="1.0.0"
)

# CORS 설정 (프론트엔드 브라우저 호출 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 백엔드 API 라우터 등록
app.include_router(convert.router, prefix="/api")

# 헬스 체크 엔드포인트
@app.get("/health")
def health_check():
    return {"status": "ok"}

# 프론트엔드 정적 파일 서빙
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_dir = os.path.join(current_dir, "..", "frontend")

# frontend 디렉토리가 존재하는지 사전 체크하여 에러를 예방합니다.
if os.path.exists(frontend_dir):
    # html=True 옵션을 주면 / 요청 시 자동으로 index.html을 서빙합니다.
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
