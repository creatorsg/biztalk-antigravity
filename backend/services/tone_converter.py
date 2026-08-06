import os
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_upstage import ChatUpstage
from prompts.templates import PROMPTS

# .env 파일 로드 (루트 디렉토리에 있는 .env를 찾아 가기 위해 상위 경로 지정)
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, "..", "..", ".env")
load_dotenv(dotenv_path=dotenv_path)

# API 키 설정 재확인
api_key = os.getenv("UPSTAGE_API_KEY")
if not api_key:
    raise ValueError("UPSTAGE_API_KEY 환경변수가 설정되지 않았습니다. .env 파일을 확인해 주세요.")

# ChatUpstage 모델 초기화 (solar-pro3 모델 사용)
chat = ChatUpstage(model="solar-pro3", api_key=api_key)

def convert_tone(text: str, target_audience: str) -> str:
    """
    수신 대상에 맞게 원문의 말투를 변환합니다.
    """
    if target_audience not in PROMPTS:
        raise ValueError(f"지원하지 않는 수신 대상입니다: {target_audience}")

    system_instruction = PROMPTS[target_audience]

    # 프롬프트 템플릿 정의
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_instruction),
        ("human", "다음 원문을 적절하게 변환해주세요: {original_text}")
    ])

    # LangChain Runnable Chain 구성 및 실행
    chain = prompt_template | chat
    response = chain.invoke({"original_text": text})

    return response.content.strip()
