import type {
  AnswerKey,
  ClassroomLabel,
  ClassroomRule,
  DialogueStrip,
  MiniBook,
  PackContent,
  ParentNote,
  SentenceFrame,
  SpeakingPrompt,
  TeacherNotes,
  VisualRoutineCard,
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

  if (content.dialogue_strips?.length) {
    pageBodies.push({
      title: 'Dialogue Strips',
      body: <DialogueStripsPage items={content.dialogue_strips} />,
    });
  }

  if (content.speaking_prompts?.length) {
    pageBodies.push({
      title: 'Speaking Prompts',
      body: <SpeakingPromptsPage items={content.speaking_prompts} />,
    });
  }

  if (content.labels?.length) {
    const fullLabels = content.labels.filter(l => l.size === 'full' || !l.size);
    const smallLabels = content.labels.filter(l => l.size === 'small');
    if (fullLabels.length) {
      chunk(fullLabels, 8).forEach((items, index) => {
        pageBodies.push({
          title: `Full-Size Labels ${index + 1}`,
          body: <FullSizeLabelsPage items={items} />,
        });
      });
    }
    if (smallLabels.length) {
      chunk(smallLabels, LABELS_PER_PAGE).forEach((items, index) => {
        pageBodies.push({
          title: `Small Labels ${index + 1}`,
          body: <LabelsPage items={items} />,
        });
      });
    }
    if (!fullLabels.length && !smallLabels.length) {
      chunk(content.labels, LABELS_PER_PAGE).forEach((items, index) => {
        pageBodies.push({
          title: `Labels ${index + 1}`,
          body: <LabelsPage items={items} />,
        });
      });
    }
  }

  if (content.visual_routine_cards?.length) {
    pageBodies.push({
      title: 'Visual Routine Cards',
      body: <VisualRoutineCardsPage items={content.visual_routine_cards} />,
    });
  }

  if (content.classroom_rules?.length) {
    pageBodies.push({
      title: 'Classroom Rules',
      body: <ClassroomRulesPage items={content.classroom_rules} />,
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

  if (content.mini_book?.pages?.length) {
    pageBodies.push({
      title: 'Mini-Book',
      body: <MiniBookPages miniBook={content.mini_book} />,
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

  // Always add Terms of Use as last page
  pageBodies.push({
    title: 'Terms of Use',
    body: <TermsOfUsePage license={content.license || 'personal-classroom-use'} />,
  });

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
            {item.response_section && (
              <div className="response-section">
                <strong>Parent Response / Respuesta del padre:</strong>
                <div className="response-line" />
                <div className="response-line" />
                <div className="response-line" />
              </div>
            )}
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

function DialogueStripsPage({ items }: { items: DialogueStrip[] }) {
  return (
    <div>
      <h2 className="section-title">Dialogue Strips</h2>
      <p className="instructions">Cut along the dotted lines. Practice with a partner.</p>
      <div className="list-stack">
        {items.map((item, index) => (
          <article key={index} className="dialogue-strip">
            {item.context && <div className="dialogue-context">{item.context}</div>}
            <div className="dialogue-row">
              <div className="speaker speaker-a">
                <div className="speaker-label">A</div>
                <div><strong>{item.speaker_a_en}</strong>{item.speaker_a_l2 && <p>{item.speaker_a_l2}</p>}</div>
              </div>
              <div className="speaker speaker-b">
                <div className="speaker-label">B</div>
                <div><strong>{item.speaker_b_en}</strong>{item.speaker_b_l2 && <p>{item.speaker_b_l2}</p>}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SpeakingPromptsPage({ items }: { items: SpeakingPrompt[] }) {
  return (
    <div>
      <h2 className="section-title">Speaking Prompt Cards</h2>
      <div className="cards-grid">
        {items.map((item, index) => (
          <article key={index} className="speaking-card">
            <div className="card-label">Prompt {index + 1}</div>
            <h3>{item.prompt_en}</h3>
            {item.prompt_l2 && <p>{item.prompt_l2}</p>}
            {item.visual_cue && <div className="illustration-box">{item.visual_cue}</div>}
            {item.expected_response && <div className="expected-response">Expected: {item.expected_response}</div>}
          </article>
        ))}
      </div>
    </div>
  );
}

function FullSizeLabelsPage({ items }: { items: ClassroomLabel[] }) {
  return (
    <div>
      <h2 className="section-title">Full-Size Labels</h2>
      <p className="instructions">Print, cut, and display on walls, doors, or bulletin boards.</p>
      <div className="full-labels-grid">
        {items.map((item, index) => (
          <article key={`${item.en}-${index}`} className="full-label">
            <strong>{item.en}</strong>
            <span>{item.l2}</span>
            <small>{formatLabel(item.category)}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

function VisualRoutineCardsPage({ items }: { items: VisualRoutineCard[] }) {
  return (
    <div>
      <h2 className="section-title">Visual Routine Cards</h2>
      <p className="instructions">Display in order of daily schedule. Point to each card during transitions.</p>
      <div className="routine-grid">
        {items.map((item, index) => (
          <article key={index} className="routine-card">
            {item.time_of_day && <div className="card-label">{item.time_of_day}</div>}
            <div className="illustration-box">{item.icon_prompt || 'Icon placeholder'}</div>
            <h3>{item.routine_en}</h3>
            <p>{item.routine_l2}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ClassroomRulesPage({ items }: { items: ClassroomRule[] }) {
  return (
    <div>
      <h2 className="section-title">Classroom Rules</h2>
      <div className="rules-stack">
        {items.map((item, index) => (
          <article key={index} className="rule-poster">
            <div className="rule-number">{index + 1}</div>
            <div className="rule-content">
              <div className="illustration-box rule-icon">{item.icon_prompt || 'Icon'}</div>
              <h3>{item.rule_en}</h3>
              <p>{item.rule_l2}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function MiniBookPages({ miniBook }: { miniBook: MiniBook }) {
  return (
    <div>
      <h2 className="section-title">Mini-Book: {miniBook.title}</h2>
      <p className="instructions">Print double-sided, fold in half, and staple to create a mini-book.</p>
      <div className="minibook-grid">
        {miniBook.pages.map((page) => (
          <article key={page.page_number} className="minibook-page">
            <div className="minibook-page-num">{page.page_number}</div>
            <div className="minibook-text">
              <p><strong>{page.text_en}</strong></p>
              {page.text_l2 && <p>{page.text_l2}</p>}
            </div>
            <div className="illustration-box">{page.image_prompt || 'Illustration'}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TermsOfUsePage({ license }: { license: string }) {
  return (
    <div>
      <h2 className="section-title">Terms of Use</h2>
      <div className="notes-layout">
        <section>
          <h3>License: {formatLabel(license)}</h3>
          <p>This resource is licensed for personal and single-classroom use only.</p>
        </section>
        <section>
          <h3>You May</h3>
          <ul>
            <li>Print copies for your own students</li>
            <li>Use in your classroom, tutoring sessions, or homeschool</li>
            <li>Share the product link with colleagues (not the file)</li>
          </ul>
        </section>
        <section>
          <h3>You May Not</h3>
          <ul>
            <li>Share, redistribute, or resell the digital files</li>
            <li>Upload to shared drives accessible by other teachers</li>
            <li>Claim this content as your own creation</li>
            <li>Use for commercial purposes without a license upgrade</li>
          </ul>
        </section>
        <section>
          <h3>Need a School or District License?</h3>
          <p>Contact us at support@lanternell.com for multi-teacher and site licensing options.</p>
        </section>
      </div>
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
  @media print { @page { size: Letter; margin: 0; } }
  @page a4 { size: A4; margin: 0; }
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
  .dialogue-strip { border: 1px dashed #c8bea8; border-radius: 18px; padding: 16px; background: #fff; }
  .dialogue-context { font-size: 12px; color: #8a7a5e; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
  .dialogue-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .speaker { display: flex; gap: 10px; align-items: flex-start; }
  .speaker-label { display: inline-flex; width: 28px; height: 28px; align-items: center; justify-content: center; border-radius: 999px; font-weight: 700; font-size: 13px; flex-shrink: 0; }
  .speaker-a .speaker-label { background: #e0d5f5; color: #5b3e9e; }
  .speaker-b .speaker-label { background: #d5eee0; color: #2e7d4f; }
  .speaking-card { border: 2px solid #d9d2c1; border-radius: 20px; background: linear-gradient(180deg, #f5f0ff 0%, #ffffff 100%); padding: 18px; min-height: 160px; }
  .expected-response { margin-top: 12px; font-size: 12px; color: #6b604a; font-style: italic; border-top: 1px dashed #d2c9b7; padding-top: 8px; }
  .full-labels-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .full-label { border: 3px solid #d9d2c1; border-radius: 20px; background: #fff; padding: 24px; text-align: center; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .full-label strong { font-size: 28px; display: block; }
  .full-label span { font-size: 22px; display: block; margin-top: 8px; color: #5b5345; }
  .full-label small { display: block; margin-top: 12px; color: #8a7a5e; text-transform: uppercase; letter-spacing: 0.04em; font-size: 11px; }
  .routine-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .routine-card { border: 2px solid #d9d2c1; border-radius: 20px; background: #fff; padding: 18px; text-align: center; }
  .routine-card h3 { margin: 10px 0 4px; }
  .rules-stack { display: grid; gap: 16px; }
  .rule-poster { display: grid; grid-template-columns: 48px 1fr; gap: 16px; align-items: center; border: 2px solid #d9d2c1; border-radius: 20px; background: #fff; padding: 20px; }
  .rule-number { display: inline-flex; width: 40px; height: 40px; align-items: center; justify-content: center; border-radius: 999px; background: #b25f2e; color: #fff; font-weight: 700; font-size: 20px; }
  .rule-content { display: flex; align-items: center; gap: 16px; }
  .rule-icon { width: 56px; height: 56px; min-height: auto; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .minibook-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .minibook-page { border: 2px dashed #c8bea8; border-radius: 16px; background: #fff; padding: 18px; min-height: 180px; display: flex; flex-direction: column; }
  .minibook-page-num { font-size: 11px; color: #8a7a5e; text-align: right; }
  .minibook-text { flex: 1; margin-bottom: 10px; }
  .response-section { margin-top: 14px; padding-top: 12px; border-top: 1px dashed #d2c9b7; }
  .response-section .response-line { margin-top: 16px; }
`;
