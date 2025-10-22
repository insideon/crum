import type { Article, Category, Tag } from './strapi';

// 더미 데이터 생성을 위한 템플릿
const titleTemplates = [
  '{topic} 완전 분석: 2024년 최신 동향과 실전 가이드',
  '{topic} 마스터 가이드: 초보자부터 전문가까지',
  '{topic} 전문가 분석: 성공을 위한 핵심 전략',
  '{topic} 시장 현황과 미래 전망: 2024년 트렌드 리포트',
  '{topic} 도입 가이드: 성공 사례와 실전 노하우',
  '{topic} 활용법: 단계별 실무 가이드',
  '{topic} 비교 분석: 경쟁사 대비 우위 전략',
  '{topic} 투자 가이드: ROI 극대화 전략',
  '{topic} 혁신 사례: 디지털 전환 성공 스토리',
  '{topic} 전문가 인터뷰: 업계 인사이트와 조언',
  '{topic} 입문자가 꼭 알아야 할 핵심 사항',
  '{topic}로 생산성을 높이는 실전 방법',
  '{topic} 관련 최신 연구 결과와 인사이트',
  '{topic} 산업의 혁신 사례와 성공 전략',
  '{topic} 실전 활용 팁과 전문가 조언',
];

const topics = [
  'AI', '머신러닝', '딥러닝', '블록체인', 'NFT', '메타버스', 'Web3',
  '클라우드', 'DevOps', '마이크로서비스', 'Kubernetes', 'Docker',
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'Node.js',
  '파이썬', '자바', 'Go', 'Rust', 'Swift', 'Kotlin',
  '데이터 분석', '빅데이터', '데이터 시각화', 'SQL', 'NoSQL',
  '사이버보안', '정보보안', '해킹', '취약점',
  '스타트업', '창업', '투자', '펀딩', 'VC',
  '마케팅', 'SEO', 'SNS 마케팅', '콘텐츠 마케팅', '그로스 해킹',
  '재택근무', '원격근무', '업무 효율', '생산성', '시간관리',
  '건강', '운동', '다이어트', '요가', '명상',
  '요리', '레시피', '베이킹', '카페',
  '여행', '배낭여행', '호텔', '항공권',
  '영화', '드라마', 'K-POP', '음악', '공연',
  '게임', 'e-스포츠', '스트리밍',
  '부동산', '재테크', '주식', '암호화폐', '경제',
  '자동차', '전기차', '자율주행',
  '패션', '뷰티', '화장품', '스타일링',
  '육아', '교육', '온라인 강의',
  '반려동물', '반려견', '반려묘',
];

const contentTemplates = [
  `<h1>{title} 완전 분석: 2024년 최신 동향과 실전 가이드</h1>

<p>{topic}에 대한 종합적인 분석을 통해 현재 시장 상황과 미래 전망을 상세히 살펴보겠습니다. 이 글에서는 전문가들의 인사이트와 실제 데이터를 바탕으로 {topic}의 핵심 요소들을 다룹니다.</p>

<h2>{topic}의 현재 시장 현황</h2>

<p>최근 {topic} 시장은 급속한 성장을 보이고 있습니다. 2024년 기준으로 전 세계 시장 규모는 약 1조 달러에 달하며, 연평균 성장률은 15%를 상회하고 있습니다. 특히 아시아 태평양 지역에서의 성장세가 두드러지며, 한국 시장도 빠른 속도로 확장되고 있습니다.</p>

<h3>주요 성장 동력</h3>
<ul>
<li><strong>기술 혁신</strong>: AI와 머신러닝 기술의 발전</li>
<li><strong>시장 수요 증가</strong>: 디지털 전환 가속화</li>
<li><strong>정부 정책 지원</strong>: 관련 산업 육성 정책</li>
<li><strong>투자 유입</strong>: 벤처캐피털과 기업 투자 확대</li>
</ul>

<h2>{topic}의 핵심 특징과 장점</h2>

<p>{topic}는 다음과 같은 독특한 특징을 가지고 있습니다:</p>

<h3>1. 확장성과 유연성</h3>
<p>{topic}는 다양한 규모의 기업과 개인 사용자 모두에게 적합한 솔루션을 제공합니다. 클라우드 기반 아키텍처를 통해 필요에 따라 자원을 확장하거나 축소할 수 있습니다.</p>

<h3>2. 사용자 친화적 인터페이스</h3>
<p>직관적인 UI/UX 디자인으로 초보자도 쉽게 접근할 수 있으며, 전문가를 위한 고급 기능도 제공합니다.</p>

<h3>3. 보안과 안정성</h3>
<p>엔터프라이즈급 보안 기능과 99.9% 이상의 가용성을 보장하여 안정적인 서비스 운영이 가능합니다.</p>

<h2>실전 활용 사례와 성공 전략</h2>

<h3>성공 사례 1: 스타트업 A사의 {topic} 도입</h3>
<p>스타트업 A사는 {topic}를 도입한 후 6개월 만에 매출이 300% 증가했습니다. 주요 성공 요인은 다음과 같습니다:</p>

<ul>
<li><strong>단계적 도입</strong>: 핵심 기능부터 점진적으로 확장</li>
<li><strong>직원 교육</strong>: 체계적인 교육 프로그램 운영</li>
<li><strong>데이터 분석</strong>: 실시간 성과 모니터링과 개선</li>
</ul>

<h3>성공 사례 2: 대기업 B사의 디지털 전환</h3>
<p>대기업 B사는 {topic}를 활용하여 디지털 전환을 성공적으로 진행했습니다. 결과적으로 운영 비용을 40% 절감하고 고객 만족도를 크게 향상시켰습니다.</p>

<h2>{topic} 도입 시 고려사항</h2>

<h3>초기 투자 비용</h3>
<p>{topic} 도입을 위해서는 초기 투자 비용이 필요합니다. 일반적으로 소규모 기업의 경우 월 100만원, 중대규모 기업의 경우 월 500만원 이상의 비용이 예상됩니다.</p>

<h3>교육과 적응 기간</h3>
<p>직원들의 교육과 시스템 적응을 위해 최소 3-6개월의 기간이 필요합니다. 이 기간 동안 생산성이 일시적으로 감소할 수 있으므로 충분한 계획이 필요합니다.</p>

<h3>보안과 규정 준수</h3>
<p>{topic} 도입 시 관련 법규와 보안 요구사항을 충족해야 합니다. 특히 개인정보보호법, 정보통신망법 등의 준수가 중요합니다.</p>

<h2>미래 전망과 트렌드</h2>

<h3>2024-2025년 주요 트렌드</h3>
<ol>
<li><strong>AI 통합</strong>: 인공지능 기능이 더욱 강화될 예정</li>
<li><strong>모바일 최적화</strong>: 모바일 환경에 특화된 기능 확대</li>
<li><strong>개인화</strong>: 사용자별 맞춤형 서비스 제공</li>
<li><strong>자동화</strong>: 업무 프로세스 자동화 기능 강화</li>
</ol>

<h3>시장 전망</h3>
<p>전문가들은 {topic} 시장이 향후 5년간 연평균 20% 이상 성장할 것으로 예상하고 있습니다. 특히 중소기업 시장에서의 성장세가 두드러질 것으로 전망됩니다.</p>

<h2>결론 및 권장사항</h2>

<p>{topic}는 현재 시장에서 매우 중요한 역할을 하고 있으며, 앞으로도 그 중요성은 더욱 커질 것입니다. 성공적인 도입을 위해서는 다음과 같은 점들을 고려해야 합니다:</p>

<ol>
<li><strong>신중한 계획 수립</strong>: 단계적이고 체계적인 도입 계획</li>
<li><strong>충분한 교육</strong>: 직원들의 역량 강화에 투자</li>
<li><strong>지속적인 모니터링</strong>: 성과 측정과 개선</li>
<li><strong>전문가 자문</strong>: 필요시 전문 컨설팅 활용</li>
</ol>

<p>{topic}에 대한 투자는 단순한 기술 도입이 아닌, 비즈니스 전략의 핵심 요소로 접근해야 합니다. 올바른 접근을 통해 {topic}의 모든 잠재력을 발휘할 수 있을 것입니다.</p>`,

  `<h1>{title} 마스터 가이드: 초보자부터 전문가까지</h1>

<p>{topic}에 대해 완전히 이해하고 싶다면 이 가이드가 도움이 될 것입니다. {topic}의 기본 개념부터 고급 활용법까지 단계별로 설명하겠습니다.</p>

<h2>{topic}란 무엇인가?</h2>

<p>{topic}는 현대 디지털 환경에서 필수적인 도구입니다. 간단히 말해, {topic}는 복잡한 문제를 해결하고 효율성을 높이는 혁신적인 솔루션입니다.</p>

<h3>핵심 정의</h3>
<ul>
<li><strong>기술적 관점</strong>: 최신 기술을 활용한 통합 솔루션</li>
<li><strong>비즈니스 관점</strong>: 수익성과 효율성을 높이는 전략적 도구</li>
<li><strong>사용자 관점</strong>: 일상생활을 편리하게 만드는 서비스</li>
</ul>

<h2>{topic}의 작동 원리</h2>

<p>{topic}는 다음과 같은 과정을 통해 작동합니다:</p>

<h3>1단계: 데이터 수집</h3>
<p>다양한 소스에서 관련 데이터를 수집하고 정제합니다.</p>

<h3>2단계: 분석 및 처리</h3>
<p>수집된 데이터를 분석하여 의미 있는 인사이트를 도출합니다.</p>

<h3>3단계: 결과 제공</h3>
<p>사용자에게 직관적이고 이해하기 쉬운 형태로 결과를 제공합니다.</p>

<h2>단계별 활용 방법</h2>

<h3>초급자용 기본 활용법</h3>

<h4>1. 계정 생성 및 설정</h4>
<ul>
<li>공식 웹사이트에서 계정 생성</li>
<li>기본 프로필 정보 입력</li>
<li>보안 설정 완료</li>
</ul>

<h4>2. 기본 기능 익히기</h4>
<ul>
<li>메인 대시보드 탐색</li>
<li>기본 설정 변경</li>
<li>간단한 작업 수행</li>
</ul>

<h4>3. 첫 번째 프로젝트 시작</h4>
<ul>
<li>템플릿 활용</li>
<li>단계별 가이드 따라하기</li>
<li>결과 확인 및 피드백</li>
</ul>

<h3>중급자용 고급 활용법</h3>

<h4>1. 커스터마이징</h4>
<ul>
<li>개인화된 설정 구성</li>
<li>워크플로우 최적화</li>
<li>자동화 규칙 설정</li>
</ul>

<h4>2. 데이터 분석</h4>
<ul>
<li>고급 분석 도구 활용</li>
<li>리포트 생성</li>
<li>트렌드 분석</li>
</ul>

<h4>3. 협업 기능</h4>
<ul>
<li>팀 멤버 초대</li>
<li>권한 관리</li>
<li>공유 및 협업</li>
</ul>

<h3>전문가용 마스터 활용법</h3>

<h4>1. API 연동</h4>
<ul>
<li>외부 시스템과의 연동</li>
<li>커스텀 개발</li>
<li>고급 자동화</li>
</ul>

<h4>2. 성능 최적화</h4>
<ul>
<li>시스템 튜닝</li>
<li>리소스 관리</li>
<li>확장성 고려</li>
</ul>

<h4>3. 전략적 활용</h4>
<ul>
<li>비즈니스 전략 수립</li>
<li>ROI 분석</li>
<li>경쟁 우위 확보</li>
</ul>

<h2>실무에서의 활용 팁</h2>

<h3>효율성 극대화 팁</h3>
<ol>
<li><strong>키보드 단축키 활용</strong>: 작업 속도 향상</li>
<li><strong>템플릿 활용</strong>: 반복 작업 자동화</li>
<li><strong>알림 설정</strong>: 중요한 업데이트 놓치지 않기</li>
<li><strong>백업 정책</strong>: 데이터 손실 방지</li>
</ol>

<h3>문제 해결 가이드</h3>
<ul>
<li><strong>로그인 문제</strong>: 캐시 삭제 및 재로그인</li>
<li><strong>성능 저하</strong>: 브라우저 업데이트 및 확장 프로그램 확인</li>
<li><strong>데이터 동기화</strong>: 네트워크 연결 상태 점검</li>
<li><strong>권한 오류</strong>: 관리자에게 문의</li>
</ul>

<h2>자주 묻는 질문 (FAQ)</h2>

<h3>Q: {topic}는 무료로 사용할 수 있나요?</h3>
<p>A: 기본 기능은 무료로 제공되며, 고급 기능은 유료 플랜에서 이용 가능합니다.</p>

<h3>Q: 모바일에서도 사용할 수 있나요?</h3>
<p>A: 네, iOS와 Android 앱을 통해 모바일에서도 모든 기능을 이용할 수 있습니다.</p>

<h3>Q: 데이터 보안은 어떻게 보장되나요?</h3>
<p>A: 엔터프라이즈급 암호화와 보안 프로토콜을 사용하여 데이터를 안전하게 보호합니다.</p>

<h3>Q: 고객 지원은 어떻게 받을 수 있나요?</h3>
<p>A: 이메일, 채팅, 전화를 통해 24시간 고객 지원을 제공합니다.</p>

<h2>결론</h2>

<p>{topic}는 현대 사회에서 필수적인 도구입니다. 이 가이드를 통해 {topic}의 모든 기능을 마스터하고, 업무와 일상생활에서 최대한의 효과를 얻을 수 있을 것입니다. 지속적인 학습과 실습을 통해 {topic} 전문가가 되어보세요.</p>`,

  `<h1>{title} 전문가 분석: 성공을 위한 핵심 전략</h1>

<p>{topic} 분야의 전문가들이 공유하는 실전 노하우와 성공 전략을 상세히 분석합니다. 이 글에서는 실제 사례를 바탕으로 {topic}에서 성공하기 위한 구체적인 방법론을 제시합니다.</p>

<h2>{topic} 성공의 핵심 요소</h2>

<h3>1. 전략적 사고</h3>
<p>{topic}에서 성공하려면 단순한 기술적 접근을 넘어서 전략적 사고가 필요합니다. 다음과 같은 요소들을 고려해야 합니다:</p>

<ul>
<li><strong>시장 분석</strong>: 현재 시장 상황과 경쟁 환경 파악</li>
<li><strong>고객 이해</strong>: 타겟 고객의 니즈와 행동 패턴 분석</li>
<li><strong>차별화 전략</strong>: 경쟁사 대비 우위 요소 확보</li>
<li><strong>장기적 비전</strong>: 지속 가능한 성장 전략 수립</li>
</ul>

<h3>2. 데이터 기반 의사결정</h3>
<p>감정이나 직관에 의존하지 말고, 객관적인 데이터를 바탕으로 의사결정을 내려야 합니다.</p>

<h4>핵심 지표 (KPI)</h4>
<ul>
<li><strong>성과 지표</strong>: 매출, 이익률, 고객 수</li>
<li><strong>효율성 지표</strong>: 생산성, 비용 효율성</li>
<li><strong>고객 지표</strong>: 만족도, 재구매율, 추천도</li>
<li><strong>성장 지표</strong>: 시장 점유율, 신규 고객 확보율</li>
</ul>

<h2>성공 사례 분석</h2>

<h3>사례 1: 스타트업의 급성장</h3>
<p>A 스타트업은 {topic}를 활용하여 2년 만에 시리즈 A 투자를 유치했습니다.</p>

<h4>성공 요인 분석</h4>
<ol>
<li><strong>명확한 문제 정의</strong>: 고객의 실제 문제를 정확히 파악</li>
<li><strong>MVP 접근</strong>: 최소 기능 제품으로 빠른 시장 검증</li>
<li><strong>고객 피드백</strong>: 지속적인 고객 피드백 수집 및 반영</li>
<li><strong>팀 구성</strong>: 다양한 전문성을 가진 팀원들로 구성</li>
</ol>

<h4>핵심 전략</h4>
<ul>
<li><strong>린 스타트업 방법론</strong> 적용</li>
<li><strong>애자일 개발</strong> 프로세스 도입</li>
<li><strong>데이터 드리븐</strong> 의사결정 문화 구축</li>
</ul>

<h3>사례 2: 대기업의 디지털 전환</h3>
<p>B 대기업은 {topic}를 통해 디지털 전환을 성공적으로 완료했습니다.</p>

<h4>도전 과제</h4>
<ul>
<li>기존 시스템과의 호환성 문제</li>
<li>직원들의 변화 저항</li>
<li>투자 대비 효과 측정의 어려움</li>
</ul>

<h4>해결 방안</h4>
<ul>
<li><strong>단계적 도입</strong>: 점진적인 시스템 교체</li>
<li><strong>변화 관리</strong>: 체계적인 교육과 커뮤니케이션</li>
<li><strong>성과 측정</strong>: 명확한 ROI 지표 설정</li>
</ul>

<h2>실패 사례에서 배우는 교훈</h2>

<h3>실패 사례 1: 기술 중심 접근</h3>
<p>C 회사는 최신 기술에만 집중하다가 고객 니즈를 간과했습니다.</p>

<h4>실패 원인</h4>
<ul>
<li>고객 조사 부족</li>
<li>기술적 완성도에만 집중</li>
<li>시장 검증 과정 생략</li>
</ul>

<h4>교훈</h4>
<ul>
<li>고객 중심 사고의 중요성</li>
<li>기술과 시장의 균형</li>
<li>빠른 시장 검증의 필요성</li>
</ul>

<h3>실패 사례 2: 과도한 확장</h3>
<p>D 회사는 초기 성공에 만족하여 무리한 확장을 시도했습니다.</p>

<h4>실패 원인</h4>
<ul>
<li>충분한 자본 확보 없이 확장</li>
<li>핵심 역량 확립 전 다각화</li>
<li>시장 상황 변화 미고려</li>
</ul>

<h4>교훈</h4>
<ul>
<li>단계적 성장의 중요성</li>
<li>핵심 역량 강화 우선</li>
<li>시장 환경 변화 모니터링</li>
</ul>

<h2>성공을 위한 실행 계획</h2>

<h3>1단계: 현황 분석 (1-2개월)</h3>
<ul>
<li>현재 상황 정확한 파악</li>
<li>강점과 약점 분석</li>
<li>기회와 위협 요소 식별</li>
</ul>

<h3>2단계: 전략 수립 (2-3개월)</h3>
<ul>
<li>명확한 목표 설정</li>
<li>실행 계획 수립</li>
<li>리소스 배분 계획</li>
</ul>

<h3>3단계: 실행 및 모니터링 (6-12개월)</h3>
<ul>
<li>계획에 따른 실행</li>
<li>정기적인 성과 측정</li>
<li>필요시 전략 수정</li>
</ul>

<h3>4단계: 평가 및 개선 (지속적)</h3>
<ul>
<li>성과 평가</li>
<li>교훈 도출</li>
<li>다음 단계 계획 수립</li>
</ul>

<h2>전문가 조언</h2>

<h3>기술 전문가의 조언</h3>
<blockquote>
<p>"기술은 도구일 뿐입니다. 진정한 성공은 기술을 통해 고객에게 가치를 제공하는 것입니다."</p>
</blockquote>

<h3>마케팅 전문가의 조언</h3>
<blockquote>
<p>"브랜드 스토리텔링이 중요합니다. 단순한 기능 소개를 넘어서 감정적 연결을 만들어야 합니다."</p>
</blockquote>

<h3>경영 전문가의 조언</h3>
<blockquote>
<p>"지속 가능한 성장을 위해서는 조직 문화와 시스템 구축에 투자해야 합니다."</p>
</blockquote>

<h2>결론</h2>

<p>{topic}에서 성공하기 위해서는 기술적 역량뿐만 아니라 전략적 사고, 고객 이해, 데이터 활용 능력이 종합적으로 필요합니다. 이 가이드에서 제시한 사례와 전략을 참고하여 자신만의 성공 모델을 만들어보세요. 지속적인 학습과 개선을 통해 {topic} 분야의 전문가가 되어보시기 바랍니다.</p>`,
];

const excerptTemplates = [
  '{topic}에 대한 종합적인 분석과 2024년 최신 동향을 전문가의 시각으로 상세히 분석합니다. 시장 현황부터 실전 활용법까지 모든 것을 다룹니다.',
  '{topic} 마스터 가이드: 초보자부터 전문가까지 단계별로 설명하는 완벽한 가이드입니다. 기본 개념부터 고급 활용법까지 모든 것을 배울 수 있습니다.',
  '{topic} 전문가 분석: 성공을 위한 핵심 전략과 실전 노하우를 공유합니다. 실제 사례를 바탕으로 한 구체적인 방법론을 제시합니다.',
  '{topic}의 핵심 원리와 작동 방식을 이해하고, 실무에서 바로 활용할 수 있는 실용적인 팁과 전략을 제공합니다.',
  '{topic} 시장의 현재 상황과 미래 전망을 데이터 기반으로 분석하고, 성공적인 도입을 위한 체계적인 가이드를 제공합니다.',
];

const unsplashImageIds = [
  'photo-1677442136019-21780ecad995', 'photo-1633356122544-f134324a6cee',
  'photo-1519389950473-47ba0277781c', 'photo-1440404653325-ab127d49abc1',
  'photo-1639762681485-074b7f938ba0', 'photo-1556761175-b413da4baf72',
  'photo-1460925895917-afdab827c52f', 'photo-1490645935967-10de6ba17061',
  'photo-1526170375885-4d8ecf77b99f', 'photo-1505740420928-5e560c06d30e',
  'photo-1523275335684-37898b6baf30', 'photo-1572635196237-14b3f281503f',
  'photo-1487058792275-0ad4aaf24ca7', 'photo-1498050108023-c5249f4df085',
  'photo-1550439062-609e1531270e', 'photo-1451187580459-43490279c0fa',
  'photo-1484788984921-03950022c9ef', 'photo-1504384308090-c894fdcc538d',
  'photo-1496181133206-80ce9b88a853', 'photo-1517694712202-14dd9538aa97',
];

// 더미 카테고리 데이터
export const dummyCategories: Category[] = [
  {
    id: 1,
    name: '뉴스/시사',
    slug: 'news',
    description: '최신 뉴스와 시사 이슈',
    icon: '📰',
    order: 1
  },
  {
    id: 2,
    name: '기술/IT',
    slug: 'tech',
    description: '기술 트렌드와 IT 정보',
    icon: '💻',
    order: 2
  },
  {
    id: 3,
    name: '경제/재테크',
    slug: 'finance',
    description: '경제 동향과 재테크 정보',
    icon: '💰',
    order: 3
  },
  {
    id: 4,
    name: '생활/건강',
    slug: 'lifestyle',
    description: '일상 생활과 건강 정보',
    icon: '🏠',
    order: 4
  },
  {
    id: 5,
    name: '엔터테인먼트',
    slug: 'entertainment',
    description: '문화, 영화, 음악, 게임',
    icon: '🎬',
    order: 5
  },
  {
    id: 6,
    name: '스포츠',
    slug: 'sports',
    description: '스포츠 뉴스와 경기 결과',
    icon: '⚽',
    order: 6
  },
  {
    id: 7,
    name: '여행/문화',
    slug: 'travel',
    description: '여행 정보와 문화 콘텐츠',
    icon: '✈️',
    order: 7
  },
  {
    id: 8,
    name: '요리/맛집',
    slug: 'food',
    description: '요리 레시피와 맛집 정보',
    icon: '🍳',
    order: 8
  },
  {
    id: 9,
    name: '패션/뷰티',
    slug: 'fashion',
    description: '패션 트렌드와 뷰티 정보',
    icon: '👗',
    order: 9
  },
  {
    id: 10,
    name: '교육/학습',
    slug: 'education',
    description: '교육 정보와 학습 팁',
    icon: '📚',
    order: 10
  },
  {
    id: 11,
    name: '자동차',
    slug: 'automotive',
    description: '자동차 뉴스와 리뷰',
    icon: '🚗',
    order: 11
  },
  {
    id: 12,
    name: '부동산',
    slug: 'real-estate',
    description: '부동산 시장 동향과 정보',
    icon: '🏘️',
    order: 12
  },
  {
    id: 13,
    name: '반려동물',
    slug: 'pets',
    description: '반려동물 케어와 정보',
    icon: '🐕',
    order: 13
  },
  {
    id: 14,
    name: '육아/가족',
    slug: 'family',
    description: '육아 정보와 가족 생활',
    icon: '👶',
    order: 14
  },
  {
    id: 15,
    name: '환경/에너지',
    slug: 'environment',
    description: '환경 보호와 에너지 정보',
    icon: '🌱',
    order: 15
  },
  {
    id: 16,
    name: '과학/연구',
    slug: 'science',
    description: '과학 연구와 발견',
    icon: '🔬',
    order: 16
  },
  {
    id: 17,
    name: '정치/사회',
    slug: 'politics',
    description: '정치 동향과 사회 이슈',
    icon: '🏛️',
    order: 17
  },
  {
    id: 18,
    name: '국제',
    slug: 'international',
    description: '국제 뉴스와 해외 동향',
    icon: '🌍',
    order: 18
  },
  {
    id: 19,
    name: '취업/직장',
    slug: 'career',
    description: '취업 정보와 직장 생활',
    icon: '💼',
    order: 19
  },
  {
    id: 20,
    name: '기타',
    slug: 'etc',
    description: '기타 다양한 주제',
    icon: '📋',
    order: 20
  }
];

// 더미 태그 데이터
export const dummyTags: Tag[] = [
  { id: 1, name: 'AI', slug: 'ai', count: 15 },
  { id: 2, name: '개발', slug: 'development', count: 12 },
  { id: 3, name: '블록체인', slug: 'blockchain', count: 8 },
  { id: 4, name: '스타트업', slug: 'startup', count: 10 },
  { id: 5, name: '디자인', slug: 'design', count: 7 },
  { id: 6, name: '마케팅', slug: 'marketing', count: 9 },
  { id: 7, name: '건강', slug: 'health', count: 11 },
  { id: 8, name: '여행', slug: 'travel', count: 6 },
  { id: 9, name: '요리', slug: 'cooking', count: 5 },
  { id: 10, name: '경제', slug: 'economy', count: 13 }
];

// 시더블 랜덤 생성기
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }
}

// slug 생성 함수
function generateSlug(title: string, id: number): string {
  // 한글을 영문으로 변환하는 간단한 매핑
  const koreanToEnglish: { [key: string]: string } = {
    '업계': 'industry',
    '최신': 'latest',
    '동향': 'trends',
    '초보자': 'beginner',
    '완벽': 'complete',
    '가이드': 'guide',
    '실전': 'practical',
    '활용': 'application',
    '팁': 'tips',
    '입문자': 'starter',
    '알아야': 'know',
    '사항': 'things',
    '놀라운': 'amazing',
    '사례': 'cases',
    '전문가': 'expert',
    '추천': 'recommend',
    '베스트': 'best',
    '프랙티스': 'practices',
    '시장': 'market',
    '분석': 'analysis',
    '리포트': 'report',
    '생산성': 'productivity',
    '높이는': 'boost',
    '방법': 'method',
    '연구': 'research',
    '결과': 'results',
    '산업': 'industry',
    '혁신': 'innovation',
    '트렌드': 'trends',
    '미래': 'future',
    '전망': 'outlook',
    '성공': 'success',
    '전략': 'strategy',
    '수익': 'profit',
    '창출': 'generation',
    'vs': 'vs',
    '선택': 'choice',
    '해야': 'should',
    '할까': 'choose',
    '관련': 'related',
    'AI': 'ai',
    '머신러닝': 'machine-learning',
    '딥러닝': 'deep-learning',
    '블록체인': 'blockchain',
    'NFT': 'nft',
    '메타버스': 'metaverse',
    'Web3': 'web3',
    '클라우드': 'cloud',
    'DevOps': 'devops',
    '마이크로서비스': 'microservices',
    'Kubernetes': 'kubernetes',
    'Docker': 'docker',
    'React': 'react',
    'Next.js': 'nextjs',
    'Vue.js': 'vuejs',
    'Angular': 'angular',
    'TypeScript': 'typescript',
    'Node.js': 'nodejs',
    '파이썬': 'python',
    '자바': 'java',
    'Go': 'go',
    'Rust': 'rust',
    'Swift': 'swift',
    'Kotlin': 'kotlin',
    '데이터': 'data',
    '빅데이터': 'big-data',
    '시각화': 'visualization',
    'SQL': 'sql',
    'NoSQL': 'nosql',
    '사이버보안': 'cybersecurity',
    '정보보안': 'information-security',
    '해킹': 'hacking',
    '취약점': 'vulnerability',
    '스타트업': 'startup',
    '창업': 'entrepreneurship',
    '투자': 'investment',
    '펀딩': 'funding',
    'VC': 'vc',
    '마케팅': 'marketing',
    'SEO': 'seo',
    'SNS': 'sns',
    '콘텐츠': 'content',
    '그로스': 'growth',
    '재택근무': 'remote-work',
    '원격근무': 'telework',
    '효율': 'efficiency',
    '시간관리': 'time-management',
    '건강': 'health',
    '운동': 'exercise',
    '다이어트': 'diet',
    '요가': 'yoga',
    '명상': 'meditation',
    '요리': 'cooking',
    '레시피': 'recipe',
    '베이킹': 'baking',
    '카페': 'cafe',
    '여행': 'travel',
    '배낭여행': 'backpacking',
    '호텔': 'hotel',
    '항공권': 'flight',
    '영화': 'movie',
    '드라마': 'drama',
    'K-POP': 'kpop',
    '음악': 'music',
    '공연': 'performance',
    '게임': 'game',
    'e-스포츠': 'esports',
    '스트리밍': 'streaming',
    '부동산': 'real-estate',
    '재테크': 'investment',
    '주식': 'stock',
    '암호화폐': 'cryptocurrency',
    '경제': 'economy',
    '자동차': 'automobile',
    '전기차': 'electric-car',
    '자율주행': 'autonomous-driving',
    '패션': 'fashion',
    '뷰티': 'beauty',
    '화장품': 'cosmetics',
    '스타일링': 'styling',
    '육아': 'parenting',
    '교육': 'education',
    '온라인': 'online',
    '강의': 'lecture',
    '반려동물': 'pet',
    '반려견': 'dog',
    '반려묘': 'cat'
  };

  // 한글을 영문으로 변환
  let englishTitle = title;
  for (const [korean, english] of Object.entries(koreanToEnglish)) {
    englishTitle = englishTitle.replace(new RegExp(korean, 'g'), english);
  }

  return englishTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50) + `-${id}`;
}

// 1000개의 더미 아티클 생성
function generateDummyArticles(count: number = 1000): Article[] {
  const articles: Article[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= count; i++) {
    const random = new SeededRandom(i);

    // 랜덤 토픽 선택
    const topic = random.choice(topics);
    const topic2 = random.choice(topics.filter(t => t !== topic));

    // 타이틀 생성
    const titleTemplate = random.choice(titleTemplates);
    const title = titleTemplate
      .replace('{year}', currentYear.toString())
      .replace('{topic}', topic)
      .replace('{topic2}', topic2);

    // slug 생성
    const slug = generateSlug(title, i);

    // 컨텐츠 생성
    const contentTemplate = random.choice(contentTemplates);
    const content = contentTemplate
      .replace(/{title}/g, title)
      .replace(/{topic}/g, topic);

    // excerpt 생성
    const excerptTemplate = random.choice(excerptTemplates);
    const excerpt = excerptTemplate.replace(/{topic}/g, topic);

    // 랜덤 카테고리 및 태그
    const category = random.choice(dummyCategories);
    const tagCount = random.nextInt(1, 3);
    const articleTags: Tag[] = [];
    for (let j = 0; j < tagCount; j++) {
      const tag = random.choice(dummyTags);
      if (!articleTags.find(t => t.id === tag.id)) {
        articleTags.push(tag);
      }
    }

    // 랜덤 이미지
    const imageId = random.choice(unsplashImageIds);

    // 랜덤 통계
    const trendScore = random.nextInt(50, 100);
    const viewCount = random.nextInt(100, 5000);

    // 랜덤 게시 시간 (최근 30일 내)
    const hoursAgo = random.nextInt(1, 30 * 24);
    const publishedAt = new Date(Date.now() - 1000 * 60 * 60 * hoursAgo);

    articles.push({
      id: i,
      documentId: `article-${i}`,
      title,
      slug,
      content,
      excerpt,
      seoTitle: `${title} - 완벽 가이드`,
      metaDescription: excerpt,
      keywords: [topic, topic2, category.name],
      sourceKeyword: topic,
      trendScore,
      viewCount,
      status: 'published',
      publishedAt: publishedAt.toISOString(),
      createdAt: new Date(publishedAt.getTime() - 1000 * 60 * 60).toISOString(),
      updatedAt: publishedAt.toISOString(),
      category,
      tags: articleTags,
      featuredImage: {
        url: `https://images.unsplash.com/${imageId}?w=800&h=600&fit=crop`,
        alternativeText: title
      }
    });
  }

  return articles;
}

// 더미 아티클 배열 생성
export const dummyArticles = generateDummyArticles(1000);
