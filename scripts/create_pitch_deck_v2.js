const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'HeartChain Team';
pres.title = 'HeartChain Evolution Pitch Deck v2.0';

// Color palette - Teal Trust (with evolution accent)
const colors = {
  primary: "028090",    // teal
  secondary: "00A896",  // seafoam
  accent: "02C39A",     // mint
  evolved: "FF6B35",    // orange (for new features)
  dark: "1E293B",       // dark slate
  light: "F8FAFC",      // off-white
  gray: "64748B",       // muted gray
  white: "FFFFFF"
};

// Helper: add accent bar
function addAccentBar(slide, y, color = colors.accent) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: y, w: 0.08, h: 0.6,
    fill: { color: color },
    line: { color: color }
  });
}

// Helper: section header
function addSectionHeader(slide, text, y = 0.5, color = colors.dark) {
  addAccentBar(slide, y + 0.05, colors.evolved);
  slide.addText(text, {
    x: 0.2, y: y, w: 9.5, h: 0.6,
    fontSize: 32, bold: true, color: color,
    fontFace: "Arial", margin: 0
  });
}

// ========== SLIDE 1: Title Slide ==========
let slide1 = pres.addSlide();
slide1.background = { color: colors.primary };

slide1.addText("HeartChain", {
  x: 0.5, y: 1.5, w: 9, h: 1,
  fontSize: 60, bold: true, color: colors.white,
  fontFace: "Arial", align: "center"
});

slide1.addText("자원봉사자의 삶을 바꾸는 블록체인 플랫폼", {
  x: 0.5, y: 2.6, w: 9, h: 0.5,
  fontSize: 24, color: colors.accent,
  fontFace: "Arial", align: "center", italic: true
});

slide1.addText("Evolution Pitch Deck v2.0", {
  x: 0.5, y: 3.3, w: 9, h: 0.4,
  fontSize: 18, color: colors.light,
  fontFace: "Arial", align: "center"
});

// New features badges
const badges = ["블록체인 코인", "위치기반 광고", "광고 위치 설정"];
badges.forEach((badge, i) => {
  slide1.addShape(pres.shapes.RECTANGLE, {
    x: 1.5 + i * 2.7, y: 4.2, w: 2.4, h: 0.4,
    fill: { color: colors.evolved },
    line: { color: colors.evolved }
  });
  slide1.addText(badge, {
    x: 1.5 + i * 2.7, y: 4.25, w: 2.4, h: 0.3,
    fontSize: 12, bold: true, color: colors.white, align: "center", valign: "middle"
  });
});

// ========== SLIDE 2: 문제 제기 + 진화 방향 ==========
let slide2 = pres.addSlide();
slide2.background = { color: colors.light };

addSectionHeader(slide2, "문제 제기 + 진화 방향");

// Problems (left side)
slide2.addText("현재 문제", {
  x: 0.5, y: 1.2, w: 4, h: 0.4,
  fontSize: 18, bold: true, color: colors.dark
});

const problems = [
  { icon: "💰", title: "낮은 소득", desc: "자원봉사자\n무보수 활동" },
  { icon: "🎓", title: "대학생 고충", desc: "졸업 요건 충족\n보상 없음" },
  { icon: "📍", title: "위치 불일치", desc: "지역 광고 어려움\n타겟팅 불가" }
];

problems.forEach((item, i) => {
  const y = 1.7 + i * 1.1;
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: y, w: 4, h: 0.9,
    fill: { color: colors.white },
    line: { color: "E2E8F0", width: 1 }
  });
  slide2.addText(item.icon, {
    x: 0.6, y: y + 0.1, w: 0.5, h: 0.5,
    fontSize: 24
  });
  slide2.addText(item.title, {
    x: 1.2, y: y + 0.1, w: 3.1, h: 0.3,
    fontSize: 14, bold: true, color: colors.dark
  });
  slide2.addText(item.desc, {
    x: 1.2, y: y + 0.4, w: 3.1, h: 0.4,
    fontSize: 10, color: colors.gray
  });
});

// Evolution solutions (right side)
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.2, w: 4.3, h: 4.3,
  fill: { color: "FFF7ED" },
  line: { color: colors.evolved, width: 2 }
});

slide2.addText("🚀 진화 방향", {
  x: 5.4, y: 1.3, w: 4, h: 0.4,
  fontSize: 18, bold: true, color: colors.evolved
});

const evolutions = [
  "✅ 블록체인 코인 생성\n  (미래 대비, Pi 모델)",
  "✅ 광고 위치 설정 시스템\n  (관리자 UI, 수익화)",
  "✅ 위치기반 광고 발송\n  (LBS, 회원 정보 개선)",
  "✅ 회원 휴대폰/위치\n  (동의 기반, 정확한 타겟팅)"
];

evolutions.forEach((item, i) => {
  slide2.addText(item, {
    x: 5.4, y: 1.8 + i * 0.9, w: 4, h: 0.7,
    fontSize: 12, color: colors.dark, valign: "top"
  });
});

// ========== SLIDE 3: 신규 기능 - 블록체인 코인 ==========
let slide3 = pres.addSlide();
slide3.background = { color: colors.light };

addSectionHeader(slide3, "신규 기능 1: 블록체인 코인 생성", 0.5, colors.primary);

slide3.addText("미래 대비 - Pi 코인 모델 참조", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.gray, fontFace: "Arial"
});

// Coin phases
const coinPhases = [
  { phase: "Phase 1", title: "네트워크 선택", desc: "이더리움/폴리곤\n스마트 컨트랙트", color: colors.secondary },
  { phase: "Phase 2", title: "코인 개발", desc: "HeartChain 전용 코인\nERC-20/컨센서스", color: colors.primary },
  { phase: "Phase 3", title: "봉사 보상", desc: "활동 → 코인 적립\n지갑 시스템", color: colors.accent },
  { phase: "Phase 4", title: "생태계 완성", desc: "메인넷 런칭\n거래소 상장", color: colors.evolved }
];

coinPhases.forEach((item, i) => {
  const x = 0.8 + i * 2.3;
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.0, h: 2.5,
    fill: { color: colors.white },
    line: { color: item.color, width: 2 }
  });
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.0, h: 0.4,
    fill: { color: item.color },
    line: { color: item.color }
  });
  slide3.addText(item.phase, {
    x: x + 0.1, y: 2.05, w: 1.8, h: 0.3,
    fontSize: 11, bold: true, color: colors.white
  });
  slide3.addText(item.title, {
    x: x, y: 2.5, w: 2.0, h: 0.3,
    fontSize: 14, bold: true, color: colors.dark, align: "center"
  });
  slide3.addText(item.desc, {
    x: x + 0.2, y: 2.9, w: 1.6, h: 1.3,
    fontSize: 11, color: colors.gray, align: "center", valign: "top"
  });
});

// Important note
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.8, w: 9, h: 0.6,
  fill: { color: "FFF7ED" },
  line: { color: colors.evolved, width: 1 }
});
slide3.addText("⚠️ 규제 준수: 코인 판매 아님, 지분 가치 상승 모델 (Pi 코인 참조) - 규제 이슈 없음", {
  x: 0.7, y: 4.85, w: 8.6, h: 0.5,
  fontSize: 12, color: colors.dark, align: "center", valign: "middle"
});

// ========== SLIDE 4: 신규 기능 - 광고 위치 설정 ==========
let slide4 = pres.addSlide();
slide4.background = { color: colors.light };

addSectionHeader(slide4, "신규 기능 2: 광고 위치 설정 시스템", 0.5, colors.primary);

slide4.addText("hermes-webui 활용 관리자 대시보드", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.gray, fontFace: "Arial"
});

// Ad slots
const adSlots = [
  { loc: "메인 페이지", slots: ["상단 배너", "사이드바", "인피드"], icon: "🏠" },
  { loc: "봉사기록 페이지", slots: ["기록 완료 팝업", "하단 배너"], icon: "📝" },
  { loc: "대학 대시보드", slots: ["관리자 배너", "학생 대시보드"], icon: "🎓" },
  { loc: "모바일 앱", slots: ["푸시 알림", "인앱 배너"], icon: "📱" }
];

adSlots.forEach((item, i) => {
  const x = 0.6 + (i % 2) * 4.8;
  const y = 2.0 + Math.floor(i / 2) * 1.8;
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 4.3, h: 1.5,
    fill: { color: colors.white },
    line: { color: colors.secondary, width: 1 },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.06 }
  });
  slide4.addText(item.icon + " " + item.loc, {
    x: x + 0.2, y: y + 0.15, w: 4, h: 0.3,
    fontSize: 14, bold: true, color: colors.dark
  });
  item.slots.forEach((slot, j) => {
    slide4.addText("• " + slot, {
      x: x + 0.3, y: y + 0.5 + j * 0.3, w: 3.8, h: 0.25,
      fontSize: 11, color: colors.gray
    });
  });
});

// ========== SLIDE 5: 신규 기능 - 위치기반 광고 ==========
let slide5 = pres.addSlide();
slide5.background = { color: colors.light };

addSectionHeader(slide5, "신규 기능 3: 위치기반 광고 발송 (LBS)", 0.5, colors.primary);

slide5.addText("회원 정보 개선 + 휴대폰 GPS 활용", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.gray, fontFace: "Arial"
});

// Member info improvement
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 4.5, h: 3.0,
  fill: { color: colors.white },
  line: { color: colors.accent, width: 2 }
});
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 4.5, h: 0.4,
  fill: { color: colors.accent },
  line: { color: colors.accent }
});
slide5.addText("회원 정보 개선 (v2)", {
  x: 0.6, y: 2.05, w: 4.3, h: 0.3,
  fontSize: 14, bold: true, color: colors.white
});

const memberFields = [
  "📱 휴대폰 번호 (필수)",
  "🏠 주소 (시/도, 구/군, 상세)",
  "📍 위치 정보 수집 동의 (GDPR/PIPA)",
  "🎯 관심 지역 설정 (최대 3개)"
];

memberFields.forEach((field, i) => {
  slide5.addText(field, {
    x: 0.7, y: 2.6 + i * 0.5, w: 4.0, h: 0.4,
    fontSize: 12, color: colors.dark
  });
});

// Location targeting
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.0, w: 4.3, h: 3.0,
  fill: { color: colors.white },
  line: { color: colors.evolved, width: 2 }
});
slide5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.0, w: 4.3, h: 0.4,
  fill: { color: colors.evolved },
  line: { color: colors.evolved }
});
slide5.addText("위치기반 타겟팅 엔진", {
  x: 5.3, y: 2.05, w: 4.1, h: 0.3,
  fontSize: 14, bold: true, color: colors.white
});

const targeting = [
  "🔴 실시간 위치: GPS 좌표 기반 반경 검색",
  "🔵 등록 주소: 시/도, 구/군 매칭",
  "🟢 하이브리드: GPS + 주소 결합",
  "🎯 반경 설정: 예) 학교 반경 5km 내 광고"
];

targeting.forEach((item, i) => {
  slide5.addText(item, {
    x: 5.4, y: 2.6 + i * 0.5, w: 4.0, h: 0.4,
    fontSize: 11, color: colors.dark
  });
});

// ========== SLIDE 6: 진화된 비즈니스 모델 ==========
let slide6 = pres.addSlide();
slide6.background = { color: colors.light };

addSectionHeader(slide6, "진화된 비즈니스 모델");

// Original revenue streams
slide6.addText("기존 + 신규 수익원", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.gray
});

const streams = [
  { title: "광고 수익", pct: "40%", desc: "트래픽 즉시\n로컬+위치기반", color: colors.primary },
  { title: "프리미엄 광고", pct: "20%", desc: "위치 타겟팅\n고단가 광고", color: colors.evolved },
  { title: "작업 게시 수수료", pct: "20%", desc: "봉사자 대상\n구인/과외", color: colors.secondary },
  { title: "데이터 판매", pct: "10%", desc: "익명화된\n위치/행동 데이터", color: colors.accent },
  { title: "지분 가치 상승", pct: "10%", desc: "코인 생태계\n엑시트", color: "8B5CF6" }
];

streams.forEach((item, i) => {
  const x = 0.5 + i * 1.9;
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 1.7, h: 2.8,
    fill: { color: i === 1 ? item.color : colors.white },
    line: { color: item.color, width: 1 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
  });
  slide6.addText(item.title, {
    x: x + 0.1, y: 2.2, w: 1.5, h: 0.4,
    fontSize: 13, bold: true, 
    color: i === 1 ? colors.white : colors.dark, 
    align: "center"
  });
  slide6.addText(item.desc, {
    x: x + 0.2, y: 2.7, w: 1.3, h: 1.2,
    fontSize: 10, 
    color: i === 1 ? "E0F7F4" : colors.gray, 
    align: "center", valign: "top"
  });
  slide6.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 4.5, w: 1.7, h: 0.3,
    fill: { color: item.color },
    line: { color: item.color }
  });
  slide6.addText(item.pct, {
    x: x, y: 4.5, w: 1.7, h: 0.3,
    fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle"
  });
});

// ========== SLIDE 7: 기술 진화 로드맵 ==========
let slide7 = pres.addSlide();
slide7.background = { color: colors.light };

addSectionHeader(slide7, "기술 진화 로드맵 (Tech Roadmap)");

const phases = [
  { 
    phase: "Phase 1: 기반 구축", 
    period: "0-6개월",
    color: colors.accent,
    items: ["블록체인 기록 (기존)", "회원정보 DB 확장", "광고 위치 관리 UI", "hermes-webui 통합"]
  },
  { 
    phase: "Phase 2: 위치기반", 
    period: "6-12개월",
    color: colors.evolved,
    items: ["LBS 엔진 개발", "위치 타겟팅 알고리즘", "지역 광고 시스템", "모바일 앱 프로토타입"]
  },
  { 
    phase: "Phase 3: 코인 생성", 
    period: "12-24개월",
    color: colors.primary,
    items: ["스마트 컨트랙트", "코인 적립 시스템", "지갑 시스템", "내부 테스트넷"]
  },
  { 
    phase: "Phase 4: 생태계 완성", 
    period: "24개월+",
    color: colors.secondary,
    items: ["메인넷 런칭", "파트너십 확장", "코인 거래소 상장", "엑시트 준비"]
  }
];

phases.forEach((phase, i) => {
  const x = 0.5 + i * 2.4;
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.2, h: 3.0,
    fill: { color: colors.white },
    line: { color: phase.color, width: 2 }
  });
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.2, h: 0.4,
    fill: { color: phase.color },
    line: { color: phase.color }
  });
  slide7.addText(phase.phase, {
    x: x + 0.1, y: 2.05, w: 2.0, h: 0.3,
    fontSize: 11, bold: true, color: colors.white
  });
  slide7.addText(phase.period, {
    x: x + 0.1, y: 2.45, w: 2.0, h: 0.25,
    fontSize: 10, color: phase.color
  });
  
  phase.items.forEach((item, j) => {
    slide7.addText("• " + item, {
      x: x + 0.2, y: 2.8 + j * 0.45, w: 1.8, h: 0.4,
      fontSize: 10, color: colors.dark
    });
  });
});

// ========== SLIDE 8: KPI v2.0 ==========
let slide8 = pres.addSlide();
slide8.background = { color: colors.light };

addSectionHeader(slide8, "KPI v2.0 (정량적 목표)");

// KPI table
const kpiData = [
  ["시기", "대상", "사용자 수", "신규 목표"],
  ["6개월", "1개 도시 (5개 대학)", "20,000명", "광고위치 10개, 회원정보 확장"],
  ["1년", "전국 50개 대학", "200,000명", "위치기반 광고 런칭, 지역광고 수익화"],
  ["2년", "글로벌 500개 대학", "2,000,000명", "코인 테스트넷 가동"],
  ["3년", "전세계 주요 대학", "10,000,000명+", "메인넷 런칭, 엑시트"]
];

slide8.addTable(kpiData, {
  x: 0.5, y: 1.8, w: 9, h: 3.2,
  border: { pt: 1, color: "E2E8F0" },
  fill: { color: colors.white },
  fontSize: 12,
  color: colors.dark,
  colW: [1.5, 2.5, 2.0, 3.0],
  rowH: [0.6, 0.65, 0.65, 0.65, 0.65],
  align: "center",
  valign: "middle"
});

// Header row styling
slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.8, w: 9, h: 0.6,
  fill: { color: colors.primary },
  line: { color: colors.primary }
});

// ========== SLIDE 9: gstack + self-evolution 활용 ==========
let slide9 = pres.addSlide();
slide9.background = { color: colors.light };

addSectionHeader(slide9, "gstack + self-evolution으로 자동 진화", 0.5, colors.primary);

slide9.addText("방금 설치한 5개 스킬로 플랫폼 진화", {
  x: 0.5, y: 1.2, w: 9, h: 0.4,
  fontSize: 16, color: colors.gray
});

const skills = [
  { name: "gstack", desc: "23개 전문가 역할\n체계적 디버깅, 스킬 생성", icon: "🧠" },
  { name: "self-evolution", desc: "DSPy + GEPA\n스킬/코드 자동 최적화", icon: "🚀" },
  { name: "gbrain", desc: "지능형 브레인\n세션 간 학습 관리", icon: "🧬" },
  { name: "hermes-webui", desc: "웹/폰 UI\n관리자 대시보드", icon: "🖥️" },
  { name: "awesome-hermes", desc: "200+ 커뮤니티 스킬\n베스트 프랙티스", icon: "📚" }
];

skills.forEach((item, i) => {
  const x = 0.6 + (i % 3) * 3.1;
  const y = 2.0 + Math.floor(i / 3) * 1.6;
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 2.9, h: 1.3,
    fill: { color: i === 0 ? colors.primary : colors.white },
    line: { color: i === 0 ? colors.primary : "E2E8F0", width: 1 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  slide9.addText(item.icon + " " + item.name, {
    x: x + 0.2, y: y + 0.15, w: 2.5, h: 0.3,
    fontSize: 14, bold: true, 
    color: i === 0 ? colors.white : colors.dark
  });
  slide9.addText(item.desc, {
    x: x + 0.2, y: y + 0.5, w: 2.5, h: 0.6,
    fontSize: 10, 
    color: i === 0 ? "E0F7F4" : colors.gray,
    valign: "top"
  });
});

// ========== SLIDE 10: 투자 제안 (업데이트) ==========
let slide10 = pres.addSlide();
slide10.background = { color: colors.primary };

slide10.addText("투자 제안 (Evolution Edition)", {
  x: 0.5, y: 1.0, w: 9, h: 0.6,
  fontSize: 36, bold: true, color: colors.white, align: "center"
});

slide10.addText("블록체인 + 위치기반 + 자동진화 = 독보적 경쟁력", {
  x: 0.5, y: 1.8, w: 9, h: 0.4,
  fontSize: 18, color: colors.accent, align: "center", italic: true
});

const investmentPoints = [
  "✓ 블록체인 코인 생성 - 미래 대비 (Pi 모델, 규제 없음)",
  "✓ 위치기반 광고 - 정확한 타겟팅, 고단가 수익화",
  "✓ 광고 위치 설정 - 관리자 UI, 즉시 수익화",
  "✓ 자동 진화 시스템 - gstack, self-evolution으로 지속 개선",
  "✓ 5개 스킬 설치 완료 - 지금 바로 진화 시작!"
];

investmentPoints.forEach((point, i) => {
  slide10.addText(point, {
    x: 1.5, y: 2.5 + i * 0.45, w: 7, h: 0.4,
    fontSize: 14, color: colors.white
  });
});

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 2.5, y: 5.0, w: 5, h: 0.6,
  fill: { color: colors.evolved },
  line: { color: colors.evolved }
});
slide10.addText("지금 투자하세요 - 자원봉사자의 삶을 바꾸는 혁신에 함께하세요", {
  x: 2.5, y: 5.0, w: 5, h: 0.6,
  fontSize: 13, bold: true, color: colors.white, align: "center", valign: "middle"
});

// ========== SLIDE 11: 마무리 ==========
let slide11 = pres.addSlide();
slide11.background = { color: colors.light };

slide11.addText("HeartChain", {
  x: 0.5, y: 1.3, w: 9, h: 0.8,
  fontSize: 48, bold: true, color: colors.primary, align: "center"
});

slide11.addText("자원봉사자의 소득을 높여주는 혁신적인 플랫폼", {
  x: 0.5, y: 2.2, w: 9, h: 0.5,
  fontSize: 20, color: colors.gray, align: "center"
});

slide11.addText("핵심 가치: 봉사자들의 삶을 개선하고, 사회적 임팩트를 비즈니스 가치로", {
  x: 0.5, y: 3.0, w: 9, h: 0.4,
  fontSize: 14, color: colors.dark, align: "center", italic: true
});

// Core features summary
const coreFeatures = [
  "블록체인 코인",
  "위치기반 광고",
  "광고 위치 설정",
  "자동 진화 시스템"
];

coreFeatures.forEach((feature, i) => {
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: 1.5 + i * 2.0, y: 3.8, w: 1.8, h: 0.5,
    fill: { color: i === 0 ? colors.evolved : colors.secondary },
    line: { color: i === 0 ? colors.evolved : colors.secondary }
  });
  slide11.addText(feature, {
    x: 1.5 + i * 2.0, y: 3.85, w: 1.8, h: 0.4,
    fontSize: 12, bold: true, color: colors.white, align: "center", valign: "middle"
  });
});

// Contact info
slide11.addShape(pres.shapes.RECTANGLE, {
  x: 2.5, y: 4.6, w: 5, h: 1.0,
  fill: { color: "FFF7ED" },
  line: { color: colors.evolved, width: 1 }
});
slide11.addText("문의: HeartChain Team\nE: \\WorkBuddy\\heartchain\\\n진화 도구: gstack, gbrain, hermes-webui, awesome-hermes, self-evolution ✅", {
  x: 2.5, y: 4.7, w: 5, h: 0.8,
  fontSize: 12, color: colors.dark, align: "center", valign: "middle"
});

// Save
const outputPath = "/mnt/e/WorkBuddy/heartchain/HeartChain_Evolution_Pitch_v2.pptx";
pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("✅ PPT v2.0 created successfully: " + outputPath);
  })
  .catch(err => {
    console.error("❌ Error creating PPT:", err);
  });
