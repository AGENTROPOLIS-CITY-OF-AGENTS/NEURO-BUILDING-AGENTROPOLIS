const STORE = "agentropolis-main-street-v1";

const REGIONS = [
  { id: "plaza", name: "Welcome Plaza", short: "Plaza", lead: "You are at the start of Main Street.", next: "Want to shop, work, learn, create, or explore?", explain: "Main Street is the easy way into the city. You can look around without a wallet.", color: "#00ffff", pos: [0, 0, 0], size: [8.4, 2.2, 8.4], later: false, shape: "plaza",
    actions: [{ id: "shop", label: "Shop" }, { id: "work", label: "Work" }, { id: "create", label: "Create" }, { id: "learn", label: "Learn" }, { id: "explore", label: "Explore" }] },
  { id: "commerce", name: "Commerce Row", short: "Shop", lead: "You are in the shops.", next: "Pick one thing. Prices are plain. No money leaves this floor.", explain: "A shop here works like a normal store. A receipt shows what happened. Nothing is charged.", color: "#00e8ff", pos: [12.5, 0, -8.2], size: [7.2, 4.6, 5.2], later: false, shape: "shop",
    actions: [{ id: "browse", label: "See goods" }, { id: "buy-pin", label: "Get the pin", sensitive: true }, { id: "buy-note", label: "Get the notebook", sensitive: true }] },
  { id: "creator", name: "Creator Boulevard", short: "Create", lead: "You are on Creator Boulevard.", next: "Make something, publish it here, or ask for help.", explain: "Create first. Ownership talk comes later. Publish on this floor stays local.", color: "#ff00ff", pos: [12.5, 0, 8.2], size: [7.2, 4.8, 5.4], later: false, shape: "atelier",
    actions: [{ id: "make", label: "Make something" }, { id: "publish", label: "Publish", sensitive: true }, { id: "help", label: "Get help" }] },
  { id: "work", name: "Work Exchange", short: "Work", lead: "You are at the Work Exchange.", next: "There are no live jobs here. You can still try a sample task.", explain: "A real job would pay through the city. This floor only shows the shape of the work.", color: "#39ff14", pos: [24.5, 0, -8.2], size: [7.6, 5.2, 5.6], later: false, shape: "hall",
    actions: [{ id: "find", label: "Find work" }, { id: "sample", label: "Try a sample", sensitive: true }, { id: "receipts", label: "See my receipts" }] },
  { id: "learn", name: "Learning Quarter", short: "Learn", lead: "You are in the Learning Quarter.", next: "One lesson. Then we stop.", explain: "I teach one idea at a time. You stay in control.", color: "#7ad7ff", pos: [24.5, 0, 8.2], size: [7.4, 5.8, 5.4], later: false, shape: "library",
    actions: [{ id: "lesson-street", label: "What is this street?" }, { id: "lesson-receipt", label: "What is a receipt?" }, { id: "lesson-wallet", label: "What is a wallet?" }] },
  { id: "play", name: "Entertainment Promenade", short: "Play", lead: "You are on the Promenade.", next: "Browse or play a local preview. No live show is on this floor.", explain: "This is the fun side of the street. Previews stay local. Nothing streams in.", color: "#ff7ad2", pos: [36.5, 0, -8.2], size: [7.4, 5.4, 5.4], later: false, shape: "marquee",
    actions: [{ id: "browse", label: "Browse" }, { id: "play", label: "Play preview" }] },
  { id: "services", name: "Services Square", short: "Help", lead: "You are in Services Square.", next: "I can save your place on this device, or explain the street.", explain: "Saving your place writes to this device only. It is not a city account.", color: "#9aa8ff", pos: [36.5, 0, 8.2], size: [7.2, 4.8, 5.2], later: false, shape: "civic",
    actions: [{ id: "help", label: "Help" }, { id: "save", label: "Save my place", sensitive: true }, { id: "account", label: "My place" }] },
  { id: "own", name: "Ownership Terminal", short: "Own", lead: "You are at the Ownership Terminal.", next: "I will explain first. No wallet is connected on this floor.", explain: "A wallet is a key to things you own. Custody means who holds that key. Fees are what you pay to move value. Withdrawal is how you take it out. None of that is live on this floor.", color: "#ff3131", pos: [48.5, 0, 0], size: [6.4, 6.2, 6.4], later: true, shape: "vault",
    actions: [{ id: "wallet", label: "What is a wallet?" }, { id: "custody", label: "Who holds it?" }, { id: "fees", label: "Fees" }, { id: "withdraw", label: "Withdraw" }, { id: "connect", label: "Connect a wallet", sensitive: true, deny: true }] },
];

const INTENTS = [
  { id: "shop", label: "Shop", region: "commerce", line: "Commerce Row is the shops. I can take you there." },
  { id: "work", label: "Work", region: "work", line: "Work Exchange is for tasks. I can take you there." },
  { id: "create", label: "Create", region: "creator", line: "Creator Boulevard is for making things." },
  { id: "learn", label: "Learn", region: "learn", line: "Learning Quarter. One lesson at a time." },
  { id: "explore", label: "Explore", region: "plaza", line: "We can walk the boulevard. I will keep it simple." },
];

const LESSONS = {
  "lesson-street": { title: "What is this street?", body: "Main Street is the easy door into AGENTROPOLIS. Shop, work, learn, and create like a normal app. The city handles the hard rails underneath when you need them." },
  "lesson-receipt": { title: "What is a receipt?", body: "A receipt is a plain record. It says what you asked for, what was allowed, what you paid, what you got, and what you can take out. If a number is missing, it did not happen." },
  "lesson-wallet": { title: "What is a wallet?", body: "A wallet holds keys to things you own. You do not need one to walk this street. When you want to claim something, the Ownership Terminal explains custody, fees, and withdrawal first." },
};

const GOODS = {
  "buy-pin": { name: "City pin", price: "6", get: "A local pin mark on this floor.", own: "Nothing on a chain.", withdraw: "Nothing to withdraw." },
  "buy-note": { name: "Street notebook", price: "12", get: "A local notebook mark on this floor.", own: "Nothing on a chain.", withdraw: "Nothing to withdraw." },
};

const PLACES = [
  { id: "look", label: "Visitor", plain: "Look around" },
  { id: "save", label: "Resident", plain: "Save my place" },
  { id: "work", label: "Worker", plain: "Work or create" },
  { id: "claim", label: "Owner", plain: "Claim what is mine" },
  { id: "city", label: "Citizen", plain: "Enter the wider city" },
];

const MODE_NOTE = {
  web2: "Shop and walk like a normal street. No wallet talk.",
  hybrid: "Same street. A little of what runs underneath.",
  web3: "Ownership is available. Nothing is forced.",
};

const $ = (id) => document.getElementById(id);
const region = (id) => REGIONS.find((r) => r.id === id);

function loadState() {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) throw 0;
    const p = JSON.parse(raw);
    return {
      place: p.place || "look",
      mode: p.mode || "web2",
      seen: Array.isArray(p.seen) && p.seen.length ? p.seen : ["plaza"],
      receipts: Array.isArray(p.receipts) ? p.receipts : [],
      artifact: p.artifact || null,
      saved: Boolean(p.saved),
    };
  } catch {
    return { place: "look", mode: "web2", seen: ["plaza"], receipts: [], artifact: null, saved: false };
  }
}

const state = loadState();
const ui = {
  focus: "plaza",
  inside: null,
  pending: null,
  speech: "Welcome to Main Street. I can show you around.",
  sheet: null,
};

function save() {
  localStorage.setItem(STORE, JSON.stringify(state));
}

function bump(next) {
  const order = ["look", "save", "work", "claim", "city"];
  if (order.indexOf(next) > order.indexOf(state.place)) state.place = next;
}

function receipt(partial) {
  const now = new Date();
  const item = {
    id: `MS-RCP-${now.getTime().toString(36).toUpperCase()}`,
    at: now.toISOString(),
    ...partial,
  };
  state.receipts = [item, ...state.receipts].slice(0, 24);
  save();
  ui.sheet = { kind: "receipt", item };
  speak("This is your receipt. It shows what happened.");
  render();
  return item;
}

function speak(text) {
  ui.speech = text;
  $("speech").textContent = text;
}

function markSeen(id) {
  if (!state.seen.includes(id)) {
    state.seen = [...state.seen, id];
    save();
  }
}

function setFocus(id) {
  ui.focus = id;
  markSeen(id);
  const r = region(id);
  speak(r.lead);
  world?.focus(id, false);
  renderChrome();
}

function enter(id) {
  if (id === "own" && state.mode === "web2") {
    setFocus("own");
    speak("Ownership is further down the street. You do not need it yet.");
    return;
  }
  ui.inside = id;
  ui.focus = id;
  ui.pending = null;
  markSeen(id);
  speak(region(id).next);
  ui.sheet = null;
  world?.focus(id, true);
  render();
}

function recommend(intent) {
  const item = INTENTS.find((i) => i.id === intent);
  ui.pending = intent;
  ui.focus = item.region;
  speak(item.line);
  ui.sheet = null;
  world?.focus(item.region, false);
  render();
}

function showMe() {
  const id = ui.pending ? INTENTS.find((i) => i.id === ui.pending).region : ui.focus;
  ui.focus = id;
  ui.inside = null;
  speak(`This is ${region(id).name}. Tap again when you want to go in.`);
  world?.focus(id, false);
  render();
}

function takeThere() {
  const id = ui.pending ? INTENTS.find((i) => i.id === ui.pending).region : ui.focus;
  if (id) enter(id);
}

function explain() {
  const r = region(ui.inside || ui.focus);
  speak(r.explain);
  ui.sheet = { kind: "explain", title: "Plain words", body: r.explain };
  renderSheet();
}

function confirmCopy(action) {
  const g = GOODS[action];
  if (g) return `${g.name} · ${g.price}. ${g.get} ${g.withdraw} No money will move. Mode: ${state.mode}.`;
  if (action === "save") return "This saves your visit on this device. It is not a city account and not a wallet.";
  if (action === "publish") return "Publish stays on this device. The live city will not receive it.";
  if (action === "sample") return "This is a sample task. There is no employer and no payout.";
  return "Please confirm. I will not act until you say so.";
}

function runAction(actionId) {
  const r = region(ui.inside || ui.focus);
  const action = r.actions.find((a) => a.id === actionId);
  if (!action) {
    if (INTENTS.some((i) => i.id === actionId)) return recommend(actionId);
    return;
  }
  if (action.deny) {
    speak("I cannot do that on this floor.");
    receipt({
      region: r.id, action: actionId, title: "Wallet connect denied", mode: state.mode,
      paid: "None", received: "None", owned: "None", withdraw: "None",
      note: "DENY. No live wallet on this floor. Guidance is not permission.",
    });
    return;
  }
  if (action.sensitive) {
    speak("That action needs your approval first.");
    ui.sheet = { kind: "confirm", action: actionId, title: action.label, body: confirmCopy(actionId) };
    renderSheet();
    return;
  }
  applyAction(actionId);
}

function applyAction(actionId) {
  const r = region(ui.inside || ui.focus);
  const g = GOODS[actionId];
  if (g) {
    receipt({
      region: r.id, action: actionId, title: `Preview checkout · ${g.name}`, mode: state.mode,
      paid: `${g.price} · not charged`, received: g.get, owned: g.own, withdraw: g.withdraw,
      note: "No money moved. This is a local receipt on this floor.",
    });
    return;
  }
  if (actionId === "save") {
    state.saved = true;
    bump("save");
    receipt({
      region: "services", action: "save", title: "Place saved on this device", mode: state.mode,
      paid: "None", received: "A local resident mark.", owned: "None", withdraw: "None",
      note: "Not a city account. Not a wallet.",
    });
    return;
  }
  if (actionId === "make") {
    state.artifact = `Street note · ${new Date().toLocaleTimeString()}`;
    bump("work");
    receipt({
      region: "creator", action: "make", title: "Something made on this floor", mode: state.mode,
      paid: "None", received: state.artifact, owned: "Local only. Not published live.", withdraw: "None",
      note: "No live publish. No live payout.",
    });
    return;
  }
  if (actionId === "publish") {
    receipt({
      region: "creator", action: "publish", title: "Publish stayed local", mode: state.mode,
      paid: "None", received: state.artifact || "Nothing to send.", owned: "Local only", withdraw: "None",
      note: "Publish is local. The live city did not receive this.",
    });
    return;
  }
  if (actionId === "sample") {
    bump("work");
    receipt({
      region: "work", action: "sample", title: "Sample task finished", mode: state.mode,
      paid: "None", received: "A practice receipt.", owned: "None", withdraw: "None",
      note: "There are no live jobs on this floor.",
    });
    return;
  }
  if (actionId === "receipts" || actionId === "account") {
    ui.sheet = { kind: "list" };
    speak(state.receipts.length ? "Here are the receipts from this device." : "No receipts yet. Do one thing and I will write one.");
    renderSheet();
    return;
  }
  if (actionId === "help") {
    ui.sheet = { kind: "explain", title: "Plain words", body: "I am a guide. Guidance is not permission. I do not move money. You do not need a wallet yet." };
    speak("Ask me to show you, take you there, or explain a word.");
    renderSheet();
    return;
  }
  if (actionId === "find") { speak("No live jobs on this floor. You can still try a sample so you see how a receipt looks."); return; }
  if (actionId === "browse") { speak("Previews only. No live show and no live store inventory."); return; }
  if (actionId === "play") { speak("Preview loop. Nothing is streaming in."); return; }
  if (actionId.startsWith("lesson-")) {
    const lesson = LESSONS[actionId];
    if (lesson) {
      ui.sheet = { kind: "explain", title: lesson.title, body: lesson.body };
      speak("One lesson. Tell me when you want the next.");
      renderSheet();
    }
    return;
  }
  if (actionId === "wallet" || actionId === "custody" || actionId === "fees" || actionId === "withdraw") {
    const text =
      actionId === "wallet" ? LESSONS["lesson-wallet"].body
      : actionId === "custody" ? "Custody is who holds the key. If we hold it, we must say so. If you hold it, you can lose it. This floor holds nothing."
      : actionId === "fees" ? "Fees are what you pay to move value. They must be shown before you approve. No fee is charged here."
      : "Withdrawal is how you take value out. Terms must be plain. There is nothing to withdraw on this floor.";
    bump("claim");
    ui.sheet = { kind: "explain", title: "Read first", body: text };
    speak("Read first. I will not act for you.");
    save();
    render();
  }
}

function renderChrome() {
  const r = region(ui.inside || ui.focus);
  const place = PLACES.find((p) => p.id === state.place);
  $("where").textContent = ui.inside ? r.lead : `You are on Main Street. ${place.plain}.`;
  $("place").textContent = place.plain;
  $("speech").textContent = ui.speech;
  const q = Math.min(1, state.seen.length / REGIONS.length);
  $("quest").style.background = `conic-gradient(var(--cyan) ${Math.round(q * 360)}deg, #111 0deg)`;
  $("quest-n").textContent = String(Math.round(q * 8) || 1);
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.setAttribute("aria-selected", b.dataset.mode === state.mode ? "true" : "false");
  });
  const enter = $("enter");
  const showEnter = !ui.inside && ui.focus && ui.focus !== "plaza";
  enter.hidden = !showEnter;
  $("intents").hidden = Boolean(ui.inside || ui.pending);
  const acts = $("acts");
  if (ui.pending) {
    acts.innerHTML = `
      <button type="button" data-act="show">Show me</button>
      <button type="button" data-act="take">Take me there</button>
      <button type="button" data-act="later">Not now</button>`;
  } else if (ui.inside) {
    acts.innerHTML = `
      <button type="button" data-act="do">${r.actions[0].label}</button>
      <button type="button" data-act="explain">Explain</button>
      <button type="button" data-act="out">Back out</button>`;
  } else {
    acts.innerHTML = `
      <button type="button" data-act="show">Show me</button>
      <button type="button" data-act="take">Take me there</button>
      <button type="button" data-act="explain">Explain</button>`;
  }
  renderSheet();
  renderMap();
}

function renderSheet() {
  const el = $("sheet");
  const s = ui.sheet;
  const r = region(ui.inside || ui.focus);
  if (!s && ui.inside) {
    el.hidden = false;
    el.innerHTML = `<h2>${r.name}</h2><p>${r.next}</p>${r.actions.slice(0, 4).map((a) =>
      `<button type="button" class="trace full ${a.deny ? "deny" : ""}" data-do="${a.id}">${a.label}</button>`).join("")}`;
    return;
  }
  if (!s) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  if (s.kind === "explain") {
    el.innerHTML = `<h2>${s.title}</h2><p>${s.body}</p><button type="button" class="trace full" data-close>Close</button>`;
  } else if (s.kind === "confirm") {
    el.innerHTML = `<h2>${s.title}</h2><p>${s.body}</p><div class="grid"><button type="button" class="trace" data-close>Not now</button><button type="button" class="trace" data-yes>Yes, do it</button></div>`;
  } else if (s.kind === "receipt") {
    const t = s.item;
    el.innerHTML = `<p class="ok">Receipt</p><p class="mute">${t.id}</p>
      <div class="row"><span class="mute">Paid</span><span>${t.paid}</span></div>
      <div class="row"><span class="mute">Received</span><span>${t.received}</span></div>
      <div class="row"><span class="mute">Owned</span><span>${t.owned}</span></div>
      <div class="row"><span class="mute">Withdraw</span><span>${t.withdraw}</span></div>
      <p>${t.note}</p><button type="button" class="trace full" data-close>Close</button>`;
  } else if (s.kind === "list") {
    el.innerHTML = `<h2>Receipts on this device</h2>${state.receipts.length
      ? state.receipts.map((t) => `<p class="mute">${t.title} · ${t.id}</p>`).join("")
      : "<p>None yet.</p>"}<button type="button" class="trace full" data-close>Close</button>`;
  }
}

function renderMap() {
  const map = $("map");
  if (map.hidden) return;
  map.innerHTML = REGIONS.filter((r) => !(r.later && state.mode === "web2")).map((r) => `
    <button type="button" class="chip ${ui.focus === r.id ? "hot" : ""}" data-goto="${r.id}">
      <span class="led ${ui.focus === r.id ? "here" : r.later ? "later" : ""}"></span>
      <strong>${r.short}</strong>
      <span class="mute">${r.name}</span>
    </button>`).join("");
}

function render() {
  renderChrome();
}

$("dock-hide").onclick = () => { $("dock").hidden = true; $("dock-show").hidden = false; };
$("dock-show").onclick = () => { $("dock").hidden = false; $("dock-show").hidden = true; };
$("enter").onclick = () => enter(ui.focus);
$("intents").addEventListener("click", (e) => {
  const b = e.target.closest("[data-intent]");
  if (b) recommend(b.dataset.intent);
});
$("acts").addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act;
  if (a === "show") showMe();
  else if (a === "take") takeThere();
  else if (a === "explain") explain();
  else if (a === "later") { ui.pending = null; speak("You can come back to this later."); render(); }
  else if (a === "out") { ui.inside = null; speak("Back on the boulevard."); world?.focus(ui.focus, false); render(); }
  else if (a === "do") runAction(region(ui.inside || ui.focus).actions[0].id);
});
$("sheet").addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.hasAttribute("data-close")) { ui.sheet = null; render(); }
  else if (t.hasAttribute("data-yes") && ui.sheet?.kind === "confirm") {
    const action = ui.sheet.action;
    ui.sheet = null;
    applyAction(action);
  } else if (t.dataset.do) runAction(t.dataset.do);
});
$("map").addEventListener("click", (e) => {
  const b = e.target.closest("[data-goto]");
  if (!b) return;
  const id = b.dataset.goto;
  if (ui.focus === id) enter(id);
  else setFocus(id);
});
document.querySelector(".mode").addEventListener("click", (e) => {
  const b = e.target.closest("[data-mode]");
  if (!b) return;
  state.mode = b.dataset.mode;
  save();
  speak(MODE_NOTE[state.mode]);
  render();
});
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (ui.sheet) { ui.sheet = null; render(); return; }
  if (ui.inside) { ui.inside = null; speak("Back on the boulevard."); world?.focus(ui.focus, false); render(); }
});

let world = null;

function useMap() {
  $("gl").hidden = true;
  $("map").hidden = false;
  renderMap();
}

async function bootWorld() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection?.saveData);
  const low = saveData || (navigator.hardwareConcurrency || 8) <= 4;
  if (low && !window.WebGLRenderingContext) {
    useMap();
    return;
  }
  try {
    const THREE = await import("three");
    const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
    const { CSS2DRenderer, CSS2DObject } = await import("three/addons/renderers/CSS2DRenderer.js");
    world = makeWorld(THREE, OrbitControls, CSS2DRenderer, CSS2DObject, { reduce, low });
  } catch (err) {
    console.warn("3D unavailable, using street map.", err);
    useMap();
  }
}

function makeWorld(THREE, OrbitControls, CSS2DRenderer, CSS2DObject, { reduce, low }) {
  const canvas = $("gl");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.08, 180);
  camera.position.set(-4.5, 9.2, 18);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, alpha: false, powerPreference: low ? "low-power" : "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, low ? 1.05 : 1.5));
  renderer.toneMapping = THREE.NoToneMapping;
  const labels = new CSS2DRenderer();
  labels.domElement.style.position = "absolute";
  labels.domElement.style.inset = "0";
  labels.domElement.style.pointerEvents = "none";
  $("stage").appendChild(labels.domElement);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = !reduce;
  controls.dampingFactor = 0.08;
  controls.minPolarAngle = 0.34;
  controls.maxPolarAngle = Math.PI / 2.18;
  controls.minDistance = 7;
  controls.maxDistance = 48;
  controls.target.set(14, 1.4, 0);

  scene.add(new THREE.HemisphereLight(0xd8f6ff, 0x05080c, 0.92));
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 1.15);
  sun.position.set(12, 18, 8);
  scene.add(sun);
  const core = new THREE.PointLight(0x00ffff, 1.1, 28);
  core.position.set(0, 4.2, 0);
  scene.add(core);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(92, 42), new THREE.MeshLambertMaterial({ color: 0x05070a }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(18, 0, 0);
  scene.add(ground);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(78, 7.2), new THREE.MeshLambertMaterial({ color: 0x0a1016 }));
  road.rotation.x = -Math.PI / 2;
  road.position.set(18, 0.02, 0);
  scene.add(road);
  const stripe = new THREE.Mesh(new THREE.PlaneGeometry(78, 0.12), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.55 }));
  stripe.rotation.x = -Math.PI / 2;
  stripe.position.set(18, 0.04, 0);
  scene.add(stripe);
  const ring = new THREE.Mesh(new THREE.RingGeometry(5.4, 5.7, 64), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(0, 0.06, 0);
  scene.add(ring);

  const traces = new THREE.BufferGeometry();
  const pts = [];
  for (const r of REGIONS) {
    if (r.id === "plaza") continue;
    pts.push(0, 0.08, 0, r.pos[0], 0.08, r.pos[2]);
  }
  traces.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.LineSegments(traces, new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.28 })));

  const buildings = new Map();
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function addLabel(obj, text, y) {
    const el = document.createElement("div");
    el.className = "label3d";
    el.innerHTML = `<span class="led"></span>${text}`;
    const tag = new CSS2DObject(el);
    tag.position.set(0, y, 0);
    obj.add(tag);
    return el;
  }

  function volume(r) {
    const g = new THREE.Group();
    const [w, h, d] = r.size;
    const mat = new THREE.MeshLambertMaterial({ color: 0x121820, emissive: 0x000000, emissiveIntensity: 0 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h * (r.shape === "plaza" ? 0.12 : 0.78), d), mat);
    box.position.y = r.shape === "plaza" ? 0.2 : h * 0.39;
    g.add(box);
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.55, 0.1), new THREE.MeshLambertMaterial({ color: 0x05080c, emissive: new THREE.Color(r.color), emissiveIntensity: 0.28 }));
    door.position.set(0, 0.78, d / 2 + 0.03);
    g.add(door);
    g.userData.mat = mat;
    g.userData.led = addLabel(g, r.name, h + 0.55);
    return g;
  }

  for (const r of REGIONS) {
    const g = volume(r);
    g.position.set(...r.pos);
    g.userData.id = r.id;
    scene.add(g);
    buildings.set(r.id, g);
  }

  const station = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.3, 8.4), new THREE.MeshLambertMaterial({ color: 0x101820 }));
  station.position.set(-16.5, 0.15, 0);
  scene.add(station);
  const stLabel = addLabel(station, "Main Street Station", 5.1);
  stLabel.querySelector(".led").classList.add("here");

  const guide = new THREE.Group();
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 14), new THREE.MeshLambertMaterial({ color: 0xd8f6ff, emissive: 0x00ffff, emissiveIntensity: 0.22 }));
  head.position.y = 1.55;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.7, 6, 10), new THREE.MeshLambertMaterial({ color: 0x0a2a32, emissive: 0x00ffff, emissiveIntensity: 0.18 }));
  body.position.y = 0.85;
  guide.add(head, body);
  guide.position.set(1.8, 0, 2.6);
  scene.add(guide);

  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
  scene.add(pulse);

  if (!low) {
    for (let x = -8; x <= 46; x += 6) {
      for (const z of [-3.4, 3.4]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 6), new THREE.MeshLambertMaterial({ color: 0x1a242c }));
        pole.position.set(x, 1.6, z);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.85 }));
        lamp.position.set(x, 3.25, z);
        scene.add(pole, lamp);
      }
    }
  }

  let flying = true;
  const goal = new THREE.Vector3(-4.5, 9.2, 18);
  const look = new THREE.Vector3(14, 1.4, 0);
  let interior = null;

  function clearInterior() {
    if (interior) {
      scene.remove(interior);
      interior = null;
    }
    for (const g of buildings.values()) g.visible = true;
    station.visible = true;
    guide.visible = true;
  }

  function makeInterior(r) {
    clearInterior();
    const g = new THREE.Group();
    g.position.set(...r.pos);
    const w = 10.4, depth = 12.2, h = 3.7;
    const wallC = r.id === "own" ? 0x2a1418 : 0x1a2430;
    const floorC = r.id === "own" ? 0x1c1014 : 0x141c24;
    const wall = new THREE.MeshLambertMaterial({ color: wallC });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, depth), new THREE.MeshLambertMaterial({ color: floorC }));
    floor.rotation.x = -Math.PI / 2;
    g.add(floor);
    const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), wall);
    back.position.set(0, h / 2, -depth / 2);
    g.add(back);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, depth), wall);
    left.position.set(-w / 2, h / 2, 0);
    g.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, depth), wall);
    right.position.set(w / 2, h / 2, 0);
    g.add(right);
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.4), new THREE.MeshLambertMaterial({ color: 0x101820, emissive: new THREE.Color(r.color), emissiveIntensity: 0.16 }));
    desk.position.set(0, 0.55, -1.4);
    g.add(desk);
    const light = new THREE.PointLight(r.color, 1.5, 16);
    light.position.set(0, 2.6, 0);
    g.add(light);
    const el = document.createElement("div");
    el.className = "label3d";
    el.textContent = `You are here · ${r.name}`;
    const tag = new CSS2DObject(el);
    tag.position.set(0, 2.15, -1.2);
    g.add(tag);
    scene.add(g);
    interior = g;
    for (const b of buildings.values()) b.visible = false;
    station.visible = false;
    guide.visible = false;
  }

  function focus(id, inside) {
    const r = region(id);
    flying = true;
    if (inside && r) {
      makeInterior(r);
      goal.set(r.pos[0], 1.62, r.pos[2] + 2.4);
      look.set(r.pos[0], 1.28, r.pos[2] - 2.2);
      controls.minDistance = 1.1;
      controls.maxDistance = 8;
      return;
    }
    clearInterior();
    controls.minDistance = 7;
    controls.maxDistance = 48;
    if (r && r.id !== "plaza") {
      goal.set(r.pos[0] + 6.4, r.size[1] + 3.8, r.pos[2] + 9.2);
      look.set(r.pos[0], r.size[1] * 0.42, r.pos[2]);
    } else {
      goal.set(-4.5, 9.2, 18);
      look.set(14, 1.4, 0);
    }
    for (const [rid, g] of buildings) {
      const hot = rid === id;
      g.userData.mat.emissive = new THREE.Color(hot ? region(rid).color : "#000000");
      g.userData.mat.emissiveIntensity = hot ? 0.22 : 0;
      g.userData.led.querySelector(".led").className = `led ${hot ? "here" : region(rid).later ? "later" : ""}`;
    }
  }

  canvas.addEventListener("pointerdown", (ev) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(pointer, camera);
    const hits = ray.intersectObjects([...buildings.values()], true);
    if (!hits.length) return;
    let obj = hits[0].object;
    while (obj && !obj.userData.id) obj = obj.parent;
    if (!obj) return;
    const id = obj.userData.id;
    if (ui.focus === id) enter(id);
    else setFocus(id);
  });

  function resize() {
    const w = canvas.clientWidth || $("stage").clientWidth;
    const h = canvas.clientHeight || $("stage").clientHeight;
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    labels.setSize(w, h);
  }
  window.addEventListener("resize", resize);
  resize();

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (flying) {
      if (reduce) {
        camera.position.copy(goal);
        controls.target.copy(look);
        flying = false;
      } else {
        const k = ui.inside ? 5.4 : 3.1;
        camera.position.lerp(goal, 1 - Math.exp(-dt * k));
        controls.target.lerp(look, 1 - Math.exp(-dt * k));
        if (camera.position.distanceTo(goal) < 0.12) flying = false;
      }
    }
    const dest = region(ui.pending ? INTENTS.find((i) => i.id === ui.pending).region : ui.focus);
    if (dest) {
      const t = ((now / 1000) % 2.4) / 2.4;
      pulse.position.set(dest.pos[0] * t, 0.28, dest.pos[2] * t);
      const gx = dest.id === "plaza" ? 1.8 : dest.pos[0] - 2.4;
      const gz = dest.id === "plaza" ? 2.6 : dest.pos[2] + 3.1;
      guide.position.lerp(new THREE.Vector3(gx, 0, gz), 1 - Math.exp(-dt * 2.2));
    }
    controls.update();
    renderer.render(scene, camera);
    labels.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  controls.addEventListener("start", () => { flying = false; });

  return { focus };
}

bootWorld().then(() => render());
render();
