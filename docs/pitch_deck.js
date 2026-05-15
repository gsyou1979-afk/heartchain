const pptxgen = require('pptxgenjs');
const html2pptx = require('C:/Users/KP/.workbuddy/skills/powerpoint/scripts/html2pptx.js');
const path = require('path');

const OUT = 'E:/WorkBuddy/heartchain/docs/HeartChain_파트너십_PitchDeck.pptx';
const TMP = 'E:/WorkBuddy/heartchain/docs/_slides_tmp/';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.title = 'HeartChain 파트너십 제안';
pptx.author = 'HeartChain';

// ─── Design tokens ───
const C = {
  darkBg:   '1A1A2E',   // deep navy
  midBg:    '16213E',   // navy
  accent:   'FF6B9D',   // coral pink
  accent2:  '00D9C4',   // teal
  light:    'E8F4F8',   // light blue-white
  white:    'FFFFFF',
  text:    'FFFFFF',
  gray:     'B0B8C4',
  gold:     'FFD700',
  cardBg:   '1E2D4A',
};

async function main() {
  await main$body();
  await pptx.writeFile({ fileName: OUT });
  console.log('Saved:', OUT);
}

async function main$body() {

  // ── SLIDE 1: Cover ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.darkBg };

    // Top accent bar
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 10, h: 0.08,
      fill: { color: C.accent }
    });

    // Left accent bar
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 0.06, h: 5.625,
      fill: { color: C.accent }
    });

    // Logo text
    s.addText('HEARTCHAIN', {
      x: 0.5, y: 0.4, w: 9, h: 0.5,
      fontSize: 14, color: C.accent, bold: true,
      charSpacing: 8, fontFace: 'Arial'
    });

    // Main title
    s.addText('자원봉사 단체와\n함께 성장하는\n블록체인 플랫폼', {
      x: 0.5, y: 1.3, w: 6, h: 2.8,
      fontSize: 36, color: C.white, bold: true,
      fontFace: 'Arial', lineSpacing: 44
    });

    // Sub title
    s.addText('HeartChain 파트너십 제안서', {
      x: 0.5, y: 4.3, w: 5, h: 0.5,
      fontSize: 16, color: C.gray, fontFace: 'Arial'
    });

    // Right side - heart icon placeholder (oval)
    s.addShape(pptx.shapes.OVAL, {
      x: 7.2, y: 1.2, w: 2.3, h: 2.3,
      fill: { color: C.accent, transparency: 15 },
      line: { color: C.accent, width: 2 }
    });
    s.addText('HRT', {
      x: 7.2, y: 1.9, w: 2.3, h: 0.9,
      fontSize: 28, color: C.white, bold: true,
      align: 'center', fontFace: 'Arial'
    });

    // Bottom stats
    const stats = [
      { label: '플랫폼 분배', val: '70%' },
      { label: '개발자 보유', val: '30%' },
      { label: '활성 동호회', val: '200+' },
    ];
    stats.forEach((st, i) => {
      const x = 0.5 + i * 2.8;
      s.addText(st.val, {
        x, y: 4.85, w: 2.5, h: 0.4,
        fontSize: 20, color: C.accent2, bold: true, fontFace: 'Arial'
      });
      s.addText(st.label, {
        x, y: 5.2, w: 2.5, h: 0.3,
        fontSize: 10, color: C.gray, fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 2: 문제 ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.midBg };

    // Section label
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fill: { color: C.accent }
    });
    s.addText('01 문제', {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fontSize: 10, color: C.white, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('자원봉사 단체가\n직면한 현실', {
      x: 0.5, y: 0.9, w: 9, h: 1.0,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    const problems = [
      { icon: 'X', title: '성과 인정 부족', desc: '자원봉사자의 기여가\n시스템적으로 기록되지 않음' },
      { icon: 'X', title: '인센티브 부재', desc: '열정만으로 운영하며\n회원이 이탈하기 쉬움' },
      { icon: 'X', title: '데이터 분산', desc: '단체별 회원이 흩어져 있어\n실질적 영향력을 파악하기 어려움' },
      { icon: 'X', title: '수익화 수단 없음', desc: '단체 운영에 필요한\n지속적 수익원이 필요' },
    ];

    problems.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.7;
      const y = 2.2 + row * 1.55;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.4, h: 1.35,
        fill: { color: C.cardBg },
        rectRadius: 0.1
      });

      // X icon circle
      s.addShape(pptx.shapes.OVAL, {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fill: { color: 'C0392B' }
      });
      s.addText('X', {
        x: x + 0.2, y: y + 0.2, w: 0.5, h: 0.5,
        fontSize: 14, color: C.white, bold: true,
        align: 'center', valign: 'middle', fontFace: 'Arial'
      });

      s.addText(p.title, {
        x: x + 0.85, y: y + 0.2, w: 3.3, h: 0.4,
        fontSize: 13, color: C.white, bold: true, fontFace: 'Arial'
      });
      s.addText(p.desc, {
        x: x + 0.85, y: y + 0.55, w: 3.3, h: 0.7,
        fontSize: 10, color: C.gray, fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 3: 솔루션 ──────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.darkBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fill: { color: C.accent2 }
    });
    s.addText('02 솔루션', {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fontSize: 10, color: C.darkBg, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('HeartChain이\n문제를 해결합니다', {
      x: 0.5, y: 0.9, w: 9, h: 1.0,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    const solutions = [
      { icon: 'BC', title: '블록체인 기록', desc: '모든 기여가 투명하게\n변조 불가능하게 기록' },
      { icon: 'HRT', title: 'HRT 인센티브', desc: '人头分配로 단체에\n지속적 보상 제공' },
      { icon: 'APP', title: 'APP 관리', desc: '회원과 임무를\n한눈에 관리하는 대시보드' },
      { icon: 'DATA', title: '실시간 데이터', desc: '단체별 성과와\n활성도를 실시간 확인' },
    ];

    solutions.forEach((sol, i) => {
      const x = 0.5 + i * 2.35;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y: 2.1, w: 2.15, h: 2.9,
        fill: { color: C.cardBg },
        rectRadius: 0.1
      });

      // Icon circle
      s.addShape(pptx.shapes.OVAL, {
        x: x + 0.65, y: 2.3, w: 0.85, h: 0.85,
        fill: { color: i % 2 === 0 ? C.accent : C.accent2 }
      });
      s.addText(sol.icon, {
        x: x + 0.65, y: 2.3, w: 0.85, h: 0.85,
        fontSize: i === 1 ? 14 : 12, color: C.white, bold: true,
        align: 'center', valign: 'middle', fontFace: 'Arial'
      });

      s.addText(sol.title, {
        x: x + 0.1, y: 3.3, w: 1.95, h: 0.5,
        fontSize: 12, color: C.white, bold: true,
        align: 'center', fontFace: 'Arial'
      });
      s.addText(sol.desc, {
        x: x + 0.1, y: 3.8, w: 1.95, h: 1.0,
        fontSize: 10, color: C.gray,
        align: 'center', fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 4: HRT 분배 ────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.midBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fill: { color: C.accent }
    });
    s.addText('03 HRT 분배', {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fontSize: 10, color: C.white, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('플랫폼이 성장하면\n단체도 성장합니다', {
      x: 0.5, y: 0.9, w: 9, h: 1.0,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    // Pie chart
    s.addChart(pptx.charts.PIE, [{
      name: 'HRT 분배',
      labels: ['단체 풀 (50%)', '개인 풀 (20%)', '개발자 (30%)'],
      values: [50, 20, 30]
    }], {
      x: 0.3, y: 1.9, w: 4.5, h: 3.4,
      showPercent: true,
      showLegend: true,
      legendPos: 'b',
      chartColors: [C.accent, C.accent2, '5C6BC0']
    });

    // Right side details
    const details = [
      { pct: '50%', label: '단체 풀', desc: '유효회원人头分配\n가입 시 1회성 지급', color: C.accent },
      { pct: '20%', label: '개인 풀', desc: '개인이 유치한\n유효회원人头分配', color: C.accent2 },
      { pct: '30%', label: '개발자', desc: '플랫폼 개발·유지\n위해 개발자 보유', color: '5C6BC0' },
    ];

    details.forEach((d, i) => {
      const y = 2.0 + i * 1.05;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 5.0, y, w: 4.5, h: 0.9,
        fill: { color: C.cardBg },
        rectRadius: 0.08
      });

      // Color bar
      s.addShape(pptx.shapes.RECTANGLE, {
        x: 5.0, y, w: 0.12, h: 0.9,
        fill: { color: d.color }
      });

      s.addText(d.pct, {
        x: 5.25, y: y + 0.08, w: 1.0, h: 0.5,
        fontSize: 22, color: d.color, bold: true, fontFace: 'Arial'
      });
      s.addText(d.label, {
        x: 6.25, y: y + 0.08, w: 1.5, h: 0.4,
        fontSize: 12, color: C.white, bold: true, fontFace: 'Arial'
      });
      s.addText(d.desc, {
        x: 6.25, y: y + 0.45, w: 3.1, h: 0.45,
        fontSize: 9, color: C.gray, fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 5: 단체 혜택 ───────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.darkBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fill: { color: C.accent2 }
    });
    s.addText('04 단체 혜택', {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fontSize: 10, color: C.darkBg, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('단체가 얻는 실질적 혜택', {
      x: 0.5, y: 0.9, w: 9, h: 0.6,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    const benefits = [
      {
        title: '人头费 HRT 지급',
        desc: '자신의 회원을 플랫폼에 가입시키면\n人头수 x 단가로 HRT 지급\n(상장 시점 단가 역산)',
        highlight: '+人头 HRT',
        color: C.accent
      },
      {
        title: '임무완성 장려금 3%',
        desc: '회원이 임무를 완성할 때마다\n임무가치의 3%를 추가 HRT로\n단체 계정에 적립',
        highlight: '+임무 3%',
        color: C.accent2
      },
      {
        title: '임무발행 장려금 10%',
        desc: '단체가 직접 임무를 게시하면\n설정 임무가치의 10%를\n즉시 환급',
        highlight: '+발행 10%',
        color: 'FFB74D'
      },
      {
        title: 'APP 무료 제공',
        desc: '회원이 사용할 수 있는\nAPP과 관리 대시보드를\n무료로 제공',
        highlight: 'APP 무료',
        color: 'AB47BC'
      },
    ];

    benefits.forEach((b, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 0.5 + col * 4.7;
      const y = 1.7 + row * 1.85;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y, w: 4.4, h: 1.7,
        fill: { color: C.cardBg },
        rectRadius: 0.1
      });

      // Top accent
      s.addShape(pptx.shapes.RECTANGLE, {
        x, y, w: 4.4, h: 0.08,
        fill: { color: b.color }
      });

      // Highlight badge
      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 3.2, y: y + 0.2, w: 1.1, h: 0.4,
        fill: { color: b.color, transparency: 20 },
        rectRadius: 0.08
      });
      s.addText(b.highlight, {
        x: x + 3.2, y: y + 0.2, w: 1.1, h: 0.4,
        fontSize: 9, color: b.color, bold: true,
        align: 'center', valign: 'middle', fontFace: 'Arial'
      });

      s.addText(b.title, {
        x: x + 0.2, y: y + 0.2, w: 2.9, h: 0.4,
        fontSize: 13, color: C.white, bold: true, fontFace: 'Arial'
      });
      s.addText(b.desc, {
        x: x + 0.2, y: y + 0.65, w: 4.0, h: 0.95,
        fontSize: 10, color: C.gray, fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 6: 유효회원 기준 ──────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.midBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.5, h: 0.35,
      fill: { color: C.accent }
    });
    s.addText('05 유효회원', {
      x: 0.5, y: 0.4, w: 1.5, h: 0.35,
      fontSize: 10, color: C.white, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('人头 인정 기준은\n간단하고 투명합니다', {
      x: 0.5, y: 0.9, w: 9, h: 1.0,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    // Flow diagram
    const steps = [
      { num: '01', title: '가입 완료', desc: '플랫폼에\n회원으로 가입' },
      { num: '02', title: '6개월内有APP登录', desc: 'APP 접속만\n하면 완료' },
      { num: '03', title: '人头 인정', desc: '유효회원으로\n등록 및 HRT 지급' },
    ];

    steps.forEach((step, i) => {
      const x = 0.5 + i * 3.2;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y: 2.2, w: 2.7, h: 2.0,
        fill: { color: C.cardBg },
        rectRadius: 0.1
      });

      s.addShape(pptx.shapes.OVAL, {
        x: x + 0.9, y: 2.35, w: 0.9, h: 0.9,
        fill: { color: C.accent }
      });
      s.addText(step.num, {
        x: x + 0.9, y: 2.35, w: 0.9, h: 0.9,
        fontSize: 18, color: C.white, bold: true,
        align: 'center', valign: 'middle', fontFace: 'Arial'
      });

      s.addText(step.title, {
        x: x + 0.1, y: 3.35, w: 2.5, h: 0.4,
        fontSize: 13, color: C.white, bold: true,
        align: 'center', fontFace: 'Arial'
      });
      s.addText(step.desc, {
        x: x + 0.1, y: 3.75, w: 2.5, h: 0.5,
        fontSize: 10, color: C.gray,
        align: 'center', fontFace: 'Arial'
      });

      // Arrow
      if (i < 2) {
        s.addText('>>>', {
          x: x + 2.7, y: 3.0, w: 0.5, h: 0.5,
          fontSize: 16, color: C.accent2, bold: true,
          align: 'center', fontFace: 'Arial'
        });
      }
    });

    // Note
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: 4.5, w: 9, h: 0.8,
      fill: { color: C.cardBg },
      rectRadius: 0.08
    });
    s.addText('회원이 임무를 완성하는 것과는 무관합니다. 오직 접속만으로人头가 인정됩니다.', {
      x: 0.7, y: 4.55, w: 8.6, h: 0.7,
      fontSize: 11, color: C.accent2, bold: false,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });
  }

  // ── SLIDE 7: HRT 가치 상승 ───────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.darkBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.5, h: 0.35,
      fill: { color: C.accent2 }
    });
    s.addText('06 HRT 가치', {
      x: 0.5, y: 0.4, w: 1.5, h: 0.35,
      fontSize: 10, color: C.darkBg, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('HRT의 가치는\n플랫폼 활성도에 따라 상승합니다', {
      x: 0.5, y: 0.9, w: 9, h: 1.0,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    // Growth arrow line chart
    s.addChart(pptx.charts.LINE, [{
      name: 'HRT 가치 상승',
      labels: ['런칭', 'Q1', 'Q2', 'Q3', 'Q4', '상장'],
      values: [0, 1, 3, 8, 20, 100]
    }], {
      x: 0.3, y: 1.9, w: 5.5, h: 3.2,
      lineSize: 3,
      lineSmooth: true,
      showCatAxisTitle: false,
      showValAxisTitle: false,
      showLegend: false,
      chartColors: [C.accent],
      valAxisMaxVal: 120,
      lineDataSymbol: 'circle',
      lineDataSymbolSize: 8,
      dataLabelColor: C.white,
    });

    // Right side explanation
    const stages = [
      { label: '런칭初期', val: 'HRT 충전 매체 역할' },
      { label: '회원 확대', val: '충전站 체계 구축' },
      { label: '流动성 확보', val: '거래소 상장 또는 DEX' },
      { label: '상장 완료', val: '현찰로 교환 가능' },
    ];

    stages.forEach((st, i) => {
      const y = 1.95 + i * 0.82;
      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 6.0, y, w: 3.5, h: 0.72,
        fill: { color: C.cardBg },
        rectRadius: 0.08
      });
      s.addShape(pptx.shapes.RECTANGLE, {
        x: 6.0, y, w: 0.1, h: 0.72,
        fill: { color: i === 3 ? C.gold : C.accent2 }
      });
      s.addText(st.label, {
        x: 6.2, y: y + 0.05, w: 3.2, h: 0.35,
        fontSize: 11, color: i === 3 ? C.gold : C.white, bold: true, fontFace: 'Arial'
      });
      s.addText(st.val, {
        x: 6.2, y: y + 0.38, w: 3.2, h: 0.3,
        fontSize: 9, color: C.gray, fontFace: 'Arial'
      });
    });
  }

  // ── SLIDE 8: 계약 요약 ───────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.midBg };

    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fill: { color: C.accent }
    });
    s.addText('07 계약 요약', {
      x: 0.5, y: 0.4, w: 1.2, h: 0.35,
      fontSize: 10, color: C.white, bold: true,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });

    s.addText('파트너십 계약 조건', {
      x: 0.5, y: 0.9, w: 9, h: 0.6,
      fontSize: 28, color: C.white, bold: true, fontFace: 'Arial'
    });

    const terms = [
      { left: '계약 기간', right: '3년 (갱신 가능)' },
      { left: '단체 풀 HRT', right: '50% (人头分配)' },
      { left: '개인 풀 HRT', right: '20% (人头分配)' },
      { left: '개발자 보유', right: '30%' },
      { left: '人头 인정 기준', right: '가입 + 6개월内有APP 접속' },
      { left: '임무완성 장려금', right: '임무가치의 3%' },
      { left: '임무발행 장려금', right: '임무가치의 10%' },
      { left: '1인당 단가', right: '상장 시점 역산 (분자50%/분모人头合)' },
      { left: 'HRT 교환', right: '流动성 확보 후 교환 가능' },
    ];

    const tableData = [
      [
        { text: '항목', options: { fill: { color: C.accent }, color: C.white, bold: true } },
        { text: '내용', options: { fill: { color: C.accent }, color: C.white, bold: true } }
      ],
      ...terms.map((t, i) => [
        { text: t.left, options: { fill: { color: i % 2 === 0 ? C.cardBg : '253655' }, color: C.white, bold: true } },
        { text: t.right, options: { fill: { color: i % 2 === 0 ? C.cardBg : '253655' }, color: C.gray } }
      ])
    ];

    s.addTable(tableData, {
      x: 0.5, y: 1.65, w: 9, h: 3.6,
      colW: [2.8, 6.2],
      border: { pt: 0.5, color: '2D3F60' },
      fontFace: 'Arial',
      fontSize: 11,
      valign: 'middle',
      align: 'left',
    });
  }

  // ── SLIDE 9: CTA ─────────────────────────────────────────────
  {
    const s = pptx.addSlide();
    s.background = { color: C.darkBg };

    // Big CTA
    s.addText('자원봉사 단체의\n미래, HeartChain과\n함께 쓰십시오', {
      x: 0.5, y: 0.8, w: 9, h: 2.0,
      fontSize: 34, color: C.white, bold: true, fontFace: 'Arial',
      lineSpacing: 44
    });

    // Accent line
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: 2.9, w: 2.0, h: 0.06,
      fill: { color: C.accent }
    });

    s.addText('계약 체결 및 자세한 내용은 아래 연락처로 문의주세요', {
      x: 0.5, y: 3.05, w: 9, h: 0.5,
      fontSize: 14, color: C.gray, fontFace: 'Arial'
    });

    // Contact cards
    const contacts = [
      { label: '플랫폼', val: 'HeartChain APP' },
      { label: '연락처', val: 'contact@heartchain.io' },
      { label: '토큰', val: 'HRT (Heart Token)' },
    ];

    contacts.forEach((c, i) => {
      const x = 0.5 + i * 3.1;
      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x, y: 3.7, w: 2.9, h: 1.2,
        fill: { color: C.cardBg },
        rectRadius: 0.1
      });
      s.addText(c.label, {
        x, y: 3.8, w: 2.9, h: 0.4,
        fontSize: 10, color: C.gray,
        align: 'center', fontFace: 'Arial'
      });
      s.addText(c.val, {
        x, y: 4.15, w: 2.9, h: 0.55,
        fontSize: 14, color: C.accent2, bold: true,
        align: 'center', fontFace: 'Arial'
      });
    });

    // Bottom bar
    s.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 5.4, w: 10, h: 0.225,
      fill: { color: C.accent }
    });
    s.addText('HeartChain — 자원봉사 블록체인 플랫폼 — 블록체인으로 기록하고, HRT로 보답합니다', {
      x: 0, y: 5.4, w: 10, h: 0.225,
      fontSize: 8, color: C.white,
      align: 'center', valign: 'middle', fontFace: 'Arial'
    });
  }
}

main().catch(e => { console.error(e); process.exit(1); });
