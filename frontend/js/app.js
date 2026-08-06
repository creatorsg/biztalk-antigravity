document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 캐싱
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const audienceGrid = document.getElementById('audienceGrid');
    const convertBtn = document.getElementById('convertBtn');
    const convertBtnText = document.getElementById('convertBtnText');
    const loaderIcon = document.getElementById('loaderIcon');
    const defaultIcon = document.getElementById('defaultIcon');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const copyBtnText = document.getElementById('copyBtnText');
    const copyIcon = document.getElementById('copyIcon');

    // 현재 선택된 수신 대상 코드 (기본값: boss)
    let selectedAudience = 'boss';

    // API Base URL 판별
    // - 브라우저에서 직접 로컬 html 파일을 열었을 때(file://)는 http://localhost:8000을 바라봅니다.
    // - 백엔드가 static 파일 서빙을 담당할 때는 window.location.origin을 바라봅니다.
    const API_BASE = window.location.origin.startsWith('file://') || window.location.origin.includes('127.0.0.1:5500') 
        ? 'http://localhost:8000' 
        : window.location.origin;

    // 1. 실시간 글자 수 세기 및 제한
    inputText.addEventListener('input', () => {
        const length = inputText.value.length;
        charCount.textContent = length;
        
        if (length >= 1000) {
            charCount.style.color = '#EC4899'; // 최대 한도 도달 시 핑크색으로 경고
        } else {
            charCount.style.color = '#9CA3AF';
        }
    });

    // 2. 수신 대상 버튼 토글
    audienceGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.audience-btn');
        if (!btn) return;

        // 기존 active 클래스 제거
        document.querySelectorAll('.audience-btn').forEach(b => b.classList.remove('active'));
        
        // 클릭한 버튼 active 클래스 추가
        btn.classList.add('active');
        selectedAudience = btn.dataset.target;
    });

    // 3. 로딩 상태 관리 함수
    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            loaderIcon.style.display = 'inline-block';
            defaultIcon.style.display = 'none';
            convertBtnText.textContent = '말투 변환하는 중...';
            outputText.classList.remove('success-glow');
        } else {
            convertBtn.disabled = false;
            loaderIcon.style.display = 'none';
            defaultIcon.style.display = 'inline-block';
            convertBtnText.textContent = '말투 변환하기';
        }
    }

    // 4. 말투 변환 실행 API 호출
    convertBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        
        if (!text) {
            alert('변환할 원문을 입력해 주세요.');
            inputText.focus();
            return;
        }

        setLoading(true);
        outputText.value = '';

        try {
            const response = await fetch(`${API_BASE}/api/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    target_audience: selectedAudience
                })
            });

            const data = await response.json();

            if (response.ok) {
                outputText.value = data.converted_text;
                // 성공적인 변환 후 결과창에 시각적 피드백 효과(초록색 글로우) 제공
                outputText.classList.add('success-glow');
            } else {
                const errorMsg = data.detail || '변환 작업이 실패하였습니다.';
                alert(`오류: ${errorMsg}`);
            }
        } catch (error) {
            console.error('API Error:', error);
            alert('서버와 통신하는 동안 오류가 발생했습니다. 백엔드 서버가 켜져 있는지 확인해 주세요.');
        } finally {
            setLoading(false);
        }
    });

    // 5. 클립보드 복사 기능
    copyBtn.addEventListener('click', async () => {
        const text = outputText.value.trim();
        
        if (!text || text === outputText.placeholder) {
            alert('복사할 변환 결과가 없습니다.');
            return;
        }

        try {
            // Clipboard API 사용
            await navigator.clipboard.writeText(text);
            
            // 복사 성공 마이크로 인터랙션 피드백
            copyBtn.classList.add('copied');
            copyBtnText.textContent = '복사 완료!';
            copyIcon.textContent = 'done';

            // 2초 뒤 상태 복구
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtnText.textContent = '복사하기';
                copyIcon.textContent = 'content_copy';
            }, 2000);

        } catch (err) {
            console.error('Copy Failed:', err);
            // Clipboard API fallback (Internet Explorer 등이나 구형 브라우저 대응)
            try {
                outputText.select();
                document.execCommand('copy');
                
                copyBtn.classList.add('copied');
                copyBtnText.textContent = '복사 완료!';
                copyIcon.textContent = 'done';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtnText.textContent = '복사하기';
                    copyIcon.textContent = 'content_copy';
                }, 2000);
            } catch (fallbackErr) {
                alert('복사에 실패했습니다. 결과를 직접 선택하여 복사해 주세요.');
            }
        }
    });
});
