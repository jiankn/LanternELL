import type {
    AnswerKey, ClassroomLabel, ClassroomRule, DialogueStrip, MiniBook,
    ParentNote, SentenceFrame, SpeakingPrompt, TeacherNotes,
    VisualRoutineCard, VocabularyItem, WorksheetItem,
} from '@/lib/content-schema';
import { fmt } from './pack-document';

/** Parse **bold** markdown into React nodes with <strong> tags */
function renderBold(text: string): React.ReactNode {
    if (!text.includes('**')) return text;
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

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
                            <div className="text-en">{renderBold(page.text_en)}</div>
                            {page.text_l2 && <div className="text-l2">{renderBold(page.text_l2)}</div>}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

/**
 * Extract word bank from instructions text.
 * Patterns: "Word Bank: x, y, z", "from the box: (x, y, z)", "Words: x, y, z", "(Options: x, y, z)"
 * Returns { cleanInstructions, wordBank: string[] | null }
 */
function extractWordBank(instructions: string): { clean: string; words: string[] | null } {
    // Pattern 1: "Word Bank: word1, word2, ..." (may span to end)
    const wbMatch = instructions.match(/\bWord [Bb]ank:\s*(.+)$/i);
    if (wbMatch) {
        const clean = instructions.slice(0, wbMatch.index).replace(/\s+$/, '');
        const words = wbMatch[1].split(',').map(w => w.trim()).filter(Boolean);
        return { clean, words };
    }
    // Pattern 2: "(Words: x, y, z)" or "(Options: x, y, z)" or "from the box: (x, y, z)"
    const parenMatch = instructions.match(/\((?:Words|Options|Word Bank)?:?\s*([^)]+)\)\s*$/i);
    if (parenMatch) {
        const clean = instructions.slice(0, parenMatch.index).replace(/\s+$/, '');
        const words = parenMatch[1].split(',').map(w => w.trim()).filter(Boolean);
        return { clean, words };
    }
    // Pattern 3: "from the box. (x, y, z)" — words after last colon in parens
    const boxMatch = instructions.match(/[:：]\s*\(([^)]+)\)\s*$/);
    if (boxMatch) {
        const clean = instructions.slice(0, boxMatch.index).replace(/\s+$/, '') + '.';
        const words = boxMatch[1].split(',').map(w => w.trim()).filter(Boolean);
        return { clean, words };
    }
    return { clean: instructions, words: null };
}

/**
 * Shuffle array with a simple deterministic seed (based on first item content)
 */
function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
    const result = [...arr];
    let s = seed;
    for (let i = result.length - 1; i > 0; i--) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        const j = s % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function Worksheet({ worksheet, index, showHeader = true, itemStartIndex = 0 }: { worksheet: WorksheetItem; index: number; showHeader?: boolean; itemStartIndex?: number }) {
    const isMatching = worksheet.type === 'matching';
    const isColoring = worksheet.type === 'coloring';
    const isTracing = worksheet.type === 'tracing';
    const isFillBlank = worksheet.type === 'fill-blank';
    const isCategorizing = worksheet.type === 'categorizing';

    // For fill-blank: extract word bank from instructions
    const fillBlankData = isFillBlank ? extractWordBank(worksheet.instructions_en) : null;

    // For matching: determine variant and build shuffled right column
    let matchLeftItems: any[] = [];
    let matchRightLabels: string[] = [];
    let matchVariant: 'image' | 'translation' | 'definition' = 'translation';
    if (isMatching) {
        const items = worksheet.items;
        const hasImages = items.some((it: any) => it.image_data || it.image_prompt);
        const hasOptions = items.some((it: any) => it.options || it.options_en);
        const hasMatchTarget = items.some((it: any) => it.match_target);

        if (hasOptions) {
            // Variant 3: word → definition (6-8 academic)
            matchVariant = 'definition';
            matchLeftItems = items;
            // Collect all correct_answers as right column, shuffled
            const answers = items.map((it: any) => it.correct_answer || '');
            const seed = items.length * 7 + (items[0]?.content?.charCodeAt(0) || 0);
            matchRightLabels = shuffleWithSeed(answers, seed);
        } else if (hasMatchTarget && !hasImages) {
            // Variant 2: English → Spanish translation
            matchVariant = 'translation';
            matchLeftItems = items;
            const targets = items.map((it: any) => it.match_target || it.content_l2 || '');
            const seed = items.length * 13 + (items[0]?.content?.charCodeAt(0) || 0);
            matchRightLabels = shuffleWithSeed(targets, seed);
        } else {
            // Variant 1: word → image (K-2), or fallback
            matchVariant = 'image';
            matchLeftItems = items;
        }
    }

    // For categorizing: parse structure
    let catCategories: string[] = [];
    let catWords: string[] = [];
    let catSlots: { name: string }[] = [];
    if (isCategorizing && worksheet.items.length >= 3) {
        // item[0].content = 'Categories: "X" | "Y" | "Z"'
        const catLine = worksheet.items[0].content;
        const catMatch = catLine.match(/Categories:\s*(.+)/i);
        if (catMatch) {
            catCategories = catMatch[1].split('|').map(c => c.replace(/"/g, '').trim());
        }
        // item[1].content = 'Words to sort: word1, word2, ...'
        const wordsLine = worksheet.items[1].content;
        const wordsMatch = wordsLine.match(/Words to sort:\s*(.+)/i);
        if (wordsMatch) {
            catWords = wordsMatch[1].split(',').map(w => w.trim());
        }
        // item[2+] = category slots
        catSlots = worksheet.items.slice(2).map(it => ({
            name: it.content.replace(/:\s*___.*$/, '').trim(),
        }));
    }

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
                    {isFillBlank && fillBlankData ? (
                        <>
                            <p className="ws-instructions">{fillBlankData.clean}</p>
                            {fillBlankData.words && (
                                <div className="ws-word-bank">
                                    <span className="ws-word-bank-label">Word Bank</span>
                                    <div className="ws-word-bank-words">
                                        {fillBlankData.words.map((w, i) => (
                                            <span key={i} className="ws-word-bank-chip">{w}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="ws-instructions">{worksheet.instructions_en}</p>
                    )}
                    {worksheet.instructions_l2 ? <p className="ws-instructions-l2">{worksheet.instructions_l2}</p> : null}
                </>
            )}
            {!showHeader && (
                <p className="ws-instructions" style={{ marginBottom: 12 }}>Worksheet {index} (continued)</p>
            )}

            {isMatching && matchVariant === 'image' ? (
                /* Matching Variant 1: word + image (K-2) — two-column grid, left=word, right=shuffled images */
                (() => {
                    const items = matchLeftItems;
                    const seed = items.length * 17 + (items[0]?.content?.charCodeAt(0) || 0);
                    const shuffledItems = shuffleWithSeed([...items], seed);
                    return (
                        <div className="ws-match-columns">
                            <div className="ws-match-col">
                                <div className="ws-match-col-header">Words</div>
                                {items.map((item: any, i: number) => (
                                    <div key={`l-${i}`} className="ws-match-left-item">
                                        <span className="ws-match-num">{itemStartIndex + i + 1}</span>
                                        <span className="ws-match-word">{item.content}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="ws-match-line-area" />
                            <div className="ws-match-col">
                                <div className="ws-match-col-header">Pictures</div>
                                {shuffledItems.map((item: any, i: number) => {
                                    const imgData = item.image_data;
                                    const letter = String.fromCharCode(65 + i);
                                    return (
                                        <div key={`r-${i}`} className="ws-match-right-item">
                                            <span className="ws-match-letter">{letter}</span>
                                            {imgData ? (
                                                <img className="ws-match-img" src={imgData} alt="" />
                                            ) : (
                                                <div className="ws-match-img-placeholder">?</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()
            ) : isMatching && matchVariant === 'translation' ? (
                /* Matching Variant 2: English → Spanish (3-5) — two columns with draw-line */
                <div className="ws-match-columns">
                    <div className="ws-match-col">
                        <div className="ws-match-col-header">English</div>
                        {matchLeftItems.map((item: any, i: number) => (
                            <div key={`l-${i}`} className="ws-match-left-item">
                                <span className="ws-match-num">{itemStartIndex + i + 1}</span>
                                <span className="ws-match-word">{item.content}</span>
                            </div>
                        ))}
                    </div>
                    <div className="ws-match-line-area" />
                    <div className="ws-match-col">
                        <div className="ws-match-col-header">Español</div>
                        {matchRightLabels.map((label, i) => {
                            const letter = String.fromCharCode(65 + i);
                            return (
                                <div key={`r-${i}`} className="ws-match-right-item">
                                    <span className="ws-match-letter">{letter}</span>
                                    <span className="ws-match-word">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : isMatching && matchVariant === 'definition' ? (
                /* Matching Variant 3: word → definition (6-8) — left words, right shuffled definitions */
                <div className="ws-match-columns ws-match-def">
                    <div className="ws-match-col">
                        <div className="ws-match-col-header">Word</div>
                        {matchLeftItems.map((item: any, i: number) => (
                            <div key={`l-${i}`} className="ws-match-left-item">
                                <span className="ws-match-num">{itemStartIndex + i + 1}</span>
                                <span className="ws-match-word">{item.content}</span>
                                <span className="ws-match-answer-blank">→ ___</span>
                            </div>
                        ))}
                    </div>
                    <div className="ws-match-col">
                        <div className="ws-match-col-header">Definition</div>
                        {matchRightLabels.map((label, i) => {
                            const letter = String.fromCharCode(65 + i);
                            return (
                                <div key={`r-${i}`} className="ws-match-def-item">
                                    <span className="ws-match-letter">{letter}</span>
                                    <span className="ws-match-def-text">{label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : isCategorizing ? (
                /* Categorizing: word pool on top, category boxes below */
                <div className="ws-categorize">
                    <div className="ws-cat-word-pool">
                        <div className="ws-cat-pool-label">Words to Sort</div>
                        <div className="ws-cat-pool-words">
                            {catWords.map((w, i) => (
                                <span key={i} className="ws-cat-chip">{w}</span>
                            ))}
                        </div>
                    </div>
                    <div className="ws-cat-boxes" style={{ gridTemplateColumns: `repeat(${Math.min(catSlots.length, 3)}, 1fr)` }}>
                        {catSlots.map((slot, i) => (
                            <div key={i} className="ws-cat-box">
                                <div className="ws-cat-box-header">{slot.name}</div>
                                <div className="ws-cat-box-lines">
                                    {[0,1,2,3,4].map(j => <div key={j} className="ws-write-line" />)}
                                </div>
                            </div>
                        ))}
                    </div>
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
