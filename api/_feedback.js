export function generateFeedback(transcript) {
  const text = (transcript || '').trim();
  const words = text ? text.split(/\s+/) : [];
  const pronunciation = [];
  for (const w of words) {
    const lw = w.toLowerCase();
    if (lw.includes('th')) {
      pronunciation.push({ word: w, suggestion: "Place tongue between teeth for 'th' sound.", score: 0.65 });
    }
    if (lw.includes('r')) {
      pronunciation.push({ word: w, suggestion: "Relax tongue tip; avoid rolling the 'r'.", score: 0.7 });
    }
  }
  if (pronunciation.length === 0) {
    pronunciation.push({ word: words[0] || '(audio)', suggestion: 'Speak slowly and clearly; stress content words.', score: 0.8 });
  }
  const tips = [
    'Record and compare with native pronunciation.',
    'Focus on stressed syllables; reduce function words.',
    'Keep steady rhythm; avoid trailing off at sentence ends.'
  ];
  const summary = pronunciation.length ? 'Good effort! Mind consonants and rhythm.' : 'Clear pronunciation. Keep practicing.';
  return { summary, pronunciation, tips };
}

