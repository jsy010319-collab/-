function scenarioTips(scenario) {
  switch (scenario) {
    case 'movie':
      return [
        '연결 발음(listen to linking)과 약화(weak forms)에 주의하세요.',
        '티켓/상영시간 같은 키워드의 강세를 분명히 하세요.'
      ];
    case 'airport':
      return [
        '숫자, 알파벳(게이트/좌석) 발음 정확도를 점검하세요.',
        '의문문 억양을 올리고, 정보 전달은 또박또박.'
      ];
    case 'restaurant':
      return [
        '메뉴/재료 발음과 정중한 표현(please, would like)을 연습하세요.',
        '요청 문장에 억양과 리듬을 살리세요.'
      ];
    case 'shopping':
      return [
        '가격/사이즈 숫자와 단위를 또렷하게.',
        '조건/비교문에서 강세 위치를 신경 쓰세요.'
      ];
    default:
      return [
        'Record and compare with native pronunciation.',
        'Focus on stressed syllables; reduce function words.',
        'Keep steady rhythm; avoid trailing off at sentence ends.'
      ];
  }
}

export function generateFeedback(transcript, scenario = 'general') {
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
  const tips = scenarioTips(scenario);
  const summary = pronunciation.length ? 'Good effort! Mind consonants and rhythm.' : 'Clear pronunciation. Keep practicing.';
  return { summary, pronunciation, tips };
}

