/* ===== Utilitas & penyimpanan skor ===== */
const $ = (s, e = document) => e.querySelector(s);
const KEY = 'english-prep-scores';
const SECTIONS = { grammar: 'Grammar', reading: 'Reading', listening: 'Listening', speaking: 'Speaking' };
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveScore = (k, v) => {
  const d = load();
  d[k] = { last: v, best: Math.max(v, (d[k] || {}).best || 0) };
  try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
};
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const say = (t, rate = 0.9) => {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = 'en-US'; u.rate = rate;
  speechSynthesis.speak(u);
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-say]');
  if (b) say(b.dataset.say, +b.dataset.rate || 0.9);
});

/* ===== Materi Grammar ===== */
const TOPICS = [
  { t: 'Simple Present', use: ['Kebiasaan atau rutinitas', 'Fakta umum dan kebenaran ilmiah', 'Jadwal tetap'],
    f: { Positif: 'S + V1 (tambah -s/-es untuk he, she, it)', Negatif: 'S + do/does + not + V1', Tanya: 'Do/Does + S + V1?' },
    sig: 'always, usually, often, sometimes, never, every day, on Mondays',
    ex: ['She studies English every day.', 'The sun rises in the east.', 'He doesn’t drink coffee.'] },
  { t: 'Present Continuous', use: ['Kejadian yang sedang berlangsung saat berbicara', 'Kegiatan sementara di masa kini', 'Rencana dekat yang sudah diatur'],
    f: { Positif: 'S + am/is/are + V-ing', Negatif: 'S + am/is/are + not + V-ing', Tanya: 'Am/Is/Are + S + V-ing?' },
    sig: 'now, right now, at the moment, today, Look!, Listen!',
    ex: ['They are studying in the library now.', 'I am not working today.', 'Is she cooking?'] },
  { t: 'Simple Past', use: ['Kejadian yang sudah selesai pada waktu tertentu di masa lampau'],
    f: { Positif: 'S + V2', Negatif: 'S + did + not + V1', Tanya: 'Did + S + V1?' },
    sig: 'yesterday, last week, two days ago, in 2020',
    ex: ['I visited Bandung last week.', 'She didn’t go to school yesterday.', 'Did you watch the match?'] },
  { t: 'Present Perfect', use: ['Pengalaman hidup tanpa waktu yang pasti', 'Kejadian lampau yang hasilnya masih terasa sekarang', 'Kegiatan yang dimulai di masa lalu dan masih berlanjut (since/for)'],
    f: { Positif: 'S + have/has + V3', Negatif: 'S + have/has + not + V3', Tanya: 'Have/Has + S + V3?' },
    sig: 'already, yet, just, ever, never, since (titik waktu), for (lama waktu)',
    ex: ['I have worked here for two years.', 'She has never eaten sushi.', 'Have you finished your report yet?'] },
  { t: 'Simple Future', use: ['Keputusan spontan, janji, dan prediksi (will)', 'Rencana yang sudah diputuskan (am/is/are going to + V1)'],
    f: { Positif: 'S + will + V1', Negatif: 'S + will not (won’t) + V1', Tanya: 'Will + S + V1?' },
    sig: 'tomorrow, next week, soon, in 2030, I think, probably',
    ex: ['I will call you tomorrow.', 'It won’t rain tonight.', 'Will they join us?'] },
  { t: 'Articles: a, an, the', use: ['a dan an hanya untuk benda tunggal yang bisa dihitung dan belum spesifik', 'the untuk benda yang spesifik atau sudah disebut sebelumnya'],
    f: { a: 'sebelum BUNYI konsonan: a book, a university', an: 'sebelum BUNYI vokal: an apple, an hour', the: 'benda spesifik: the sun, the book on the table' },
    sig: 'Perhatikan bunyinya, bukan hurufnya. University diawali bunyi /y/, sedangkan hour diawali bunyi vokal karena h tidak dibunyikan.',
    ex: ['She is an honest teacher.', 'He bought a car. The car is red.', 'It takes an hour.'] },
  { t: 'Modal Verbs', use: ['can: kemampuan atau izin', 'could: kemampuan masa lalu atau permintaan sopan', 'must: keharusan kuat; should: saran', 'may/might: kemungkinan atau izin formal'],
    f: { Positif: 'S + modal + V1', Negatif: 'S + modal + not + V1', Tanya: 'Modal + S + V1?' },
    sig: 'Setelah modal selalu memakai V1, tanpa to dan tanpa -s/-es.',
    ex: ['She can speak three languages.', 'You should drink more water.', 'Could you open the window?'] },
  { t: 'Prepositions: at, on, in', use: ['Menunjukkan waktu dan tempat'],
    f: { at: 'jam dan titik tertentu: at 7 o’clock, at the station', on: 'hari, tanggal, permukaan: on Monday, on 17 August, on the table', in: 'bulan, tahun, musim, ruang tertutup: in May, in 2026, in the room' },
    sig: 'in the morning/afternoon/evening, tetapi at night.',
    ex: ['The class starts at 8 a.m. on Monday.', 'She was born in May.', 'The keys are on the table.'] }
];
const GQ = [
  { q: 'She ___ to school every day.', o: ['go', 'goes', 'going', 'is go'], a: 1, e: 'Simple Present: subjek she (orang ketiga tunggal) memakai V1 + s/es, jadi goes.' },
  { q: 'Look! The children ___ in the garden.', o: ['play', 'plays', 'are playing', 'played'], a: 2, e: 'Kata Look! menandakan kejadian yang sedang berlangsung: Present Continuous (are + V-ing).' },
  { q: 'I ___ my homework yesterday.', o: ['finish', 'finished', 'have finished', 'finishing'], a: 1, e: 'Yesterday adalah waktu lampau yang pasti, jadi memakai Simple Past (V2).' },
  { q: 'He ___ in Bandung since 2020.', o: ['lives', 'lived', 'has lived', 'is living'], a: 2, e: 'Since + titik waktu masa lalu yang berlanjut sampai sekarang memakai Present Perfect (has + V3).' },
  { q: 'I think it ___ rain tomorrow.', o: ['will', 'did', 'has', 'was'], a: 0, e: 'Prediksi tentang masa depan memakai will + V1.' },
  { q: 'She is ___ honest teacher.', o: ['a', 'an', 'the', '(tanpa artikel)'], a: 1, e: 'Honest diawali bunyi vokal (h tidak dibunyikan), jadi memakai an.' },
  { q: 'You look very sick. You ___ see a doctor.', o: ['should', 'shouldn’t', 'can’t', 'won’t'], a: 0, e: 'Should dipakai untuk memberi saran dan diikuti V1.' },
  { q: 'The meeting starts ___ 9 o’clock.', o: ['in', 'on', 'at', 'by'], a: 2, e: 'Jam tertentu memakai preposisi at.' },
  { q: 'They ___ football on Sundays.', o: ['doesn’t play', 'don’t play', 'not play', 'aren’t play'], a: 1, e: 'Subjek they pada Simple Present negatif memakai don’t + V1.' },
  { q: 'Have you ever ___ sushi?', o: ['eat', 'ate', 'eaten', 'eating'], a: 2, e: 'Present Perfect memakai have/has + V3. Bentuk V3 dari eat adalah eaten.' }
];

/* ===== Reading ===== */
const PASSAGE = 'Rina is a university student in Bandung. She wants to work in an international company after graduation, so she studies English every day. In the morning, she listens to a short English podcast while she walks to campus. In the afternoon, she reads one article and writes five new words in her notebook. At night, she practices speaking with her friend Tomi for twenty minutes. Last month, she joined an English club, and her confidence has grown a lot. Rina believes that small daily habits are better than studying hard only before an exam.';
const RQ = [
  { q: 'Why does Rina study English every day?', o: ['She wants to work in an international company.', 'She will move to another country.', 'Her friend asked her to.', 'She has an exam tomorrow.'], a: 0, e: 'Kalimat kedua: she wants to work in an international company after graduation.' },
  { q: 'What does Rina do in the morning?', o: ['She writes new words.', 'She listens to an English podcast.', 'She practices speaking with Tomi.', 'She joins an English club.'], a: 1, e: 'Pagi hari ia mendengarkan podcast bahasa Inggris sambil berjalan ke kampus.' },
  { q: 'How long does she practice speaking at night?', o: ['Five minutes', 'Ten minutes', 'Twenty minutes', 'One hour'], a: 2, e: 'Teks menyebut for twenty minutes.' },
  { q: 'What happened last month?', o: ['She finished her exam.', 'She joined an English club.', 'She met Tomi.', 'She graduated.'], a: 1, e: 'Last month, she joined an English club (Simple Past, ditandai last month).' },
  { q: 'What is Rina’s belief about studying?', o: ['Studying only before an exam is best.', 'Studying at night is best.', 'Small daily habits are better than studying hard only before an exam.', 'Reading is better than speaking.'], a: 2, e: 'Kalimat terakhir menyatakan keyakinan Rina secara langsung.' }
];

/* ===== Listening (audio dibacakan oleh browser) ===== */
const C1 = 'Good morning, everyone. The English test will start at nine thirty in Room 204, not in Room 402. Please bring your student card and a black pen. Mobile phones must be turned off.';
const C2 = 'Hi, this is Dina from the Language Center. Your speaking class has moved from Tuesday to Thursday because the teacher is sick. The class will begin at two o’clock in the afternoon. Please call me back if you cannot come.';
const play = (t, n) => `<p><button class="btn ghost" data-say="${t}">▶ Putar audio ${n}</button> <span class="note">Bisa diputar ulang.</span></p>`;
const LQ = [
  { pre: play(C1, 1), q: 'What time does the test start?', o: ['9:00', '9:30', '10:30', '2:04'], a: 1, e: 'Transkrip audio 1: “' + C1 + '” Tes dimulai pukul nine thirty (9:30).' },
  { q: 'Which room is the test in?', o: ['Room 402', 'Room 240', 'Room 204', 'Room 420'], a: 2, e: 'Ruangannya Room 204, bukan Room 402.' },
  { q: 'What must students bring?', o: ['A laptop and a pen', 'A student card and a black pen', 'A mobile phone', 'A dictionary'], a: 1, e: 'Siswa diminta membawa student card dan black pen. Ponsel harus dimatikan.' },
  { pre: play(C2, 2), q: 'Why was the class moved?', o: ['The room is full.', 'The teacher is sick.', 'There is a holiday.', 'The students are busy.'], a: 1, e: 'Transkrip audio 2: “' + C2 + '” Alasannya because the teacher is sick.' },
  { q: 'What is the new day of the class?', o: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], a: 2, e: 'Kelas pindah from Tuesday to Thursday.' }
];

/* ===== Speaking ===== */
const SP = ['I study English every day.', 'She has lived in Bandung for five years.', 'Could you tell me where the library is?', 'Practice makes perfect, so I will keep learning.'];
const words = t => t.toLowerCase().replace(/’/g, "'").replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean);
const grade = (target, said) => {
  const pool = words(said); let hit = 0;
  words(target).forEach(w => { const k = pool.indexOf(w); if (k > -1) { hit++; pool.splice(k, 1); } });
  return Math.round(hit / words(target).length * 100);
};

/* ===== Mesin kuis (dipakai Grammar, Reading, Listening) ===== */
function quiz(el, qs, key) {
  el.innerHTML = qs.map((q, i) => `<fieldset class="q">${q.pre || ''}<legend>${i + 1}. ${q.q}</legend>` +
    q.o.map((o, j) => `<label><input type="radio" name="${key}${i}" value="${j}"><span>${o}</span></label>`).join('') +
    `<p class="exp" hidden></p></fieldset>`).join('') +
    `<button class="btn" id="chk">Periksa jawaban</button><p class="res" id="res" aria-live="polite"></p>`;
  $('#chk', el).onclick = function () {
    let ok = 0;
    el.querySelectorAll('.q').forEach((f, i) => {
      const q = qs[i], s = f.querySelector('input:checked'), right = s && +s.value === q.a;
      f.querySelectorAll('label').forEach((l, j) => {
        if (j === q.a) l.classList.add('right'); else if (s && +s.value === j) l.classList.add('wrong');
      });
      f.querySelectorAll('input').forEach(x => x.disabled = true);
      const e = f.querySelector('.exp'); e.hidden = false;
      e.textContent = (right ? 'Benar. ' : 'Kurang tepat. ') + q.e;
      if (right) ok++;
    });
    const p = Math.round(ok / qs.length * 100);
    saveScore(key, p);
    this.hidden = true;
    $('#res', el).innerHTML = `Skor ${SECTIONS[key]}: <b>${p}</b>/100 (${ok} dari ${qs.length} benar) <button class="btn ghost" id="again">Ulangi</button>`;
    $('#again', el).onclick = () => quiz(el, qs, key);
  };
}

/* ===== Halaman ===== */
const INFO = {
  grammar: '8 materi (tense, article, modal, preposition) dan 10 soal',
  reading: '1 teks bacaan dan 5 soal pemahaman',
  listening: '2 audio dan 5 soal',
  speaking: '4 kalimat, dinilai dari ucapan Anda'
};
const V = {
  home(el) {
    const d = load();
    el.innerHTML = `<h1>English Exam Practice</h1><p class="lead">Pelajari grammar, lalu uji Reading, Listening, dan Speaking. Setiap bagian punya skor 0 sampai 100 dan pembahasan.</p><div class="grid">` +
      Object.keys(SECTIONS).map(k => `<a class="card" href="#${k}"><b>${SECTIONS[k]}</b><span>${INFO[k]}</span><em>${d[k] ? 'Skor terbaik: ' + d[k].best : 'Belum dikerjakan'}</em></a>`).join('') +
      `</div><a class="btn" href="#score">Lihat skor total</a>`;
  },
  grammar(el) {
    el.innerHTML = `<h1>Grammar</h1><p class="lead">Buka tiap materi, pelajari rumus dan contohnya, lalu kerjakan soal di bagian bawah.</p>` +
      TOPICS.map(t => `<details class="topic"><summary>${t.t}</summary><div><h4>Kapan dipakai</h4><ul>${t.use.map(u => `<li>${u}</li>`).join('')}</ul>` +
        `<h4>Rumus</h4><table>${Object.entries(t.f).map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>` +
        `<h4>Penanda dan catatan</h4><p>${t.sig}</p><h4>Contoh</h4><ul>${t.ex.map(x => `<li>${x} <button class="say" data-say="${x}" aria-label="Dengarkan kalimat">▶</button></li>`).join('')}</ul></div></details>`).join('') +
      `<h2>Latihan soal</h2><div id="quiz"></div>`;
    quiz($('#quiz', el), GQ, 'grammar');
  },
  reading(el) {
    el.innerHTML = `<h1>Reading</h1><p class="lead">Baca teks dengan teliti, lalu pilih jawaban yang paling sesuai dengan isi teks.</p><div class="passage">${PASSAGE}</div><div id="quiz"></div>`;
    quiz($('#quiz', el), RQ, 'reading');
  },
  listening(el) {
    el.innerHTML = `<h1>Listening</h1><p class="lead">Putar audio, dengarkan, lalu jawab soal. Transkrip muncul setelah jawaban diperiksa. Gunakan Chrome atau Edge agar suara berjalan baik.</p><div id="quiz"></div>`;
    quiz($('#quiz', el), LQ, 'listening');
  },
  speaking(el) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition, res = [];
    el.innerHTML = `<h1>Speaking</h1><p class="lead">Dengarkan contoh, tekan Rekam suara, lalu ucapkan kalimat. Skor dihitung dari kecocokan kata yang terdengar. Gunakan Chrome atau Edge dan izinkan mikrofon.</p>` +
      SP.map((s, i) => `<div class="q"><p class="big">${s}</p><button class="btn ghost" data-say="${s}" data-rate="0.8">▶ Dengarkan contoh</button> <button class="btn" data-rec="${i}">${SR ? 'Rekam suara' : 'Nilai sendiri'}</button><p class="out" id="o${i}"></p></div>`).join('') +
      `<p class="res" id="res"></p>`;
    const done = (i, p, txt) => {
      res[i] = p;
      const v = res.filter(x => x != null), avg = Math.round(v.reduce((a, b) => a + b, 0) / v.length);
      saveScore('speaking', avg);
      $('#o' + i, el).innerHTML = `${txt} Skor kalimat: <b>${p}</b>`;
      $('#res', el).innerHTML = `Skor Speaking: <b>${avg}</b>/100 (${v.length} dari ${SP.length} kalimat)`;
    };
    el.onclick = e => {
      const s = e.target.closest('[data-self]');
      if (s) { const [i, p] = s.dataset.self.split(':'); return done(+i, +p, 'Penilaian sendiri.'); }
      const b = e.target.closest('[data-rec]');
      if (!b) return;
      const i = +b.dataset.rec, o = $('#o' + i, el);
      if (!SR) {
        o.innerHTML = `Browser ini tidak mendukung pengenalan suara. Ucapkan kalimat, lalu nilai: <button class="btn ghost" data-self="${i}:100">Lancar</button> <button class="btn ghost" data-self="${i}:70">Cukup</button> <button class="btn ghost" data-self="${i}:40">Perlu latihan</button>`;
        return;
      }
      const r = new SR();
      r.lang = 'en-US';
      o.textContent = 'Mendengarkan... ucapkan kalimat sekarang.';
      r.onresult = ev => { const t = ev.results[0][0].transcript; done(i, grade(SP[i], t), `Terdengar: “${esc(t)}”.`); };
      r.onerror = () => { o.textContent = 'Mikrofon tidak bisa dipakai. Izinkan akses mikrofon lalu coba lagi.'; };
      r.start();
    };
  },
  score(el) {
    const d = load(), keys = Object.keys(SECTIONS), got = keys.filter(k => d[k]);
    const tot = got.length ? Math.round(got.reduce((a, k) => a + d[k].last, 0) / got.length) : 0;
    const lvl = !got.length ? 'Belum ada skor' : tot >= 85 ? 'Sangat baik (Advanced)' : tot >= 70 ? 'Baik (Intermediate)' : tot >= 50 ? 'Cukup (Elementary)' : 'Perlu banyak latihan (Beginner)';
    el.innerHTML = `<h1>Skor</h1><div class="sum"><div class="dial" style="--p:${tot}"><span>${tot}</span></div><div><b>${lvl}</b><p class="note">Rata-rata dari ${got.length} dari 4 bagian ujian.</p></div></div>` +
      keys.map(k => `<div class="bar"><span>${SECTIONS[k]}</span><i><u style="width:${d[k] ? d[k].last : 0}%"></u></i><b>${d[k] ? d[k].last : '-'}</b><small>${d[k] ? 'terbaik ' + d[k].best : ''}</small></div>`).join('') +
      `<p class="note">Predikat: 85 ke atas Advanced, 70 sampai 84 Intermediate, 50 sampai 69 Elementary, di bawah 50 Beginner.</p><button class="btn ghost" id="reset">Hapus semua skor</button>`;
    $('#reset', el).onclick = () => { try { localStorage.removeItem(KEY); } catch {} V.score(el); };
  }
};

/* ===== Navigasi ===== */
function route() {
  const k = (location.hash || '#home').slice(1);
  if (window.speechSynthesis) speechSynthesis.cancel();
  (V[k] || V.home)($('#app'));
  document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + k));
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
route();
