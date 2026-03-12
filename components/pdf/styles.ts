// Theme colors based on age band
export const THEMES = {
  'K-2': {
    primary: '#FF6B35',
    primaryLight: '#FFF0E8',
    secondary: '#4ECDC4',
    secondaryLight: '#E8FAF8',
    accent: '#FFE66D',
    accentLight: '#FFFDE8',
    purple: '#A78BFA',
    purpleLight: '#F0EBFF',
    pink: '#F472B6',
    pinkLight: '#FDF0F5',
    green: '#34D399',
    greenLight: '#ECFDF5',
    text: '#1E293B',
    textSecondary: '#64748B',
    bg: '#FFFFFF',
    pageBg: '#FAFBFF',
    border: '#E2E8F0',
    cardColors: ['#FFF0E8', '#E8FAF8', '#FFFDE8', '#F0EBFF', '#FDF0F5', '#ECFDF5'],
    cardBorders: ['#FFB088', '#7EDDD6', '#FFE66D', '#C4B5FD', '#F9A8D4', '#6EE7B7'],
  },
  '3-5': {
    primary: '#0D9488',
    primaryLight: '#F0FDFA',
    secondary: '#F97316',
    secondaryLight: '#FFF7ED',
    accent: '#6366F1',
    accentLight: '#EEF2FF',
    text: '#0F172A',
    textSecondary: '#475569',
    bg: '#FFFFFF',
    pageBg: '#F8FAFC',
    border: '#CBD5E1',
    cardColors: ['#F0FDFA', '#FFF7ED', '#EEF2FF', '#FEF2F2', '#F0FDF4', '#FDF4FF'],
    cardBorders: ['#5EEAD4', '#FDBA74', '#A5B4FC', '#FCA5A5', '#86EFAC', '#E9D5FF'],
  },
  '6-8': {
    primary: '#1E40AF',
    primaryLight: '#EFF6FF',
    secondary: '#DC2626',
    secondaryLight: '#FEF2F2',
    accent: '#059669',
    accentLight: '#ECFDF5',
    text: '#0F172A',
    textSecondary: '#475569',
    bg: '#FFFFFF',
    pageBg: '#F8FAFC',
    border: '#CBD5E1',
    cardColors: ['#EFF6FF', '#FEF2F2', '#ECFDF5', '#FDF4FF', '#FFFBEB', '#F0F9FF'],
    cardBorders: ['#93C5FD', '#FCA5A5', '#6EE7B7', '#E9D5FF', '#FDE68A', '#7DD3FC'],
  },
};

export function getTheme(ageBand: string) {
  if (ageBand?.includes('6') || ageBand?.includes('7') || ageBand?.includes('8')) return THEMES['6-8'];
  if (ageBand?.includes('3') || ageBand?.includes('4') || ageBand?.includes('5')) return THEMES['3-5'];
  return THEMES['K-2'];
}

export const PACK_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

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
    padding: 0.35in 0.55in 0.25in;
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
    font-size: 26px;
    color: var(--text);
    margin: 0 0 20px;
    padding-bottom: 10px;
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
  .vocab-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }
  .vocab-card {
    border: 2px solid var(--card-border, var(--border));
    border-radius: 20px;
    background: var(--card-bg, #fff);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 200px;
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
    max-height: 120px;
    object-fit: contain;
    border-radius: 14px;
    margin-bottom: 14px;
  }

  /* === SENTENCE FRAMES === */
  .frames-list { display: grid; gap: 14px; }
  .frame-card {
    display: grid;
    grid-template-columns: 44px 1fr;
    gap: 14px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--bg);
    padding: 18px;
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
  }
  .ws-instructions-l2 {
    font-size: 14px;
    line-height: 1.6;
    color: var(--primary);
    font-style: italic;
    margin-bottom: 20px;
  }
  .ws-items { display: grid; gap: 16px; }
  .ws-item {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 14px;
    align-items: start;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
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
  .minibook-grid-new { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .minibook-card {
    border: 2px dashed var(--border);
    border-radius: 18px;
    background: var(--bg);
    padding: 18px;
    min-height: 195px;
    display: flex;
    flex-direction: column;
  }
  .minibook-num {
    font-size: 11px;
    font-weight: 800;
    color: var(--primary);
    text-align: right;
    margin-bottom: 8px;
  }
  .minibook-text { flex: 1; }
  .minibook-text .text-en {
    font-family: 'Nunito', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 6px;
    line-height: 1.5;
  }
  .minibook-text .text-l2 {
    font-size: 14px;
    color: var(--primary);
    line-height: 1.5;
  }
  .minibook-illust {
    margin-top: 10px;
    height: 60px;
    border: 2px dashed var(--card-border, #ddd);
    border-radius: 12px;
    background: var(--primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: var(--text-secondary);
    font-style: italic;
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
`;
