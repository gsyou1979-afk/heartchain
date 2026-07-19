const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'HeartChain Team';
pres.title = 'HeartChain Investment Pitch Deck';

// Color palette - Teal Trust
const colors = {
  primary: "028090",    // teal
  secondary: "00A896",  // seafoam
  accent: "02C39A",     // mint
  dark: "1E293B",       // dark slate
  light: "F8FAFC",      // off-white
  gray: "64748B",       // muted gray
  white: "FFFFFF"
};

// Helper: add accent bar
function addAccentBar(slide, y) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: y, w: 0.08, h: 0.6,
    fill: { color: colors.accent },
    line: { color: colors.accent }
  });
}

// Helper: section header
function addSectionHeader(slide, text, y = 0.5) {
  addAccentBar(slide, y + 0.05);
  slide.addText(text, {
    x: 0.2, y: y, w: 9.5, h: 0.6,
    fontSize: 32, bold: true, color: colors.dark,
    fontFace: "Arial", margin: 0
  });
}

// ========== SLIDE 1: Title Slide ==========
let slide1 = pres.addSlide();
slide1.background = { color: colors.primary };

slide1.addText("HeartChain", {
  x: 0.5, y: 1.8, w: 9, h: 1,
  fontSize: 60, bold: true, color: colors.white,
  fontFace: "Arial", align: "center"
});

slide1.addText("자원봉사자의 삶을 바꾸는 블록체인 플랫폼", {
  x: 0.5, y: 2.9, w: 9, h: 0.5,
  fontSize: 24, color: colors.accent,
  fontFace: "Arial", align: "center", italic: true
});

slide1.addText("Investment Pitch Deck", {
  x: 0.5, y: 4.2, w: 9, h: 0.4,
  fontSize: 18, color: colors.light,
  fontFace: "Arial", align: "center"
});

// ========== SLIDE 2: 문제 제기 ==========
let slide2 = pres.addSlide();
slide2.background = { color: colors.light };

addSectionHeader(slide2, "문제 제기");
slide2.addText("자원봉사자들의 불합리한 현실", {
  x: 0.5, y: 1.2, w: 9, h: 0.5,
  fontSize: 20, color: colors.gray, fontFace: "Arial"
});

// Problem boxes
const problems = [
  { icon: "💰", title: "낮은 소득", desc: "자원봉사자는\무보수 활동으로\n생계 위협" },
  { icon: "🎓", title: "대학생의 고충", desc: "졸업 요건(수십 시간)\n충족해야 하나\n보상 없음" },
  { icon: "🤔", title: "신뢰 부족", desc: "공익 분야의\n변조 가능성\n우려" }
];

problems.forEach((item, i) => {
  const x = 0.8 + i * 3;
  slide2.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.2, w: 2.6, h: 2.5,
    fill: { color: colors.white },
    line: { color: "E2E8F0", width: 1 },
    shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 }
  });
  slide2.addText(item.icon, {
    x: x + 0.8, y: 2.4, w: 1, h: 0.6,
    fontSize: 36, align: "center"
  });
  slide2.addText(item.title, {
    x: x + 0.2, y: 3.1, w: 2.2, h: 0.4,
    fontSize: 18, bold: true, color: colors.dark, align: "center"
  });
  slide2.addText(item.desc, {
    x: x + 0.2, y: 3.5, w: 2.2, h: 1,
    fontSize: 13, color: colors.gray, align: "center", valign: "top"
  });
});

// ========== SLIDE 3: 솔루션 ==========
let slide3 = pres.addSlide();
slide3.background = { color: colors.light };

addSectionHeader(slide3, "솔루션: HeartChain");
slide3.addText("블록체인 기반 자원봉사 기록 및 보상 플랫폼", {
  x: 0.5, y: 1.2, w: 9, h: 0.5,
  fontSize: 20, color: colors.gray, fontFace: "Arial"
});

// Solution flow
const flowItems = [
  { num: "1", text: "봉사활동\n완전 기록", sub: "시간/장소/이벤트\n블록체인 저장" },
  { num: "2", text: "대학 지분 교환\n사용자 확보", sub: "단체 일괄 획득\n지수적 성장" },
  { num: "3", text: "트래픽 기반\n광고 수익", sub: "로컬 광고\n타겟 광고" },
  { num: "4", text: "지분 가치 상승\n엑시트", sub: "Pi 코인 모델\n장기 축적" }
];

flowItems.forEach((item, i) => {
  const x = 0.5 + i * 2.3;
  slide3.addShape(pres.shapes.OVAL, {
    x: x + 0.7, y: 2.2, w: 0.8, h: 0.8,
    fill: { color: colors.primary },
    line: { color: colors.primary }
  });
  slide3.addText(item.num, {
    x: x + 0.7, y: 2.2, w: 0.8, h: 0.8,
    fontSize: 28, bold: true, color: colors.white, align: "center", valign: "middle"
  });
  slide3.addText(item.text, {
    x: x, y: 3.2, w: 2, h: 0.8,
    fontSize: 16, bold: true, color: colors.dark, align: "center"
  });
  slide3.addText(item.sub, {
    x: x, y: 4.0, w: 2, h: 0.8,
    fontSize: 12, color: colors.gray, align: "center", valign: "top"
  });
  
  // Arrow between items
  if (i < flowItems.length - 1) {
    slide3.addShape(pres.shapes.LINE, {
      x: x + 1.6, y: 2.6, w: 0.7, h: 0,
      line: { color: colors.accent, width: 3, endArrowType: "triangle" }
    });
  }
});

// ========== SLIDE 4: 비즈니스 모델 ==========
let slide4 = pres.addSlide();
slide4.background = { color: colors.light };

addSectionHeader(slide4, "비즈니스 모델");

// Revenue streams
const streams = [
  { title: "광고 수익", icon: "📺", desc: "트래픽 즉시 수익화\n로컬 광고 + 타겟 광고", pct: "50%" },
  { title: "작업 게시 수수료", icon: "📋", desc: "봉사자 대상 구인/과외\n게시 수수료", pct: "30%" },
  { title: "지분 가치 상승", icon: "📈", desc: "사용자 확보 후\n엑시트 (Pi 모델)", pct: "20%" }
];

streams.forEach((item, i) => {
  const x = 0.5 + i * 3;
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.8, h: 3.0,
    fill: { color: i === 1 ? colors.primary : colors.white },
    line: { color: "E2E8F0", width: 1 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 }
  });
  slide4.addText(item.icon, {
    x: x + 0.9, y: 2.2, w: 1, h: 0.6,
    fontSize: 32, align: "center"
  });
  slide4.addText(item.title, {
    x: x + 0.2, y: 2.9, w: 2.4, h: 0.5,
    fontSize: 20, bold: true, 
    color: i === 1 ? colors.white : colors.dark, 
    align: "center"
  });
  slide4.addText(item.desc, {
    x: x + 0.2, y: 3.5, w: 2.4, h: 1.2,
    fontSize: 14, 
    color: i === 1 ? "E0F7F4" : colors.gray, 
    align: "center", valign: "top"
  });
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 4.7, w: 2.8, h: 0.3,
    fill: { color: colors.accent },
    line: { color: colors.accent }
  });
  slide4.addText(item.pct, {
    x: x, y: 4.7, w: 2.8, h: 0.3,
    fontSize: 14, bold: true, color: colors.white, align: "center", valign: "middle"
  });
});

// ========== SLIDE 5: 시장 기회 ==========
let slide5 = pres.addSlide();
slide5.background = { color: colors.light };

addSectionHeader(slide5, "시장 기회");

// Market size chart
slide5.addChart(pres.charts.BAR, [
  { name: "사용자 수", labels: ["초기(6개월)", "확장(1년)", "성숙(2년)"], values: [20000, 200000, 2000000] }
], {
  x: 0.5, y: 1.8, w: 5.5, h: 3.0,
  barDir: "col",
  chartColors: [colors.primary, colors.secondary, colors.accent],
  chartArea: { fill: { color: colors.white }, roundedCorners: true },
  catAxisLabelColor: colors.gray,
  valAxisLabelColor: colors.gray,
  valGridLine: { color: "E2E8F0", size: 0.5 },
  catGridLine: { style: "none" },
  showValue: true,
  dataLabelColor: colors.dark,
  showLegend: false,
  valAxisMaxVal: 2200000
});

// Key stats on right
const stats = [
  { num: "5개", label: "초기 대학 제휴" },
  { num: "2만명", label: "단일 도시 사용자" },
  { num: "전 세계", label: "확장 목표 시장" }
];

stats.forEach((item, i) => {
  slide5.addShape(pres.shapes.RECTANGLE, {
    x: 6.5, y: 1.8 + i * 1.1, w: 3, h: 0.9,
    fill: { color: i === 0 ? colors.primary : colors.white },
    line: { color: "E2E8F0", width: 1 }
  });
  slide5.addText(item.num, {
    x: 6.5, y: 1.85 + i * 1.1, w: 3, h: 0.4,
    fontSize: 24, bold: true, 
    color: i === 0 ? colors.white : colors.primary,
    align: "center"
  });
  slide5.addText(item.label, {
    x: 6.5, y: 2.2 + i * 1.1, w: 3, h: 0.3,
    fontSize: 12, color: colors.gray, align: "center"
  });
});

// ========== SLIDE 6: 고객 획득 전략 ==========
let slide6 = pres.addSlide();
slide6.background = { color: colors.light };

addSectionHeader(slide6, "고객 획득 전략");
slide6.addText("대학과의 전략적 파트너십", {
  x: 0.5, y: 1.2, w: 9, h: 0.5,
  fontSize: 20, color: colors.gray, fontFace: "Arial"
});

// Strategy visual
const strategies = [
  { title: "지분 제공", desc: "대학에 지분 제공\n기존 회원 풀 공유" },
  { title: "무료 서비스", desc: "대학은 돈 안 받음\n인증서만 제공" },
  { title: "사회적 명분", desc: "봉사 장려, 선행 장려\n사회적 승인 용이" }
];

strategies.forEach((item, i) => {
  const x = 0.8 + i * 3;
  // Circle with number
  slide6.addShape(pres.shapes.OVAL, {
    x: x + 0.9, y: 2.3, w: 0.7, h: 0.7,
    fill: { color: colors.secondary },
    line: { color: colors.secondary }
  });
  slide6.addText(String(i + 1), {
    x: x + 0.9, y: 2.3, w: 0.7, h: 0.7,
    fontSize: 24, bold: true, color: colors.white, align: "center", valign: "middle"
  });
  slide6.addText(item.title, {
    x: x, y: 3.2, w: 2.5, h: 0.4,
    fontSize: 18, bold: true, color: colors.dark, align: "center"
  });
  slide6.addText(item.desc, {
    x: x + 0.2, y: 3.6, w: 2.1, h: 1.0,
    fontSize: 13, color: colors.gray, align: "center", valign: "top"
  });
});

// Bottom highlight
slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.8, w: 9, h: 0.6,
  fill: { color: "FFF7ED" },
  line: { color: colors.accent, width: 1 }
});
slide6.addText("✓ 이미 학교장들과 긍정적 대화 완료 - 인증서 제공만으로 충분", {
  x: 0.7, y: 4.85, w: 8.6, h: 0.5,
  fontSize: 14, color: colors.dark, align: "center", valign: "middle"
});

// ========== SLIDE 7: 기술 스택 ==========
let slide7 = pres.addSlide();
slide7.background = { color: colors.light };

addSectionHeader(slide7, "기술 스택");

const techItems = [
  { name: "NestJS", desc: "Backend API\nPort 3000", color: "E0234E" },
  { name: "Nuxt 3", desc: "Frontend\nPort 3001", color: "00DC82" },
  { name: "PostgreSQL", desc: "데이터베이스", color: "336791" },
  { name: "Blockchain", desc: "변조 방지 기록", color: "F7931A" }
];

techItems.forEach((item, i) => {
  const x = 0.8 + i * 2.2;
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 2.0, h: 2.5,
    fill: { color: colors.white },
    line: { color: item.color, width: 2 }
  });
  slide7.addText(item.name, {
    x: x, y: 2.2, w: 2.0, h: 0.5,
    fontSize: 20, bold: true, color: item.color, align: "center"
  });
  slide7.addText(item.desc, {
    x: x + 0.2, y: 2.8, w: 1.6, h: 1.2,
    fontSize: 13, color: colors.gray, align: "center", valign: "top"
  });
});

// Blockchain highlight
slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 4.8, w: 9, h: 0.6,
  fill: { color: "FFF7ED" },
  line: { color: colors.accent, width: 1 }
});
slide7.addText("✓ 블록체인 기술로 공익 분야 신뢰 문제 해결 - 변조 불가능한 기록", {
  x: 0.7, y: 4.85, w: 8.6, h: 0.5,
  fontSize: 14, color: colors.dark, align: "center", valign: "middle"
});

// ========== SLIDE 8: 성장 로드맵 ==========
let slide8 = pres.addSlide();
slide8.background = { color: colors.light };

addSectionHeader(slide8, "성장 로드맵");

const phases = [
  { 
    phase: "Phase 1: MVP", 
    period: "0-3개월",
    color: colors.accent,
    items: ["봉사활동 기록 시스템", "대학 제휴 모듈", "기본 광고 시스템"]
  },
  { 
    phase: "Phase 2: 확장", 
    period: "3-6개월",
    color: colors.secondary,
    items: ["학교 내 로컬 광고", "작업 게시 및 수수료", "봉사자 보상 시스템"]
  },
  { 
    phase: "Phase 3: 생태계", 
    period: "6-12개월",
    color: colors.primary,
    items: ["정부/공공기관 연계", "글로벌 확장", "엑시트 준비"]
  }
];

phases.forEach((phase, i) => {
  const x = 0.5 + i * 3.2;
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 3.0, h: 3.0,
    fill: { color: colors.white },
    line: { color: phase.color, width: 2 }
  });
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: x, y: 2.0, w: 3.0, h: 0.5,
    fill: { color: phase.color },
    line: { color: phase.color }
  });
  slide8.addText(phase.phase, {
    x: x, y: 2.05, w: 3.0, h: 0.4,
    fontSize: 14, bold: true, color: colors.white, align: "center"
  });
  slide8.addText(phase.period, {
    x: x, y: 2.55, w: 3.0, h: 0.3,
    fontSize: 12, color: phase.color, align: "center"
  });
  
  phase.items.forEach((item, j) => {
    slide8.addText("• " + item, {
      x: x + 0.2, y: 2.9 + j * 0.5, w: 2.6, h: 0.4,
      fontSize: 12, color: colors.dark
    });
  });
});

// ========== SLIDE 9: KPI 및 재무 목표 ==========
let slide9 = pres.addSlide();
slide9.background = { color: colors.light };

addSectionHeader(slide9, "KPI 및 재무 목표");

// 6개월 목표
slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 4.3, h: 3.0,
  fill: { color: colors.white },
  line: { color: colors.primary, width: 2 }
});
slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 2.0, w: 4.3, h: 0.5,
  fill: { color: colors.primary },
  line: { color: colors.primary }
});
slide9.addText("6개월 목표", {
  x: 0.5, y: 2.05, w: 4.3, h: 0.4,
  fontSize: 16, bold: true, color: colors.white, align: "center"
});

const goals6m = [
  { label: "대학 제휴", value: "5개" },
  { label: "활성 사용자", value: "2만명" },
  { label: "월 광고 수익", value: "1,000만원" }
];
goals6m.forEach((item, i) => {
  slide9.addText(item.label + ": " + item.value, {
    x: 0.7, y: 2.6 + i * 0.6, w: 3.8, h: 0.4,
    fontSize: 14, color: colors.dark
  });
});

// 1년 목표
slide9.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.0, w: 4.3, h: 3.0,
  fill: { color: colors.white },
  line: { color: colors.accent, width: 2 }
});
slide9.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 2.0, w: 4.3, h: 0.5,
  fill: { color: colors.accent },
  line: { color: colors.accent }
});
slide9.addText("1년 목표", {
  x: 5.2, y: 2.05, w: 4.3, h: 0.4,
  fontSize: 16, bold: true, color: colors.white, align: "center"
});

const goals1y = [
  { label: "대학 제휴", value: "50개" },
  { label: "활성 사용자", value: "20만명" },
  { label: "월 광고 수익", value: "1억원" },
  { label: "투자/엑시트", value: "Series A or Exit" }
];
goals1y.forEach((item, i) => {
  slide9.addText(item.label + ": " + item.value, {
    x: 5.4, y: 2.6 + i * 0.5, w: 3.8, h: 0.4,
    fontSize: 14, color: colors.dark
  });
});

// ========== SLIDE 10: 경쟁 우위 ==========
let slide10 = pres.addSlide();
slide10.background = { color: colors.light };

addSectionHeader(slide10, "경쟁 우위 및 혁신성");

const advantages = [
  { title: "Pi 코인 모델", desc: "장기 축적 후 거래\n규제 이슈 없음" },
  { title: "블록체인 신뢰", desc: "변조 불가능한 기록\n공익 분야 신뢰 해결" },
  { title: "고빈도 행동", desc: "대학생 필수 활동\n졸업 요건 충족" },
  { title: "단체 일괄 획득", desc: "대학 지분 교환\n지수적 성장" }
];

advantages.forEach((item, i) => {
  const x = 0.5 + (i % 2) * 4.8;
  const y = 2.2 + Math.floor(i / 2) * 1.5;
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 4.5, h: 1.2,
    fill: { color: colors.white },
    line: { color: colors.secondary, width: 1 },
    shadow: { type: "outer", color: "000000", blur: 4, offset: 2, angle: 135, opacity: 0.06 }
  });
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: 0.1, h: 1.2,
    fill: { color: colors.accent },
    line: { color: colors.accent }
  });
  slide10.addText(item.title, {
    x: x + 0.3, y: y + 0.15, w: 4.0, h: 0.4,
    fontSize: 16, bold: true, color: colors.dark, margin: 0
  });
  slide10.addText(item.desc, {
    x: x + 0.3, y: y + 0.55, w: 4.0, h: 0.5,
    fontSize: 12, color: colors.gray, margin: 0
  });
});

// ========== SLIDE 11: 투자 제안 ==========
let slide11 = pres.addSlide();
slide11.background = { color: colors.primary };

slide11.addText("투자 제안", {
  x: 0.5, y: 1.2, w: 9, h: 0.6,
  fontSize: 36, bold: true, color: colors.white, align: "center"
});

slide11.addText("지분 가치 상승을 통한 엑시트 전략", {
  x: 0.5, y: 2.0, w: 9, h: 0.4,
  fontSize: 20, color: colors.accent, align: "center", italic: true
});

const investmentPoints = [
  "✓ Pi 코인 모델 참조 - 장기 축적으로 지분 가치 상승",
  "✓ 미디어 자산 모델 - 회원수 × 활성도 = 광고 가치",
  "✓ 트래픽 즉시 수익화 - 특정 규모 대기 불필요",
  "✓ 글로벌 확장 가능 - 전 세계 대학 시장 타겟"
];

investmentPoints.forEach((point, i) => {
  slide11.addText(point, {
    x: 1.5, y: 2.8 + i * 0.5, w: 7, h: 0.4,
    fontSize: 16, color: colors.white
  });
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 2.5, y: 5.0, w: 5, h: 0.6,
  fill: { color: colors.accent },
  line: { color: colors.accent }
});
slide11.addText("지금 투자하세요 - 자원봉사자의 삶을 바꾸는 여정에 함께하세요", {
  x: 2.5, y: 5.0, w: 5, h: 0.6,
  fontSize: 14, bold: true, color: colors.dark, align: "center", valign: "middle"
});

// ========== SLIDE 12: 마무리 ==========
let slide12 = pres.addSlide();
slide12.background = { color: colors.light };

slide12.addText("HeartChain", {
  x: 0.5, y: 1.5, w: 9, h: 0.8,
  fontSize: 48, bold: true, color: colors.primary, align: "center"
});

slide12.addText("자원봉사자의 소득을 높여주는 혁신적인 플랫폼", {
  x: 0.5, y: 2.4, w: 9, h: 0.5,
  fontSize: 20, color: colors.gray, align: "center"
});

slide12.addText("핵심 가치: 봉사자들의 삶을 개선하고, 사회적 임팩트를 비즈니스 가치로", {
  x: 0.5, y: 3.2, w: 9, h: 0.4,
  fontSize: 14, color: colors.dark, align: "center", italic: true
});

// Contact info
slide12.addShape(pres.shapes.RECTANGLE, {
  x: 2.5, y: 4.2, w: 5, h: 1.0,
  fill: { color: "FFF7ED" },
  line: { color: colors.accent, width: 1 }
});
slide12.addText("문의: HeartChain Team\nE: \\WorkBuddy\\heartchain\\", {
  x: 2.5, y: 4.3, w: 5, h: 0.8,
  fontSize: 14, color: colors.dark, align: "center", valign: "middle"
});

// Save
const outputPath = "/mnt/e/WorkBuddy/heartchain/HeartChain_Investment_Pitch_Deck.pptx";
pres.writeFile({ fileName: outputPath })
  .then(() => {
    console.log("✅ PPT created successfully: " + outputPath);
  })
  .catch(err => {
    console.error("❌ Error creating PPT:", err);
  });
