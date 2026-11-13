// Content for Level Quest: levels, prompts, vocabulary.
// Each level has genres; each genre has writing prompts and the sections the child fills in.

export const LEVELS = [
  {
    id: 1, name: "Super Sentences", emoji: "🌱", age: "7-8 years old (2nd grade)",
    rubric: "complete sentences, capital letters and end punctuation, at least one describing word and one detail (where/when/why) per sentence",
    minWords: 8,
    genres: [
      {
        key: "sentences", label: "Long & Vivid Sentences",
        sections: [
          { key: "s1", label: "Sentence 1", hint: "Tell WHO and WHAT, and add a describing word." },
          { key: "s2", label: "Sentence 2", hint: "Add WHERE it happened." },
          { key: "s3", label: "Sentence 3", hint: "Add WHY or HOW. Use a feeling word!" },
        ],
        prompts: [
          "A little kitten finds a mysterious box.",
          "A rainy day at the park.",
          "A robot learns to bake cookies.",
          "A dragon is afraid of the dark.",
          "The school bus takes a surprise turn.",
          "A snowman wakes up at night.",
        ],
      },
    ],
  },
  {
    id: 2, name: "Mini Story", emoji: "🐾", age: "8-9 years old (3rd grade)",
    rubric: "a clear beginning, middle and end; a character with a problem; transition words; describing words; correct punctuation",
    minWords: 12,
    genres: [
      {
        key: "story", label: "Three-Part Story",
        sections: [
          { key: "beginning", label: "Beginning", hint: "Who is in your story, where are they, and what problem happens?" },
          { key: "middle", label: "Middle", hint: "What do they try? Use trail words like First, Next, Suddenly." },
          { key: "end", label: "End", hint: "How is the problem solved? How does your character feel?" },
        ],
        prompts: [
          "A backpack that can talk.",
          "The day the playground slide turned into a waterfall.",
          "A fox who wants to learn to fly.",
          "A lost key that opens something magical.",
          "The night the stars came down to play.",
          "A class pet that escapes.",
        ],
      },
    ],
  },
  {
    id: 3, name: "Paragraph Power", emoji: "🌿", age: "9-10 years old (3rd-4th grade)",
    rubric: "a topic sentence, three supporting details with specific examples, transitions, and a closing sentence that wraps up the idea",
    minWords: 9,
    genres: [
      {
        key: "paragraph", label: "Describe & Explain",
        sections: [
          { key: "topic", label: "Topic sentence", hint: "Tell the main idea in one sentence." },
          { key: "d1", label: "Detail 1", hint: "Start with a trail word. Give a specific example." },
          { key: "d2", label: "Detail 2", hint: "Another reason or fact. Use a different trail word." },
          { key: "d3", label: "Detail 3", hint: "One more detail. Make it vivid!" },
          { key: "closing", label: "Closing sentence", hint: "Wrap it up without repeating word-for-word." },
        ],
        prompts: [
          "Describe your favorite place and why it is special.",
          "Explain how to make your favorite snack.",
          "Tell about an animal you find fascinating.",
          "Describe the best day of your year.",
          "Explain how to be a good friend.",
          "Describe a place you would love to visit.",
        ],
      },
    ],
  },
  {
    id: 4, name: "Opinion Writer", emoji: "🌳", age: "9-10 years old (4th grade)",
    rubric: "a clear opinion, two reasons each supported by a specific example or fact, linking words (because, for example, also), and a closing that restates the opinion in new words",
    minWords: 10,
    genres: [
      {
        key: "opinion", label: "Opinion (OREO)",
        sections: [
          { key: "o1", label: "O — Opinion", hint: "What do you think? Say it clearly." },
          { key: "r1", label: "R — Reason 1", hint: "Because... Give your strongest reason." },
          { key: "e1", label: "E — Example", hint: "For example... Give a real, specific example." },
          { key: "r2", label: "R — Reason 2", hint: "Another reason. Use a linking word like Also or In addition." },
          { key: "o2", label: "O — Opinion again", hint: "Say your opinion again in NEW words." },
        ],
        prompts: [
          "Should kids have longer recess?",
          "Which is the better pet: a cat or a dog?",
          "Should every school have a garden?",
          "Is it better to read a book or watch the movie?",
          "Should kids get to choose their bedtime?",
          "Is summer better than winter?",
        ],
      },
    ],
  },
  {
    id: 5, name: "Letters & Compare", emoji: "🌲", age: "10-11 years old (4th-5th grade)",
    rubric: "organized paragraphs, a clear purpose, precise word choice, varied sentence beginnings, and evidence or specific examples",
    minWords: 14,
    genres: [
      {
        key: "letter", label: "Persuasive Letter",
        sections: [
          { key: "open", label: "Greeting & purpose", hint: "Dear ___, then tell why you are writing." },
          { key: "body", label: "Your argument", hint: "Give two strong reasons with examples." },
          { key: "ask", label: "Your request", hint: "What do you want them to do?" },
          { key: "close", label: "Closing & name", hint: "Thank them, then Sincerely, your name." },
        ],
        prompts: [
          "Write to your principal asking for a class pet.",
          "Write to your parents asking to adopt a dog.",
          "Write to the mayor asking for a new park.",
          "Write to the librarian asking for more adventure books.",
        ],
      },
      {
        key: "compare", label: "Compare & Contrast",
        sections: [
          { key: "intro", label: "Introduction", hint: "Name the two things and say you will compare them." },
          { key: "alike", label: "How they are alike", hint: "At least two ways. Use Both / Similarly." },
          { key: "diff", label: "How they are different", hint: "At least two ways. Use However / On the other hand." },
          { key: "concl", label: "Conclusion", hint: "Which do you prefer, or what did you learn?" },
        ],
        prompts: [
          "Compare cats and dogs.",
          "Compare living in the city and in the country.",
          "Compare reading a book and playing a video game.",
          "Compare summer and winter.",
        ],
      },
    ],
  },
  {
    id: 6, name: "Essay Master", emoji: "🏔️", age: "10-12 years old (5th grade and up)",
    rubric: "an introduction with a hook and a clear main idea, three body paragraphs each with a topic sentence and evidence, smooth transitions, strong vocabulary, and a conclusion that goes beyond repeating the introduction",
    minWords: 25,
    genres: [
      {
        key: "essay", label: "Five-Part Essay",
        sections: [
          { key: "intro", label: "Introduction", hint: "Start with a hook. End with your main idea." },
          { key: "b1", label: "Body 1", hint: "Topic sentence + evidence + explanation." },
          { key: "b2", label: "Body 2", hint: "A new idea. Link it to Body 1 with a transition." },
          { key: "b3", label: "Body 3", hint: "Your strongest point. Use precise words." },
          { key: "concl", label: "Conclusion", hint: "Leave the reader thinking. Don't just copy your intro." },
        ],
        prompts: [
          "Should schools start later in the morning?",
          "What makes someone a hero?",
          "Is technology good for kids? Argue one side.",
          "Explain how a small kindness can change someone's day.",
          "What is the most important invention in history, and why?",
        ],
      },
    ],
  },
];

// Daily new words: { w, d } (word + kid-friendly meaning)
export const LEVEL_WORDS = {
  1: [
    { w: "enormous", d: "very, very big" }, { w: "tiny", d: "very small" },
    { w: "sparkling", d: "shining with little flashes" }, { w: "whispered", d: "spoke very softly" },
    { w: "delighted", d: "very happy" }, { w: "scurried", d: "ran quickly with small steps" },
    { w: "gloomy", d: "dark and sad-looking" }, { w: "fluffy", d: "soft and light like a cloud" },
    { w: "peered", d: "looked carefully" }, { w: "tumbled", d: "fell and rolled" },
    { w: "puzzled", d: "confused, not sure" }, { w: "shimmering", d: "shining with a soft light" },
  ],
  2: [
    { w: "suddenly", d: "all at once, without warning" }, { w: "determined", d: "not giving up" },
    { w: "mysterious", d: "strange and hard to explain" }, { w: "adventure", d: "an exciting trip or event" },
    { w: "nervous", d: "a little scared or worried" }, { w: "discovered", d: "found something new" },
    { w: "frantic", d: "so worried you move fast" }, { w: "grateful", d: "thankful" },
    { w: "treasure", d: "something very special or valuable" }, { w: "echoed", d: "a sound that bounced back" },
    { w: "hesitated", d: "paused because unsure" }, { w: "triumphant", d: "feeling like a winner" },
  ],
  3: [
    { w: "fascinating", d: "so interesting you can't look away" }, { w: "unique", d: "one of a kind" },
    { w: "essential", d: "really important, must-have" }, { w: "particularly", d: "especially" },
    { w: "consequently", d: "so, as a result" }, { w: "vivid", d: "bright and clear" },
    { w: "habitat", d: "the place an animal lives" }, { w: "ingredient", d: "one thing in a recipe" },
    { w: "peculiar", d: "odd or unusual" }, { w: "remarkable", d: "worth noticing" },
    { w: "ordinary", d: "normal, not special" }, { w: "genuine", d: "real, not fake" },
  ],
  4: [
    { w: "convince", d: "make someone agree" }, { w: "evidence", d: "facts that prove something" },
    { w: "benefit", d: "a good result" }, { w: "therefore", d: "so, for that reason" },
    { w: "beneficial", d: "good for you" }, { w: "obvious", d: "easy to see" },
    { w: "responsible", d: "can be trusted to do the right thing" }, { w: "opportunity", d: "a chance to do something" },
    { w: "persuade", d: "get someone to agree with you" }, { w: "valuable", d: "very useful or worth a lot" },
    { w: "consider", d: "think carefully about" }, { w: "furthermore", d: "also, what's more" },
  ],
  5: [
    { w: "persuasive", d: "good at making people agree" }, { w: "contrast", d: "show how things are different" },
    { w: "similarly", d: "in the same way" }, { w: "perspective", d: "a way of looking at something" },
    { w: "significant", d: "important, big enough to matter" }, { w: "conclude", d: "decide after thinking" },
    { w: "assume", d: "think something is true without proof" }, { w: "emphasize", d: "give extra importance to" },
    { w: "inevitable", d: "sure to happen" }, { w: "reluctant", d: "not wanting to do something" },
    { w: "accomplish", d: "finish something successfully" }, { w: "nevertheless", d: "even so" },
  ],
  6: [
    { w: "controversial", d: "people argue about it" }, { w: "perseverance", d: "keep trying even when it's hard" },
    { w: "diminish", d: "make smaller or less" }, { w: "substantial", d: "large and important" },
    { w: "inspire", d: "make others want to do something good" }, { w: "ambitious", d: "wants to achieve big things" },
    { w: "profound", d: "very deep and meaningful" }, { w: "illustrate", d: "show clearly with an example" },
    { w: "undermine", d: "weaken slowly" }, { w: "compelling", d: "so strong you can't ignore it" },
    { w: "inherent", d: "built in, part of something" }, { w: "resilient", d: "bounces back from trouble" },
  ],
};

export function wordUsed(text, word) {
  const t = String(text || "").toLowerCase();
  const w = word.toLowerCase();
  const stem = w.length > 6 ? w.slice(0, w.length - 2) : w.length > 4 ? w.slice(0, w.length - 1) : w;
  return new RegExp("\\b" + stem.replace(/[^a-z]/g, "")).test(t);
}

export function todayWords(level, profile, dateISO) {
  const pool = LEVEL_WORDS[level] || LEVEL_WORDS[1];
  let h = 0;
  for (const ch of profile + dateISO) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const a = h % pool.length;
  const b = (a + 1 + ((h >>> 3) % (pool.length - 1))) % pool.length;
  return [pool[a], pool[b]];
}

export const DEFAULT_LEVEL = { leyna: 2, lea: 4 };
export const GREAT_TO_LEVEL_UP = 3;
