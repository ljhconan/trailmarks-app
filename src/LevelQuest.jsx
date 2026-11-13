import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Star, Wand2, Shuffle, CheckCircle2, Circle, AlertTriangle, ThumbsUp, Lightbulb } from "lucide-react";
import {
  LEVELS, DEFAULT_LEVEL, GREAT_TO_LEVEL_UP, todayWords, wordUsed,
} from "./levels.js";

const PROFILE_KEY = "trailmarks-profile";
const lvKey = (p) => `trailmarks-lv-${p}`;
const PROFILES = [
  { key: "lea", label: "Lea" },
  { key: "leyna", label: "Leyna" },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadProfileState(p) {
  try {
    const raw = localStorage.getItem(lvKey(p));
    if (raw) return { level: DEFAULT_LEVEL[p] || 2, great: 0, words: {}, done: 0, ...JSON.parse(raw) };
  } catch (e) { /* ignore */ }
  return { level: DEFAULT_LEVEL[p] || 2, great: 0, words: {}, done: 0 };
}

function saveProfileState(p, s) {
  try { localStorage.setItem(lvKey(p), JSON.stringify(s)); } catch (e) { /* ignore */ }
}

async function askAI(prompt) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error("AI request failed");
  const data = await response.json();
  const clean = String(data.text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function sectionsText(sections, texts) {
  return sections.map((s) => `${s.label}: ${texts[s.key] || ""}`).join("\n");
}

function draftPrompt({ level, genre, prompt, texts, words }) {
  return `You are a warm but HONEST writing coach for a child (${level.age}). The child is doing Level ${level.id} "${level.name}" writing: ${genre.label}.
Writing task: "${prompt}"
Skills expected at this level: ${level.rubric}.
The child was asked to use these new words: ${words.map((w) => w.w).join(", ")}.

Their draft:
${sectionsText(genre.sections, texts)}

Respond ONLY with a JSON object (no markdown fences, no extra text) with exactly these fields:
{
  "strengths": ["1-2 specific things they really did well, each under 14 words"],
  "fixSection": "the key of the ONE section that would improve most (one of: ${genre.sections.map((s) => s.key).join(", ")})",
  "fixOriginal": "the exact sentence or two copied from that section that needs work",
  "fixWhy": "why it needs work, under 22 words, kid-friendly",
  "fixTip": "one concrete way to improve it, under 28 words, kid-friendly; do not rewrite it for them",
  "score": an integer 1-5 for this draft compared with what is expected at this level (1 = needs a lot of help, 2 = below level, 3 = meets level but basic, 4 = strong for this level, 5 = excellent). Be honest: most first drafts should be 2-4.
}
Language must be simple and encouraging. Never mention the score in the text fields.`;
}

function revisionPrompt({ level, genre, prompt, texts, words, fix, revised }) {
  return `You are a warm but HONEST writing coach for a child (${level.age}). Level ${level.id} "${level.name}", ${genre.label}.
Task: "${prompt}". Expected skills: ${level.rubric}. New words to use: ${words.map((w) => w.w).join(", ")}.

First draft:
${sectionsText(genre.sections, texts)}

The coach asked them to improve the section "${fix.label}". Tip given: ${fix.tip}
Original of that section: ${texts[fix.key]}
Their revision of that section: ${revised}

Respond ONLY with a JSON object (no markdown fences) with exactly:
{
  "improved": true or false (did the revision genuinely follow the tip and get better?),
  "praise": "one specific sentence of praise about the revision, under 22 words",
  "stillTry": "one small thing to try next time, under 22 words, or an empty string",
  "score": an integer 1-5 for the WHOLE piece now, using the same level-appropriate scale (3 = meets level but basic, 4 = strong, 5 = excellent). Be honest.
}`;
}

function wordCountOf(s) {
  return String(s || "").trim().split(/\s+/).filter(Boolean).length;
}

export default function LevelQuest({ onComplete, getUsage, recordUsage, limit }) {
  const [profile, setProfile] = useState(() => {
    try { return localStorage.getItem(PROFILE_KEY) || "lea"; } catch (e) { return "lea"; }
  });
  const [pstate, setPstate] = useState(() => loadProfileState(profile));
  const [stage, setStage] = useState("write"); // write | checking | revise | rechecking | done
  const [genreIdx, setGenreIdx] = useState(0);
  const [promptIdx, setPromptIdx] = useState(0);
  const [texts, setTexts] = useState({});
  const [draftFb, setDraftFb] = useState(null);
  const [revised, setRevised] = useState("");
  const [revFb, setRevFb] = useState(null);
  const [error, setError] = useState(false);
  const [capped, setCapped] = useState(false);
  const [result, setResult] = useState(null); // { leveledUp, level, great, learned: [] }

  const level = LEVELS[Math.min(Math.max(pstate.level, 1), LEVELS.length) - 1];
  const genre = level.genres[genreIdx % level.genres.length];
  const prompt = genre.prompts[promptIdx % genre.prompts.length];
  const words = useMemo(() => todayWords(level.id, profile, todayISO()), [level.id, profile]);

  // switch profile
  function chooseProfile(p) {
    setProfile(p);
    try { localStorage.setItem(PROFILE_KEY, p); } catch (e) { /* ignore */ }
    setPstate(loadProfileState(p));
    resetTask();
  }

  function resetTask() {
    setStage("write"); setTexts({}); setDraftFb(null); setRevised("");
    setRevFb(null); setError(false); setCapped(false); setResult(null);
    setPromptIdx(Math.floor(Math.random() * 50));
  }

  // new task when level changes
  useEffect(() => { setGenreIdx(0); setPromptIdx(Math.floor(Math.random() * 50)); }, [level.id]);

  function persist(next) { setPstate(next); saveProfileState(profile, next); }

  function setLevelManual(n) {
    persist({ ...pstate, level: n, great: 0 });
    resetTask();
  }

  const allText = Object.values(texts).join(" ");
  const sectionOk = (s) => wordCountOf(texts[s.key]) >= level.minWords;
  const wordsOk = words.map((w) => wordUsed(allText, w.w));
  const ready = genre.sections.every(sectionOk) && wordsOk.every(Boolean);

  function finish(finalScore, learned) {
    // update level progress
    let { level: lv, great } = pstate;
    let leveledUp = false;
    if (finalScore !== null && finalScore >= 4) great += 1;
    if (great >= GREAT_TO_LEVEL_UP && lv < LEVELS.length) { lv += 1; great = 0; leveledUp = true; }
    else if (great >= GREAT_TO_LEVEL_UP) great = GREAT_TO_LEVEL_UP;
    const wordsMap = { ...pstate.words };
    learned.forEach((w) => {
      const cur = wordsMap[w.w] || { d: w.d, count: 0 };
      wordsMap[w.w] = { d: w.d, count: cur.count + 1 };
    });
    persist({ ...pstate, level: lv, great, words: wordsMap, done: (pstate.done || 0) + 1 });
    setResult({ leveledUp, level: lv, great, score: finalScore, learned });
    setStage("done");
    if (onComplete) onComplete();
  }

  async function checkDraft() {
    if (!ready) return;
    setError(false); setCapped(false);
    if (getUsage() >= limit) { setCapped(true); return; }
    setStage("checking");
    try {
      const fb = await askAI(draftPrompt({ level, genre, prompt, texts, words }));
      recordUsage();
      const sec = genre.sections.find((s) => s.key === fb.fixSection) || genre.sections[0];
      setDraftFb({ ...fb, fix: { key: sec.key, label: sec.label, tip: fb.fixTip, why: fb.fixWhy, original: fb.fixOriginal } });
      setRevised(texts[sec.key] || "");
      setStage("revise");
    } catch (e) {
      setError(true); setStage("write");
    }
  }

  async function submitRevision() {
    if (!draftFb) return;
    const changed = revised.trim() !== (texts[draftFb.fix.key] || "").trim() && wordCountOf(revised) >= 4;
    if (!changed) return;
    setError(false);
    if (getUsage() >= limit) {
      // no more feedback today: keep the revision, finish without level progress
      setTexts((t) => ({ ...t, [draftFb.fix.key]: revised }));
      finish(null, words.filter((w, i) => wordsOk[i]));
      return;
    }
    setStage("rechecking");
    try {
      const fb = await askAI(revisionPrompt({ level, genre, prompt, texts, words, fix: draftFb.fix, revised }));
      recordUsage();
      setRevFb(fb);
      setTexts((t) => ({ ...t, [draftFb.fix.key]: revised }));
      finish(Number(fb.score) || null, words.filter((w, i) => wordsOk[i]));
    } catch (e) {
      setError(true); setStage("revise");
    }
  }

  function skipRevision() {
    finish(null, words.filter((w, i) => wordsOk[i]));
  }

  const card = { padding: 18, marginBottom: 14 };
  const dots = Array.from({ length: GREAT_TO_LEVEL_UP }, (_, i) => i < pstate.great);

  return (
    <div>
      {/* profile + level header */}
      <div className="tm-card" style={card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span className="tm-mono" style={{ fontSize: 11, color: "var(--moss)" }}>WRITER</span>
          {PROFILES.map((p) => (
            <button key={p.key} className="tm-btn" onClick={() => chooseProfile(p.key)}
              style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 14, fontWeight: 700,
                background: profile === p.key ? "var(--pine)" : "var(--paper)",
                color: profile === p.key ? "var(--paper-card)" : "var(--pine-dark)",
                border: `2px solid ${profile === p.key ? "var(--pine)" : "var(--line)"}`,
              }}>{p.label}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 38 }}>{level.emoji}</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div className="tm-display" style={{ fontSize: 20, fontWeight: 800, color: "var(--pine-dark)" }}>
              Level {level.id} · {level.name}
            </div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {pstate.level >= LEVELS.length
                ? "Top level! Keep writing great pieces to stay sharp."
                : `Write ${GREAT_TO_LEVEL_UP} great pieces to reach Level ${level.id + 1}`}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {dots.map((on, i) => (
                <Star key={i} size={20} color="var(--mustard)" fill={on ? "var(--mustard)" : "none"} />
              ))}
            </div>
          </div>
          <label style={{ fontSize: 12, opacity: 0.8 }}>
            Level{" "}
            <select value={pstate.level} onChange={(e) => setLevelManual(Number(e.target.value))}
              style={{ fontFamily: "inherit", padding: 4, borderRadius: 8, border: "2px solid var(--line)" }}>
              {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.id}. {l.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      {stage === "done" && result ? (
        <DoneView result={result} revFb={revFb} onAnother={resetTask} levelName={LEVELS[result.level - 1].name} />
      ) : (
        <>
          {/* task */}
          <div className="tm-card" style={card}>
            <div className="tm-mono" style={{ fontSize: 11, color: "var(--moss)", letterSpacing: 0.5 }}>
              {genre.label.toUpperCase()}
            </div>
            <div className="tm-display" style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 10px" }}>{prompt}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <button className="tm-btn" disabled={stage !== "write"}
                onClick={() => setPromptIdx((i) => i + 1)}
                style={{ padding: "6px 12px", borderRadius: 999, background: "var(--paper)", border: "2px solid var(--line)", fontSize: 13, fontWeight: 700 }}>
                <Shuffle size={13} style={{ verticalAlign: -2 }} /> New prompt
              </button>
              {level.genres.length > 1 && level.genres.map((g, i) => (
                <button key={g.key} className="tm-btn" disabled={stage !== "write"}
                  onClick={() => { setGenreIdx(i); setPromptIdx(Math.floor(Math.random() * 50)); setTexts({}); }}
                  style={{
                    padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                    background: i === genreIdx % level.genres.length ? "var(--pine)" : "var(--paper)",
                    color: i === genreIdx % level.genres.length ? "var(--paper-card)" : "var(--pine-dark)",
                    border: "2px solid var(--line)",
                  }}>{g.label}</button>
              ))}
            </div>
            <div style={{ background: "var(--paper)", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>🔑 Today's new words — use both!</div>
              {words.map((w, i) => (
                <div key={w.w} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, marginBottom: 3 }}>
                  {wordsOk[i] ? <CheckCircle2 size={16} color="var(--pine)" /> : <Circle size={16} color="var(--moss)" />}
                  <b>{w.w}</b> <span style={{ opacity: 0.75 }}>— {w.d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* sections */}
          {(stage === "write" || stage === "checking") && (
            <div className="tm-card" style={card}>
              {genre.sections.map((s) => {
                const n = wordCountOf(texts[s.key]);
                return (
                  <div key={s.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div className="tm-display" style={{ fontWeight: 700, color: "var(--pine-dark)" }}>{s.label}</div>
                      <div className="tm-mono" style={{ fontSize: 11, color: n >= level.minWords ? "var(--pine)" : "var(--moss)" }}>
                        {n}/{level.minWords}+ words
                      </div>
                    </div>
                    <div style={{ fontSize: 12.5, opacity: 0.75, margin: "2px 0 5px" }}>{s.hint}</div>
                    <textarea className="tm-textarea" rows={level.id >= 5 ? 4 : 3} value={texts[s.key] || ""}
                      disabled={stage === "checking"}
                      onChange={(e) => setTexts((t) => ({ ...t, [s.key]: e.target.value }))} />
                  </div>
                );
              })}
              {error && (
                <div style={{ color: "var(--plum)", fontSize: 13, marginBottom: 8 }}>
                  <AlertTriangle size={14} style={{ verticalAlign: -2 }} /> Couldn't reach the Trail Guide. Try again in a moment.
                </div>
              )}
              {capped && (
                <div style={{ color: "var(--plum)", fontSize: 13, marginBottom: 8 }}>
                  You've used all of today's feedback. Come back tomorrow!
                </div>
              )}
              <button className="tm-btn" disabled={!ready || stage === "checking"} onClick={checkDraft}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 17, fontWeight: 800,
                  background: ready ? "var(--pine)" : "var(--line)", color: ready ? "var(--paper-card)" : "var(--moss)",
                  cursor: ready ? "pointer" : "not-allowed",
                }}>
                {stage === "checking" ? <><Loader2 size={16} className="tm-spin" style={{ verticalAlign: -3 }} /> Trail Guide is reading…</> : <><Wand2 size={16} style={{ verticalAlign: -3 }} /> Check my writing</>}
              </button>
              {!ready && (
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, textAlign: "center" }}>
                  Fill every box and use both new words to continue.
                </div>
              )}
            </div>
          )}

          {/* revise */}
          {(stage === "revise" || stage === "rechecking") && draftFb && (
            <div className="tm-card" style={card}>
              <div className="tm-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--pine-dark)", marginBottom: 8 }}>
                <ThumbsUp size={18} style={{ verticalAlign: -3 }} /> What you did well
              </div>
              <ul style={{ margin: "0 0 14px 18px", padding: 0, fontSize: 15 }}>
                {(draftFb.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              <div className="tm-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--plum)", marginBottom: 6 }}>
                <Lightbulb size={18} style={{ verticalAlign: -3 }} /> Your revision mission
              </div>
              <div style={{ fontSize: 14, marginBottom: 4 }}>
                In <b>{draftFb.fix.label}</b>: <i>"{draftFb.fix.original}"</i>
              </div>
              <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 2 }}>{draftFb.fix.why}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>💡 {draftFb.fix.tip}</div>
              <textarea className="tm-textarea" rows={level.id >= 5 ? 5 : 4} value={revised}
                disabled={stage === "rechecking"} onChange={(e) => setRevised(e.target.value)} />
              {error && (
                <div style={{ color: "var(--plum)", fontSize: 13, marginTop: 8 }}>
                  Couldn't reach the Trail Guide. Try again, or skip.
                  <button className="tm-btn" onClick={skipRevision} style={{ marginLeft: 8, padding: "3px 10px", borderRadius: 8, background: "var(--paper)", border: "2px solid var(--line)", fontSize: 12 }}>Skip</button>
                </div>
              )}
              <button className="tm-btn" onClick={submitRevision}
                disabled={stage === "rechecking" || revised.trim() === (texts[draftFb.fix.key] || "").trim() || wordCountOf(revised) < 4}
                style={{
                  width: "100%", marginTop: 12, padding: "12px 16px", borderRadius: 12, fontSize: 17, fontWeight: 800,
                  background: "var(--pine)", color: "var(--paper-card)",
                  opacity: revised.trim() === (texts[draftFb.fix.key] || "").trim() ? 0.5 : 1,
                }}>
                {stage === "rechecking" ? <><Loader2 size={16} className="tm-spin" style={{ verticalAlign: -3 }} /> Reading your revision…</> : "Submit my revision"}
              </button>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, textAlign: "center" }}>
                Change your writing to follow the tip, then submit.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DoneView({ result, revFb, onAnother, levelName }) {
  return (
    <div className="tm-card" style={{ padding: 22, textAlign: "center" }}>
      <div style={{ fontSize: 56 }}>{result.leveledUp ? "🎉" : "⭐"}</div>
      <div className="tm-display" style={{ fontSize: 24, fontWeight: 800, color: "var(--pine-dark)" }}>
        {result.leveledUp ? `LEVEL UP! Level ${result.level}: ${levelName}` : "Great work!"}
      </div>
      {revFb && (
        <div style={{ margin: "12px 0", fontSize: 15 }}>
          <div>{revFb.praise}</div>
          {revFb.stillTry ? <div style={{ opacity: 0.8, marginTop: 6 }}>Next time: {revFb.stillTry}</div> : null}
        </div>
      )}
      {result.score !== null && result.score < 4 && (
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>
          Keep going — a great piece (strong, with details) earns a star toward the next level.
        </div>
      )}
      {result.score !== null && result.score >= 4 && !result.leveledUp && (
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          ⭐ You earned a level star! {result.great}/{GREAT_TO_LEVEL_UP}
        </div>
      )}
      {result.learned.length > 0 && (
        <div style={{ background: "var(--paper)", borderRadius: 12, padding: 12, margin: "10px 0", fontSize: 14 }}>
          📚 New words collected: <b>{result.learned.map((w) => w.w).join(", ")}</b>
        </div>
      )}
      <button className="tm-btn" onClick={onAnother}
        style={{ padding: "12px 22px", borderRadius: 12, fontSize: 17, fontWeight: 800, background: "var(--pine)", color: "var(--paper-card)" }}>
        Write another
      </button>
    </div>
  );
}

// Shown on the Word Bank tab: every new word the writer has used.
export function CollectedWords() {
  const rows = [];
  PROFILES.forEach((p) => {
    const st = loadProfileState(p.key);
    Object.entries(st.words || {}).forEach(([w, v]) => rows.push({ who: p.label, w, ...v }));
  });
  if (rows.length === 0) return null;
  return (
    <div className="tm-card" style={{ padding: 18, marginTop: 14 }}>
      <div className="tm-display" style={{ fontSize: 18, fontWeight: 800, color: "var(--pine-dark)", marginBottom: 8 }}>
        📚 Words I've collected
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {rows.map((r) => (
          <div key={r.who + r.w} title={r.d}
            style={{ background: "var(--paper)", borderRadius: 999, padding: "5px 12px", fontSize: 13, border: "2px solid var(--line)" }}>
            <b>{r.w}</b> <span style={{ opacity: 0.6 }}>· {r.who} ×{r.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
