// Add icon_prompt to sentence frames for visual anchoring
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const PACKS_DIR = join(process.cwd(), 'data', 'packs');

// Icon mappings based on common sentence frame themes
const iconMappings = {
  'asking-for-help': {
    'I need help.': 'A raised hand with a question mark',
    'Can you help me?': 'Two hands reaching toward each other',
    'Please help me.': 'A child with hands together in a pleading gesture',
    "I don't understand.": 'A confused face with a question mark above',
    'Show me, please.': 'A pointing finger and an eye',
    'What is this?': 'A magnifying glass over an object',
    "I can't do it.": 'A child looking at a difficult task with a thought bubble',
    'Help me with ___.': 'A wrench or tool icon representing assistance',
  },
  'basic-greetings': {
    default_patterns: {
      'hello|hi|good morning|good afternoon': 'A waving hand',
      'goodbye|bye|see you': 'A hand waving goodbye',
      'name|my name': 'A name tag or badge',
      'how are you|how do you feel': 'A smiley face',
      'thank|thanks': 'A heart or thumbs up',
      'please': 'Hands pressed together politely',
      'sorry|excuse': 'A person bowing slightly',
      'yes|no': 'A checkmark and X mark',
    },
  },
  'classroom-instructions': {
    default_patterns: {
      'sit|seat': 'A chair with a downward arrow',
      'stand|line up': 'A person standing with an upward arrow',
      'listen|quiet': 'An ear icon',
      'look|watch|see': 'An eye icon',
      'write|pencil': 'A pencil writing on paper',
      'read': 'An open book',
      'open|close': 'A book opening or closing',
      'raise|hand': 'A raised hand',
      'share|turn': 'Two arrows forming a circle',
      'clean|put away': 'A broom or tidy desk',
      'stop': 'A stop sign or raised palm',
      'walk': 'Footprints in a line',
    },
  },
  'expressing-feelings': {
    default_patterns: {
      'happy|glad|excited': 'A smiling face with bright eyes',
      'sad|upset|cry': 'A face with a tear',
      'angry|mad|frustrated': 'A face with furrowed brows',
      'scared|afraid|nervous': 'A face with wide eyes and shaking lines',
      'tired|sleepy': 'A face with closed eyes and a yawn',
      'surprised|wow': 'A face with an open mouth and wide eyes',
      'proud|great': 'A face with a big smile and a star',
      'confused|don\'t know': 'A face with a question mark',
      'lonely|alone': 'A single figure standing apart',
      'love|like|enjoy': 'A heart icon',
    },
  },
  'sharing-taking-turns': {
    default_patterns: {
      'share|give': 'Two hands exchanging an object',
      'turn|my turn|your turn': 'A circular arrow indicating rotation',
      'wait|patient': 'A clock or hourglass',
      'together|play': 'Two children playing side by side',
      'ask|may I|can I': 'A speech bubble with a question mark',
      'thank': 'A thumbs up or heart',
      'sorry': 'A person with an apologetic expression',
      'fair|equal': 'A balance scale',
    },
  },
  'academic-discussion': {
    default_patterns: {
      'think|opinion|believe': 'A thought bubble with a lightbulb',
      'agree': 'A thumbs up icon',
      'disagree': 'A thumbs down icon',
      'explain|clarify': 'A speech bubble with lines of text',
      'evidence|text|page': 'A document with a magnifying glass',
      'summarize|summary': 'A large document shrinking into a small note',
      'remind|connect': 'A chain link or connection icon',
      'notice|observe': 'An eye with a sparkle',
      'question|ask|what do you': 'A question mark in a speech bubble',
      'consider|point': 'A pointing finger',
    },
  },
  'book-reports-reading-logs': {
    default_patterns: {
      'character|protagonist': 'A person silhouette with a star',
      'setting|place|where': 'A landscape or location pin',
      'problem|conflict': 'A lightning bolt or exclamation mark',
      'solution|resolve': 'A lightbulb or checkmark',
      'favorite|best|like': 'A heart or star',
      'learn|lesson|moral': 'A graduation cap',
      'recommend|suggest': 'A thumbs up with a book',
      'beginning|start': 'A play button or starting line',
      'end|conclusion|finally': 'A finish flag',
      'feel|emotion': 'A heart with different expressions',
    },
  },
  'literary-analysis': {
    default_patterns: {
      'author|writer': 'A pen or quill icon',
      'theme|central': 'A key icon',
      'character|trait': 'A person silhouette with a magnifying glass',
      'setting|mood': 'A landscape with weather symbols',
      'infer|suggest': 'A detective magnifying glass',
      'conflict': 'Two arrows pointing at each other',
      'symbol': 'An abstract shape representing meaning',
      'purpose|goal': 'A target or bullseye',
      'evidence|quote|text': 'A document with quotation marks',
      'turning point|climax': 'A mountain peak',
      'word choice|tone': 'A paintbrush with words',
    },
  },
  'research-citation': {
    default_patterns: {
      'source|reference|cite': 'A book with a bookmark',
      'evidence|support|prove': 'A document with a checkmark',
      'author|researcher': 'A person with glasses and a book',
      'data|statistic|number': 'A bar chart',
      'quote|passage': 'Quotation marks',
      'paraphrase|own words': 'A speech bubble with a pencil',
      'credible|reliable|trust': 'A shield with a checkmark',
      'compare|contrast': 'Two overlapping circles (Venn diagram)',
      'conclude|therefore': 'An arrow pointing to a conclusion',
      'question|investigate': 'A magnifying glass with a question mark',
    },
  },
};

function findIconForFrame(frame, topic) {
  const frameLower = frame.toLowerCase();
  const topicKey = topic.toLowerCase().replace(/\s+/g, '-');

  // Direct mapping first
  const directMap = iconMappings[topicKey];
  if (directMap && directMap[frame]) {
    return directMap[frame];
  }

  // Pattern matching
  const patterns = directMap?.default_patterns || {};
  for (const [pattern, icon] of Object.entries(patterns)) {
    const keywords = pattern.split('|');
    if (keywords.some(kw => frameLower.includes(kw))) {
      return icon;
    }
  }

  // Fallback: generic icon based on frame content
  if (frameLower.includes('?')) return 'A question mark in a speech bubble';
  if (frameLower.includes('!')) return 'An exclamation mark in a speech bubble';
  if (frameLower.includes('___')) return 'A pencil filling in a blank line';
  return 'A speech bubble icon';
}

const files = readdirSync(PACKS_DIR).filter(f => f.includes('sentence_frames'));
let totalFrames = 0;

for (const file of files) {
  const filePath = join(PACKS_DIR, file);
  const pack = JSON.parse(readFileSync(filePath, 'utf-8'));

  if (!pack.sentence_frames) continue;

  let count = 0;
  for (const sf of pack.sentence_frames) {
    if (!sf.icon_prompt) {
      sf.icon_prompt = findIconForFrame(sf.frame, pack.topic);
      count++;
    }
  }

  writeFileSync(filePath, JSON.stringify(pack, null, 2) + '\n');
  console.log(`${file}: added ${count} icon_prompts`);
  totalFrames += count;
}

console.log(`\nDone. Added ${totalFrames} icon_prompts total.`);
