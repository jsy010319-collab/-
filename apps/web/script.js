const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const player = document.getElementById('player');
const feedbackDiv = document.getElementById('feedback');
const textInput = document.getElementById('textInput');
const sendTextBtn = document.getElementById('sendTextBtn');

let mediaRecorder = null;
let chunks = [];

async function sendAudio(blob) {
  const form = new FormData();
  form.append('audio', blob, 'speech.webm');
  const res = await fetch('/chat/audio', { method: 'POST', body: form });
  const data = await res.json();
  renderFeedback(data.feedback);
}

async function sendText(text) {
  const res = await fetch('/chat/text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  renderFeedback(data.feedback);
}

function renderFeedback(feedback) {
  if (!feedback) return;
  const { summary, pronunciation = [], tips = [] } = feedback;
  const items = [
    `<p><strong>요약:</strong> ${summary}</p>`,
    '<div><strong>발음 교정:</strong><ul>' + pronunciation.map(p => `<li>${p.word}: ${p.suggestion} (점수 ${p.score})</li>`).join('') + '</ul></div>',
    '<div><strong>팁:</strong><ul>' + tips.map(t => `<li>${t}</li>`).join('') + '</ul></div>'
  ];
  feedbackDiv.innerHTML = items.join('');
}

recordBtn.addEventListener('click', async () => {
  chunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'audio/webm' });
    player.src = URL.createObjectURL(blob);
    await sendAudio(blob);
  };
  mediaRecorder.start();
  recordBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recordBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

sendTextBtn.addEventListener('click', async () => {
  const text = textInput.value.trim();
  if (!text) return;
  await sendText(text);
});

// Calendar + Notes (localStorage)
const monthLabel = document.getElementById('monthLabel');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const notesArea = document.getElementById('notesArea');
const saveNoteBtn = document.getElementById('saveNote');

let current = new Date();
let selectedDate = new Date();

function ymd(d) {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function loadNote(dateStr) {
  return localStorage.getItem(`notes:${dateStr}`) || '';
}

function saveNote(dateStr, text) {
  localStorage.setItem(`notes:${dateStr}`, text);
}

function renderCalendar() {
  calendarGrid.innerHTML = '';
  const first = new Date(current.getFullYear(), current.getMonth(), 1);
  const last = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  monthLabel.textContent = `${current.getFullYear()}년 ${current.getMonth() + 1}월`;

  const startDay = first.getDay();
  const totalCells = startDay + last.getDate();

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (i >= startDay) {
      const day = i - startDay + 1;
      cell.textContent = String(day);
      const date = new Date(current.getFullYear(), current.getMonth(), day);
      cell.dataset.date = ymd(date);
      cell.addEventListener('click', () => {
        selectedDate = date;
        notesArea.value = loadNote(ymd(selectedDate));
        document.querySelectorAll('.cell.selected').forEach(el => el.classList.remove('selected'));
        cell.classList.add('selected');
      });
      if (ymd(date) === ymd(selectedDate)) {
        cell.classList.add('selected');
      }
      // Mark days with notes
      if (loadNote(ymd(date))) {
        cell.classList.add('has-note');
      }
    } else {
      cell.className = 'cell placeholder';
    }
    calendarGrid.appendChild(cell);
  }
  notesArea.value = loadNote(ymd(selectedDate));
}

prevMonthBtn.addEventListener('click', () => {
  current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
  current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  renderCalendar();
});

saveNoteBtn.addEventListener('click', () => {
  const dateStr = ymd(selectedDate);
  saveNote(dateStr, notesArea.value);
  renderCalendar();
});

// Initialize
selectedDate = new Date();
renderCalendar();

