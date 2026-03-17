// Theme colors based on age band
// K-2: Claymorphism 粘土糖果风 — 粉嫩、柔和、马卡龙色
// 3-5: Neubrutalism 新野兽派 — 高饱和、高对比、活力
// 6-8: Clean Modern 简约成熟 — 专业、冷静、可信
export const THEMES = {
  'K-2': {
    primary: '#FF6B8A',
    primaryLight: '#FFF0F3',
    secondary: '#7DD3C0',
    secondaryLight: '#EDFAF6',
    accent: '#FFD166',
    accentLight: '#FFFDE8',
    purple: '#B8A9E8',
    purpleLight: '#F3F0FF',
    pink: '#FFB5C8',
    pinkLight: '#FFF0F5',
    green: '#7DD3A8',
    greenLight: '#F0FDF7',
    text: '#2D2D3F',
    textSecondary: '#6B7280',
    bg: '#FFFDF7',
    pageBg: '#FFFDF7',
    border: '#F0E6E0',
    cardColors: ['#FFF0F3', '#EDFAF6', '#FFFDE8', '#F3F0FF', '#FFF0F5', '#F0FDF7'],
    cardBorders: ['#FFB5C8', '#7DD3C0', '#FFD166', '#B8A9E8', '#FFB5C8', '#7DD3A8'],
  },
  '3-5': {
    primary: '#FF5252',
    primaryLight: '#FFF0F0',
    secondary: '#2196F3',
    secondaryLight: '#E8F4FD',
    accent: '#FFEB3B',
    accentLight: '#FFFDE7',
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    bg: '#FFFDE7',
    pageBg: '#FFFDE7',
    border: '#2D2D2D',
    cardColors: ['#FFF0F0', '#E8F4FD', '#FFFDE7', '#E8F5E9', '#F3E5F5', '#FFF3E0'],
    cardBorders: ['#FF5252', '#2196F3', '#FFC107', '#4CAF50', '#9C27B0', '#FF9800'],
  },
  '6-8': {
    primary: '#1E40AF',
    primaryLight: '#EFF6FF',
    secondary: '#0D9488',
    secondaryLight: '#F0FDFA',
    accent: '#F59E0B',
    accentLight: '#FFFBEB',
    text: '#0F172A',
    textSecondary: '#475569',
    bg: '#FFFFFF',
    pageBg: '#F8FAFC',
    border: '#CBD5E1',
    cardColors: ['#EFF6FF', '#F0FDFA', '#FFFBEB', '#F5F3FF', '#FEF2F2', '#F0F9FF'],
    cardBorders: ['#93C5FD', '#5EEAD4', '#FDE68A', '#C4B5FD', '#FCA5A5', '#7DD3FC'],
  },
};

export function getTheme(ageBand: string) {
  if (ageBand?.includes('6') || ageBand?.includes('7') || ageBand?.includes('8')) return THEMES['6-8'];
  if (ageBand?.includes('3') || ageBand?.includes('4') || ageBand?.includes('5')) return THEMES['3-5'];
  return THEMES['K-2'];
}

export const PACK_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Baloo+2:wght@400;500;600;700;800&family=Comic+Neue:wght@300;400;700&family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

  @page { size: Letter; margin: 0; }
  @media print { @page { size: Letter; margin: 0; } }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body.pack-body {
    margin: 0;
    background: #F1F5F9;
    color: var(--text);
    font-family: 'Inter', system-ui, sans-serif;
  }

  /* === PAGE FRAME === */
  .pdf-page {
    position: relative;
    width: 8.5in;
    min-height: 11in;
    background: var(--bg);
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .pdf-page:last-child { border-bottom: none; }

  /* Brand bar at top */
  .brand-bar {
    height: 6px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary, var(--primary)) 50%, var(--accent, var(--primary)) 100%);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0.55in;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .page-header .brand-name {
    font-weight: 800;
    color: var(--primary);
    font-size: 12px;
    letter-spacing: 0.04em;
  }

  .page-content {
    flex: 1;
    padding: 0.2in 0.5in 0.15in;
    position: relative;
    z-index: 1;
  }

  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0.55in;
    font-size: 10px;
    color: var(--text-secondary);
    border-top: 1px solid var(--border);
  }
  .page-footer .site-url {
    font-weight: 600;
    color: var(--primary);
  }

  /* === WATERMARK (sample) === */
  .watermark {
    position: absolute;
    bottom: 1.2in;
    right: 0.4in;
    font-size: 14px;
    font-weight: 700;
    color: rgba(0,0,0,0.06);
    transform: rotate(-12deg);
    pointer-events: none;
    z-index: 0;
    letter-spacing: 0.05em;
  }

  /* Sample CTA banner */
  .sample-cta {
    background: linear-gradient(135deg, var(--primary), var(--secondary, var(--primary)));
    color: white;
    text-align: center;
    padding: 14px 0.55in;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .sample-cta a { color: white; text-decoration: underline; }

  /* === TYPOGRAPHY === */
  h1 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 900;
    font-size: 36px;
    line-height: 1.15;
    color: var(--text);
    margin: 0 0 12px;
  }
  h2.section-title {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 800;
    font-size: 22px;
    color: var(--text);
    margin: 0 0 12px;
    padding-bottom: 6px;
    border-bottom: 3px solid var(--primary);
    display: inline-block;
  }
  h3 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: var(--text);
  }

  /* === COVER PAGE === */
  .cover-page {
    display: flex;
    flex-direction: column;
    min-height: 9.2in;
  }
  .cover-hero {
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light, var(--primary-light)) 100%);
    border-radius: 24px;
    padding: 40px;
    margin-bottom: 24px;
    border: 2px solid var(--border);
    text-align: center;
  }
  .cover-hero .eyebrow {
    display: inline-block;
    background: var(--primary);
    color: white;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 16px;
    border-radius: 100px;
    margin-bottom: 18px;
  }
  .cover-hero h1 { font-size: 38px; margin-bottom: 14px; }
  .cover-hero .lead {
    font-size: 16px;
    line-height: 1.65;
    color: var(--text-secondary);
    max-width: 85%;
    margin: 0 auto;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .meta-pill {
    background: var(--primary-light);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 14px 16px;
    text-align: center;
  }
  .meta-pill .meta-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--primary);
    margin-bottom: 6px;
  }
  .meta-pill .meta-value {
    display: block;
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 800;
    color: var(--text);
  }

  .cover-includes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    flex: 1;
  }
  .cover-includes-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
  }
  .cover-includes-box h3 {
    font-size: 15px;
    margin-bottom: 12px;
    color: var(--primary);
  }
  .cover-includes-box ul {
    list-style: none;
    padding: 0;
  }
  .cover-includes-box li {
    font-size: 14px;
    line-height: 1.8;
    padding-left: 20px;
    position: relative;
    color: var(--text-secondary);
  }
  .cover-includes-box li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 700;
  }
  .cover-includes-box p {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
  }

  /* === VOCABULARY CARDS === */
  .vocab-container {
    width: 100%;
  }
  .vocab-row {
    display: flex;
    width: 100%;
  }
  .vocab-cell {
    flex: 1;
    display: flex;
    align-items: stretch;
    position: relative;
  }

  /* ✂️ Horizontal cut line between rows */
  .cut-line-h {
    display: flex;
    align-items: center;
    padding: 4px 0;
    margin: 2px 0;
  }
  .cut-line-scissors {
    font-size: 16px;
    color: #999;
    margin-right: 6px;
    flex-shrink: 0;
  }
  .cut-line-dash {
    flex: 1;
    height: 0;
    border-top: 2px dashed #BBBBBB;
  }

  /* ✂️ Vertical cut line between columns */
  .cut-line-v {
    width: 0;
    align-self: stretch;
    border-left: 2px dashed #BBBBBB;
    margin: 8px 2px;
    flex-shrink: 0;
  }

  .vocab-card {
    border: 2px solid var(--card-border, var(--border));
    border-radius: 18px;
    background: var(--card-bg, #fff);
    padding: 14px;
    margin: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 180px;
    flex: 1;
  }
  .vocab-card .card-num {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--primary);
    margin-bottom: 10px;
  }
  .vocab-card .illust-area {
    width: 100%;
    height: 100px;
    border-radius: 14px;
    background: var(--card-bg, #f8f8f8);
    border: 2px dashed var(--card-border, #ddd);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--text-secondary);
    margin-bottom: 14px;
    font-style: italic;
  }
  .vocab-card .word-en {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 24px;
    font-weight: 900;
    color: var(--text);
    margin-bottom: 4px;
  }
  .vocab-card .word-l2 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary);
  }
  .vocab-img {
    width: 100%;
    max-height: 140px;
    object-fit: contain;
    border-radius: 12px;
    margin-bottom: 8px;
  }

  /* === SENTENCE FRAMES === */
  .frames-list { display: grid; gap: 10px; }
  .frame-card {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 10px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg);
    padding: 14px;
    border-left: 4px solid var(--primary);
  }
  .frame-num {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    font-weight: 800;
    font-size: 16px;
    font-family: 'Nunito', system-ui, sans-serif;
  }
  .frame-card h3 { font-size: 17px; margin-bottom: 4px; }
  .frame-card p { font-size: 15px; color: var(--primary); margin-top: 4px; }

  /* === WORKSHEETS === */
  .ws-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    page-break-inside: avoid;
    page-break-after: avoid;
  }
  .ws-type-badge {
    display: inline-block;
    background: var(--primary);
    color: white;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 12px;
    border-radius: 100px;
    margin-top: 4px;
    margin-left: 10px;
    vertical-align: middle;
  }
  .ws-name-box {
    font-size: 14px;
    color: var(--text-secondary);
    border-bottom: 2px solid var(--text);
    padding-bottom: 4px;
    min-width: 200px;
  }
  .ws-instructions {
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 6px;
    page-break-after: avoid;
  }
  .ws-instructions-l2 {
    font-size: 14px;
    line-height: 1.6;
    color: var(--primary);
    font-style: italic;
    margin-bottom: 20px;
    page-break-after: avoid;
  }
  .ws-items { display: grid; gap: 12px; }
  .ws-item {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 10px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    background: var(--bg);
  }
  .ws-item-num {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 800;
    font-size: 18px;
    font-family: 'Nunito', system-ui, sans-serif;
  }
  .ws-item-content strong {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 18px;
    display: block;
  }
  .ws-item-content .ws-l2 {
    font-size: 15px;
    color: var(--primary);
    margin: 4px 0 12px;
  }
  .ws-write-line {
    height: 20px;
    border-bottom: 2px dotted var(--border);
    margin-top: 8px;
  }

  /* Matching worksheet: grid with images */
  .ws-matching-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .ws-matching-item {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 12px;
    background: var(--bg);
    text-align: center;
  }
  .ws-matching-item .ws-item-num {
    margin: 0 auto 8px;
  }
  .ws-matching-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 10px;
    margin-bottom: 8px;
  }
  .ws-matching-item strong {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 16px;
    display: block;
  }
  .ws-matching-item .ws-write-line {
    margin-top: 6px;
  }

  /* Coloring worksheet: large images */
  .ws-coloring-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .ws-coloring-item {
    border: 2px dashed var(--border);
    border-radius: 14px;
    padding: 10px;
    background: #fff;
    text-align: center;
  }
  .ws-coloring-img {
    width: 100%;
    max-height: 180px;
    object-fit: contain;
    border-radius: 10px;
    margin-bottom: 6px;
  }
  .ws-coloring-placeholder {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed var(--border);
    border-radius: 10px;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }
  .ws-coloring-label {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
  }
  .ws-coloring-label span {
    font-weight: 400;
    color: var(--primary);
  }

  /* Tracing worksheet: dotted text */
  .ws-tracing-item {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 10px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    background: var(--bg);
  }
  .ws-tracing-word {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 4px;
  }
  .ws-tracing-dotted {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: transparent;
    -webkit-text-stroke: 1px var(--border);
    letter-spacing: 2px;
    margin-bottom: 4px;
  }

  /* === LABELS === */
  .labels-grid-new { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .label-card-new {
    border: 3px solid var(--card-border, var(--border));
    border-radius: 20px;
    background: var(--card-bg, #fff);
    padding: 28px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 110px;
  }
  .label-card-new .label-en {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 900;
    color: var(--text);
    margin-bottom: 6px;
  }
  .label-card-new .label-l2 {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--primary);
  }
  .label-card-new .label-cat {
    margin-top: 10px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }

  /* === MINI BOOK === */
  .minibook-grid-new { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .minibook-card {
    border: 2px dashed var(--border);
    border-radius: 14px;
    background: var(--bg);
    padding: 14px;
    min-height: 240px;
    display: flex;
    flex-direction: column;
  }
  .minibook-num {
    font-size: 11px;
    font-weight: 800;
    color: var(--primary);
    text-align: right;
    margin-bottom: 6px;
  }
  .minibook-text { flex: 1; }
  .minibook-text .text-en {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
    line-height: 1.45;
  }
  .minibook-text .text-l2 {
    font-size: 13px;
    color: var(--primary);
    line-height: 1.45;
  }
  .minibook-illust {
    margin-top: 8px;
    min-height: 50px;
    max-height: 140px;
    border: 2px dashed var(--card-border, #ddd);
    border-radius: 10px;
    background: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--text-secondary);
    font-style: italic;
    overflow: hidden;
  }
  .minibook-illust img {
    width: auto;
    height: 132px;
    object-fit: contain;
    border-radius: 8px;
  }

  /* === DIALOGUE STRIPS === */
  .dialogue-list { display: grid; gap: 14px; }
  .dialogue-card {
    border: 1px dashed var(--border);
    border-radius: 16px;
    background: var(--bg);
    padding: 16px;
  }
  .dialogue-ctx {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--primary);
    margin-bottom: 10px;
  }
  .dialogue-speakers { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .spk { display: flex; gap: 10px; align-items: flex-start; }
  .spk-badge {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; font-weight: 800; font-size: 13px; flex-shrink: 0;
  }
  .spk-a .spk-badge { background: #E0D5F5; color: #5B3E9E; }
  .spk-b .spk-badge { background: #D5EEE0; color: #2E7D4F; }
  .spk strong { font-size: 15px; display: block; }
  .spk p { font-size: 13px; color: var(--primary); margin-top: 2px; }

  /* === TEACHER NOTES === */
  .notes-grid { display: grid; gap: 14px; }
  .note-section {
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    background: var(--bg);
  }
  .note-section h3 {
    font-size: 15px;
    color: var(--primary);
    margin-bottom: 10px;
  }
  .note-section p, .note-section li {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
  }
  .note-section ul { padding-left: 18px; }
  .note-section li { margin-bottom: 4px; }

  /* === ANSWER KEY === */
  .answer-list { display: grid; gap: 14px; }
  .ak-section {
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    background: var(--bg);
  }
  .ak-section h3 { font-size: 15px; color: var(--primary); margin-bottom: 12px; }
  .ak-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .ak-item {
    background: var(--primary-light);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
  }
  .ak-item strong { color: var(--text); margin-right: 6px; }
  .ak-item span { color: var(--text-secondary); }

  /* === PARENT NOTES === */
  .parent-notes-list { display: grid; gap: 16px; }
  .pn-card {
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    background: var(--bg);
  }
  .pn-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .pn-header strong { font-size: 16px; }
  .pn-type-badge {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--primary);
    background: var(--primary-light);
    padding: 3px 10px; border-radius: 100px;
  }
  .pn-card p { font-size: 14px; line-height: 1.7; color: var(--text-secondary); }
  .pn-translated {
    margin-top: 14px; padding-top: 14px;
    border-top: 1px dashed var(--border);
  }
  .pn-sig { margin-top: 14px; font-size: 13px; color: var(--text-secondary); }
  .pn-response { margin-top: 14px; padding-top: 12px; border-top: 1px dashed var(--border); }

  /* === SPEAKING PROMPTS / ROUTINE / RULES === */
  .prompt-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .prompt-card {
    border: 2px solid var(--card-border, var(--border));
    border-radius: 20px;
    background: var(--card-bg, #fff);
    padding: 18px;
    min-height: 160px;
  }
  .prompt-card .card-num { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--primary); margin-bottom: 8px; }
  .prompt-card h3 { font-size: 17px; margin-bottom: 4px; }
  .prompt-card p { font-size: 15px; color: var(--primary); margin-top: 2px; }
  .prompt-card .visual-cue {
    margin-top: 10px; font-size: 11px; font-style: italic; color: var(--text-secondary);
    border-top: 1px dashed var(--border); padding-top: 8px;
  }

  .routine-grid-new { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .routine-card-new {
    border: 2px solid var(--border); border-radius: 20px; background: var(--bg);
    padding: 18px; text-align: center;
  }
  .routine-card-new .time-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--primary); margin-bottom: 6px; }
  .routine-card-new .icon-area {
    width: 60px; height: 60px; margin: 0 auto 10px;
    border-radius: 50%; background: var(--primary-light);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: var(--text-secondary);
  }
  .routine-card-new h3 { font-size: 17px; margin-bottom: 2px; }
  .routine-card-new p { font-size: 15px; color: var(--primary); }

  .rules-list { display: grid; gap: 14px; }
  .rule-card {
    display: grid; grid-template-columns: 50px 1fr; gap: 16px; align-items: center;
    border: 2px solid var(--border); border-radius: 20px; background: var(--bg); padding: 20px;
  }
  .rule-num {
    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
    border-radius: 50%; background: var(--primary); color: white;
    font-weight: 900; font-size: 22px; font-family: 'Nunito', system-ui, sans-serif;
  }
  .rule-card h3 { font-size: 17px; margin-bottom: 2px; }
  .rule-card p { font-size: 15px; color: var(--primary); }

  /* === TERMS OF USE === */
  .terms-grid { display: grid; gap: 14px; }
  .terms-section {
    border: 1px solid var(--border); border-radius: 16px; padding: 18px; background: var(--bg);
  }
  .terms-section h3 { font-size: 15px; color: var(--primary); margin-bottom: 10px; }
  .terms-section p, .terms-section li { font-size: 14px; line-height: 1.7; color: var(--text-secondary); }
  .terms-section ul { padding-left: 18px; }
  .terms-section li { margin-bottom: 4px; }

  /* === COMPACT TERMS (合并到其他页面底部) === */
  .terms-compact {
    margin-top: 24px;
    padding-top: 14px;
    border-top: 2px dashed var(--border);
  }
  .terms-compact-title {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 800;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .terms-compact-body {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 11px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .terms-compact-body span {
    white-space: nowrap;
  }

  /* ============================================================
     AGE-BAND SPECIFIC OVERRIDES
     K-2: Claymorphism 粘土糖果风 (Fredoka + Nunito)
     3-5: Neubrutalism 新野兽派 (Baloo 2 + Comic Neue)
     6-8: Clean Modern 简约成熟风 (Inter + Nunito)
     ============================================================ */

  /* === K-2: CLAYMORPHISM === */
  body.age-k2 {
    font-family: 'Nunito', system-ui, sans-serif;
  }
  body.age-k2 h1,
  body.age-k2 h2.section-title,
  body.age-k2 h3,
  body.age-k2 .vocab-card .word-en,
  body.age-k2 .vocab-card .word-l2,
  body.age-k2 .label-card-new .label-en,
  body.age-k2 .label-card-new .label-l2,
  body.age-k2 .meta-pill .meta-value,
  body.age-k2 .frame-num,
  body.age-k2 .ws-item-num,
  body.age-k2 .rule-num {
    font-family: 'Fredoka', 'Nunito', system-ui, sans-serif;
  }

  body.age-k2 .brand-bar {
    height: 8px;
    border-radius: 0 0 4px 4px;
    background: linear-gradient(90deg, #FF6B8A, #FFD166, #7DD3C0, #B8A9E8, #FFB5C8);
  }

  body.age-k2 .vocab-card {
    border-width: 3px;
    border-radius: 24px;
    box-shadow:
      inset -2px -2px 6px rgba(0,0,0,0.05),
      4px 4px 12px rgba(0,0,0,0.07);
  }
  body.age-k2 .vocab-card .illust-area {
    border-radius: 18px;
  }
  body.age-k2 .cover-hero { border-radius: 28px; }
  body.age-k2 .meta-pill { border-radius: 20px; }
  body.age-k2 .cover-includes-box { border-radius: 20px; }
  body.age-k2 .frame-card { border-radius: 18px; border-left-width: 5px; }
  body.age-k2 .ws-item { border-radius: 18px; }
  body.age-k2 .label-card-new {
    border-width: 3px;
    border-radius: 24px;
    box-shadow:
      inset -2px -2px 6px rgba(0,0,0,0.05),
      4px 4px 12px rgba(0,0,0,0.07);
  }
  body.age-k2 .prompt-card {
    border-width: 3px;
    border-radius: 24px;
    box-shadow:
      inset -2px -2px 6px rgba(0,0,0,0.05),
      4px 4px 12px rgba(0,0,0,0.07);
  }
  body.age-k2 .minibook-card { border-radius: 18px; }
  body.age-k2 .dialogue-card { border-radius: 20px; }
  body.age-k2 .note-section { border-radius: 20px; }
  body.age-k2 .ak-section { border-radius: 20px; }
  body.age-k2 .terms-section { border-radius: 20px; }
  body.age-k2 .routine-card-new { border-radius: 24px; }
  body.age-k2 .rule-card { border-radius: 24px; }
  body.age-k2 .pn-card { border-radius: 20px; }

  body.age-k2 .cut-line-dash { border-top-style: dotted; }

  body.age-k2 .frame-num,
  body.age-k2 .ws-item-num,
  body.age-k2 .rule-num {
    box-shadow: 2px 2px 6px rgba(0,0,0,0.08);
  }

  /* === 3-5: NEUBRUTALISM === */
  body.age-35 {
    font-family: 'Comic Neue', 'Nunito', system-ui, sans-serif;
  }
  body.age-35 h1,
  body.age-35 h2.section-title,
  body.age-35 h3,
  body.age-35 .vocab-card .word-en,
  body.age-35 .vocab-card .word-l2,
  body.age-35 .label-card-new .label-en,
  body.age-35 .label-card-new .label-l2,
  body.age-35 .meta-pill .meta-value,
  body.age-35 .frame-num,
  body.age-35 .ws-item-num,
  body.age-35 .rule-num {
    font-family: 'Baloo 2', 'Nunito', system-ui, sans-serif;
  }

  body.age-35 .brand-bar {
    height: 8px;
    background: repeating-linear-gradient(
      90deg,
      #FF5252 0%, #FF5252 25%,
      #2196F3 25%, #2196F3 50%,
      #FFEB3B 50%, #FFEB3B 75%,
      #4CAF50 75%, #4CAF50 100%
    );
  }

  body.age-35 .vocab-card {
    border: 3px solid #2D2D2D;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2D2D2D;
  }
  body.age-35 .vocab-card .illust-area {
    border: 2px solid #2D2D2D;
    border-radius: 12px;
  }
  body.age-35 .cover-hero {
    border: 3px solid #2D2D2D;
    border-radius: 20px;
    box-shadow: 5px 5px 0px #2D2D2D;
  }
  body.age-35 .meta-pill {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .cover-includes-box {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .frame-card {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    border-left: 5px solid var(--primary);
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .ws-item {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .label-card-new {
    border: 3px solid #2D2D2D;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2D2D2D;
  }
  body.age-35 .prompt-card {
    border: 3px solid #2D2D2D;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2D2D2D;
  }
  body.age-35 .minibook-card {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .dialogue-card {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .note-section {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .ak-section {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .terms-section {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }
  body.age-35 .routine-card-new {
    border: 2px solid #2D2D2D;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2D2D2D;
  }
  body.age-35 .rule-card {
    border: 2px solid #2D2D2D;
    border-radius: 16px;
    box-shadow: 4px 4px 0px #2D2D2D;
  }
  body.age-35 .pn-card {
    border: 2px solid #2D2D2D;
    border-radius: 14px;
    box-shadow: 3px 3px 0px #2D2D2D;
  }

  body.age-35 .cut-line-dash { border-top: 3px dashed #2D2D2D; }
  body.age-35 .cut-line-v { border-left: 3px dashed #2D2D2D; }

  body.age-35 .page-header { border-bottom: 2px solid #2D2D2D; }
  body.age-35 .page-footer { border-top: 2px solid #2D2D2D; }

  body.age-35 h2.section-title {
    border-bottom: 4px solid var(--primary);
  }

  body.age-35 .frame-num,
  body.age-35 .ws-item-num {
    border: 2px solid #2D2D2D;
    box-shadow: 2px 2px 0px #2D2D2D;
  }
  body.age-35 .rule-num {
    border: 2px solid #2D2D2D;
    box-shadow: 2px 2px 0px #2D2D2D;
  }

  body.age-35 .ws-type-badge {
    border: 2px solid #2D2D2D;
    box-shadow: 2px 2px 0px #2D2D2D;
  }
  body.age-35 .cover-hero .eyebrow {
    border: 2px solid #2D2D2D;
    box-shadow: 2px 2px 0px #2D2D2D;
  }

  /* === 6-8: CLEAN MODERN === */
  body.age-68 {
    font-family: 'Inter', system-ui, sans-serif;
  }
  body.age-68 h1,
  body.age-68 h2.section-title,
  body.age-68 h3 {
    font-family: 'Nunito', 'Inter', system-ui, sans-serif;
  }

  body.age-68 .brand-bar {
    height: 4px;
    background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
  }

  body.age-68 .vocab-card {
    border-width: 1.5px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  body.age-68 .vocab-card .illust-area {
    border-radius: 10px;
  }
  body.age-68 .cover-hero { border-radius: 16px; border-width: 1.5px; }
  body.age-68 .meta-pill { border-radius: 12px; }
  body.age-68 .cover-includes-box { border-radius: 12px; }
  body.age-68 .frame-card { border-radius: 10px; }
  body.age-68 .ws-item { border-radius: 10px; }
  body.age-68 .label-card-new {
    border-width: 2px;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  body.age-68 .prompt-card {
    border-width: 2px;
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }
  body.age-68 .minibook-card { border-radius: 10px; }
  body.age-68 .dialogue-card { border-radius: 12px; }
  body.age-68 .note-section { border-radius: 12px; }
  body.age-68 .ak-section { border-radius: 12px; }
  body.age-68 .terms-section { border-radius: 12px; }
  body.age-68 .routine-card-new { border-radius: 14px; }
  body.age-68 .rule-card { border-radius: 14px; }
  body.age-68 .pn-card { border-radius: 12px; }

  body.age-68 .vocab-card .word-en { font-size: 22px; }
  body.age-68 .vocab-card .word-l2 { font-size: 18px; }
  body.age-68 .label-card-new .label-en { font-size: 26px; }
  body.age-68 .label-card-new .label-l2 { font-size: 20px; }
`;
