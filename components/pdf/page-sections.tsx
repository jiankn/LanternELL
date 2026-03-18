import type {
    AnswerKey, ClassroomLabel, ClassroomRule, DialogueStrip, MiniBook,
    ParentNote, SentenceFrame, SpeakingPrompt, TeacherNotes,
    VisualRoutineCard, VocabularyItem, WorksheetItem,
} from '@/lib/content-schema';
import { fmt } from './pack-document';

function VocabularyCards({ items, cardColors, cardBorders, pageIndex }: {
    items: VocabularyItem[]; cardColors: string[]; cardBorders: string[]; pageIndex: number;
}) {
    // Build 2-column rows with cut lines between them
    const rows: VocabularyItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
        rows.push(items.slice(i, i + 2));
    }

    return (
        <div>
            <h2 className="section-title">Vocabulary Cards</h2>
            <div className="vocab-container">
                {rows.map((row, ri) => (
                    <div key={`row-${ri}`}>
                        <div className="vocab-row">
                            {row.map((item, ci) => {
                                const idx = pageIndex * 4 + ri * 2 + ci;
                                const cIdx = idx % cardColors.length;
                                const imgData = (item as any).image_data;
                                return (
                                    <div key={`${item.en}-${ci}`} className="vocab-cell">
                                        {ci > 0 && <div className="cut-line-v" />}
                                        <article className="vocab-card"
                                            style={{ '--card-bg': cardColors[cIdx], '--card-border': cardBorders[cIdx] } as any}>
                                            <div className="card-num">Card {idx + 1}</div>
                                            {imgData ? (
                                                <img className="vocab-img" src={imgData} alt={item.en} />
                                            ) : (
                                                <div className="illust-area">{item.image_prompt || '🖼️'}</div>
                                            )}
                                            <div className="word-en">{item.en}</div>
                                            <div className="word-l2">{item.l2}</div>
                                        </article>
                                    </div>
                                );
                            })}
                        </div>
                        {ri < rows.length - 1 && (
                            <div className="cut-line-h">
                                <span className="cut-line-scissors">✂</span>
                                <span className="cut-line-dash" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SentenceFrames({ items }: { items: SentenceFrame[] }) {
    return (
        <div>
            <h2 className="section-title">Sentence Frames</h2>
            <div className="frames-list">
                {items.map((item, i) => (
                    <article key={`${item.frame}-${i}`} className="frame-card">
                        <div className="frame-num">{i + 1}</div>
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

function DialogueStrips({ items }: { items: DialogueStrip[] }) {
    return (
        <div>
            <h2 className="section-title">Dialogue Strips</h2>
            <p className="ws-instructions">Cut along the dotted lines. Practice with a partner.</p>
            <div className="dialogue-list">
                {items.map((item, i) => (
                    <article key={i} className="dialogue-card">
                        {item.context && <div className="dialogue-ctx">{item.context}</div>}
                        <div className="dialogue-speakers">
                            <div className="spk spk-a">
                                <div className="spk-badge">A</div>
                                <div><strong>{item.speaker_a_en}</strong>{item.speaker_a_l2 && <p>{item.speaker_a_l2}</p>}</div>
                            </div>
                            <div className="spk spk-b">
                                <div className="spk-badge">B</div>
                                <div><strong>{item.speaker_b_en}</strong>{item.speaker_b_l2 && <p>{item.speaker_b_l2}</p>}</div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

function SpeakingPrompts({ items, cardColors, cardBorders }: {
    items: SpeakingPrompt[]; cardColors: string[]; cardBorders: string[];
}) {
    return (
        <div>
            <h2 className="section-title">Speaking Prompt Cards</h2>
            <div className="prompt-grid">
                {items.map((item, i) => {
                    const imgData = (item as any).image_data;
                    return (
                        <article key={i} className="prompt-card"
                            style={{ '--card-bg': cardColors[i % cardColors.length], '--card-border': cardBorders[i % cardBorders.length] } as any}>
                            <div className="card-num">Prompt {i + 1}</div>
                            {imgData ? (
                                <img className="vocab-img" src={imgData} alt={item.prompt_en} />
                            ) : item.visual_cue ? (
                                <div className="illust-area">{item.visual_cue}</div>
                            ) : null}
                            <h3>{item.prompt_en}</h3>
                            {item.prompt_l2 && <p>{item.prompt_l2}</p>}
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

function Labels({ items, cardColors, cardBorders }: {
    items: ClassroomLabel[]; cardColors: string[]; cardBorders: string[];
}) {
    return (
        <div>
            <h2 className="section-title">Classroom Labels</h2>
            <p className="ws-instructions">Print, cut, and display in your classroom.</p>
            <div className="labels-grid-new">
                {items.map((item, i) => (
                    <article key={`${item.en}-${i}`} className="label-card-new"
                        style={{ '--card-bg': cardColors[i % cardColors.length], '--card-border': cardBorders[i % cardBorders.length] } as any}>
                        <div className="label-en">{item.en}</div>
                        <div className="label-l2">{item.l2}</div>
                        <div className="label-cat">{fmt(item.category)}</div>
                    </article>
                ))}
            </div>
        </div>
    );
}

function VisualRoutineCards({ items }: { items: VisualRoutineCard[] }) {
    return (
        <div>
            <h2 className="section-title">Visual Routine Cards</h2>
            <p className="ws-instructions">Display in order of daily schedule. Point to each card during transitions.</p>
            <div className="routine-grid-new">
                {items.map((item, i) => (
                    <article key={i} className="routine-card-new">
                        {item.time_of_day && <div className="time-badge">{item.time_of_day}</div>}
                        <div className="icon-area">
                            {(item as any).image_data ? (
                                <img className="vocab-img" src={(item as any).image_data} alt={item.routine_en} />
                            ) : (
                                item.icon_prompt || '🕐'
                            )}
                        </div>
                        <h3>{item.routine_en}</h3>
                        <p>{item.routine_l2}</p>
                    </article>
                ))}
            </div>
        </div>
    );
}

function ClassroomRules({ items, startIndex = 0 }: { items: ClassroomRule[]; startIndex?: number }) {
    return (
        <div>
            <h2 className="section-title">Classroom Rules</h2>
            <div className="rules-list">
                {items.map((item, i) => (
                    <article key={i} className="rule-card">
                        <div className="rule-num">{startIndex + i + 1}</div>
                        {(item as any).image_data ? (
                            <img className="vocab-img" src={(item as any).image_data} alt={item.rule_en} style={{ width: 48, height: 48 }} />
                        ) : null}
                        <div>
                            <h3>{item.rule_en}</h3>
                            <p>{item.rule_l2}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

function ParentNotes({ items }: { items: ParentNote[] }) {
    return (
        <div>
            <h2 className="section-title">Parent Communication</h2>
            <div className="parent-notes-list">
                {items.map((item, i) => (
                    <article key={`${item.title_en}-${i}`} className="pn-card">
                        <div className="pn-header">
                            <strong>{item.title_en}</strong>
                            <span className="pn-type-badge">{fmt(item.type)}</span>
                        </div>
                        <p>{item.content_en}</p>
                        <div className="pn-translated">
                            <strong>{item.title_l2}</strong>
                            <p>{item.content_l2}</p>
                        </div>
                        <div className="pn-sig">
                            {item.signature_required ? 'Parent signature: ____________________' : ''}
                        </div>
                        {item.response_section && (
                            <div className="pn-response">
                                <strong>Parent Response / Respuesta:</strong>
                                <div className="ws-write-line" /><div className="ws-write-line" /><div className="ws-write-line" />
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

function MiniBookPage({ miniBook, showHeader = true }: { miniBook: MiniBook; showHeader?: boolean }) {
    return (
        <div>
            {showHeader && (
                <>
                    <h2 className="section-title minibook-title">Mini-Book: {miniBook.title}</h2>
                    <p className="ws-instructions">Print double-sided, fold in half, and staple to create a mini-book.</p>
                </>
            )}
            <div className="minibook-grid-new">
                {miniBook.pages.map(page => (
                    <article key={page.page_number} className="minibook-card">
                        <div className="minibook-num">{page.page_number}</div>
                        <div className="minibook-illust">
                            {(page as any).image_data ? (
                                <img className="vocab-img" src={(page as any).image_data} alt={page.text_en} />
                            ) : (
                                page.image_prompt || '🖼️ Illustration'
                            )}
                        </div>
                        <div className="minibook-text">
                            <div className="text-en">{page.text_en}</div>
                            {page.text_l2 && <div className="text-l2">{page.text_l2}</div>}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

function Worksheet({ worksheet, index, showHeader = true, itemStartIndex = 0 }: { worksheet: WorksheetItem; index: number; showHeader?: boolean; itemStartIndex?: number }) {
    const isMatching = worksheet.type === 'matching';
    const isColoring = worksheet.type === 'coloring';
    const isTracing = worksheet.type === 'tracing';

    return (
        <div>
            {showHeader && (
                <>
                    <div className="ws-header">
                        <div>
                            <h2 className="section-title">Worksheet {index}</h2>
                            <span className="ws-type-badge">{fmt(worksheet.type)}</span>
                        </div>
                        <div className="ws-name-box">Name: ____________________</div>
                    </div>
                    <p className="ws-instructions">{worksheet.instructions_en}</p>
                    {worksheet.instructions_l2 ? <p className="ws-instructions-l2">{worksheet.instructions_l2}</p> : null}
                </>
            )}
            {!showHeader && (
                <p className="ws-instructions" style={{ marginBottom: 12 }}>Worksheet {index} (continued)</p>
            )}

            {isMatching ? (
                <div className="ws-matching-grid">
                    {worksheet.items.map((item, i) => {
                        const imgData = (item as any).image_data;
                        return (
                            <article key={`${item.id}-${i}`} className="ws-matching-item">
                                <div className="ws-item-num">{itemStartIndex + i + 1}</div>
                                {imgData ? (
                                    <img className="ws-matching-img" src={imgData} alt={item.content} />
                                ) : null}
                                <strong>{item.content}</strong>
                                {item.content_l2 ? <div className="ws-l2">{item.content_l2}</div> : null}
                                <div className="ws-write-line" />
                            </article>
                        );
                    })}
                </div>
            ) : isColoring ? (
                <div className="ws-coloring-grid">
                    {worksheet.items.map((item, i) => {
                        const imgData = (item as any).image_data;
                        return (
                            <article key={`${item.id}-${i}`} className="ws-coloring-item">
                                {imgData ? (
                                    <img className="ws-coloring-img" src={imgData} alt={item.content} />
                                ) : (
                                    <div className="ws-coloring-placeholder">{item.content}</div>
                                )}
                                <div className="ws-coloring-label">
                                    <strong>{item.content}</strong>
                                    {item.content_l2 ? <span> / {item.content_l2}</span> : null}
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : isTracing ? (
                <div className="ws-items">
                    {worksheet.items.map((item, i) => (
                        <article key={`${item.id}-${i}`} className="ws-tracing-item">
                            <div className="ws-item-num">{itemStartIndex + i + 1}</div>
                            <div className="ws-item-content">
                                <div className="ws-tracing-word">{item.content}</div>
                                <div className="ws-tracing-dotted">{item.content}</div>
                                {item.content_l2 ? <div className="ws-l2">{item.content_l2}</div> : null}
                                <div className="ws-write-line" />
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="ws-items">
                    {worksheet.items.map((item, i) => (
                        <article key={`${item.id}-${i}`} className="ws-item">
                            <div className="ws-item-num">{itemStartIndex + i + 1}</div>
                            <div className="ws-item-content">
                                <strong>{item.content}</strong>
                                {item.content_l2 ? <div className="ws-l2">{item.content_l2}</div> : null}
                                <div className="ws-write-line" />
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

function TeacherNotesPage({ notes }: { notes: TeacherNotes }) {
    return (
        <div>
            <h2 className="section-title">Teacher Notes</h2>
            <div className="notes-grid">
                <section className="note-section"><h3>🎯 Objective</h3><p>{notes.objective}</p></section>
                <section className="note-section"><h3>💡 Suggested Use</h3><p>{notes.suggested_use}</p></section>
                {notes.materials_needed?.length ? (
                    <section className="note-section"><h3>📦 Materials Needed</h3><ul>{notes.materials_needed.map(m => <li key={m}>{m}</li>)}</ul></section>
                ) : null}
                {notes.differentiation_tips?.length ? (
                    <section className="note-section"><h3>🔀 Differentiation Tips</h3><ul>{notes.differentiation_tips.map(t => <li key={t}>{t}</li>)}</ul></section>
                ) : null}
                {notes.assessment_ideas?.length ? (
                    <section className="note-section"><h3>📝 Assessment Ideas</h3><ul>{notes.assessment_ideas.map(a => <li key={a}>{a}</li>)}</ul></section>
                ) : null}
            </div>
        </div>
    );
}

function AnswerKeyPage({ answerKeys }: { answerKeys: AnswerKey[] }) {
    return (
        <div>
            <h2 className="section-title">Answer Key</h2>
            <div className="answer-list">
                {answerKeys.map(ak => (
                    <section key={ak.worksheet_id} className="ak-section">
                        <h3>{ak.worksheet_id}</h3>
                        {typeof ak.answers === 'string' ? (
                            <p className="ws-instructions-l2">{ak.answers}</p>
                        ) : (
                            <div className="ak-grid">
                                {Object.entries(ak.answers).map(([id, ans]) => (
                                    <div key={id} className="ak-item"><strong>{id}.</strong><span>{ans}</span></div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}

function TermsOfUsePage({ license }: { license: string }) {
    return (
        <div>
            <h2 className="section-title">Terms of Use</h2>
            <div className="terms-grid">
                <section className="terms-section"><h3>📄 License: {fmt(license)}</h3><p>This resource is licensed for personal and single-classroom use only.</p></section>
                <section className="terms-section"><h3>✅ You May</h3><ul><li>Print copies for your own students</li><li>Use in your classroom, tutoring sessions, or homeschool</li><li>Share the product link with colleagues (not the file)</li></ul></section>
                <section className="terms-section"><h3>❌ You May Not</h3><ul><li>Share, redistribute, or resell the digital files</li><li>Upload to shared drives accessible by other teachers</li><li>Claim this content as your own creation</li></ul></section>
                <section className="terms-section"><h3>🏫 Need a School License?</h3><p>Contact us at support@lanternell.com for multi-teacher and site licensing options.</p></section>
            </div>
        </div>
    );
}

/** 紧凑版 Terms of Use，用于合并到其他页面底部，节省纸张 */
function TermsOfUseCompact({ license }: { license: string }) {
    return (
        <div className="terms-compact">
            <div className="terms-compact-title">📄 Terms of Use — {fmt(license)}</div>
            <div className="terms-compact-body">
                <span>✅ Print for your students & classroom use.</span>
                <span>❌ Do not share, redistribute, or resell files.</span>
                <span>🏫 School license: support@lanternell.com</span>
            </div>
        </div>
    );
}

export const PageSections = {
    VocabularyCards, SentenceFrames, DialogueStrips, SpeakingPrompts,
    Labels, VisualRoutineCards, ClassroomRules, ParentNotes,
    MiniBookPage, Worksheet, TeacherNotesPage, AnswerKeyPage, TermsOfUsePage,
    TermsOfUseCompact,
};
