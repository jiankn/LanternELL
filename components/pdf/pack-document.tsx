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
    pageBodies.push({ title: 'Dialogue Strips', body: <PageSections.DialogueStrips items={content.dialogue_strips} /> });
  }
  if (content.speaking_prompts?.length) {
    pageBodies.push({ title: 'Speaking Prompts', body: <PageSections.SpeakingPrompts items={content.speaking_prompts} cardColors={theme.cardColors || []} cardBorders={theme.cardBorders || []} /> });
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
    pageBodies.push({ title: 'Visual Routine Cards', body: <PageSections.VisualRoutineCards items={content.visual_routine_cards} /> });
  }
  if (content.classroom_rules?.length) {
    pageBodies.push({ title: 'Classroom Rules', body: <PageSections.ClassroomRules items={content.classroom_rules} /> });
  }
  if (content.parent_notes?.length) {
    chunk(content.parent_notes, 2).forEach((items, i) => {
      pageBodies.push({ title: `Parent Notes ${i + 1}`, body: <PageSections.ParentNotes items={items} /> });
    });
  }
  if (content.mini_book?.pages?.length) {
    pageBodies.push({ title: 'Mini-Book', body: <PageSections.MiniBookPage miniBook={content.mini_book} /> });
  }
  content.worksheets?.forEach((ws, i) => {
    pageBodies.push({ title: `Worksheet ${i + 1}`, body: <PageSections.Worksheet worksheet={ws} index={i + 1} /> });
  });
  if (content.teacher_notes) {
    pageBodies.push({ title: 'Teacher Notes', body: <PageSections.TeacherNotesPage notes={content.teacher_notes} /> });
  }
  if (content.answer_key?.length) {
    pageBodies.push({ title: 'Answer Key', body: <PageSections.AnswerKeyPage answerKeys={content.answer_key} /> });
  }
  pageBodies.push({ title: 'Terms of Use', body: <PageSections.TermsOfUsePage license={content.license || 'personal-classroom-use'} /> });

  const total = pageBodies.length;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{content.title || resource.title}</title>
        <style>{cssVars}</style>
        <style>{PACK_STYLES}</style>
      </head>
      <body className="pack-body">
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
