import React, { useState, useEffect, useCallback } from "react";
import {
  Footprints,
  Feather,
  Compass,
  BookOpen,
  Star,
  PenLine,
  Sparkles,
  Shuffle,
  CheckCircle2,
  Circle,
  TreePine,
  MapPin,
  Loader2,
  AlertTriangle,
  ThumbsUp,
  Lightbulb,
  Wand2,
} from "lucide-react";

const FONT_LINK_ID = "trailmarks-fonts";

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

const STORY_CHARACTERS = [
  { emoji: "🦊", label: "a sneaky fox" },
  { emoji: "🐉", label: "a tiny dragon who's afraid of fire" },
  { emoji: "👽", label: "a lost alien" },
  { emoji: "🕵️", label: "a nosy raccoon detective" },
  { emoji: "🦸", label: "a kid with a secret superpower" },
  { emoji: "🧙", label: "a young wizard who keeps messing up spells" },
  { emoji: "🐙", label: "an octopus who wants to be a chef" },
  { emoji: "🤖", label: "a robot learning how to feel emotions" },
  { emoji: "🐢", label: "the slowest turtle in the whole town" },
  { emoji: "🦁", label: "a lion who is scared of mice" },
];

const STORY_SETTINGS = [
  { emoji: "🏰", label: "a castle that floats in the clouds" },
  { emoji: "🌋", label: "the top of a rumbling volcano" },
  { emoji: "🕳️", label: "a hole that leads to a secret world" },
  { emoji: "🚀", label: "a spaceship with a broken engine" },
  { emoji: "🌲", label: "a forest where the trees whisper" },
  { emoji: "🏝️", label: "an island that only appears at night" },
  { emoji: "🏫", label: "a school after all the lights go out" },
  { emoji: "🌊", label: "an underwater city made of bubbles" },
  { emoji: "🎪", label: "a circus that only opens at midnight" },
  { emoji: "🛒", label: "a grocery store where nothing stays on the shelves" },
];

const STORY_PROBLEMS = [
  { emoji: "🗺️", label: "found a map with no ending" },
  { emoji: "👂", label: "heard a strange noise coming from nowhere" },
  { emoji: "🤫", label: "discovered a best friend was hiding a big secret" },
  { emoji: "🐜", label: "accidentally shrank to the size of an ant" },
  { emoji: "🔑", label: "lost the one thing needed most" },
  { emoji: "💨", label: "woke up and everyone else had disappeared" },
  { emoji: "🚪", label: "found a door that wasn't there yesterday" },
  { emoji: "✉️", label: "got a mysterious invitation with no name on it" },
  { emoji: "🌀", label: "got turned upside down by a strange wind" },
  { emoji: "🧩", label: "found a puzzle piece that didn't belong to any puzzle" },
];

function randomIndex(len, excludeIndex) {
  if (len <= 1) return 0;
  let next = Math.floor(Math.random() * len);
  if (excludeIndex !== undefined) {
    while (next === excludeIndex) next = Math.floor(Math.random() * len);
  }
  return next;
}

function pickRandomSpark() {
  return {
    characterIdx: randomIndex(STORY_CHARACTERS.length),
    settingIdx: randomIndex(STORY_SETTINGS.length),
    problemIdx: randomIndex(STORY_PROBLEMS.length),
  };
}

function beginningStarter(spark) {
  const character = STORY_CHARACTERS[spark.characterIdx].label;
  const setting = STORY_SETTINGS[spark.settingIdx].label;
  const problem = STORY_PROBLEMS[spark.problemIdx].label;
  return `One day, ${character} was exploring ${setting} when they ${problem}.`;
}

function middleHint(spark) {
  const character = STORY_CHARACTERS[spark.characterIdx].label;
  return `What did ${character} try first? Did the plan work, or did something go wrong?`;
}

function endHint(spark) {
  const character = STORY_CHARACTERS[spark.characterIdx].label;
  return `How does it end? How does ${character} feel now — relieved, proud, surprised?`;
}

const STRUCTURE = [
  { key: "beginning", label: "Beginning" },
  { key: "middle", label: "Middle" },
  { key: "end", label: "End" },
];

const CHECKLIST = [
  { key: "capital", label: "Every sentence starts with a capital letter" },
  { key: "punctuation", label: "Every sentence ends with . ! or ?" },
  { key: "complete", label: "Each sentence is a complete thought" },
  { key: "describing", label: "I used at least one describing word" },
  { key: "spelled", label: "I spelled tricky words the best I can" },
];

const WORD_BANK = [
  {
    title: "Feeling Words",
    icon: Sparkles,
    words: ["excited", "nervous", "proud", "curious", "silly", "brave", "surprised", "cozy"],
  },
  {
    title: "Size & Shape",
    icon: Compass,
    words: ["tiny", "enormous", "round", "wiggly", "gigantic", "narrow", "towering", "flat"],
  },
  {
    title: "Color & Texture",
    icon: TreePine,
    words: ["sparkly", "fuzzy", "smooth", "bumpy", "shiny", "faded", "silky", "rough"],
  },
  {
    title: "Trail Words (transitions)",
    icon: Footprints,
    words: ["First,", "Next,", "After that,", "Then,", "Suddenly,", "Finally,", "Because", "Also,"],
  },
];

const SENTENCE_BASE = "The dog ran.";
const SENTENCE_QUESTIONS = [
  { key: "who", label: "What kind of dog? (add a describing word)" },
  { key: "where", label: "Where did it run?" },
  { key: "when", label: "When did this happen?" },
  { key: "why", label: "Why did it run?" },
  { key: "how", label: "How did it run? (fast, quietly, happily...)" },
];
const SENTENCE_EXAMPLE =
  "The scruffy brown dog ran quickly across the muddy field this morning because it wanted to catch the ball.";

async function fetchTrailGuideFeedback(writing) {
  const userPrompt = `A young writer (age 8-9, 3rd grade) wrote this story draft in three parts.

Beginning: ${writing.beginning}
Middle: ${writing.middle}
End: ${writing.end}

Respond ONLY with a JSON object (no markdown code fences, no extra text before or after) with exactly these fields:
{
  "strengths": ["short specific praise about something they actually did well", "a second one if there's a genuine second thing (1-2 total)"],
  "suggestion": "one specific, actionable, kid-friendly tip to improve this exact draft",
  "tryThis": "pick one real sentence from their draft and show a slightly more descriptive rewrite of it, in quotes",
  "encouragement": "one short cheerful closing sentence"
}

Rules: warm and encouraging like a supportive elementary teacher, specific to what they actually wrote (reference real details from the draft, not generic praise), never mention a score/grade/rubric, keep language simple enough for an 8-9 year old, strengths items under 12 words each, suggestion under 22 words, tryThis under 30 words, encouragement under 15 words.`;

  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userPrompt }),
  });
  if (!response.ok) {
    throw new Error("Feedback request failed");
  }
  const data = await response.json();
  const clean = String(data.text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const DAILY_FEEDBACK_LIMIT = 5;

function getFeedbackUsageToday() {
  try {
    const raw = localStorage.getItem("trailmarks-feedback-usage");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.date === todayISO()) return parsed.count || 0;
    }
  } catch (e) {
    // ignore — treat as no usage yet
  }
  return 0;
}

function recordFeedbackUsage() {
  try {
    const count = getFeedbackUsageToday() + 1;
    localStorage.setItem("trailmarks-feedback-usage", JSON.stringify({ date: todayISO(), count }));
    return count;
  } catch (e) {
    return null;
  }
}

function computeStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const iso = cursor.toISOString().slice(0, 10);
    if (set.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function TrailmarksJournal() {
  useGoogleFonts();

  const [activeTab, setActiveTab] = useState("trail");
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [stampCount, setStampCount] = useState(0);
  const [completedDates, setCompletedDates] = useState([]);
  const [celebrate, setCelebrate] = useState(false);

  const [spark, setSpark] = useState(() => pickRandomSpark());
  const [writing, setWriting] = useState({ beginning: "", middle: "", end: "" });
  const [checklist, setChecklist] = useState({});

  const [sentenceAnswers, setSentenceAnswers] = useState({});
  const [expandedSentence, setExpandedSentence] = useState("");

  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackError, setFeedbackError] = useState(false);
  const [feedbackCapped, setFeedbackCapped] = useState(false);
  const [feedbackUsage, setFeedbackUsage] = useState(0);

  // Load progress
  useEffect(() => {
    try {
      const raw = localStorage.getItem("trailmarks-progress");
      if (raw) {
        const parsed = JSON.parse(raw);
        setStampCount(parsed.stampCount || 0);
        setCompletedDates(parsed.completedDates || []);
      }
    } catch (e) {
      // storage unavailable or corrupt — start fresh
    } finally {
      setLoaded(true);
    }
    setFeedbackUsage(getFeedbackUsageToday());
  }, []);

  const saveProgress = useCallback((nextStampCount, nextDates) => {
    try {
      localStorage.setItem(
        "trailmarks-progress",
        JSON.stringify({ stampCount: nextStampCount, completedDates: nextDates })
      );
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, []);

  const streak = computeStreak(completedDates);
  const stonesFilled = stampCount % 10;

  const allChecked = CHECKLIST.every((item) => checklist[item.key]);
  const hasWritten =
    writing.beginning.trim().length > 0 &&
    writing.middle.trim().length > 0 &&
    writing.end.trim().length > 0;
  const wordCount = Object.values(writing)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  function toggleCheck(key) {
    setChecklist((c) => ({ ...c, [key]: !c[key] }));
  }

  function rerollSpark() {
    setSpark(pickRandomSpark());
  }

  function rerollSparkPart(part) {
    setSpark((s) => {
      if (part === "character") return { ...s, characterIdx: randomIndex(STORY_CHARACTERS.length, s.characterIdx) };
      if (part === "setting") return { ...s, settingIdx: randomIndex(STORY_SETTINGS.length, s.settingIdx) };
      if (part === "problem") return { ...s, problemIdx: randomIndex(STORY_PROBLEMS.length, s.problemIdx) };
      return s;
    });
  }

  async function finishWriting() {
    if (!hasWritten || !allChecked) return;

    setFeedback(null);
    setFeedbackError(false);
    setFeedbackCapped(false);

    if (feedbackUsage >= DAILY_FEEDBACK_LIMIT) {
      setFeedbackCapped(true);
    } else {
      setFeedbackLoading(true);
      try {
        const result = await fetchTrailGuideFeedback(writing);
        setFeedback(result);
        const newCount = recordFeedbackUsage();
        if (newCount !== null) setFeedbackUsage(newCount);
      } catch (e) {
        setFeedbackError(true);
      } finally {
        setFeedbackLoading(false);
      }
    }

    const today = todayISO();
    const nextDates = completedDates.includes(today)
      ? completedDates
      : [...completedDates, today].slice(-60);
    const nextStamps = stampCount + 1;
    setStampCount(nextStamps);
    setCompletedDates(nextDates);
    saveProgress(nextStamps, nextDates);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2600);
  }

  function resetWritingSession() {
    setWriting({ beginning: "", middle: "", end: "" });
    setChecklist({});
    setFeedback(null);
    setFeedbackError(false);
    setFeedbackCapped(false);
    rerollSpark();
  }

  function updateSentenceAnswer(key, value) {
    setSentenceAnswers((a) => ({ ...a, [key]: value }));
  }

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "var(--paper)",
        minHeight: "100%",
        color: "var(--ink)",
        "--paper": "#F1E8D0",
        "--paper-card": "#FAF5E6",
        "--ink": "#2B2519",
        "--pine": "#33513F",
        "--pine-dark": "#22362B",
        "--moss": "#7A9471",
        "--mustard": "#DCA83B",
        "--plum": "#8C3B5E",
        "--line": "#D8CBA3",
        padding: "0",
      }}
    >
      <style>{`
        .tm-display { font-family: 'Baloo 2', sans-serif; }
        .tm-mono { font-family: 'Space Mono', monospace; }
        .tm-btn {
          font-family: 'Baloo 2', sans-serif;
          border: none;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .tm-btn:hover { transform: translateY(-2px); }
        .tm-btn:active { transform: translateY(0px); }
        .tm-btn:focus-visible { outline: 3px solid var(--pine); outline-offset: 2px; }
        .tm-tab:focus-visible { outline: 3px solid var(--mustard); outline-offset: -3px; }
        .tm-input, .tm-textarea {
          font-family: 'Nunito', sans-serif;
          border: 2px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          color: var(--ink);
          width: 100%;
          box-sizing: border-box;
        }
        .tm-textarea:focus, .tm-input:focus { outline: none; border-color: var(--pine); }
        .tm-card {
          background: var(--paper-card);
          border-radius: 16px;
          box-shadow: 0 2px 0 var(--line), 0 8px 20px rgba(43,37,25,0.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-btn, .tm-stone { transition: none !important; }
          .tm-spin { animation: none !important; }
        }
        .tm-spin { animation: tm-spin-anim 0.9s linear infinite; }
        @keyframes tm-spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 40px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "var(--pine)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Footprints size={22} color="var(--paper-card)" />
          </div>
          <div>
            <div className="tm-display" style={{ fontSize: 22, fontWeight: 700, color: "var(--pine-dark)", lineHeight: 1.1 }}>
              Trailmarks
            </div>
            <div className="tm-mono" style={{ fontSize: 11, color: "var(--moss)", letterSpacing: 0.5 }}>
              A YOUNG WRITER'S FIELD JOURNAL
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
          role="tablist"
        >
          {[
            { key: "trail", label: "Trail Map", icon: MapPin },
            { key: "write", label: "Story Spark", icon: PenLine },
            { key: "sentence", label: "Sentence Builder", icon: Feather },
            { key: "words", label: "Word Bank", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active}
                className="tm-btn tm-tab"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  background: active ? "var(--pine)" : "var(--paper-card)",
                  color: active ? "var(--paper-card)" : "var(--pine-dark)",
                  border: `2px solid ${active ? "var(--pine)" : "var(--line)"}`,
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {!loaded ? (
          <div style={{ padding: 24, textAlign: "center", color: "var(--moss)" }}>Opening the journal…</div>
        ) : (
          <>
            {activeTab === "trail" && (
              <TrailView
                stampCount={stampCount}
                stonesFilled={stonesFilled}
                streak={streak}
                onStart={() => setActiveTab("write")}
                saveError={saveError}
              />
            )}

            {activeTab === "write" && (
              <WriteView
                spark={spark}
                onRerollAll={rerollSpark}
                onRerollPart={rerollSparkPart}
                writing={writing}
                setWriting={setWriting}
                checklist={checklist}
                toggleCheck={toggleCheck}
                allChecked={allChecked}
                hasWritten={hasWritten}
                wordCount={wordCount}
                onFinish={finishWriting}
                celebrate={celebrate}
                feedbackLoading={feedbackLoading}
                feedback={feedback}
                feedbackError={feedbackError}
                feedbackCapped={feedbackCapped}
                feedbackUsage={feedbackUsage}
                feedbackLimit={DAILY_FEEDBACK_LIMIT}
                onWriteAnother={resetWritingSession}
              />
            )}

            {activeTab === "sentence" && (
              <SentenceView
                sentenceAnswers={sentenceAnswers}
                updateSentenceAnswer={updateSentenceAnswer}
                expandedSentence={expandedSentence}
                setExpandedSentence={setExpandedSentence}
              />
            )}

            {activeTab === "words" && <WordBankView />}
          </>
        )}
      </div>
    </div>
  );
}

function TrailView({ stampCount, stonesFilled, streak, onStart, saveError }) {
  return (
    <div>
      <div className="tm-card" style={{ padding: 22, marginBottom: 14 }}>
        <div className="tm-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--pine-dark)", marginBottom: 4 }}>
          This season's trail
        </div>
        <div style={{ fontSize: 14, color: "var(--ink)", opacity: 0.8, marginBottom: 18 }}>
          Finish a writing challenge to earn a paw stamp and move down the trail.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "6px 0 10px",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = i < stonesFilled;
            return (
              <React.Fragment key={i}>
                <div
                  className="tm-stone"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: filled ? "var(--mustard)" : "var(--paper)",
                    border: `2px solid ${filled ? "var(--mustard)" : "var(--line)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {filled ? <Star size={18} color="var(--pine-dark)" fill="var(--pine-dark)" /> : <Circle size={10} color="var(--line)" />}
                </div>
                {i < 9 && <div style={{ width: 14, height: 2, background: "var(--line)" }} />}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          <StatPill icon={Star} label="Total stamps" value={stampCount} />
          <StatPill icon={Sparkles} label="Day streak" value={streak} />
        </div>
      </div>

      <button
        className="tm-btn"
        onClick={onStart}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: 14,
          background: "var(--plum)",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <PenLine size={18} />
        Start today's writing challenge
      </button>

      {saveError && (
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--plum)", textAlign: "center" }}>
          Progress couldn't be saved this time — you can still write, it just may not carry over.
        </div>
      )}
    </div>
  );
}

function StatPill({ icon: Icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "var(--paper)",
        border: "2px solid var(--line)",
        borderRadius: 999,
        padding: "8px 14px",
      }}
    >
      <Icon size={16} color="var(--pine)" />
      <span className="tm-mono" style={{ fontSize: 14, fontWeight: 700 }}>{value}</span>
      <span style={{ fontSize: 12, color: "var(--ink)", opacity: 0.7 }}>{label}</span>
    </div>
  );
}

function SparkPiece({ emoji, tag, label, onReroll }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--paper)",
        border: "2px solid var(--line)",
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tm-mono" style={{ fontSize: 10, color: "var(--moss)", marginBottom: 1 }}>
          {tag.toUpperCase()}
        </div>
        <div style={{ fontSize: 14, color: "var(--ink)", fontWeight: 700 }}>{label}</div>
      </div>
      <button
        className="tm-btn"
        onClick={onReroll}
        aria-label={`Reroll ${tag}`}
        style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: 8,
          background: "var(--paper-card)",
          border: "2px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Shuffle size={13} color="var(--pine)" />
      </button>
    </div>
  );
}

function WriteView({
  spark,
  onRerollAll,
  onRerollPart,
  writing,
  setWriting,
  checklist,
  toggleCheck,
  allChecked,
  hasWritten,
  wordCount,
  onFinish,
  celebrate,
  feedbackLoading,
  feedback,
  feedbackError,
  feedbackCapped,
  feedbackUsage,
  feedbackLimit,
  onWriteAnother,
}) {
  const finished = !feedbackLoading && (feedback || feedbackError || feedbackCapped);
  const starter = beginningStarter(spark);

  function useStarter() {
    setWriting((w) => ({ ...w, beginning: starter }));
  }

  const hints = {
    beginning: `Not sure how to start? Try the sentence below, or write your own.`,
    middle: middleHint(spark),
    end: endHint(spark),
  };

  return (
    <div>
      <div className="tm-card" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="tm-mono" style={{ fontSize: 11, color: "var(--moss)" }}>YOUR STORY SPARK</div>
          <button
            className="tm-btn"
            onClick={onRerollAll}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--paper)",
              border: "2px solid var(--line)",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--pine)",
            }}
          >
            <Shuffle size={13} />
            New spark
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SparkPiece
            emoji={STORY_CHARACTERS[spark.characterIdx].emoji}
            tag="Someone"
            label={STORY_CHARACTERS[spark.characterIdx].label}
            onReroll={() => onRerollPart("character")}
          />
          <SparkPiece
            emoji={STORY_SETTINGS[spark.settingIdx].emoji}
            tag="Somewhere"
            label={STORY_SETTINGS[spark.settingIdx].label}
            onReroll={() => onRerollPart("setting")}
          />
          <SparkPiece
            emoji={STORY_PROBLEMS[spark.problemIdx].emoji}
            tag="Something happens"
            label={STORY_PROBLEMS[spark.problemIdx].label}
            onReroll={() => onRerollPart("problem")}
          />
        </div>
      </div>

      {STRUCTURE.map((section) => (
        <div key={section.key} className="tm-card" style={{ padding: 18, marginBottom: 12 }}>
          <div className="tm-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--pine)", marginBottom: 3 }}>
            {section.label}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink)", opacity: 0.75, marginBottom: 8 }}>{hints[section.key]}</div>
          {section.key === "beginning" && (
            <div
              style={{
                fontSize: 13,
                fontStyle: "italic",
                color: "var(--ink)",
                background: "var(--paper)",
                border: "2px dashed var(--line)",
                borderRadius: 10,
                padding: "8px 12px",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>{starter}</span>
              <button
                className="tm-btn"
                onClick={useStarter}
                style={{
                  flexShrink: 0,
                  background: "var(--pine)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Use this
              </button>
            </div>
          )}
          <textarea
            className="tm-textarea"
            rows={3}
            value={writing[section.key]}
            onChange={(e) => setWriting((w) => ({ ...w, [section.key]: e.target.value }))}
            placeholder="Write here..."
          />
        </div>
      ))}

      <div className="tm-card" style={{ padding: 18, marginBottom: 14 }}>
        <div className="tm-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--pine)", marginBottom: 10 }}>
          Check your work
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CHECKLIST.map((item) => {
            const checked = !!checklist[item.key];
            return (
              <button
                key={item.key}
                className="tm-btn"
                onClick={() => toggleCheck(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  padding: "4px 2px",
                  textAlign: "left",
                  fontSize: 14,
                  color: "var(--ink)",
                }}
              >
                {checked ? (
                  <CheckCircle2 size={20} color="var(--pine)" />
                ) : (
                  <Circle size={20} color="var(--line)" />
                )}
                <span style={{ textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.6 : 1 }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 12, color: "var(--ink)", opacity: 0.6, marginBottom: 10, textAlign: "center" }}>
        {wordCount} words so far
      </div>

      {!finished && (
        <>
          <button
            className="tm-btn"
            onClick={onFinish}
            disabled={!hasWritten || !allChecked || feedbackLoading}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 14,
              background: hasWritten && allChecked ? "var(--pine)" : "var(--line)",
              color: hasWritten && allChecked ? "#fff" : "var(--ink)",
              fontSize: 16,
              fontWeight: 700,
              cursor: hasWritten && allChecked && !feedbackLoading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {feedbackLoading ? (
              <>
                <Loader2 size={18} className="tm-spin" />
                The Trail Guide is reading...
              </>
            ) : celebrate ? (
              "Stamp earned! 🎉"
            ) : (
              "I'm done — get feedback & earn my stamp"
            )}
          </button>
          {(!hasWritten || !allChecked) && !feedbackLoading && (
            <div style={{ fontSize: 12, color: "var(--ink)", opacity: 0.55, textAlign: "center", marginTop: 6 }}>
              Fill in all three parts and check every box to get feedback and a stamp.
            </div>
          )}
          {hasWritten && allChecked && !feedbackLoading && typeof feedbackUsage === "number" && (
            <div style={{ fontSize: 12, color: "var(--ink)", opacity: 0.5, textAlign: "center", marginTop: 6 }}>
              {Math.max(feedbackLimit - feedbackUsage, 0)} of {feedbackLimit} Trail Guide feedbacks left today
            </div>
          )}
        </>
      )}

      {(feedback || feedbackError || feedbackCapped) && (
        <FeedbackCard
          feedback={feedback}
          error={feedbackError}
          capped={feedbackCapped}
          onWriteAnother={onWriteAnother}
        />
      )}
    </div>
  );
}

function FeedbackCard({ feedback, error, capped, onWriteAnother }) {
  return (
    <div
      className="tm-card"
      style={{
        padding: 20,
        marginTop: 4,
        border: "2px solid var(--pine)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Compass size={20} color="var(--pine)" />
        <div className="tm-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--pine-dark)" }}>
          Trail Guide feedback
        </div>
      </div>

      {capped ? (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14 }}>
          <Star size={18} color="var(--mustard)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            You've used up today's Trail Guide feedback — but your stamp is still earned! More feedback opens up
            again tomorrow.
          </span>
        </div>
      ) : error ? (
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 14 }}>
          <AlertTriangle size={18} color="var(--plum)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            The Trail Guide couldn't read your story just now — but your stamp is still earned! Try again next time
            for feedback.
          </span>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 13, fontWeight: 700, color: "var(--pine)" }}>
                <ThumbsUp size={15} /> What's working
              </div>
              <ul style={{ margin: 0, paddingLeft: 22, fontSize: 14 }}>
                {feedback.strengths.map((s, i) => (
                  <li key={i} style={{ marginBottom: 3 }}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {feedback.suggestion && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 13, fontWeight: 700, color: "var(--pine)" }}>
                <Lightbulb size={15} /> Try this next
              </div>
              <div style={{ fontSize: 14 }}>{feedback.suggestion}</div>
            </div>
          )}

          {feedback.tryThis && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, fontSize: 13, fontWeight: 700, color: "var(--pine)" }}>
                <Wand2 size={15} /> A stronger sentence
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  background: "var(--paper)",
                  border: "2px dashed var(--line)",
                  borderRadius: 10,
                  padding: "8px 12px",
                }}
              >
                {feedback.tryThis}
              </div>
            </div>
          )}

          {feedback.encouragement && (
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--plum)" }}>{feedback.encouragement}</div>
          )}
        </div>
      )}

      <button
        className="tm-btn"
        onClick={onWriteAnother}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "11px 16px",
          borderRadius: 12,
          background: "var(--paper)",
          border: "2px solid var(--line)",
          color: "var(--pine-dark)",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Write another entry
      </button>
    </div>
  );
}

function SentenceView({ sentenceAnswers, updateSentenceAnswer, expandedSentence, setExpandedSentence }) {
  const [showExample, setShowExample] = useState(false);
  return (
    <div>
      <div className="tm-card" style={{ padding: 20, marginBottom: 14 }}>
        <div className="tm-mono" style={{ fontSize: 11, color: "var(--moss)", marginBottom: 4 }}>SENTENCE BUILDER</div>
        <div className="tm-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--pine-dark)", marginBottom: 6 }}>
          Grow a small sentence into a big one
        </div>
        <div
          style={{
            fontSize: 15,
            fontStyle: "italic",
            color: "var(--ink)",
            background: "var(--paper)",
            border: "2px dashed var(--line)",
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          {SENTENCE_BASE}
        </div>
      </div>

      <div className="tm-card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: "var(--ink)", opacity: 0.75, marginBottom: 10 }}>
          Answer these questions about the sentence:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SENTENCE_QUESTIONS.map((q) => (
            <div key={q.key}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "var(--pine)", display: "block", marginBottom: 4 }}>
                {q.label}
              </label>
              <input
                className="tm-input"
                value={sentenceAnswers[q.key] || ""}
                onChange={(e) => updateSentenceAnswer(q.key, e.target.value)}
                placeholder="Type your idea..."
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tm-card" style={{ padding: 18, marginBottom: 14 }}>
        <div className="tm-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--pine)", marginBottom: 6 }}>
          Now write your big sentence
        </div>
        <div style={{ fontSize: 13, color: "var(--ink)", opacity: 0.75, marginBottom: 8 }}>
          Use your answers above to turn "{SENTENCE_BASE}" into one longer, more exciting sentence.
        </div>
        <textarea
          className="tm-textarea"
          rows={3}
          value={expandedSentence}
          onChange={(e) => setExpandedSentence(e.target.value)}
          placeholder="The ... dog ran ... because ..."
        />
      </div>

      <button
        className="tm-btn"
        onClick={() => setShowExample((s) => !s)}
        style={{
          background: "var(--paper-card)",
          border: "2px solid var(--line)",
          borderRadius: 12,
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
          color: "var(--pine)",
          width: "100%",
        }}
      >
        {showExample ? "Hide example" : "Stuck? See one example"}
      </button>
      {showExample && (
        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            fontStyle: "italic",
            color: "var(--ink)",
            background: "var(--paper)",
            border: "2px dashed var(--line)",
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          {SENTENCE_EXAMPLE}
        </div>
      )}
    </div>
  );
}

function WordBankView() {
  return (
    <div>
      {WORD_BANK.map((group) => {
        const Icon = group.icon;
        return (
          <div key={group.title} className="tm-card" style={{ padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Icon size={18} color="var(--pine)" />
              <div className="tm-display" style={{ fontSize: 15, fontWeight: 700, color: "var(--pine-dark)" }}>
                {group.title}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {group.words.map((w) => (
                <span
                  key={w}
                  style={{
                    background: "var(--paper)",
                    border: "2px solid var(--line)",
                    borderRadius: 999,
                    padding: "5px 12px",
                    fontSize: 13,
                    color: "var(--ink)",
                  }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
