import type {
  AnswerKey,
  ClassroomLabel,
  PackContent,
  ParentNote,
  SentenceFrame,
  TeacherNotes,
  VocabularyItem,
  WorksheetItem,
} from '@/lib/content-schema';

export interface PackDocumentResource {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  pack_type: string;
  topic: string | null;
  age_band: string | null;
  language_pair: string | null;
}

interface PackDocumentProps {
  content: PackContent;
  resource: PackDocumentResource;
  mode: 'final' | 'sample';
  renderedAt: string;
  sampleWatermarkText?: string;
}

const VOCABULARY_PER_PAGE = 8;
const FRAMES_PER_PAGE = 8;
const LABELS_PER_PAGE = 15;
const NOTES_PER_PAGE = 2;

export function PackDocument({
  content,
  resource,
  mode,
  renderedAt,
  sampleWatermarkText,
}: PackDocumentProps) {
  const pageBodies: Array<{ title: string; body: React.ReactNode }> = [];

  pageBodies.push({
    title: 'Cover',
    body: <CoverPage content={content} resource={resource} />,
  });

  if (content.vocabulary?.length) {
    chunk(content.vocabulary, VOCABULARY_PER_PAGE).forEach((items, index) => {
      pageBodies.push({
        title: `Vocabulary Cards ${index + 1}`,
        body: <VocabularyCardsPage items={items} />,
      });
    });
  }

  if (content.sentence_frames?.length) {
    chunk(content.sentence_frames, FRAMES_PER_PAGE).forEach((items, index) => {
      pageBodies.push({
        title: `Sentence Frames ${index + 1}`,
        body: <SentenceFramesPage items={items} />,
      });
    });
  }

  if (content.labels?.length) {
    chunk(content.labels, LABELS_PER_PAGE).forEach((items, index) => {
      pageBodies.push({
        title: `Labels ${index + 1}`,
        body: <LabelsPage items={items} />,
      });
    });
  }

  if (content.parent_notes?.length) {
    chunk(content.parent_notes, NOTES_PER_PAGE).forEach((items, index) => {
      pageBodies.push({
        title: `Parent Notes ${index + 1}`,
        body: <ParentNotesPage items={items} />,
      });
    });
  }

  content.worksheets?.forEach((worksheet, index) => {
    pageBodies.push({
      title: `Worksheet ${index + 1}`,
      body: <WorksheetPage worksheet={worksheet} index={index + 1} />,
    });
  });

  if (content.teacher_notes) {
    pageBodies.push({
      title: 'Teacher Notes',
      body: <TeacherNotesPage notes={content.teacher_notes} />,
    });
  }

  if (content.answer_key?.length) {
    pageBodies.push({
      title: 'Answer Key',
      body: <AnswerKeyPage answerKeys={content.answer_key} />,
    });
  }

  const totalPages = pageBodies.length;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>{content.title || resource.title}</title>
        <style>{PACK_DOCUMENT_STYLES}</style>
      </head>
      <body className="pack-body">
        {pageBodies.map((page, index) => (
          <PageFrame
            key={`${page.title}-${index}`}
            title={page.title}
            pageNumber={index + 1}
            totalPages={totalPages}
            renderedAt={renderedAt}
            mode={mode}
            sampleWatermarkText={sampleWatermarkText}
          >
            {page.body}
          </PageFrame>
        ))}
      </body>
    </html>
  );
}

function PageFrame({
  children,
  title,
  pageNumber,
  totalPages,
  renderedAt,
  mode,
  sampleWatermarkText,
}: {
  children: React.ReactNode;
  title: string;
  pageNumber: number;
  totalPages: number;
  renderedAt: string;
  mode: 'final' | 'sample';
  sampleWatermarkText?: string;
}) {
  return (
    <section className="pdf-page">
      {mode === 'sample' && sampleWatermarkText ? (
        <div className="watermark">{sampleWatermarkText}</div>
      ) : null}
      <header className="page-header">
        <span>{title}</span>
        <span>{mode === 'sample' ? 'Sample Version' : 'Printable Pack'}</span>
      </header>
      <main className="page-content">{children}</main>
      <footer className="page-footer">
        <span>{renderedAt}</span>
        <span>
          Page {pageNumber} / {totalPages}
        </span>
      </footer>
    </section>
  );
}

function CoverPage({
  content,
  resource,
}: {
  content: PackContent;
  resource: PackDocumentResource;
}) {
  return (
    <div className="cover-page">
      <div className="eyebrow">{content.language_pair.toUpperCase()} printable resource</div>
      <h1>{content.title || resource.title}</h1>
      <p className="lead">
        {content.description || resource.description || 'Print-ready bilingual classroom resource pack.'}
      </p>
      <div className="cover-grid">
        <MetaCard label="Topic" value={content.topic || resource.topic || 'General classroom support'} />
        <MetaCard label="Age Band" value={content.age_band || resource.age_band || 'K-2'} />
        <MetaCard label="Pack Type" value={formatLabel(content.pack_type)} />
        <MetaCard
          label="Language Pair"
          value={(content.language_pair || resource.language_pair || 'en-es').toUpperCase()}
        />
      </div>
      <div className="cover-summary">
        <div>
          <strong>Includes</strong>
          <ul>
            <li>{content.vocabulary?.length || 0} vocabulary items</li>
            <li>{content.worksheets?.length || 0} worksheets</li>
            <li>{content.sentence_frames?.length || 0} sentence frames</li>
            <li>{content.labels?.length || 0} classroom labels</li>
          </ul>
        </div>
        <div>
          <strong>Recommended Use</strong>
          <p>
            {content.teacher_notes?.suggested_use ||
              'Use as a quick-start printable pack for bilingual and newcomer support.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function VocabularyCardsPage({ items }: { items: VocabularyItem[] }) {
  return (
    <div>
      <h2 className="section-title">Vocabulary Cards</h2>
      <div className="cards-grid">
        {items.map((item, index) => (
          <article key={`${item.en}-${index}`} className="vocab-card">
            <div className="card-label">Card {index + 1}</div>
            <h3>{item.en}</h3>
            <p>{item.l2}</p>
            <div className="illustration-box">{item.image_prompt || 'Illustration placeholder'}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SentenceFramesPage({ items }: { items: SentenceFrame[] }) {
  return (
    <div>
      <h2 className="section-title">Sentence Frames</h2>
      <div className="list-stack">
        {items.map((item, index) => (
          <article key={`${item.frame}-${index}`} className="line-card">
            <div className="item-index">{index + 1}</div>
            <div>
              <h3>{item.frame}</h3>
              {item.translation ? <p>{item.translation}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LabelsPage({ items }: { items: ClassroomLabel[] }) {
  return (
    <div>
      <h2 className="section-title">Classroom Labels</h2>
      <div className="labels-grid">
        {items.map((item, index) => (
          <article key={`${item.en}-${index}`} className="label-chip">
            <strong>{item.en}</strong>
            <span>{item.l2}</span>
            <small>{formatLabel(item.category)}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function ParentNotesPage({ items }: { items: ParentNote[] }) {
  return (
    <div>
      <h2 className="section-title">Parent Communication</h2>
      <div className="notes-stack">
        {items.map((item, index) => (
          <article key={`${item.title_en}-${index}`} className="parent-note">
            <div className="note-header">
              <strong>{item.title_en}</strong>
              <span>{formatLabel(item.type)}</span>
            </div>
            <p>{item.content_en}</p>
            <div className="translated-note">
              <strong>{item.title_l2}</strong>
              <p>{item.content_l2}</p>
            </div>
            <div className="signature-line">
              {item.signature_required ? 'Parent signature: ____________________' : 'No signature required'}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function WorksheetPage({
  worksheet,
  index,
}: {
  worksheet: WorksheetItem;
  index: number;
}) {
  return (
    <div>
      <div className="worksheet-heading">
        <div>
          <h2 className="section-title">Worksheet {index}</h2>
          <p className="worksheet-type">{formatLabel(worksheet.type)}</p>
        </div>
        <div className="name-box">Name: ____________________</div>
      </div>
      <p className="instructions">{worksheet.instructions_en}</p>
      {worksheet.instructions_l2 ? <p className="instructions secondary">{worksheet.instructions_l2}</p> : null}
      <div className="worksheet-grid">
        {worksheet.items.map((item, itemIndex) => (
          <article key={`${item.id}-${itemIndex}`} className="worksheet-item">
            <div className="item-index">{itemIndex + 1}</div>
            <div className="worksheet-body">
              <strong>{item.content}</strong>
              {item.content_l2 ? <p>{item.content_l2}</p> : null}
              <div className="response-line" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TeacherNotesPage({ notes }: { notes: TeacherNotes }) {
  return (
    <div>
      <h2 className="section-title">Teacher Notes</h2>
      <div className="notes-layout">
        <section>
          <h3>Objective</h3>
          <p>{notes.objective}</p>
        </section>
        <section>
          <h3>Suggested Use</h3>
          <p>{notes.suggested_use}</p>
        </section>
        {notes.materials_needed?.length ? (
          <section>
            <h3>Materials Needed</h3>
            <ul>{notes.materials_needed.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
        {notes.differentiation_tips?.length ? (
          <section>
            <h3>Differentiation Tips</h3>
            <ul>{notes.differentiation_tips.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
        {notes.assessment_ideas?.length ? (
          <section>
            <h3>Assessment Ideas</h3>
            <ul>{notes.assessment_ideas.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function AnswerKeyPage({ answerKeys }: { answerKeys: AnswerKey[] }) {
  return (
    <div>
      <h2 className="section-title">Answer Key</h2>
      <div className="answer-stack">
        {answerKeys.map((answerKey) => (
          <section key={answerKey.worksheet_id} className="answer-card">
            <h3>{answerKey.worksheet_id}</h3>
            <div className="answer-grid">
              {Object.entries(answerKey.answers).map(([itemId, answer]) => (
                <div key={itemId} className="answer-item">
                  <strong>{itemId}</strong>
                  <span>{answer}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function formatLabel(value: string) {
  return value.replace(/_/g, ' ');
}

const PACK_DOCUMENT_STYLES = `
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  body.pack-body { margin: 0; background: #f7f4eb; color: #1b1f2a; font-family: Arial, Helvetica, sans-serif; }
  .pdf-page {
    position: relative;
    width: 8.5in;
    min-height: 11in;
    padding: 0.45in 0.55in 0.45in;
    background: #fffdf8;
    border-bottom: 1px dashed #d8d0bf;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .pdf-page:last-child { border-bottom: none; }
  .watermark {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 700;
    color: rgba(160, 82, 45, 0.12);
    transform: rotate(-26deg);
    pointer-events: none;
    z-index: 0;
  }
  .page-header, .page-footer {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #7b6f5a;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .page-content { position: relative; z-index: 1; flex: 1; padding-top: 20px; }
  h1, h2, h3, strong { font-family: Georgia, "Times New Roman", serif; }
  h1 { margin: 8px 0 18px; font-size: 34px; line-height: 1.1; }
  h2.section-title { margin: 0 0 18px; font-size: 28px; }
  .eyebrow { color: #b25f2e; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-size: 12px; }
  .lead { max-width: 80%; font-size: 16px; line-height: 1.6; color: #433d30; }
  .cover-grid, .cover-summary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  .meta-card, .cover-summary > div, .answer-card, .parent-note, .line-card, .worksheet-item, .label-chip {
    border: 1px solid #ded7c7;
    border-radius: 18px;
    background: #fff;
    padding: 16px;
  }
  .meta-card span { display: block; font-size: 12px; text-transform: uppercase; color: #7b6f5a; margin-bottom: 8px; }
  .meta-card strong { font-size: 18px; }
  .cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .vocab-card {
    border: 2px solid #d9d2c1;
    border-radius: 20px;
    background: linear-gradient(180deg, #fff9ef 0%, #ffffff 100%);
    padding: 18px;
    min-height: 176px;
  }
  .card-label, .worksheet-type, .secondary { font-size: 12px; color: #8a7a5e; text-transform: uppercase; letter-spacing: 0.06em; }
  .illustration-box {
    margin-top: 18px;
    min-height: 68px;
    border: 1px dashed #c8bea8;
    border-radius: 14px;
    background: #f7f2e7;
    padding: 10px;
    font-size: 12px;
    color: #6b604a;
  }
  .list-stack, .notes-stack, .answer-stack { display: grid; gap: 14px; }
  .line-card, .worksheet-item { display: grid; grid-template-columns: 44px 1fr; gap: 14px; align-items: start; }
  .item-index {
    display: inline-flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: #efe6d5;
    color: #6d563e;
    font-weight: 700;
  }
  .labels-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .label-chip strong, .answer-item strong { display: block; }
  .label-chip span, .answer-item span { display: block; margin-top: 4px; }
  .label-chip small {
    display: block;
    margin-top: 10px;
    color: #8a7a5e;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .note-header, .worksheet-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .translated-note { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #d2c9b7; }
  .signature-line { margin-top: 14px; color: #6b604a; font-size: 13px; }
  .instructions { margin: 0 0 18px; font-size: 15px; line-height: 1.5; }
  .worksheet-grid { display: grid; gap: 14px; }
  .worksheet-body p { margin: 6px 0 12px; color: #5b5345; }
  .response-line { height: 18px; border-bottom: 2px solid #d8cfbd; }
  .name-box { font-size: 13px; color: #5e5548; }
  .notes-layout { display: grid; gap: 16px; }
  .notes-layout section { border: 1px solid #ded7c7; border-radius: 18px; padding: 16px; background: #fff; }
  .notes-layout ul, .cover-summary ul { margin: 10px 0 0 18px; padding: 0; }
  .answer-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
  .answer-item { border: 1px solid #e3dac8; border-radius: 12px; padding: 10px; background: #fffaf2; }
`;
