from pydantic import BaseModel

class ConvertRequest(BaseModel):
    text: str
    target_audience: str  # boss / colleague / client / team

class ConvertResponse(BaseModel):
    converted_text: str
    target_audience: str
    original_text: str
