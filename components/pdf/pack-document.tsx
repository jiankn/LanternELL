import type {
  AnswerKey, ClassroomLabel, ClassroomRule, DialogueStrip, MiniBook,
  PackContent, ParentNote, SentenceFrame, SpeakingPrompt, TeacherNotes,
  VisualRoutineCard, VocabularyItem, WorksheetItem,
} from '@/lib/content-schema';
import { getTheme, PACK_STYLES } from './styles';
import { PageSections } from './page-sections';

export interface PackDocumentResource {
  id: string; slug: string; title: string; description: string | null;
  pack_type: string; topic: string | null; age_band: string | null; language_pair: string | null;
}
interface PackDocumentProps {
  content: PackContent; resource: PackDocumentResource;
  mode: 'final' | 'sample'; renderedAt: string; sampleWatermarkText?: string;
}

const VOCAB_PER_PAGE = 4;
const FRAMES_PER_PAGE = 6;
const LABELS_PER_PAGE = 8;
const DIALOGUE_PER_PAGE = 5;
const SPEAKING_PER_PAGE = 6;
const ROUTINE_PER_PAGE = 6;
const RULES_PER_PAGE = 6;
const ANSWER_KEY_PER_PAGE = 2;

export function PackDocument({ content, resource, mode, renderedAt, sampleWatermarkText }: PackDocumentProps) {
  const ageBand = content.age_band || resource.age_band || 'K-2';
  const theme = getTheme(ageBand);
  const cssVars = `
    :root {
      --primary: ${theme.primary}; --primary-light: ${theme.primaryLight};
      --secondary: ${theme.secondary}; --secondary-light: ${theme.secondaryLight};
      --accent: ${theme.accent || theme.primary}; --accent-light: ${theme.accentLight || theme.primaryLight};
      --text: ${theme.text}; --text-secondary: ${theme.textSecondary};
      --bg: ${theme.bg}; --page-bg: ${theme.pageBg}; --border: ${theme.border};
    }
  `;

  const pageBodies: Array<{ title: string; body: React.ReactNode }> = [];
  pageBodies.push({ title: 'Cover', body: <CoverPage content={content} resource={resource} /> });

  if (content.vocabulary?.length) {
    chunk(content.vocabulary, VOCAB_PER_PAGE).forEach((items, i) => {
      const colors = theme.cardColors || [];
      const borders = theme.cardBorders || [];
      pageBodies.push({
        title: `Vocabulary Cards ${i + 1}`,
        body: <PageSections.VocabularyCards items={items} cardColors={colors} cardBorders={borders} pageIndex={i} />,
      });
    });
  }
  if (content.sentence_frames?.length) {
    chunk(content.sentence_frames, FRAMES_PER_PAGE).forEach((items, i) => {
      pageBodies.push({ title: `Sentence Frames ${i + 1}`, body: <PageSections.SentenceFrames items={items} /> });
    });
  }
  if (content.dialogue_strips?.length) {
    chunk(content.dialogue_strips, DIALOGUE_PER_PAGE).forEach((items, i) => {
      pageBodies.push({ title: `Dialogue Strips ${i + 1}`, body: <PageSections.DialogueStrips items={items} /> });
    });
  }
  if (content.speaking_prompts?.length) {
    chunk(content.speaking_prompts, SPEAKING_PER_PAGE).forEach((items, i) => {
      pageBodies.push({ title: `Speaking Prompts ${i + 1}`, body: <PageSections.SpeakingPrompts items={items} cardColors={theme.cardColors || []} cardBorders={theme.cardBorders || []} /> });
    });
  }
  if (content.labels?.length) {
    const full = content.labels.filter(l => l.size === 'full' || !l.size);
    const small = content.labels.filter(l => l.size === 'small');
    const useLabels = full.length ? full : small.length ? small : content.labels;
    chunk(useLabels, LABELS_PER_PAGE).forEach((items, i) => {
      pageBodies.push({
        title: `Labels ${i + 1}`,
        body: <PageSections.Labels items={items} cardColors={theme.cardColors || []} cardBorders={theme.cardBorders || []} />,
      });
    });
  }
  if (content.visual_routine_cards?.length) {
    chunk(content.visual_routine_cards, ROUTINE_PER_PAGE).forEach((items, i) => {
      pageBodies.push({ title: `Visual Routine Cards ${i + 1}`, body: <PageSections.VisualRoutineCards items={items} /> });
    });
  }
  if (content.classroom_rules?.length) {
    chunk(content.classroom_rules, RULES_PER_PAGE).forEach((items, i) => {
      pageBodies.push({ title: `Classroom Rules ${i + 1}`, body: <PageSections.ClassroomRules items={items} startIndex={i * RULES_PER_PAGE} /> });
    });
  }
  if (content.parent_notes?.length) {
    chunk(content.parent_notes, 2).forEach((items, i) => {
      pageBodies.push({ title: `Parent Notes ${i + 1}`, body: <PageSections.ParentNotes items={items} /> });
    });
  }
  if (content.mini_book?.pages?.length) {
    const mbPages = content.mini_book.pages;
    const MINIBOOK_PER_PAGE = 4;
    for (let i = 0; i < mbPages.length; i += MINIBOOK_PER_PAGE) {
      const pageSlice = mbPages.slice(i, i + MINIBOOK_PER_PAGE);
      const pageNum = Math.floor(i / MINIBOOK_PER_PAGE) + 1;
      const totalPages = Math.ceil(mbPages.length / MINIBOOK_PER_PAGE);
      pageBodies.push({
        title: `Mini-Book ${pageNum}/${totalPages}`,
        body: <PageSections.MiniBookPage miniBook={{ ...content.mini_book, pages: pageSlice }} showHeader={i === 0} />,
      });
    }
  }
  // Worksheets: 大 worksheet 自动拆页，小 worksheet 可合并
  if (content.worksheets?.length) {
    const WS_MERGE_THRESHOLD = 3;
    // 每页最大 items 数（宽松设置，实际溢出由 Puppeteer 层自动处理）
    const maxPerPage = (type: string) => {
      if (type === 'matching') return 8;
      if (type === 'coloring') return 6;
      if (type === 'tracing') return 8;
      return 8; // writing, fill-blank, 通用
    };

    const wsList = content.worksheets;
    let wi = 0;
    while (wi < wsList.length) {
      const ws = wsList[wi];
      const max = maxPerPage(ws.type);

      if (ws.items.length > max) {
        // 拆分大 worksheet 为多页
        const totalChunks = Math.ceil(ws.items.length / max);
        for (let ci = 0; ci < totalChunks; ci++) {
          const slicedItems = ws.items.slice(ci * max, (ci + 1) * max);
          const slicedWs = { ...ws, items: slicedItems };
          const showHeader = ci === 0;
          pageBodies.push({
            title: `Worksheet ${wi + 1}${totalChunks > 1 ? ` (${ci + 1}/${totalChunks})` : ''}`,
            body: <PageSections.Worksheet worksheet={slicedWs} index={wi + 1} showHeader={showHeader} itemStartIndex={ci * max} />,
          });
        }
        wi++;
      } else {
        const nextWs = wi + 1 < wsList.length ? wsList[wi + 1] : null;
        // 小 worksheet 合并
        if (nextWs && ws.items.length <= WS_MERGE_THRESHOLD && nextWs.items.length <= WS_MERGE_THRESHOLD) {
          pageBodies.push({
            title: `Worksheets ${wi + 1}-${wi + 2}`,
            body: (
              <div>
                <PageSections.Worksheet worksheet={ws} index={wi + 1} />
                <div style={{ marginTop: 20 }} />
                <PageSections.Worksheet worksheet={nextWs} index={wi + 2} />
              </div>
            ),
          });
          wi += 2;
        } else {
          pageBodies.push({ title: `Worksheet ${wi + 1}`, body: <PageSections.Worksheet worksheet={ws} index={wi + 1} /> });
          wi++;
        }
      }
    }
  }
  if (content.teacher_notes) {
    pageBodies.push({ title: 'Teacher Notes', body: <PageSections.TeacherNotesPage notes={content.teacher_notes} /> });
  }
  if (content.answer_key?.length) {
    const akChunks = chunk(content.answer_key, ANSWER_KEY_PER_PAGE);
    akChunks.forEach((items, i) => {
      const isLast = i === akChunks.length - 1;
      pageBodies.push({ title: `Answer Key${akChunks.length > 1 ? ` ${i + 1}` : ''}`, body: (
        <div>
          <PageSections.AnswerKeyPage answerKeys={items} />
          {isLast && <PageSections.TermsOfUseCompact license={content.license || 'personal-classroom-use'} />}
        </div>
      ) });
    });
  } else {
    // 没有 answer key 时，Terms 合并到 teacher notes 页
    // 但如果也没有 teacher notes，才单独一页
    if (pageBodies.length > 0 && pageBodies[pageBodies.length - 1].title.startsWith('Teacher Notes')) {
      // 把 compact terms 追加到 teacher notes 页
      const lastPage = pageBodies[pageBodies.length - 1];
      const origBody = lastPage.body;
      pageBodies[pageBodies.length - 1] = {
        title: lastPage.title,
        body: (
          <div>
            {origBody}
            <PageSections.TermsOfUseCompact license={content.license || 'personal-classroom-use'} />
          </div>
        ),
      };
    } else {
      // fallback: 单独一页（极少情况）
      pageBodies.push({ title: 'Terms of Use', body: <PageSections.TermsOfUsePage license={content.license || 'personal-classroom-use'} /> });
    }
  }

  const ageBandClass = ageBand.includes('6') || ageBand.includes('7') || ageBand.includes('8')
    ? 'age-68'
    : ageBand.includes('3') || ageBand.includes('4') || ageBand.includes('5')
      ? 'age-35'
      : 'age-k2';

  const total = pageBodies.length;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{content.title || resource.title}</title>
        <style>{cssVars}</style>
        <style>{PACK_STYLES}</style>
      </head>
      <body className={`pack-body ${ageBandClass}`}>
        {pageBodies.map((page, i) => (
          <section key={`${page.title}-${i}`} className="pdf-page">
            <div className="brand-bar" />
            {mode === 'sample' && sampleWatermarkText ? <div className="watermark">{sampleWatermarkText}</div> : null}
            <header className="page-header">
              <span className="brand-name">LanternELL</span>
              <span>{page.title}</span>
              <span>{mode === 'sample' ? '📎 Sample' : '📄 Printable Pack'}</span>
            </header>
            <main className="page-content">{page.body}</main>
            <footer className="page-footer">
              <span>{renderedAt}</span>
              <span className="site-url">lanternell.com</span>
              <span>Page {i + 1} / {total}</span>
            </footer>
            {mode === 'sample' && i === total - 2 ? (
              <div className="sample-cta">💡 Love this sample? Get the full pack at lanternell.com/shop</div>
            ) : null}
          </section>
        ))}
      </body>
    </html>
  );
}

function CoverPage({ content, resource }: { content: PackContent; resource: PackDocumentResource }) {
  return (
    <div className="cover-page">
      <div className="cover-hero">
        <div className="eyebrow">{content.language_pair.toUpperCase()} Printable Resource</div>
        <h1>{content.title || resource.title}</h1>
        <p className="lead">{content.description || resource.description || 'Print-ready bilingual classroom resource pack.'}</p>
      </div>
      <div className="cover-meta-grid">
        <MetaPill label="Topic" value={content.topic || resource.topic || 'General'} />
        <MetaPill label="Age Band" value={content.age_band || resource.age_band || 'K-2'} />
        <MetaPill label="Pack Type" value={fmt(content.pack_type)} />
        <MetaPill label="Language" value={(content.language_pair || 'en-es').toUpperCase()} />
      </div>
      <div className="cover-includes">
        <div className="cover-includes-box">
          <h3>✨ What's Inside</h3>
          <ul>
            {(content.vocabulary?.length || 0) > 0 && <li>{content.vocabulary!.length} vocabulary items</li>}
            {(content.worksheets?.length || 0) > 0 && <li>{content.worksheets!.length} worksheets</li>}
            {(content.sentence_frames?.length || 0) > 0 && <li>{content.sentence_frames!.length} sentence frames</li>}
            {(content.dialogue_strips?.length || 0) > 0 && <li>{content.dialogue_strips!.length} dialogue strips</li>}
            {(content.speaking_prompts?.length || 0) > 0 && <li>{content.speaking_prompts!.length} speaking prompts</li>}
            {(content.labels?.length || 0) > 0 && <li>{content.labels!.length} classroom labels</li>}
            {(content.visual_routine_cards?.length || 0) > 0 && <li>{content.visual_routine_cards!.length} routine cards</li>}
            {(content.classroom_rules?.length || 0) > 0 && <li>{content.classroom_rules!.length} classroom rules</li>}
            {(content.parent_notes?.length || 0) > 0 && <li>{content.parent_notes!.length} parent notes</li>}
            {content.mini_book?.pages?.length && <li>Mini-book ({content.mini_book.pages.length} pages)</li>}
            <li>Teacher notes &amp; answer key</li>
          </ul>
        </div>
        <div className="cover-includes-box">
          <h3>📖 How to Use</h3>
          <p>{content.teacher_notes?.suggested_use || 'Use as a quick-start printable pack for bilingual and newcomer support.'}</p>
        </div>
      </div>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (<div className="meta-pill"><span className="meta-label">{label}</span><span className="meta-value">{value}</span></div>);
}

export function chunk<T>(items: T[], size: number) {
  const r: T[][] = [];
  for (let i = 0; i < items.length; i += size) r.push(items.slice(i, i + size));
  return r;
}
export function fmt(v: string) { return v.replace(/_/g, ' '); }
