from fastapi import APIRouter, HTTPException
from models.schemas import ConvertRequest, ConvertResponse
from services.tone_converter import convert_tone

router = APIRouter()

@router.post("/convert", response_model=ConvertResponse)
def convert_text_tone(request: ConvertRequest):
    """
    원문 텍스트와 대상(audience)을 입력받아 알맞은 업무 말투로 변환한 결과를 응답합니다.
    """
    # 텍스트 필수값 검증
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="text 필드는 필수이며 공백일 수 없습니다.")

    try:
        converted_result = convert_tone(
            text=request.text,
            target_audience=request.target_audience
        )
        return ConvertResponse(
            converted_text=converted_result,
            target_audience=request.target_audience,
            original_text=request.text
        )
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"LLM API 호출 중 오류가 발생했습니다: {str(e)}"
        )
