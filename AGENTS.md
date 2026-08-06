# AGENTS.md — Antigravity 개발 지침서

이 문서는 **업무 말투 변환기 (BizTalk Antigravity)** 프로젝트를 개발할 때 Antigravity AI가 준수해야 하는 규칙과 프로젝트 개요를 정의합니다.

---

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트 명**: 업무 말투 변환기 (BizTalk Antigravity)
- **목적**: 사용자가 전달하고 싶은 본문을 입력하고 수신 대상을 선택하면, 대상에 맞는 정중하고 자연스러운 비즈니스 말투로 자동 변환해주는 웹 서비스 (One Day 프로젝트)
- **개발 가이드 문서**:
  - [개요서_업무말투변환기.md](file:///C:/rookies6/vibe_antigravity/biztalk_antigravity/개요서_업무말투변환기.md)
  - [PRD_업무말투변환기.md](file:///C:/rookies6/vibe_antigravity/biztalk_antigravity/PRD_업무말투변환기.md)

---

## 2. Antigravity가 준수해야 할 핵심 개발 규칙 (Rules for Antigravity)

Antigravity는 이 프로젝트를 구현 및 디버깅할 때 반드시 다음 사항을 준수해야 합니다.

### 2-1. 바이브 코딩 3원칙 준수
1. **완료 기준 우선 정의**: 코드를 작성하기 전에 무엇을 구현하면 작업이 끝나는지 목록을 확인하고, 그 범위 내에서만 작업을 진행합니다. 불필요한 기능(로그인, 이력 DB 저장 등)을 임의로 덧붙이지 않습니다.
2. **조사 우선, 구현 나중**: 새로운 모듈 설치나 API 연동(예: `Solar-Pro3` 연동 방식) 시, 사전에 라이브러리 사용법을 충분히 확인한 다음 구현에 들어갑니다.
3. **버그 발생 시 원인 분석 우선**: 에러가 나면 무작정 코드를 덮어쓰지 말고, 에러의 발생 원인부터 설명한 뒤 사용자와 조율하여 근본적인 수정 코드를 제안합니다.

### 2-2. 기술 스택 및 개발 제한 조건
- **백엔드**: Python 3.11+ 환경에서 `FastAPI`와 `LangChain`을 사용하여 설계합니다.
  - 패키지 의존성은 [backend/requirements.txt](file:///C:/rookies6/vibe_antigravity/biztalk_antigravity/backend/requirements.txt)에 명시하고 관리합니다.
  - 로컬 테스트 및 실행 시 루트에 생성된 파이썬 가상환경 `.venv`를 활성화한 상태로 수행합니다.
- **AI 모델**: Upstage `solar-pro3` 모델을 `langchain-upstage` 패키지를 통해 연동합니다.
- **프론트엔드**: 외부 프레임워크(React, Vue, Tailwind 등) 없이 순수 **Vanilla HTML, CSS, JavaScript**만을 사용하여 구현합니다.
- **보안 및 자격증명**:
  - API 키 등의 민감 정보는 루트의 [.env](file:///C:/rookies6/vibe_antigravity/biztalk_antigravity/.env) 파일로 관리합니다.
  - **절대 `.env` 파일의 비밀키 정보를 출력하거나 수정하지 않으며**, 해당 파일이 Git에 추가되지 않도록 [.gitignore](file:///C:/rookies6/vibe_antigravity/biztalk_antigravity/.gitignore) 상태를 유지합니다.

