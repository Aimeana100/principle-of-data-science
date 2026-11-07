/* DSC6131 Model Exam — vanilla JS, no backend. Works from file:// and GitHub Pages. */
(function () {
  "use strict";

  const BANK = (window.QUESTION_BANK || []).slice().sort((a, b) => a.id - b.id);
  const BY_ID = Object.fromEntries(BANK.map(q => [q.id, q]));
  const MARKS = { Foundational: 1, Intermediate: 2, Advanced: 3 };
  const DIFFS = ["Foundational", "Intermediate", "Advanced"];
  const TYPES = { mcq: "Multiple choice", multi: "Multiple select", tf: "True / false", numeric: "Numerical", short: "Short answer", scenario: "Scenario-based" };
  const AREA = {
    "Foundations of Data Science": "Foundations, lifecycle & ethics",
    "Data Science lifecycle": "Foundations, lifecycle & ethics",
    "Responsible Data Science & ethics": "Foundations, lifecycle & ethics",
    "Data types & measurement scales": "Data types, quality & preprocessing",
    "Data collection & data quality": "Data types, quality & preprocessing",
    "Data preprocessing & transformation": "Data types, quality & preprocessing",
    "Big Data & MapReduce": "Big data, databases & pipelines",
    "Databases & SQL": "Big data, databases & pipelines",
    "Data pipelines & storage": "Big data, databases & pipelines",
    "Exploratory Data Analysis": "EDA & descriptive statistics",
    "Descriptive statistics": "EDA & descriptive statistics",
    "Data visualisation": "Data visualisation",
    "Probability & distributions": "Probability & inference",
    "Inferential statistics": "Probability & inference",
    "Sampling & sampling bias": "Sampling, measurement & causality",
    "Research methodology & measurement": "Sampling, measurement & causality",
    "Correlation & causality": "Sampling, measurement & causality",
    "Variable relationships & association": "Relationships & regression",
    "Statistical models & regression": "Relationships & regression",
    "Machine learning foundations": "ML foundations & evaluation",
    "Supervised & unsupervised learning": "ML foundations & evaluation",
    "Overfitting, bias & variance": "ML foundations & evaluation",
    "Model evaluation & validation": "ML foundations & evaluation",
    "Data mining: association rules": "ML & data-mining algorithms",
    "Decision trees & ensembles": "ML & data-mining algorithms",
    "Classification & regression algorithms": "ML & data-mining algorithms",
    "Clustering & dimensionality reduction": "ML & data-mining algorithms",
    "Neural networks & deep learning": "ML & data-mining algorithms",
    "Data validation & testing": "Data types, quality & preprocessing",
    "Model selection & technique choice": "ML foundations & evaluation",
    "Reproducibility & documentation": "Foundations, lifecycle & ethics"
  };
  const areaOf = q => AREA[q.topic] || q.topic;
  const SETS = ["A", "B"];
  const SET_LABEL = { A: "Set A · Core with calculations (Q1–60)", B: "Set B · Concepts, no calculations (Q61–100)" };
  const setOf = q => (q.id <= 60 ? "A" : "B");
  const AREAS = [...new Set(BANK.map(areaOf))];
  const STORE_KEY = "dsc6131_model_exam_v1";

  /* ---------- storage (safe) ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
  function save(data) { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ } }
  let store = load();
  if (!Array.isArray(store.history)) store.history = [];
  const persist = () => save(store);

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const el = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fmt = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toString();
  const letter = i => String.fromCharCode(65 + i);
  const typeKeys = q => q.scenario ? [q.type, "scenario"] : [q.type];

  function parseNum(str) {
    if (str == null) return NaN;
    let s = String(str).trim().replace(/\s|%|’|'/g, "");
    if (s.includes(",") && s.includes(".")) s = s.replace(/,/g, "");
    else if (s.includes(",")) s = s.replace(",", ".");
    s = s.replace(/[^0-9eE+\-.]/g, "");
    return s === "" ? NaN : Number(s);
  }

  /* ---------- grading ---------- */
  function isAnswered(q, r) {
    if (r == null) return false;
    if (q.type === "multi") return Array.isArray(r) && r.length > 0;
    if (q.type === "numeric" || q.type === "short") return String(r).trim() !== "";
    return true;
  }
  function grade(q, r, selfMarks) {
    if (!isAnswered(q, r)) return { frac: 0, status: "unanswered" };
    let frac = 0;
    switch (q.type) {
      case "mcq": frac = r === q.answer ? 1 : 0; break;
      case "tf": frac = r === q.answer ? 1 : 0; break;
      case "multi": {
        const good = r.filter(i => q.answer.includes(i)).length, bad = r.length - good;
        frac = Math.max(0, (good - bad) / q.answer.length); break;
      }
      case "numeric": {
        const v = parseNum(r); frac = Number.isFinite(v) && Math.abs(v - q.answer) <= q.tolerance + 1e-9 ? 1 : 0; break;
      }
      case "short": {
        if (!Array.isArray(selfMarks)) return { frac: 0, status: "pending" };
        frac = selfMarks.filter(Boolean).length / q.keyPoints.length; break;
      }
    }
    return { frac, status: frac >= 0.999 ? "correct" : frac > 0 ? "partial" : "incorrect" };
  }
  const statusLabel = { correct: "Correct", partial: "Partly correct", incorrect: "Incorrect", unanswered: "Not answered", pending: "Self-mark needed" };

  /* ---------- setup screen ---------- */
  const filters = { set: new Set(SETS), area: new Set(AREAS), diff: new Set(DIFFS), type: new Set(Object.keys(TYPES)) };

  function buildChips(container, values, set, labelFn, countFn) {
    container.innerHTML = "";
    values.forEach(v => {
      const b = el("button", { type: "button", class: "chip" + (set.has(v) ? " on" : ""), "aria-pressed": set.has(v) });
      b.innerHTML = esc(labelFn(v)) + `<span class="n">${countFn(v)}</span>`;
      b.onclick = () => { set.has(v) ? set.delete(v) : set.add(v); b.classList.toggle("on"); b.setAttribute("aria-pressed", set.has(v)); updateMatch(); };
      container.appendChild(b);
    });
  }
  function filtered() {
    return BANK.filter(q => filters.set.has(setOf(q)) && filters.area.has(areaOf(q)) && filters.diff.has(q.difficulty) && typeKeys(q).some(t => filters.type.has(t)));
  }
  function updateMatch() {
    const n = filtered().length;
    const c = $("#optCount"); c.max = Math.max(1, n);
    if (+c.value > n || c.dataset.auto !== "0") { c.value = n; }
    const marks = filtered().reduce((s, q) => s + MARKS[q.difficulty], 0);
    $("#matchInfo").textContent = n ? `${n} question${n > 1 ? "s" : ""} match your filters (${marks} marks).` : "No questions match — widen the filters.";
    $("#startBtn").disabled = n === 0;
  }
  function renderSetup() {
    buildChips($("#fSet"), SETS, filters.set, v => SET_LABEL[v], v => BANK.filter(q => setOf(q) === v).length);
    buildChips($("#fArea"), AREAS, filters.area, v => v, v => BANK.filter(q => areaOf(q) === v).length);
    buildChips($("#fDiff"), DIFFS, filters.diff, v => v + ` (${MARKS[v]} mk)`, v => BANK.filter(q => q.difficulty === v).length);
    buildChips($("#fType"), Object.keys(TYPES), filters.type, v => TYPES[v], v => BANK.filter(q => typeKeys(q).includes(v)).length);
    updateMatch();
    const s = store.session;
    if (s && !s.finished && s.ids && s.ids.length) {
      const answered = s.ids.filter(id => isAnswered(BY_ID[id], s.resp[id])).length;
      $("#resumeInfo").textContent = `${s.mode === "exam" ? "Examination" : "Practice"} · ${answered}/${s.ids.length} answered.`;
      $("#resumeBox").hidden = false;
    } else $("#resumeBox").hidden = true;
    renderHistory();
  }
  function renderHistory() {
    const h = store.history;
    $("#historyCard").hidden = !h.length;
    if (!h.length) return;
    $("#historyTable").innerHTML = "<tr><th>Date</th><th>Mode</th><th class='num'>Questions</th><th class='num'>Marks</th><th class='num'>Score</th></tr>" +
      h.slice(-10).reverse().map(r => `<tr><td>${esc(new Date(r.date).toLocaleString())}</td><td>${esc(r.mode)}</td><td class="num">${r.n}</td><td class="num">${fmt(r.got)}/${r.max}</td><td class="num">${fmt(r.pct)}%</td></tr>`).join("");
  }

  /* ---------- session ---------- */
  let S = null; let timerId = null;

  function newSession(mode, ids) {
    const shuffleQ = $("#optShuffleQ").checked, shuffleO = $("#optShuffleO").checked;
    let list = ids || filtered().map(q => q.id);
    if (shuffleQ) list = shuffle(list);
    if (!ids) list = list.slice(0, Math.max(1, Math.min(+$("#optCount").value || list.length, list.length)));
    const optOrder = {};
    list.forEach(id => { const q = BY_ID[id]; if (q.options) { const idx = q.options.map((_, i) => i); optOrder[id] = shuffleO ? shuffle(idx) : idx; } });
    S = { mode, ids: list, optOrder, idx: 0, resp: {}, checked: {}, flags: {}, self: {}, startedAt: Date.now(), finished: false, recorded: false };
    store.session = S; persist(); showQuiz();
  }

  function show(id) { ["#setup", "#quiz", "#results"].forEach(s => $(s).hidden = s !== id); $("#homeBtn").hidden = id === "#setup"; window.scrollTo(0, 0); }

  function showQuiz() {
    show("#quiz");
    $("#modeBadge").textContent = S.mode === "exam" ? "Examination" : "Practice";
    $("#checkBtn").hidden = S.mode === "exam";
    $("#finishBtn").textContent = S.mode === "exam" ? "Submit examination" : "Finish & see results";
    clearInterval(timerId);
    const tick = () => { const s = Math.floor((Date.now() - S.startedAt) / 1000); $("#timer").textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
    tick(); timerId = setInterval(tick, 1000);
    renderQuestion();
  }

  function locked(id) { return S.mode === "practice" && S.checked[id]; }

  function renderQuestion() {
    const id = S.ids[S.idx], q = BY_ID[id], r = S.resp[id], lock = locked(id);
    const card = $("#qCard"); card.innerHTML = "";
    $("#qCounter").textContent = `Question ${S.idx + 1} of ${S.ids.length}`;
    const meta = el("div", { class: "qmeta" });
    meta.innerHTML = `<span class="tag">Q${q.id}</span><span class="tag">Set ${setOf(q)}</span><span class="tag ${q.difficulty}">${q.difficulty} · ${MARKS[q.difficulty]} mark${MARKS[q.difficulty] > 1 ? "s" : ""}</span><span class="tag">${esc(areaOf(q))}</span><span class="tag">${esc(q.category)}</span><span class="tag">${TYPES[q.type]}</span>`;
    card.appendChild(meta);
    if (q.scenario) card.appendChild(el("div", { class: "scenario" }, `<b class="lbl">Scenario</b>${q.scenario}`));
    card.appendChild(el("div", { class: "qtext" }, q.question));

    const area = el("div", { class: "answer" });
    if (q.type === "mcq" || q.type === "multi") {
      const multi = q.type === "multi";
      if (multi) area.appendChild(el("p", { class: "muted small" }, "Select all that apply."));
      const wrap = el("div", { class: "options", role: multi ? "group" : "radiogroup" });
      S.optOrder[id].forEach((orig, pos) => {
        const checked = multi ? (Array.isArray(r) && r.includes(orig)) : r === orig;
        const lab = el("label", { class: "opt" + (checked ? " sel" : "") + (lock ? " locked" : "") });
        const inp = el("input", { type: multi ? "checkbox" : "radio", name: "opt" + id, value: orig });
        inp.checked = checked; inp.disabled = lock;
        inp.onchange = () => {
          if (multi) { const cur = new Set(Array.isArray(S.resp[id]) ? S.resp[id] : []); inp.checked ? cur.add(orig) : cur.delete(orig); S.resp[id] = [...cur].sort((a, b) => a - b); }
          else S.resp[id] = orig;
          wrap.querySelectorAll(".opt").forEach(o => o.classList.toggle("sel", o.querySelector("input").checked));
          changed();
        };
        lab.appendChild(inp); lab.appendChild(el("span", { class: "key" }, letter(pos))); lab.appendChild(el("span", null, q.options[orig]));
        if (lock) { const ok = multi ? q.answer.includes(orig) : q.answer === orig; if (ok) lab.classList.add("is-correct"); else if (checked) lab.classList.add("is-wrong"); }
        wrap.appendChild(lab);
      });
      area.appendChild(wrap);
    } else if (q.type === "tf") {
      const wrap = el("div", { class: "options", role: "radiogroup" });
      [true, false].forEach((v, pos) => {
        const lab = el("label", { class: "opt" + (r === v ? " sel" : "") + (lock ? " locked" : "") });
        const inp = el("input", { type: "radio", name: "opt" + id }); inp.checked = r === v; inp.disabled = lock;
        inp.onchange = () => { S.resp[id] = v; wrap.querySelectorAll(".opt").forEach(o => o.classList.toggle("sel", o.querySelector("input").checked)); changed(); };
        lab.appendChild(inp); lab.appendChild(el("span", { class: "key" }, letter(pos))); lab.appendChild(el("span", null, v ? "True" : "False"));
        if (lock) { if (q.answer === v) lab.classList.add("is-correct"); else if (r === v) lab.classList.add("is-wrong"); }
        wrap.appendChild(lab);
      });
      area.appendChild(wrap);
    } else if (q.type === "numeric") {
      const row = el("div", { class: "numrow" });
      const inp = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Numerical answer", placeholder: "Your answer" });
      inp.value = r != null ? r : ""; inp.disabled = lock;
      inp.oninput = () => { S.resp[id] = inp.value; changed(true); };
      inp.onkeydown = e => { if (e.key === "Enter" && S.mode === "practice") check(); };
      row.appendChild(inp); if (q.unit) row.appendChild(el("span", { class: "muted" }, esc(q.unit)));
      area.appendChild(row);
      area.appendChild(el("p", { class: "muted small" }, `Enter a number${q.tolerance > 0 ? ` (accepted within ±${q.tolerance})` : ""}. Show your working on paper.`));
    } else if (q.type === "short") {
      const ta = el("textarea", { "aria-label": "Your answer", placeholder: "Write your answer as you would in the examination…" });
      ta.value = r || ""; ta.readOnly = lock;
      ta.oninput = () => { S.resp[id] = ta.value; changed(true); };
      area.appendChild(ta);
      area.appendChild(el("p", { class: "muted small" }, S.mode === "practice" ? "When ready, press “Check answer” to see the model answer and self-mark against the rubric." : "You will self-mark this answer against the examiner's rubric after submission."));
    }
    card.appendChild(area);
    if (lock) card.appendChild(feedbackBlock(q, true));

    // nav state
    $("#prevBtn").disabled = S.idx === 0;
    $("#nextBtn").disabled = S.idx === S.ids.length - 1;
    $("#flagBtn").setAttribute("aria-pressed", !!S.flags[id]);
    $("#flagBtn").textContent = S.flags[id] ? "⚑ Flagged" : "⚑ Flag";
    $("#checkBtn").disabled = lock || !isAnswered(q, r);
    if (q.type === "short" && S.mode === "practice" && !lock) $("#checkBtn").disabled = false;
    renderProgress();
  }

  function changed(soft) {
    persist();
    const id = S.ids[S.idx], q = BY_ID[id];
    if (S.mode === "practice") $("#checkBtn").disabled = !(isAnswered(q, S.resp[id]) || q.type === "short");
    renderProgress();
  }

  function feedbackBlock(q, interactiveSelf) {
    const id = q.id, g = grade(q, S.resp[id], S.self[id]);
    const box = el("div", { class: "feedback " + g.status });
    let head = statusLabel[g.status];
    if (g.status !== "pending" && g.status !== "unanswered") head += ` — ${fmt(g.frac * MARKS[q.difficulty], 2)} / ${MARKS[q.difficulty]} mark${MARKS[q.difficulty] > 1 ? "s" : ""}`;
    box.appendChild(el("h4", null, head));
    box.appendChild(el("div", { class: "sec" }, `<b class="lbl">Model answer</b>${correctText(q)}`));
    if (q.type === "short") {
      const sec = el("div", { class: "sec" }, `<b class="lbl">Self-mark: tick each point your answer covers</b>`);
      const ul = el("ul", { class: "rubric" });
      const marks = Array.isArray(S.self[id]) ? S.self[id] : q.keyPoints.map(() => false);
      q.keyPoints.forEach((kp, i) => {
        const li = el("li"); const lab = el("label"); const cb = el("input", { type: "checkbox" }); cb.checked = !!marks[i]; cb.disabled = !interactiveSelf;
        cb.onchange = () => { const m = Array.isArray(S.self[id]) ? S.self[id].slice() : q.keyPoints.map(() => false); m[i] = cb.checked; S.self[id] = m; persist(); refreshFeedback(box, q, interactiveSelf); };
        lab.appendChild(cb); lab.appendChild(el("span", null, esc(kp))); li.appendChild(lab); ul.appendChild(li);
      });
      sec.appendChild(ul);
      if (!Array.isArray(S.self[id]) && interactiveSelf) {
        const b = el("button", { type: "button", class: "btn small none-btn" }, "My answer covered none of these");
        b.onclick = () => { S.self[id] = q.keyPoints.map(() => false); persist(); refreshFeedback(box, q, interactiveSelf); };
        sec.appendChild(b);
      }
      box.appendChild(sec);
    }
    box.appendChild(el("div", { class: "sec" }, `<b class="lbl">Explanation</b>${q.explanation}`));
    if (q.source) box.appendChild(el("div", { class: "sec muted small" }, `Course reference: ${esc(q.source)}`));
    return box;
  }
  function refreshFeedback(box, q) {
    // update in place (keeps focus and checkbox state)
    const g = grade(q, S.resp[q.id], S.self[q.id]);
    box.className = "feedback " + g.status;
    const det = box.closest("details.review"); if (det) det.className = "review " + g.status;
    const st = det && det.querySelector("summary .st"); if (st) { st.className = "st " + g.status; st.textContent = statusLabel[g.status]; }
    let head = statusLabel[g.status];
    if (g.status !== "pending" && g.status !== "unanswered") head += ` — ${fmt(g.frac * MARKS[q.difficulty], 2)} / ${MARKS[q.difficulty]} mark${MARKS[q.difficulty] > 1 ? "s" : ""}`;
    box.querySelector("h4").textContent = head;
    const none = box.querySelector(".none-btn"); if (none && Array.isArray(S.self[q.id])) none.remove();
    if (!$("#results").hidden) renderResults(true); else renderProgress();
  }
  function correctText(q) {
    switch (q.type) {
      case "mcq": return `<p><strong>${esc(stripTags(q.options[q.answer]))}</strong></p><p>${q.modelAnswer}</p>`;
      case "multi": return `<ul>${q.answer.map(i => `<li><strong>${esc(stripTags(q.options[i]))}</strong></li>`).join("")}</ul><p>${q.modelAnswer}</p>`;
      case "tf": return `<p><strong>${q.answer ? "True" : "False"}</strong></p><p>${q.modelAnswer}</p>`;
      case "numeric": return `<p><strong>${q.answer}${q.unit ? " " + esc(q.unit) : ""}</strong>${q.tolerance ? ` (±${q.tolerance})` : ""}</p><p>${q.modelAnswer}</p>`;
      default: return `<div>${q.modelAnswer}</div>`;
    }
  }
  function stripTags(s) { const d = document.createElement("div"); d.innerHTML = s; return d.textContent; }

  function check() {
    const id = S.ids[S.idx], q = BY_ID[id];
    if (S.mode !== "practice" || S.checked[id]) return;
    if (!isAnswered(q, S.resp[id]) && q.type !== "short") return;
    S.checked[id] = true; persist(); renderQuestion();
    const fb = document.querySelector(".feedback"); if (fb) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderProgress() {
    const answered = S.ids.filter(id => isAnswered(BY_ID[id], S.resp[id]) || S.checked[id]).length;
    const flagged = S.ids.filter(id => S.flags[id]).length;
    $("#progressBar").style.width = (100 * answered / S.ids.length) + "%";
    let txt = `${answered} of ${S.ids.length} answered · ${flagged} flagged`;
    if (S.mode === "practice") {
      const ch = S.ids.filter(id => S.checked[id]);
      const got = ch.reduce((s, id) => s + grade(BY_ID[id], S.resp[id], S.self[id]).frac * MARKS[BY_ID[id].difficulty], 0);
      const max = ch.reduce((s, id) => s + MARKS[BY_ID[id].difficulty], 0);
      if (ch.length) txt += ` · running score ${fmt(got)}/${max} (${fmt(100 * got / max)}%)`;
    }
    $("#progressText").textContent = txt;
    const pal = $("#palette"); pal.innerHTML = "";
    S.ids.forEach((id, i) => {
      const q = BY_ID[id]; const b = el("button", { type: "button", "aria-label": `Question ${i + 1}` }, String(i + 1));
      if (S.mode === "practice" && S.checked[id]) b.classList.add(grade(q, S.resp[id], S.self[id]).status);
      else if (isAnswered(q, S.resp[id])) b.classList.add("answered");
      if (S.flags[id]) b.classList.add("flagged");
      if (i === S.idx) b.classList.add("current");
      b.onclick = () => go(i); pal.appendChild(b);
    });
  }
  function go(i) { if (i < 0 || i >= S.ids.length) return; S.idx = i; persist(); renderQuestion(); window.scrollTo({ top: 0, behavior: "smooth" }); }

  /* ---------- results ---------- */
  let reviewFilter = "all";
  function totals() {
    let got = 0, max = 0; const byArea = {}, byDiff = {}; let pending = 0;
    S.ids.forEach(id => {
      const q = BY_ID[id], g = grade(q, S.resp[id], S.self[id]), m = MARKS[q.difficulty];
      got += g.frac * m; max += m; if (g.status === "pending") pending++;
      [[byArea, areaOf(q)], [byDiff, q.difficulty]].forEach(([o, k]) => { o[k] = o[k] || { got: 0, max: 0, n: 0, ok: 0 }; o[k].got += g.frac * m; o[k].max += m; o[k].n++; if (g.status === "correct") o[k].ok++; });
    });
    return { got, max, pct: max ? 100 * got / max : 0, byArea, byDiff, pending };
  }
  function finish() {
    S.finished = true; S.finishedAt = S.finishedAt || Date.now(); persist(); clearInterval(timerId); renderResults(); show("#results");
  }
  function renderResults(soft) {
    const t = totals();
    $("#scorePct").textContent = fmt(t.pct) + "%";
    const mins = Math.round(((S.finishedAt || Date.now()) - S.startedAt) / 60000);
    $("#scoreMarks").textContent = `${fmt(t.got)} / ${t.max} marks · ${S.ids.length} questions · ${S.mode === "exam" ? "Examination" : "Practice"} · ${mins} min`;
    const band = t.pct >= 70 ? "Distinction range (≥ 70%)" : t.pct >= 60 ? "Merit range (60–69%)" : t.pct >= 50 ? "Pass range (50–59%)" : "Below pass (< 50%) — review the explanations and retry";
    $("#scoreNote").innerHTML = (t.pending ? `<strong>${t.pending} written answer${t.pending > 1 ? "s" : ""} still need self-marking</strong> (counted as 0 until marked). ` : "") + esc(band) + ". Grade bands are indicative only.";
    const table = (o, order) => "<tr><th>Area</th><th class='num'>Correct</th><th class='num'>Marks</th><th class='num'>%</th></tr>" +
      order.filter(k => o[k]).map(k => `<tr><td>${esc(k)}</td><td class="num">${o[k].ok}/${o[k].n}</td><td class="num">${fmt(o[k].got)}/${o[k].max}</td><td class="num">${fmt(100 * o[k].got / o[k].max)}</td></tr>`).join("");
    $("#byArea").innerHTML = table(t.byArea, AREAS);
    $("#byDiff").innerHTML = table(t.byDiff, DIFFS).replace("<th>Area</th>", "<th>Difficulty</th>");
    if (S.mode === "exam" && !S.recorded) { store.history.push({ date: Date.now(), mode: "Examination", n: S.ids.length, got: t.got, max: t.max, pct: t.pct }); S.recorded = true; S.historyIndex = store.history.length - 1; persist(); }
    else if (S.recorded && store.history[S.historyIndex]) { Object.assign(store.history[S.historyIndex], { got: t.got, pct: t.pct }); persist(); }
    if (!soft) renderReview();
  }
  function renderReview() {
    const list = $("#reviewList"); list.innerHTML = "";
    S.ids.forEach((id, i) => {
      const q = BY_ID[id], g = grade(q, S.resp[id], S.self[id]);
      if (reviewFilter === "wrong" && !["incorrect", "partial", "unanswered"].includes(g.status)) return;
      if (reviewFilter === "flagged" && !S.flags[id]) return;
      if (reviewFilter === "pending" && g.status !== "pending") return;
      const d = el("details", { class: "review " + g.status });
      if (g.status !== "correct") d.open = reviewFilter !== "all" || g.status === "pending";
      d.appendChild(el("summary", null, `<span class="st ${g.status}">${statusLabel[g.status]}</span><span>${i + 1}. <strong>${esc(q.topic)}:</strong> ${esc(stripTags(q.question)).slice(0, 140)}${stripTags(q.question).length > 140 ? "…" : ""}</span>${S.flags[id] ? '<span class="tag">⚑ flagged</span>' : ""}<span class="tag ${q.difficulty}">${q.difficulty}</span>`));
      if (q.scenario) d.appendChild(el("div", { class: "scenario" }, `<b class="lbl">Scenario</b>${q.scenario}`));
      d.appendChild(el("div", { class: "qtext" }, q.question));
      d.appendChild(el("div", { class: "sec" }, `<b class="muted small">Your answer</b><div class="yours">${yourAnswer(q, S.resp[id])}</div>`));
      d.appendChild(feedbackBlock(q, true));
      list.appendChild(d);
    });
    if (!list.children.length) list.appendChild(el("p", { class: "muted" }, "Nothing to show for this filter."));
  }
  function yourAnswer(q, r) {
    if (!isAnswered(q, r)) return "<em>Not answered</em>";
    if (q.type === "mcq") return esc(stripTags(q.options[r]));
    if (q.type === "multi") return r.map(i => "• " + esc(stripTags(q.options[i]))).join("<br>");
    if (q.type === "tf") return r ? "True" : "False";
    return esc(r);
  }

  /* ---------- modal ---------- */
  function confirmBox(title, text, okLabel) {
    return new Promise(res => {
      $("#modalTitle").textContent = title; $("#modalText").textContent = text; $("#modalOk").textContent = okLabel || "OK";
      $("#modal").hidden = false; $("#modalOk").focus();
      const done = v => { $("#modal").hidden = true; $("#modalOk").onclick = $("#modalCancel").onclick = null; res(v); };
      $("#modalOk").onclick = () => done(true); $("#modalCancel").onclick = () => done(false);
    });
  }

  /* ---------- wiring ---------- */
  $("#startBtn").onclick = () => newSession(document.querySelector("input[name=mode]:checked").value);
  $("#resetFilters").onclick = () => { filters.set = new Set(SETS); filters.area = new Set(AREAS); filters.diff = new Set(DIFFS); filters.type = new Set(Object.keys(TYPES)); $("#optCount").dataset.auto = "1"; renderSetup(); };
  $("#optCount").oninput = () => { $("#optCount").dataset.auto = "0"; };
  $("#resumeBtn").onclick = () => { S = store.session; if (!S.self) S.self = {}; showQuiz(); };
  $("#discardBtn").onclick = () => { delete store.session; persist(); renderSetup(); };
  $("#clearHistory").onclick = async () => { if (await confirmBox("Clear history?", "This removes all saved examination results from this browser.", "Clear")) { store.history = []; persist(); renderHistory(); } };
  $("#prevBtn").onclick = () => go(S.idx - 1);
  $("#nextBtn").onclick = () => go(S.idx + 1);
  $("#checkBtn").onclick = check;
  $("#flagBtn").onclick = () => { const id = S.ids[S.idx]; S.flags[id] ? delete S.flags[id] : (S.flags[id] = true); persist(); renderQuestion(); };
  $("#paletteToggle").onclick = () => { const p = $("#palette"); p.hidden = !p.hidden; $("#paletteToggle").textContent = p.hidden ? "Questions ▾" : "Questions ▴"; };
  $("#finishBtn").onclick = async () => {
    const un = S.ids.filter(id => !isAnswered(BY_ID[id], S.resp[id])).length;
    const msg = S.mode === "exam" ? `Submit your examination?${un ? ` ${un} question${un > 1 ? "s are" : " is"} unanswered.` : ""} Answers cannot be changed afterwards.` : `Finish this practice session?${un ? ` ${un} unanswered question${un > 1 ? "s" : ""} will score 0.` : ""}`;
    if (await confirmBox(S.mode === "exam" ? "Submit examination" : "Finish practice", msg, S.mode === "exam" ? "Submit" : "Finish")) finish();
  };
  $("#homeBtn").onclick = () => { clearInterval(timerId); show("#setup"); renderSetup(); };
  $("#newSession").onclick = () => { delete store.session; persist(); show("#setup"); renderSetup(); };
  $("#retryWrong").onclick = () => {
    const ids = S.ids.filter(id => S.flags[id] || grade(BY_ID[id], S.resp[id], S.self[id]).status !== "correct");
    if (!ids.length) { confirmBox("Nothing to retry", "Every question was answered correctly and none are flagged.", "OK"); return; }
    document.querySelector("input[name=mode][value=practice]").checked = true;
    newSession("practice", ids);
  };
  $("#reviewFilter").onclick = e => { const b = e.target.closest(".chip"); if (!b) return; reviewFilter = b.dataset.f; document.querySelectorAll("#reviewFilter .chip").forEach(c => c.classList.toggle("on", c === b)); renderReview(); };
  document.addEventListener("keydown", e => {
    if ($("#quiz").hidden || !$("#modal").hidden || /TEXTAREA|INPUT/.test(document.activeElement.tagName)) return;
    if (e.key === "ArrowRight") go(S.idx + 1); else if (e.key === "ArrowLeft") go(S.idx - 1);
  });

  // Restore a finished session's results view? Start on setup; offer resume for unfinished sessions.
  if (BANK.length !== 100) console.warn("Question bank size:", BANK.length);
  renderSetup();
  window.__DSC6131__ = { grade, parseNum, BANK, totals: () => S && totals() };
})();
