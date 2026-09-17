(() => {
  const pages = {
    "index.html": homePage,
    "": homePage,
    "programmes.html": foundationPage,
    "programmes-upsc-foundation.html": foundationPage,
    "post-foundation.html": postFoundationPage,
    "resources.html": resourcesPage,
    "aram-ai.html": aramAiPage,
    "results.html": resultPage,
    "about.html": aboutPage,
  };

  const current = location.pathname.split("/").pop();
  const renderPage = pages[current];

  const nav = [
    ["HOME", "index.html"],
    ["Foundation", "programmes-upsc-foundation.html"],
    ["Post-Foundation", "post-foundation.html"],
    ["Current Affairs", "current-affairs.html"],
    ["Resources", "resources.html"],
    ["Aram-AI", "aram-ai.html"],
    ["Result", "results.html"],
    ["About", "about.html"],
  ];

  const noticeItems = [
    ["BATCH LIVE", "UPSC Foundation batch starts September 10", "Enquire", "programmes-upsc-foundation.html", true],
    ["CURRENT AFFAIRS", "Current Affairs 360 admission is open for this cycle", "Join", "post-foundation-current-affairs-360.html", true],
    ["FOUNDATION", "Classroom + online orientation seats now open", "Talk to ARAM", "programmes-upsc-foundation.html", true],
    ["MAINS PRACTICE", "Today's Mains Answer Writing question is live", "Attempt", "resources.html", false],
    ["TEST SERIES", "Prelims test rescheduled - check updated slot before travel", "View", "resources.html", true],
    ["OFFICIAL NOTICE", "Verify ARAM centres and payment channels before making payment", "Verify", "about.html", false],
  ];

  const header = document.querySelector(".site-header");
  if (header) {
    header.insertAdjacentHTML("beforebegin", noticeMarkup(noticeItems));
    const navEl = header.querySelector(".main-nav");
    if (navEl) {
      navEl.innerHTML = nav.map(([label, href]) => {
        const active = href === current || (current === "programmes.html" && href.includes("foundation"));
        return `<a href="${href}" class="${active ? "active" : ""}">${label}</a>`;
      }).join("");
    }
    const actions = header.querySelector(".header-actions");
    if (actions) {
      const isPost = current.startsWith("post-foundation");
      const isAramAi = current === "aram-ai.html";
      const isCurrentAffairs = current === "current-affairs.html";
      let href = "#";
      let label = "Talk to ARAM";
      if (isCurrentAffairs) { href = "#quiz-hub"; label = "Start Today's Quiz"; }
      else if (isPost) { href = "post-foundation-performance-diagnostic.html"; label = "Take the Performance Diagnostic"; }
      else if (isAramAi) { href = "#"; label = "Experience ARAM AI"; }
      actions.innerHTML = `
        <a href="${href}" class="btn btn-primary">${label}</a>
      `;
    }
  }

  const footer = document.querySelector(".site-footer");
  const nodes = [...document.body.children];
  const headerIndex = nodes.indexOf(header);
  const footerIndex = nodes.indexOf(footer);
  if (renderPage && headerIndex >= 0 && footerIndex > headerIndex) {
    const html = renderPage();
    for (let i = headerIndex + 1; i < footerIndex; i += 1) nodes[i].remove();
    header.insertAdjacentHTML("afterend", html);
  }
  if (footer) footer.outerHTML = footerMarkup();

  initNotice(noticeItems.length);
  initReveal();
  initTopperBoard();
  initYtCarousel();
  initBoardTabs();

  function noticeMarkup(items) {
    const [tag, text, action, href, highlight] = items[0];
    return `
      <section class="notice-board ${highlight ? "is-highlight" : ""}" aria-label="Latest from ARAM">
        <div class="container notice-board-inner">
          <div class="notice-ticket">
            <strong>LATEST FROM ARAM</strong>
            <span data-notice-tag>${tag}</span>
            <p data-notice-text>${text}</p>
            <a href="${href}" data-notice-action>${action} →</a>
            <div class="notice-auth-actions">
              <a href="#">Student Login</a>
              <a href="#">Sign Up</a>
            </div>
          </div>
          <div class="notice-controls">
            <small data-notice-count>1 / ${items.length}</small>
            <button type="button" data-notice-prev aria-label="Previous notice">‹</button>
            <button type="button" data-notice-next aria-label="Next notice">›</button>
          </div>
        </div>
      </section>
    `;
  }

  function initNotice(total) {
    let index = 0;
    const board = document.querySelector(".notice-board");
    if (!board) return;
    const tag = board.querySelector("[data-notice-tag]");
    const text = board.querySelector("[data-notice-text]");
    const action = board.querySelector("[data-notice-action]");
    const count = board.querySelector("[data-notice-count]");
    const show = (next) => {
      index = (next + total) % total;
      const item = noticeItems[index];
      tag.textContent = item[0];
      text.textContent = item[1];
      action.textContent = `${item[2]} →`;
      action.href = item[3];
      count.textContent = `${index + 1} / ${total}`;
      board.classList.toggle("is-highlight", Boolean(item[4]));
    };
    board.querySelector("[data-notice-prev]").addEventListener("click", () => show(index - 1));
    board.querySelector("[data-notice-next]").addEventListener("click", () => show(index + 1));
    let timer = setInterval(() => show(index + 1), 5600);
    board.addEventListener("mouseenter", () => clearInterval(timer));
    board.addEventListener("mouseleave", () => timer = setInterval(() => show(index + 1), 5600));
  }

  function initReveal() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  function initTopperBoard() {
    const board = document.querySelector("[data-topper-board]");
    if (!board) return;
    const slides = [...board.querySelectorAll("[data-topper-slide]")];
    const bars = [...board.querySelectorAll("[data-topper-bar]")];
    const count = board.querySelector("[data-topper-count]");
    const prevBtn = board.querySelector("[data-topper-prev]");
    const nextBtn = board.querySelector("[data-topper-next]");
    const total = slides.length;
    const holdMs = 5000;
    let index = 0;
    let timer = null;

    const show = (next) => {
      index = (next + total) % total;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      bars.forEach((bar, i) => {
        bar.classList.remove("is-filled", "is-filling");
        const fill = bar.querySelector("i");
        fill.style.animation = "none";
        if (i < index) bar.classList.add("is-filled");
        if (i === index) {
          requestAnimationFrame(() => {
            fill.style.animation = "";
            bar.classList.add("is-filling");
          });
        }
      });
      if (count) count.textContent = `${index + 1} / ${total}`;
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), holdMs);
    };

    show(0);
    start();

    // Click on bars to jump to a specific story
    bars.forEach((bar, i) => {
      bar.style.cursor = "pointer";
      bar.addEventListener("click", () => { show(i); clearInterval(timer); start(); });
    });

    // Prev / Next buttons
    if (prevBtn) prevBtn.addEventListener("click", () => { show(index - 1); clearInterval(timer); start(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { show(index + 1); clearInterval(timer); start(); });

    board.addEventListener("mouseenter", () => clearInterval(timer));
    board.addEventListener("mouseleave", start);
  }

  function initYtCarousel() {
    document.querySelectorAll("[data-yt-carousel]").forEach((carousel) => {
      const track = carousel.querySelector(".yt-carousel-track");
      const prev = carousel.querySelector("[data-yt-prev]");
      const next = carousel.querySelector("[data-yt-next]");
      if (!track) return;
      const scrollAmt = () => track.clientWidth * 0.75;
      if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -scrollAmt(), behavior: "smooth" }));
      if (next) next.addEventListener("click", () => track.scrollBy({ left: scrollAmt(), behavior: "smooth" }));
    });
  }

  function initBoardTabs() {
    const tabContainer = document.querySelector("[data-board-tabs]");
    if (!tabContainer) return;
    const tabs = [...tabContainer.querySelectorAll("[data-board]")];
    const panels = [...tabContainer.parentElement.querySelectorAll("[data-panel]")];
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const board = tab.dataset.board;
        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === board));
      });
    });
  }

  function hero(eyebrow, title, copy, actions = "", side = "") {
    return `
      <section class="hero theme-warm">
        <div class="container">
          <div class="hero-split ${side ? "has-side" : ""}">
            <div class="hero-content reveal">
              <p class="eyebrow">${eyebrow}</p>
              <h1 class="display">${title}</h1>
              <p class="lead">${copy}</p>
              ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
            </div>
            ${side ? `<div class="hero-side reveal">${side}</div>` : ""}
          </div>
        </div>
      </section>
    `;
  }

  function section(eyebrow, title, copy, body, tone = "") {
    return `
      <section class="section ${tone}">
        <div class="container">
          <div class="section-header reveal">
            <p class="eyebrow">${eyebrow}</p>
            <h2 class="section-title">${title}</h2>
            ${copy ? `<p class="lead">${copy}</p>` : ""}
          </div>
          ${body}
        </div>
      </section>
    `;
  }

  function cards(items, columns = 3) {
    return `<div class="grid-${columns} blueprint-grid">${items.map(([tag, title, copy, href = "#", cta = "Open →"]) => `
      <a href="${href}" class="module-card card-interactive blueprint-card reveal">
        <div class="module-tag">${tag}</div>
        <h3>${title}</h3>
        <p>${copy}</p>
        <span class="text-link">${cta}</span>
      </a>
    `).join("")}</div>`;
  }

  function compactResultCards(items) {
    return `<div class="result-compact-grid">${items.map(([, title, , href = "#", cta = "Watch Story →"]) => `
      <a href="${href}" class="result-compact-card card-interactive reveal">
        <h3>${title}</h3>
        <span class="text-link">${cta}</span>
      </a>
    `).join("")}</div>`;
  }

  function chips(items) {
    return `<div class="chip-row">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;
  }

  function imageBand(src, alt, caption) {
    return `
      <figure class="blueprint-image reveal">
        <img src="${src}" alt="${alt}">
        <figcaption>${caption}</figcaption>
      </figure>
    `;
  }

  function homePage() {
    return `
      <section class="hero home-hero-live theme-warm">
        <div class="container">
          <div class="home-hero-top">
            <div class="hero-content reveal">
              <h1 class="display">From Preparation to Performance.</h1>
            </div>
          </div>
          <div class="home-hero-grid">
            <aside class="current-affairs-linker reveal" aria-label="Current Affairs Link Director">
              <div class="linker-head">
                <span>Current Affairs Link Director</span>
                <strong>26 Aug 2026</strong>
              </div>
              <div class="linker-list">
                ${currentAffairsLinks().map(([date, title, meta, active]) => `
                  <a href="resources.html" class="${active ? "active" : ""}">
                    <span>${date}</span>
                    <strong>${title}</strong>
                    <small>${meta}</small>
                  </a>
                `).join("")}
              </div>
            </aside>
            <aside class="hero-ad-carousel reveal" aria-label="Featured ARAM announcements">
              <div class="hero-ad-track">
                ${heroAds().map(([img, alt, caption, cta]) => `
                  <a href="#" class="hero-ad-slide has-image">
                    <img src="${img}" alt="${alt}" class="ad-image" loading="lazy">
                    <span class="ad-image-caption">
                      <strong>${caption}</strong>
                      <em>${cta} →</em>
                    </span>
                  </a>
                `).join("")}
              </div>
              <div class="ad-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            </aside>
            <aside class="vertical-notice-board reveal" aria-label="Live ARAM notice board">
              <div class="vertical-notice-head">
                <span>Live Notice Board</span>
                <strong>Demo Feed</strong>
              </div>
              <div class="vertical-notice-window">
                <div class="vertical-notice-track">
                  ${liveNoticeItems().concat(liveNoticeItems()).map(([tag, title, meta, urgent]) => `
                    <a href="#" class="vertical-notice-item ${urgent ? "urgent" : ""}">
                      <span>${tag}</span>
                      <strong>${title}</strong>
                      <small>${meta}</small>
                    </a>
                  `).join("")}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      ${section("Result", "Preparation leaves evidence.", "Student stories, topper conversations and rank journeys from the ARAM ecosystem.", compactResultCards([
        ["Verified Story", "M. Kiruthika · AIR 184", "A direct ARAM experience story from the Civil Services journey.", "results.html", "Watch Story →"],
        ["Tamil Nadu Rank 1", "Keerthi Vasan · AIR 29", "A high-performing Tamil Nadu achiever associated with ARAM interview guidance.", "results.html", "Watch Story →"],
        ["Tamil Nadu Rank 2", "Madhubalan · AIR 71", "A strong Tamil Nadu result story from the ARAM result archive.", "results.html", "Watch Story →"],
        ["ARAM Student", "Shruthi Srinivasan · AIR 356", "An ARAM student journey from preparation to rank.", "results.html", "Watch Story →"],
        ["Topper Talk", "Aswin P · AIR 576", "Exam lessons from an achiever conversation.", "results.html", "Watch Story →"],
        ["Topper Talk", "Ruban Cianna A · AIR 650", "Strategy, mistakes and recovery from a rank journey.", "results.html", "Watch Story →"],
      ]) + imageBand("assets/media/aram-toppers-banner.jpg", "ARAM toppers banner", "ARAM achievers, student stories and learning conversations."), "result-section")}
      <section class="section ai-home-section bg-dark">
        <div class="container">
          <div class="ai-home-split">
            <div class="ai-home-copy reveal">
              <p class="eyebrow">ARAM AI</p>
              <h2 class="section-title">Your preparation's second mind.</h2>
              <p class="lead">ARAM AI is the innovation layer: it connects syllabus content, Current Affairs, PYQs, tests and answer feedback so a student knows what to do next.</p>
              <a class="btn btn-primary" href="aram-ai.html">Explore ARAM AI →</a>
            </div>
            <div class="ai-home-visual reveal">
              <img src="assets/media/ad-aram-ai-cutout.png" alt="ARAM AI dashboard: performance snapshot, next study target, revision target and performance trend">
            </div>
          </div>
        </div>
      </section>
      ${section("Useful Today", "Study something useful now.", "", cards([
        ["Today", "Today's Current Affairs", "Read the latest exam-oriented Current Affairs update.", "resources.html"],
        ["Writing", "Mains Answer Writing", "Attempt a live or latest available question.", "resources.html"],
        ["PIB", "Latest PIB Analysis", "Read the latest examination-relevant government release.", "resources.html"],
        ["Quiz", "Latest Quiz", "Attempt a current practice set.", "resources.html"],
      ], 4), "bg-subtle")}
      ${section("Preparation Stage", "Where are you in your preparation?", "", `<div class="grid-2"><div class="stage-panel reveal"><h3>Foundation</h3><h4>Build the preparation.</h4><p>For aspirants who need structured syllabus coverage, conceptual clarity, Current Affairs, CSAT, testing and regular academic guidance.</p>${chips(["GS Prelims + Mains", "CSAT", "Current Affairs", "Tests", "Mentoring"])}<a class="btn btn-primary" href="programmes-upsc-foundation.html">Explore Foundation →</a></div><div class="stage-panel dark reveal"><h3>Post-Foundation</h3><h4>Convert preparation into marks.</h4><p>For aspirants who have studied substantially but need stronger answers, better revision, sharper Current Affairs application, diagnosis and individual intervention.</p>${chips(["Performance Diagnostic", "WriteLab", "Current Affairs 360", "Mentorship", "Ethics & Essay"])}<a class="btn btn-inverse" href="post-foundation.html">Explore Post-Foundation →</a></div></div>`, "bg-subtle")}
      ${section("Current Affairs", "", "", cards([
        ["Daily News Navigator", "Daily news article analysis", "Curated developments converted into examination relevance.", "resources.html"],
        ["PIB", "Government release analysis", "Official releases filtered for syllabus value.", "resources.html"],
        ["Prelims Practice", "Daily questions", "Recall, elimination and trap-recognition practice.", "resources.html"],
        ["Mains Practice", "Issue-based answer writing", "Daily prompts that move news into answers.", "resources.html"],
      ], 4), "bg-subtle")}
    `;
  }

  function liveNoticeItems() {
    return [
      ["Admission", "Foundation Batch 8 schedule live", "Starts September 10 · Chennai + Online", true],
      ["Test", "Prelims test rescheduled", "New slot: Sunday 9:30 AM", true],
      ["CA 360", "Current Affairs 360 admission open", "Issue chains + answer application", true],
      ["Mains", "Today's answer writing question live", "GS-II · Attempt before 9 PM", false],
      ["Class", "Polity orientation class added", "Open class · Seats limited", false],
      ["Resource", "PIB analysis uploaded", "Latest government releases", false],
      ["Mentor", "Diagnostic slots open this week", "Post-Foundation students", true],
      ["Official", "Verify centre and payment details", "Official ARAM channels only", true],
    ];
  }

  function currentAffairsLinks() {
    return [
      ["Today", "Daily News Navigator", "26 Aug · Exam-linked analysis", true],
      ["25 Aug", "PIB Analysis", "Government releases for GS", false],
      ["24 Aug", "Mains Practice Question", "GS-II answer application", false],
      ["23 Aug", "Places in News", "Map-based Prelims notes", false],
      ["22 Aug", "Current Affairs Quiz", "Daily MCQ practice", false],
      ["21 Aug", "Issue Chain", "Static + current linkage", false],
    ];
  }

  function heroAds() {
    return [
      ["assets/media/ad-foundation-batch-2027.png", "UPSC Foundation Batch 2027 admissions open, starts 17 August 2026", "UPSC Foundation Batch 2027 admissions are open", "Enquire Now"],
      ["assets/media/ad-mgp-2027.png", "Mains Guidance Program 2027 for answer writing and evaluation", "Mains Guidance Program 2027 · answer writing & evaluation", "Join MGP"],
      ["assets/media/ad-prelims-2027-test-series.png", "Prelims 2027 Test Series, Batch 01 starts 16 August 2026", "Prelims 2027 Test Series · Batch 01 starts soon", "View Test Series"],
    ];
  }

  function foundationPageNoticeItems() {
    return [
      ["Batch", "UPSC Foundation Batch 8 starting", "September 10 · Chennai + Online", true],
      ["Test", "GS Mains Test Series opens", "Weekly evaluated Mains practice begins", true],
      ["Prelims", "CSAT + GS Prelims mock scheduled", "Full-length mock this Sunday", false],
      ["Current Affairs", "Daily Current Affairs class added", "Morning batch · seats limited", false],
      ["Orientation", "Foundation orientation session", "Open for new admissions", true],
      ["Official", "Verify centre and payment details", "Official ARAM channels only", true],
    ];
  }

  function postFoundationNoticeItems() {
    return [
      ["CA 360", "Current Affairs 360 new cycle starts", "September 1 · Issue chains + PYQs", true],
      ["GS Mains", "GS Mains test series live", "Weekly evaluated Mains tests", true],
      ["Essay", "Essay writing workshop scheduled", "Framework + evaluated practice", false],
      ["Ethics", "Ethics case-study clinic", "Applied GS-IV practice", false],
      ["Diagnostic", "Performance Diagnostic slots open", "Book this week", true],
      ["Official", "Verify centre and payment details", "Official ARAM channels only", true],
    ];
  }

  function postFoundationAds() {
    return [
      ["assets/media/ad-current-affairs-360.png", "Current Affairs 360 integrated programme, admissions open", "Current Affairs 360 · Daily analysis, issue-based coverage and Mains linkage", "Join CA 360"],
      ["assets/media/ad-ethics-guidance.png", "Ethics Guidance GS Paper IV preparation programme, admissions open", "Ethics Guidance · Case studies, frameworks and evaluated GS-IV answers", "Explore Ethics Guidance"],
      ["assets/media/ad-essay-guidance.png", "Essay Guidance writing programme, admissions open", "Essay Guidance · Theme building, structure and evaluated model essays", "Explore Essay Guidance"],
    ];
  }

  function heroWithNotice(eyebrow, title, copy, actions, noticeLabel, items, ads = heroAds(), theme = "") {
    return `
      <section class="hero hero-with-notice ${theme}">
        <div class="container">
          <div class="hero-notice-grid">
            <div class="hero-content reveal">
              <p class="eyebrow">${eyebrow}</p>
              <h1 class="display">${title}</h1>
              <p class="lead">${copy}</p>
              ${actions ? `<div class="hero-actions">${actions}</div>` : ""}
            </div>
            <aside class="hero-ad-carousel reveal" aria-label="Featured ARAM announcements">
              <div class="hero-ad-track">
                ${ads.map((slide) => {
                  const isImageAd = slide.length === 4;
                  if (isImageAd) {
                    const [img, alt, caption, cta] = slide;
                    return `
                      <a href="#" class="hero-ad-slide has-image">
                        <img src="${img}" alt="${alt}" class="ad-image" loading="lazy">
                        <span class="ad-image-caption">
                          <strong>${caption}</strong>
                          <em>${cta} →</em>
                        </span>
                      </a>
                    `;
                  }
                  const [kicker, adTitle, adCopy, cta, tone] = slide;
                  return `
                    <a href="#" class="hero-ad-slide ${tone}">
                      <span class="ad-kicker">${kicker}</span>
                      <strong>${adTitle}</strong>
                      <p>${adCopy}</p>
                      <em>${cta} →</em>
                    </a>
                  `;
                }).join("")}
              </div>
              <div class="ad-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            </aside>
            <aside class="hero-notice-panel reveal" aria-label="${noticeLabel}">
              <div class="linker-head">
                <span>${noticeLabel}</span>
                <strong>Live Updates</strong>
              </div>
              <div class="linker-list">
                ${items.map(([tag, t, meta, urgent]) => `
                  <a href="#" class="${urgent ? "active" : ""}">
                    <span>${tag}</span>
                    <strong>${t}</strong>
                    <small>${meta}</small>
                  </a>
                `).join("")}
              </div>
            </aside>
          </div>
        </div>
      </section>
    `;
  }

  function foundationPage() {
    return `
      ${heroWithNotice("UPSC Foundation", "Build the preparation.<br>Build it to last.", "ARAM's Foundation pathway brings together General Studies, Current Affairs, testing and academic guidance in one structured preparation journey.", `<a href="#courses" class="btn btn-primary">View Current Batches</a><a href="#" class="btn btn-secondary">Talk to a Counsellor</a>`, "Foundation Notice Board", foundationPageNoticeItems(), heroAds(), "theme-warm")}
      <section class="section bg-subtle" id="courses">
        <div class="container">
          <div class="board-tabs reveal" data-board-tabs>
            <button class="board-tab is-active" data-board="upsc">UPSC</button>
            <button class="board-tab" data-board="tnpsc">TNPSC</button>
          </div>
          <div class="board-panel is-active" data-panel="upsc">
            <div class="section-header reveal">
              <p class="answer-kicker">Courses Offered</p>
              <h2 class="section-title answer-title">UPSC Foundation programmes.</h2>
            </div>
            <div class="course-grid reveal">${[
              ["assets/media/course-pcm.jpeg", "Prelims cum Mains", "PCM course covers complete GS for Prelims and Mains.", "#"],
              ["assets/media/course-csat.jpeg", "Civil Services Aptitude Test", "CSAT course for Paper II preparation.", "#"],
              ["assets/media/course-prelims-test.jpeg", "Prelims Test Series", "Structured Prelims testing with detailed analysis.", "#"],
              ["assets/media/course-mains-test.jpeg", "Mains Test Series", "Mains answer writing practice with evaluation.", "#"],
              ["assets/media/course-optional.jpeg", "Optional Subjects", "Tamil, Anthropology, Political Science, Agriculture, Law and more.", "#"],
            ].map(([img, title, desc, url]) => `<a href="${url}" class="course-card"><img src="${img}" alt="${title}"><div class="course-info"><h4>${title}</h4><p>${desc}</p><span class="course-tag">UPSC</span></div></a>`).join("")}</div>
          </div>
          <div class="board-panel" data-panel="tnpsc">
            <div class="section-header reveal">
              <p class="answer-kicker">Courses Offered</p>
              <h2 class="section-title answer-title">TNPSC Foundation programmes.</h2>
            </div>
            <div class="course-grid reveal">${[
              ["assets/media/course-tnpsc-group1.jpeg", "TNPSC Group I", "Complete Group I preparation with General Studies and Current Affairs.", "#"],
              ["assets/media/course-tnpsc-group2.jpeg", "TNPSC Group II / IIA", "Group II and IIA course covering all subjects.", "#"],
              ["assets/media/course-tnpsc-group4.jpeg", "TNPSC Group IV", "Group IV preparation with structured testing.", "#"],
            ].map(([img, title, desc, url]) => `<a href="${url}" class="course-card"><img src="${img}" alt="${title}"><div class="course-info"><h4>${title}</h4><p>${desc}</p><span class="course-tag">TNPSC</span></div></a>`).join("")}</div>
          </div>
        </div>
      </section>
    `;
  }

  function postFoundationPage() {
    return `
      ${heroWithNotice("Post-Foundation", "You have prepared.<br>Now improve how you perform.", "For aspirants whose problem is no longer simply syllabus completion, but converting preparation into marks.", `<a href="post-foundation-performance-diagnostic.html" class="btn btn-primary">Take the Performance Diagnostic</a><a href="#interventions" class="btn btn-secondary">Explore Interventions</a>`, "Post-Foundation Notice Board", postFoundationNoticeItems(), postFoundationAds(), "theme-warm")}
      <section class="section bg-subtle" id="interventions">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Courses Offered</p>
            <h2 class="section-title answer-title">Post-Foundation programmes.</h2>
          </div>
          <div class="course-grid reveal">${[
            ["assets/media/course-pf-1.png", "WriteLab", "Structured answer-writing practice with diagnosis and rewriting.", "post-foundation-writelab.html"],
            ["assets/media/course-pf-2.png", "Current Affairs 360", "Convert daily developments into issue understanding and answer application.", "post-foundation-current-affairs-360.html"],
            ["assets/media/course-pf-3.png", "Mentorship", "Focused consultations built around the student's actual preparation problem.", "post-foundation-mentorship.html"],
            ["assets/media/course-pf-4.png", "Ethics \& Essay", "Frameworks, application and evaluated practice for high-judgment papers.", "post-foundation-ethics-essay.html"],
          ].map(([img, title, desc, url]) => `<a href="${url}" class="course-card"><img src="${img}" alt="${title}"><div class="course-info"><h4>${title}</h4><p>${desc}</p><span class="course-tag">Post-Foundation</span></div></a>`).join("")}</div>
        </div>
      </section>
      ${section("Step 1 · The Problem", "Reading more does not fix every preparation problem.", "", `<div class="grid-3">${["Foundation is over but I can't write good answers.", "I know content but my marks aren't improving.", "Nobody evaluates me properly.", "I have too many notes.", "Current Affairs isn't translating into answers.", "I don't know what is actually wrong with my preparation."].map((x) => `<div class="problem-card reveal"><p>“${x}”</p></div>`).join("")}</div><div class="center-line reveal"><h3>Start with the problem.<br>Not another pile of content.</h3></div><div class="flow-connector reveal"><span class="flow-connector-line"></span><span class="flow-connector-arrow">↓</span><span class="flow-connector-label">The Solution</span></div>`)}
      <section class="section bg-subtle diagnostic-section">
        <div class="container">
          <div class="section-header reveal">
            <p class="eyebrow">Step 2 · The Solution</p>
            <h2 class="section-title">Know what's wrong before studying more.</h2>
            <p class="lead diagnostic-lead">The ARAM Performance Diagnostic finds where preparation is losing marks and converts it into the next academic action.</p>
          </div>
          <div class="diagnostic-full-image reveal">
            <img src="assets/media/performance-diagnostic.png" alt="ARAM Performance Diagnostic for Prelims and Mains — subject accuracy, elimination skill, revision priority and next actions">
          </div>
        </div>
      </section>
      ${section("Why ARAM", "Post-Foundation is not starting from zero.", "", cards([
        ["Answer Writing", "Existing Mains practice", "Public answer-writing practice and structured workshops already exist."],
        ["Current Affairs", "Daily content footprint", "News Navigator, PIB analysis, quizzes and AIM Civils resources support the layer."],
        ["Testing", "Prelims, CSAT and Mains", "ARAM already has test infrastructure to build on."],
        ["AI", "Achievers' Second Mind", "Technology connects preparation, practice and performance support.", "aram-ai.html"],
      ], 4), "bg-subtle")}
    `;
  }

  function resourcesPage() {
    return `
      ${hero("Resources", "Everything useful.<br>In one place.", "Curated Prelims and Mains study material, notes, current affairs and answer-writing resources.", `<a href="#prelims" class="btn btn-primary">Prelims (UPSC)</a><a href="#mains" class="btn btn-secondary">Mains (UPSC)</a>`, `<div class="hero-books">${["prelims-confluence.jpg", "mains-mainframe.jpg", "prelims-ncert.jpg", "mains-trend.jpg"].map((b) => `<img src="assets/media/${b}" alt="ARAM study material">`).join("")}</div>`)}
      <section class="section bg-subtle" id="prelims">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Prelims (UPSC)</p>
            <h2 class="section-title answer-title">Prelims study material.</h2>
          </div>
          <div class="books-grid reveal">${[
            ["prelims-confluence.jpg", "Confluence", "A bouquet of topics from seven subjects — 160 days & 700 topics"],
            ["prelims-prediction.jpg", "Prediction", "An exclusive magazine targeting UPSC Prelims"],
            ["prelims-ncert.jpg", "NCERT", "NCERT-based foundation notes for revision"],
            ["prelims-eco-trails.jpg", "Eco-Trails", "An environmental weekly compilation"],
            ["prelims-places.jpg", "Places in News", "Geography through current developments"],
            ["prelims-persons.jpg", "Persons in News", "People, offices and institutions that matter"],
            ["prelims-international.jpg", "International News", "Global developments mapped to the syllabus"],
            ["prelims-pyq-analysis.jpg", "PYQ Analysis", "UPSC Previous Year Question Paper analysis"],
            ["prelims-pyq-subject.jpg", "PYQ Subject Wise", "Previous-year questions organised by subject"],
            ["prelims-aim-civils.jpg", "AIM Civils CA", "Current Affairs Q&A for Prelims 2025"],
            ["prelims-ebook.jpg", "E-Book Series", "Detailed insights about specific topics"],
            ["prelims-mcq.jpg", "Current Affairs MCQs", "Daily news converted into practice MCQs"],
          ].map(([img, title, desc]) => `<a href="https://www.aramiasacademy.com/exclusive-materials/upsc-prelims-study-materials/" target="_blank" rel="noopener" class="book-card"><img src="assets/media/${img}" alt="${title}"><h4>${title}</h4><p>${desc}</p></a>`).join("")}</div>
        </div>
      </section>
      <section class="section" id="mains">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Mains (UPSC)</p>
            <h2 class="section-title answer-title">Mains study material.</h2>
          </div>
          <div class="books-grid reveal">${[
            ["mains-mainframe.jpg", "Mainframe", "An exclusive magazine for enhancing Mains answer writing"],
            ["mains-donotmiss.jpg", "Do Not Miss Series", "Monthly magazine covering must-know current affairs"],
            ["mains-rushthru.jpg", "Rush Through Series", "Authentic Current Affairs for UPSC Mains"],
            ["mains-trend.jpg", "Trend Analysis", "Data-driven trend analysis for Mains"],
            ["book-governance.jpg", "Governance in India", "Governance — Basics and Beyond, GS Paper II (M. Karthikeyan)"],
            ["book-ethics.jpg", "Ethics, Integrity & Aptitude", "GS Paper IV, 4th edition (M. Karthikeyan)"],
            ["book-indian-society.jpg", "Indian Society", "For UPSC and State Civil Services (M. Senthil Kumar & S. Rajesh)"],
            ["book-internal-security.jpg", "Internal Security", "GS Paper III, 3rd edition (M. Karthikeyan)"],
          ].map(([img, title, desc]) => `<a href="https://www.aramiasacademy.com/exclusive-materials/upsc-mains-study-materials/" target="_blank" rel="noopener" class="book-card"><img src="assets/media/${img}" alt="${title}"><h4>${title}</h4><p>${desc}</p></a>`).join("")}</div>
        </div>
      </section>
    `;
  }

  function aramAiPage() {
    return `
      <section class="section ai-banner-section">
        <div class="ai-banner-frame reveal">
          <img src="assets/media/ad-aram-ai-home.png" alt="ARAM AI dashboard: intelligence for your preparation, connecting diagnostics, study targets, revision and performance trends">
          <a href="#" class="btn ai-banner-cta">Experience ARAM AI →</a>
        </div>
      </section>
      <section class="section bg-subtle adaptive-section">
        <div class="container">
          <div class="adaptive-split">
            <div class="adaptive-copy reveal">
              <p class="eyebrow">Preparation Intelligence</p>
              <p class="adaptive-kicker">Adaptive Learning System</p>
              <h2 class="section-title adaptive-title">From “What should I study?” to “What should I do next?”</h2>
            </div>
            <div class="adaptive-visual reveal">
              <img src="assets/media/adaptive-learning-system.png" alt="Adaptive Learning System: diagnostic, adaptive plan, due material and test intelligence connected in one loop">
            </div>
            <div class="adaptive-chain-wrap">${adaptiveChainMarkup()}</div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="mentor-split">
            <div class="mentor-copy reveal">
              <p class="eyebrow">Preparation Intelligence</p>
              <p class="answer-kicker">Mentor Booking</p>
              <h2 class="section-title answer-title">Stuck? Talk to a mentor.</h2>
              <p class="lead ask-lead">Any ARAM student can book time with a mentor the moment they hit a difficulty, whether that's a concept gap, a Mains answer that isn't working, or a doubt about what to study next. Browse mentor availability, book a session, get feedback and track how it's improving performance over time.</p>
              <a class="btn btn-primary" href="post-foundation-mentorship.html">Book a Mentor →</a>
            </div>
            <div class="mentor-visual reveal">
              <img src="assets/media/mentor-booking.png" alt="ARAM mentor booking flow: browse mentors and availability, book a session, share feedback and view student performance">
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-subtle ask-section">
        <div class="container">
          <div class="ask-split">
            <div class="ask-copy reveal">
              <p class="eyebrow">Preparation Intelligence</p>
              <p class="answer-kicker">Ask ARAM</p>
              <h2 class="section-title answer-title">Ask the syllabus, not the internet.</h2>
              <p class="lead ask-lead">Grounded explanations linked to approved ARAM content, PYQs and relevant preparation material.</p>
            </div>
            <div class="ask-visual reveal">
              <img src="assets/media/search-mode.png" alt="ARAM AI search mode: syllabus-grounded answers linked to approved content, PYQs and preparation material">
            </div>
          </div>
        </div>
      </section>
      <section class="section answer-section">
        <div class="container">
          <div class="answer-split">
            <div class="answer-copy reveal">
              <p class="eyebrow">Preparation Intelligence</p>
              <p class="answer-kicker">Answer Intelligence</p>
              <h2 class="section-title answer-title">One answer gives feedback. Many answers reveal a pattern.</h2>
            </div>
            <div class="answer-visual reveal">
              <img src="assets/media/answer-intelligence.png" alt="Answer Intelligence: tracking answer patterns across attempts to detect recurring weaknesses">
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function resultPage() {
    return `
      ${hero("Result", "The people behind the result.", "Every rank has a preparation story. This page documents verified ARAM students and achievers, the parts of ARAM they used, and the lessons other aspirants can take from their journey.", `<a href="#toppers-board" class="btn btn-primary">Topper's Board</a><a href="#learning-series" class="btn btn-secondary">Topper Learning Series</a>`, resultRunnerMarkup())}
      <section class="section result-overview-section">
        <div class="container">
          <div class="result-overview-split reveal">
            <div class="result-overview-copy">
              <p class="answer-kicker">Result Snapshot</p>
              <h2 class="section-title answer-title">CSE results at a glance.</h2>
              <p class="lead">A year-wise view of selections, services and rank journeys.</p>
              <div class="proof-strip">${["Total Selections", "IAS", "IPS", "IFS", "IRS / Others"].map((x) => `<div class="proof-stat"><span>CSE 2025</span><strong>${x}</strong></div>`).join("")}</div>
            </div>
            <div class="result-overview-visual">
              <img src="assets/media/result-overview.png" alt="ARAM IAS CSE results overview" loading="lazy">
            </div>
          </div>
        </div>
      </section>
      <section class="section topper-stories-section">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Topper Testimonials</p>
            <h2 class="section-title answer-title">Featured ARAM Experience.</h2>
          </div>
          <div class="topper-stories-grid">
            ${topperBoardMarkup()}
          </div>
          <a class="btn btn-primary" href="#" style="margin-top:var(--space-4)">Watch Story →</a>
        </div>
      </section>
      <section class="section" id="learning-series">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Topper Learning Series</p>
            <h2 class="section-title answer-title">Learn from the achievers.</h2>
          </div>
          <div class="yt-carousel reveal" data-yt-carousel><div class="yt-carousel-track">${[
        ["xR7PJMfmKxE", "U. Harsha Veena · AIR 18", "CSE 2025 · IAS"],
        ["L7vXBnGnBnI", "M. Kiruthika · AIR 42", "CSE 2025 · IAS"],
        ["3JZ_D3ELwOQ", "C. Sathiya Priya · AIR 67", "CSE 2025 · IPS"],
        ["kJQP7kiw5Fk", "T. Chinthanai Selvan · AIR 103", "CSE 2025 · IFS"],
        ["2Vv-BfVoq4g", "Gee Gee A. S. · AIR 25", "CSE 2024 · IAS"],
        ["9bZkp7q19f0", "S. Sanjay · AIR 156", "CSE 2024 · IPS"],
        ["RgKAFK5djSk", "R. Preethi · AIR 89", "CSE 2023 · IAS"],
        ["fJ9rUzIMcZQ", "K. Aravind · AIR 214", "CSE 2023 · IRS"],
      ].map(([vid, name, exam]) => `<a href="https://www.youtube.com/watch?v=${vid}" target="_blank" rel="noopener" class="yt-card"><div class="yt-thumb"><img src="https://img.youtube.com/vi/${vid}/mqdefault.jpg" alt="${name}"><span class="yt-play">▶</span></div><div class="yt-info"><h4>${name}</h4><p>${exam}</p></div></a>`).join("")}</div><button class="yt-carousel-btn yt-carousel-prev" data-yt-prev aria-label="Previous">‹</button><button class="yt-carousel-btn yt-carousel-next" data-yt-next aria-label="Next">›</button></div>
        </div>
      </section>
      <section class="section" id="toppers-board">
        <div class="container">
          <div class="section-header reveal">
            <p class="answer-kicker">Topper's Board</p>
            <h2 class="section-title answer-title">Every rank. One verified record.</h2>
          </div>
          <div class="database-card reveal"><img src="assets/media/result-db.png" alt="ARAM IAS Student Result Database — toppers with photo, name, AIR, year, service and ARAM journey" class="result-db-img"></div>
        </div>
      </section>
    `;
  }

  function aboutPage() {
    return `
      <div class="about-page">
      ${hero("About ARAM", "Aram for Students. Students for Aram.", "ARAM IAS Academy is a Civil Services preparation institution based in Anna Nagar, Chennai, working across UPSC and TNPSC preparation through classroom learning, Current Affairs, testing, answer writing and student guidance.", `<a href="#centres" class="btn btn-primary">Where ARAM Works</a><a href="#" class="btn btn-secondary">Talk to ARAM</a>`, `<p class="hero-side-label">Get in touch</p><a href="tel:+918939696868" class="hero-side-link">+91 8939-69-6868</a><a href="mailto:info@aramiasacademy.com" class="hero-side-link">info@aramiasacademy.com</a>${socialLinksMarkup()}`)}
      ${section("Leadership & Faculty", "The people behind ARAM.", "Faculty, authorship and mentoring come together around Civil Services preparation.", teamMarkup())}
      ${section("Since 2011", "Built over more than a decade of Civil Services preparation.", "ARAM traces its institutional journey to 2011, from Times IAS Academy to ARAM IAS Academy, and now into digital, AI-supported preparation.", timelineChainMarkup(), "bg-subtle")}
      ${section("Where ARAM Works", "One academic system. Multiple ways to learn.", "", `<div class="grid-3" id="centres"><div class="stage-panel reveal"><h3>Head Office</h3><p>C-40, 1st & 2nd Floor, 2nd Avenue<br>Anna Nagar West<br>Chennai - 600040</p></div><div class="stage-panel reveal"><h3>Academic Office</h3><p>23/1665, 15th Main Road<br>H Block, Temple View Colony<br>Anna Nagar West, Chennai - 600040</p></div><div class="stage-panel reveal"><h3>Post-Foundation, Delhi</h3><p>4/28, Ground Floor, Pusa Road<br>Karol Bagh<br>New Delhi - 110005</p></div></div><div class="trust-band blueprint-note reveal"><strong>Official verification</strong><p>Official ARAM IAS centres, programmes and payment channels are listed only on this website. Please verify before making payment.</p><p>info@aramiasacademy.com · 8939-69-6868 / 69</p></div>${socialLinksMarkup()}`)}
      </div>
    `;
  }

  function adaptiveChainMarkup() {
    const items = [
      ["Learner Diagnostic", "Identify concept and performance gaps.", "The Adaptive Learning System starts by mapping what a student actually knows versus what the syllabus demands, surfacing concept gaps and recurring answer weaknesses before more content is added."],
      ["Adaptive Plan", "Prioritise learning, revision and testing by available time.", "Based on the diagnostic, the system builds a plan that sequences learning, revision and testing around the time a student actually has, instead of a generic one-size-fits-all schedule."],
      ["Due Material", "Bring weak or due material back when it matters.", "Weak topics and overdue revision are resurfaced automatically at the right interval, so declining recall gets caught and corrected before it shows up as lost marks in a test."],
      ["Test Intelligence", "Connect mistakes back to the concepts they test.", "Every test attempt is linked back to the underlying concept it was testing, so a wrong answer becomes a diagnostic signal for the next study or revision action, not just a score."],
    ];
    return `<div class="timeline-chain reveal">${items.map(([label, , story], i) => `${i > 0 ? "<i>→</i>" : ""}<span class="timeline-item" tabindex="0"><span class="timeline-label">${label}</span><span class="timeline-story" role="tooltip">${story}</span></span>`).join("")}</div>`;
  }

  function timelineChainMarkup() {
    const items = [
      ["Formerly Times IAS Academy", "Before the ARAM name existed, this institution ran as Times IAS Academy, teaching the same Anna Nagar batches General Studies and Current Affairs for UPSC and TNPSC. Many of today's senior faculty trace their teaching roots back to this phase."],
      ["ARAM IAS Academy", "The rebrand to ARAM IAS Academy marked a shift toward a more structured, feedback-driven preparation system, with dedicated Current Affairs, testing and answer-writing tracks built around Civil Services demand."],
      ["2011 Civil Services preparation begins", "ARAM's Civil Services journey started in 2011 in Anna Nagar, Chennai, with classroom batches for UPSC and TNPSC aspirants. Over a decade later, that same Anna Nagar base still anchors the academy's classroom teaching."],
      ["Current Affairs + Testing", "As competition sharpened, ARAM built dedicated Current Affairs products and structured testing, so aspirants weren't just reading the news, but converting it into PYQ links, issue chains and evaluated Mains practice."],
      ["Digital Learning", "ARAM extended classroom teaching into digital delivery, so aspirants outside Chennai could access the same Current Affairs, test series and answer-writing feedback without relocating for coaching."],
      ["ARAM AI", "ARAM AI connects syllabus content, PYQs, Current Affairs and answer feedback into one system, helping a student move from “what should I study” to “what should I do next” with a clear next action."],
      ["Post-Foundation", "For aspirants who already know the syllabus, ARAM's Post-Foundation system focuses on what Foundation alone can't fix: answer quality, Current Affairs application, and individual diagnostic-led intervention."],
    ];
    return `<div class="timeline-chain reveal">${items.map(([label, story], i) => `${i > 0 ? "<i>→</i>" : ""}<span class="timeline-item" tabindex="0"><span class="timeline-label">${label}</span><span class="timeline-story" role="tooltip">${story}</span></span>`).join("")}</div>`;
  }

  function topperBoardMarkup() {
    const images = [
      "assets/media/result-story-1.png",
      "assets/media/result-story-2.png",
      "assets/media/result-story-3.png",
      "assets/media/result-story-4.png",
    ];
    return `
      <div class="topper-board reveal" data-topper-board>
        <div class="topper-board-frame">
          <div class="topper-board-track" data-topper-track>
            ${images.map(() => `<span class="topper-board-bar" data-topper-bar><i></i></span>`).join("")}
          </div>
          ${images.map((src, i) => `<img src="${src}" alt="ARAM verified topper story ${i + 1}" class="topper-board-slide" data-topper-slide loading="lazy">`).join("")}
          <button class="topper-board-nav topper-board-prev" data-topper-prev aria-label="Previous story">‹</button>
          <button class="topper-board-nav topper-board-next" data-topper-next aria-label="Next story">›</button>
          <small class="topper-board-count" data-topper-count>1 / ${images.length}</small>
        </div>
      </div>
    `;
  }

  function resultRunnerMarkup() {
    const images = [
      "assets/media/result-story-1.png",
      "assets/media/result-story-2.png",
      "assets/media/result-story-3.png",
      "assets/media/result-story-4.png",
    ];
    return `<div class="result-runner reveal" aria-label="ARAM student result stories">${images.map((src, i) => `<img src="${src}" alt="ARAM verified result story ${i + 1}" class="result-runner-slide" loading="lazy">`).join("")}</div>`;
  }

  function socialLinksMarkup() {
    const links = [
      ["Telegram", "https://t.me/aramiasacademy", `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.05 3.76 2.98 10.86c-1.23.5-1.22 1.19-.22 1.5l4.63 1.44 1.79 5.5c.22.56.37.78.75.78.31 0 .46-.14.65-.32l1.85-1.8 4.5 3.32c.83.46 1.42.22 1.63-.77l2.94-13.87c.3-1.21-.46-1.75-1.45-1.38Zm-11.4 9.86-1.13-3.68 8.2-5.16c.38-.24.73-.11.44.15l-7.51 8.69Z"/></svg>`],
      ["Instagram", "https://instagram.com/aramiasacademy", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`],
      ["YouTube", "https://youtube.com/@aramiasacademy", `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.2-.4-4.7c-.24-.87-.93-1.55-1.8-1.79C19.3 5 12 5 12 5s-7.3 0-8.8.51c-.87.24-1.56.92-1.8 1.79C1 8.8 1 12 1 12s0 3.2.4 4.7c.24.87.93 1.53 1.8 1.79C4.7 19 12 19 12 19s7.3 0 8.8-.51c.87-.26 1.56-.92 1.8-1.79.4-1.5.4-4.7.4-4.7ZM9.8 15.5v-7l6 3.5-6 3.5Z"/></svg>`],
    ];
    return `<div class="social-links reveal">${links.map(([label, href, icon]) => `<a href="${href}" target="_blank" rel="noopener">${icon}${label}</a>`).join("")}</div>`;
  }

  function teamMarkup() {
    const team = [
      ["assets/media/team-senthilkumar.jpg", "Mr. M. Senthil Kumar", "Director, ARAM IAS Academy", "20+ years in administration and mentoring. Author of \u201cIndian Society for Civil Services Main Examination\u201d (Pearson)."],
      ["assets/media/team-devanand.jpg", "Dev Anand Venkateswaran", "Director (Operations)", "Leads AIM CIVILS current affairs preparation and day-to-day academic operations."],
      ["assets/media/team-balasubramani.jpg", "R. Balasubramani", "Director & Creative Head", "History faculty known for precise annual UPSC question predictions. The face of ARAM."],
      ["assets/media/team-vincyjohn.jpg", "Vincy John", "Programme & Administrative Lead", "Builds administrative traits in students with deep knowledge of national and state-level exams."],
    ];
    return `<div class="grid-4 team-grid">${team.map(([img, name, role, bio]) => {
      const initials = name.replace(/^Mr\.|^Ms\.|^Mrs\./, "").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
      const photo = img ? `<img src="${img}" alt="${name}, ${role} at ARAM IAS Academy" class="team-photo">` : `<span class="team-photo team-photo-initials" aria-hidden="true">${initials}</span>`;
      return `
      <div class="card team-card reveal">
        ${photo}
        <h4>${name}</h4>
        <p class="team-role">${role}</p>
        <p class="team-bio">${bio}</p>
      </div>
    `;
    }).join("")}</div>`;
  }

  function diagnosticMarkup() {
    const rows = [
      ["Content Knowledge", "STRONG"],
      ["Question Demand", "NEEDS WORK"],
      ["Answer Structure", "MODERATE"],
      ["Analysis", "MODERATE"],
      ["Examples / Value Addition", "WEAK"],
      ["Current Affairs Use", "WEAK"],
      ["Time Execution", "STRONG"],
    ];
    return `
      <div class="diagnostic-panel report-panel reveal">
        <h3>Performance Snapshot</h3>
        ${rows.map(([label, value]) => `<div class="report-row"><span>${label}</span><strong>${value}</strong></div>`).join("")}
        <div class="notice"><strong>Priority intervention:</strong> Question-demand recognition · Current Affairs application · Example enrichment</div>
        <p><strong>Next action:</strong> Complete 3 directive exercises + write 2 GS-II answers + mentor review.</p>
        <a class="btn btn-primary" href="post-foundation-performance-diagnostic.html">Start Diagnostic →</a>
      </div>
    `;
  }

  function footerMarkup() {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="brand-logo brand-logo-image"><img src="assets/aram-logo.svg" alt="ARAM IAS Academy logo"></div>
              <p>From Preparation to Performance. Civil Services preparation across academics, Current Affairs, testing, writing, mentorship and technology.</p>
            </div>
            <div class="footer-column"><h4>Prepare</h4><ul><li><a href="programmes-upsc-foundation.html">Foundation</a></li><li><a href="post-foundation.html">Post-Foundation</a></li><li><a href="programmes.html">Current Programmes</a></li></ul></div>
            <div class="footer-column"><h4>Use</h4><ul><li><a href="resources.html">Current Affairs</a></li><li><a href="resources.html">Mains Answer Writing</a></li><li><a href="resources.html">PYQs</a></li><li><a href="resources.html">Study Materials</a></li></ul></div>
            <div class="footer-column"><h4>ARAM</h4><ul><li><a href="results.html">Result</a></li><li><a href="about.html">About</a></li><li><a href="about.html">Faculty</a></li><li><a href="centres.html">Centres</a></li><li><a href="contact.html">Contact</a></li></ul></div>
            <div class="footer-column"><h4>Access</h4><ul><li><a href="#">Student Login</a></li><li><a href="#">Ongoing Admissions</a></li><li><a href="#">Privacy Policy</a></li><li><a href="about.html">Official Verification</a></li></ul></div>
          </div>
          <div class="footer-bottom">
            <p>Head Office · Anna Nagar West, Chennai</p>
            <p>Academic Office · Temple View Colony, Anna Nagar West, Chennai</p>
          </div>
        </div>
      </footer>
    `;
  }
})();
