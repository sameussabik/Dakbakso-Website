// ---------- CONFIG ----------
const ORDER_ENDPOINT = "https://script.google.com/macros/s/AKfycbz89GiiNWUixWYu5Q1VI_-DohczJhXw9VS99Yn1l_Vlm31Yq3Dt4mDef1rVs_EVZfCU/exec";
// Portfolio CSV link must end in "output=csv" (not "pubhtml") — see setup guide.
const PORTFOLIO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGbZLDjmoy2UszGKkcLachHTqDNMStPwhbGg00-mx6oxK12ZzbHIrt4eb8p5KT_GPjWx70jnE-qW3H/pub?gid=0&single=true&output=csv";
const BLOG_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTGbZLDjmoy2UszGKkcLachHTqDNMStPwhbGg00-mx6oxK12ZzbHIrt4eb8p5KT_GPjWx70jnE-qW3H/pub?gid=1999701892&single=true&output=csv";

// ---------- SERVICES DATA ----------
const SERVICES = [
  {
    name: "Website Development",
    desc: "Business, e-commerce, booking and portfolio sites.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9z"/></svg>`,
    items: ["Business website","Landing page","Portfolio website","Restaurant website","E-commerce website","Booking / appointment website","Web application / dashboard","Website redesign & fix"]
  },
  {
    name: "UI/UX & Product Design",
    desc: "Interfaces and prototypes that are easy to use.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    items: ["Website UI design","Mobile app UI","Dashboard design","Landing page design","Figma prototype","Website redesign"]
  },
  {
    name: "Web & Business Solutions",
    desc: "Custom tools that run part of your business.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="4"/></svg>`,
    items: ["Custom web applications","Admin dashboard","Customer management system","Order management system","Booking system","Inventory / basic management system","Internal business tools","API integration","Database integration","Authentication / user system"]
  },
  {
    name: "Website Maintenance & Support",
    desc: "Keeping what's live fast, safe and current.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z"/></svg>`,
    items: ["Website updates","Bug fixing","Content updates","Backup","Performance optimisation","Security / basic maintenance","Hosting / deployment support","Monthly technical support"]
  },
  {
    name: "AI & Automation",
    desc: "Workflows that save time once you're set up.",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="7" width="14" height="11" rx="2"/><path d="M9 7V5a3 3 0 0 1 6 0v2M9 12h.01M15 12h.01"/></svg>`,
    items: ["AI chatbot","Website AI assistant","Lead capture automation","Automatic customer follow-up","Email automation","Google Sheets automation","Appointment / booking automation","Order management automation","AI content generation workflow","Business workflow automation","Data automation between software / APIs"]
  }
];

const CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>`;

function renderServices(targetId, limit){
  const grid = document.getElementById(targetId);
  if (!grid) return;
  const list = limit ? SERVICES.slice(0, limit) : SERVICES;

  grid.innerHTML = list.map((s, i) => `
    <div class="service-card stagger-item">
      <span class="service-index">${String(i + 1).padStart(2, "0")}</span>
      <div class="service-icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <span class="service-toggle">View list ${CHEVRON}</span>
      <ul class="service-list">
        ${s.items.map(it => `<li>${it}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  grid.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");
      card.classList.toggle("open");
      card.querySelector(".service-toggle").innerHTML = (isOpen ? "View list" : "Hide list") + " " + CHEVRON;
    });
  });
}

// ---------- CSV PARSER ----------
// Handles quoted fields, commas inside quotes, escaped quotes (""), and
// multi-line content inside quotes — needed for blog post bodies.
function parseCSV(text){
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++){
    const c = text[i];
    if (inQuotes){
      if (c === '"'){
        if (text[i + 1] === '"'){ field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"'){ inQuotes = true; }
      else if (c === ","){ row.push(field); field = ""; }
      else if (c === "\n"){ row.push(field); rows.push(row); row = []; field = ""; }
      else if (c === "\r"){ /* skip, \n handles the row break */ }
      else { field += c; }
    }
  }
  if (field.length || row.length){ row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(v => v.trim() !== ""));
}

function csvToRows(csvText){
  const table = parseCSV(csvText.trim());
  const headers = table[0].map(h => h.trim().toLowerCase());
  return table.slice(1).map(cols => {
    const row = {};
    headers.forEach((h, i) => { row[h] = (cols[i] || "").trim(); });
    return row;
  });
}

// ---------- PORTFOLIO ----------
async function loadPortfolio(targetId, limit){
  const grid = document.getElementById(targetId);
  if (!grid) return;

  if (!PORTFOLIO_CSV_URL || PORTFOLIO_CSV_URL.startsWith("PASTE_")){
    renderPortfolioFallback(grid, limit);
    return;
  }

  try {
    const res = await fetch(PORTFOLIO_CSV_URL);
    if (!res.ok) throw new Error("sheet fetch failed");
    let rows = csvToRows(await res.text()).filter(r => r.name);
    if (rows.length === 0){ renderPortfolioFallback(grid, limit); return; }
    if (limit) rows = rows.slice(0, limit);

    grid.innerHTML = rows.map(r => `
      <div class="portfolio-card stagger-item">
        <div class="portfolio-thumb-wrap">
          <img class="portfolio-thumb" src="${r["image url"] || r.image || ""}" alt="${r.name}" loading="lazy">
          ${r["live link"] ? `<a class="portfolio-overlay" href="${r["live link"]}" target="_blank" rel="noopener"><span>View project</span></a>` : `<div class="portfolio-overlay"><span>Case study soon</span></div>`}
        </div>
        <div class="portfolio-body">
          <span class="portfolio-tag">${r.category || ""}</span>
          <h3>${r.name}</h3>
          <p>${r.description || ""}</p>
        </div>
      </div>
    `).join("") + `<div class="portfolio-empty stagger-item">More work coming soon</div>`;
  } catch (err){
    renderPortfolioFallback(grid, limit);
  }
}

function renderPortfolioFallback(grid, limit){
  const count = limit || 3;
  let html = `<div class="portfolio-empty stagger-item">First project going up here soon</div>`;
  for (let i = 1; i < count; i++){
    html += `<div class="portfolio-empty stagger-item">More work coming soon</div>`;
  }
  grid.innerHTML = html;
}

// ---------- BLOG ----------
async function loadBlogList(targetId){
  const grid = document.getElementById(targetId);
  if (!grid) return;

  if (!BLOG_CSV_URL || BLOG_CSV_URL.startsWith("PASTE_")) return; // keep the static teaser cards already in the HTML

  try {
    const res = await fetch(BLOG_CSV_URL);
    if (!res.ok) throw new Error("blog fetch failed");
    const rows = csvToRows(await res.text()).filter(r => r.title && r.slug);
    if (rows.length === 0) return;

    rows.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

    grid.innerHTML = rows.map(r => `
      <a class="portfolio-card stagger-item" href="post.html?slug=${encodeURIComponent(r.slug)}">
        <div class="portfolio-body">
          <span class="portfolio-tag">${r.category || "Blog"}</span>
          <h3>${r.title}</h3>
          <p>${r.summary || ""}</p>
        </div>
      </a>
    `).join("");
  } catch (err){
    // leave the static teaser cards in place if the fetch fails
  }
}

async function loadBlogPost(){
  const el = document.getElementById("postContent");
  if (!el) return;

  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug){ el.innerHTML = "<p>No post specified.</p>"; return; }

  if (!BLOG_CSV_URL || BLOG_CSV_URL.startsWith("PASTE_")){
    el.innerHTML = "<p>Blog isn't connected yet — set BLOG_CSV_URL in script.js.</p>";
    return;
  }

  try {
    const res = await fetch(BLOG_CSV_URL);
    const rows = csvToRows(await res.text());
    const post = rows.find(r => r.slug === slug);
    if (!post){ el.innerHTML = "<p>Post not found.</p>"; return; }

    document.title = `${post.title} — Dakbakso Blog`;
    const paragraphs = (post.content || "").split(/\n+/).filter(p => p.trim()).map(p => `<p>${p}</p>`).join("");

    el.innerHTML = `
      <span class="portfolio-tag">${post.category || "Blog"}</span>
      <h1>${post.title}</h1>
      <p class="post-date">${post.date || ""}</p>
      <div class="post-body">${paragraphs}</div>
    `;
  } catch (err){
    el.innerHTML = "<p>Couldn't load this post right now.</p>";
  }
}

// ---------- ORDER FORM ----------
function initOrderForm(){
  const form = document.getElementById("orderForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("orderSubmit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";
    status.className = "form-status";

    const data = Object.fromEntries(new FormData(form).entries());
    data.timestamp = new Date().toISOString();

    if (!ORDER_ENDPOINT || ORDER_ENDPOINT.startsWith("PASTE_")){
      status.textContent = "Form isn't connected yet — set ORDER_ENDPOINT in js/script.js.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      await fetch(ORDER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data)
      });
      status.textContent = "Request sent — we'll reach out soon.";
      status.classList.add("success");
      form.reset();
    } catch (err){
      status.textContent = "Something went wrong. Please try WhatsApp or email instead.";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send request";
    }
  });
}

// ---------- CURRENCY TOGGLE ----------
function initCurrencyToggle(){
  const wrap = document.getElementById("currencyToggle");
  if (!wrap) return;
  const buttons = wrap.querySelectorAll(".curr-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.body.classList.toggle("currency-bdt", btn.dataset.currency === "bdt");
    });
  });
}

// ---------- 3D TILT ----------
function initTilt(){
  if (typeof window.matchMedia !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.matchMedia("(hover: none)").matches) return; // skip on touch devices

  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

// ---------- NAV ----------
function initNav(){
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", false);
  }));

  const current = location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
}

// ---------- SCROLL REVEAL ----------
function initReveal(){
  const targets = document.querySelectorAll(".reveal, .reveal-stagger");
  if (!("IntersectionObserver" in window) || targets.length === 0){
    targets.forEach(t => t.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
}

// ---------- FOOTER YEAR ----------
function initFooterYear(){
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderServices("serviceGridHome", 5);
  renderServices("serviceGridFull");
  loadPortfolio("portfolioGridHome", 3);
  loadPortfolio("portfolioGridFull");
  loadBlogList("blogGrid");
  loadBlogPost();
  initOrderForm();
  initNav();
  initFooterYear();
  initReveal();
  initCurrencyToggle();
  initTilt();
});
