/* ============================================================
   DecodeLabs — main.js  |  Project 3: Interactive Web Elements
   Engineering the Client-Side Nervous System

   PDF 3 Requirements Implemented:
   ✅ IPO Loop (Input → Process → Output) on every feature
   ✅ DOM manipulation via querySelector / querySelectorAll
   ✅ addEventListener for clicks, keyboard, scroll, system
   ✅ State management via const / let (no var)
   ✅ classList.toggle() — Dynamic Classes
   ✅ textContent (safe) — never innerHTML
   ✅ document.createElement() + appendChild()
   ✅ js- prefix hooks, is- prefix state classes
   ✅ Dark Mode Toggle with localStorage persistence
   ✅ Buttons / Toggles / Dynamic content update
   ✅ Single-purpose functions (Decoupling principle)
   ============================================================ */

'use strict';

/* ── WAIT FOR DOM ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

  /* ===========================================================
     1. DARK MODE TOGGLE
     IPO: Input=click toggle btn → Process=check state, save
          to localStorage → Output=toggle .is-dark-mode on body
     PDF Ref: Case Study — The Dark Mode Toggle (page 16)
     =========================================================== */

  /* const for DOM references — immutable binding (PDF page 12) */
  const jsThemeToggle = document.querySelector('.js-theme-toggle');

  /* let for mutable state (PDF page 12) */
  let isDarkMode = localStorage.getItem('theme') === 'dark';

  /* Single-purpose function — applies state to DOM (PDF page 13) */
  function applyTheme () {
    /* classList.toggle approach — PDF page 15 */
    document.body.classList.toggle('is-dark-mode', isDarkMode);

    if (jsThemeToggle) {
      /* textContent — safe data injection, never innerHTML (PDF page 14) */
      jsThemeToggle.textContent = isDarkMode ? '☀ Light Mode' : '☾ Dark Mode';
      jsThemeToggle.setAttribute('aria-label',
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* Apply saved theme on page load (System Trigger — PDF page 9) */
  applyTheme();

  if (jsThemeToggle) {
    /* addEventListener — Wiring the Nerves (PDF page 10) */
    jsThemeToggle.addEventListener('click', function () {
      /* Process: flip state, persist to localStorage */
      isDarkMode = !isDarkMode;
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      /* Output: mutate the DOM */
      applyTheme();
    });
  }


  /* ===========================================================
     2. INTERACTIVE COUNTER
     IPO: Input=button click → Process=increment/decrement/reset
          state → Output=update textContent display
     PDF Ref: Dynamic content update, textContent (page 14)
     =========================================================== */

  const jsIncrement = document.querySelector('.js-counter-increment');
  const jsDecrement = document.querySelector('.js-counter-decrement');
  const jsReset     = document.querySelector('.js-counter-reset');
  const jsCountDisplay = document.querySelector('.js-counter-display');

  let count = 0;  /* let — mutable state (PDF page 12) */

  function updateCounter () {
    if (!jsCountDisplay) return;
    /* textContent — safe DOM mutation (PDF page 14) */
    jsCountDisplay.textContent = count;
    /* is- prefix for visual state (PDF page 17) */
    jsCountDisplay.classList.toggle('is-positive', count > 0);
    jsCountDisplay.classList.toggle('is-negative', count < 0);
    jsCountDisplay.classList.toggle('is-zero',     count === 0);
  }

  if (jsIncrement) {
    jsIncrement.addEventListener('click', function () {
      count += 1;
      updateCounter();
    });
  }

  if (jsDecrement) {
    jsDecrement.addEventListener('click', function () {
      count -= 1;
      updateCounter();
    });
  }

  if (jsReset) {
    jsReset.addEventListener('click', function () {
      count = 0;
      updateCounter();
    });
  }


  /* ===========================================================
     3. LIVE CHARACTER COUNTER (Keyboard Input)
     IPO: Input=keypress in textarea → Process=count chars
          → Output=update counter + is-warning state
     PDF Ref: Keyboard Inputs — keypresses (page 9)
     =========================================================== */

  const jsTextInput  = document.querySelector('.js-text-input');
  const jsCharCount  = document.querySelector('.js-char-count');
  const MAX_CHARS    = 150;

  if (jsTextInput && jsCharCount) {
    jsTextInput.addEventListener('input', function () {
      /* Process: calculate remaining */
      const remaining = MAX_CHARS - jsTextInput.value.length;
      /* Output: update display safely */
      jsCharCount.textContent = remaining + ' characters remaining';
      /* is- prefix state class */
      jsCharCount.classList.toggle('is-warning', remaining < 20);
      jsCharCount.classList.toggle('is-danger',  remaining < 0);
    });
  }


  /* ===========================================================
     4. DYNAMIC TASK LIST (createElement + appendChild)
     IPO: Input=button click → Process=create DOM node
          → Output=appendChild to list
     PDF Ref: Node Creation — createElement, appendChild (page 14)
     =========================================================== */

  const jsAddTask    = document.querySelector('.js-add-task');
  const jsTaskInput  = document.querySelector('.js-task-input');
  const jsTaskList   = document.querySelector('.js-task-list');
  const jsTaskCount  = document.querySelector('.js-task-count');

  let taskCount = 0;

  function updateTaskCount () {
    if (!jsTaskCount) return;
    const total = jsTaskList ? jsTaskList.querySelectorAll('.task-item:not(.is-done)').length : 0;
    jsTaskCount.textContent = total + ' task' + (total !== 1 ? 's' : '') + ' remaining';
  }

  function createTaskItem (text) {
    /* document.createElement() — PDF page 14 */
    const li = document.createElement('li');
    li.className = 'task-item js-task-item';
    li.setAttribute('role', 'listitem');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-item__checkbox js-task-checkbox';
    checkbox.setAttribute('aria-label', 'Mark "' + text + '" as done');

    const label = document.createElement('span');
    label.className = 'task-item__label';
    /* textContent — safe injection (PDF page 14) */
    label.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-item__delete js-task-delete';
    deleteBtn.textContent = '✕';
    deleteBtn.setAttribute('aria-label', 'Delete task: ' + text);
    deleteBtn.setAttribute('type', 'button');

    /* addEventListener on dynamically created element */
    checkbox.addEventListener('change', function () {
      li.classList.toggle('is-done', checkbox.checked);
      updateTaskCount();
    });

    deleteBtn.addEventListener('click', function () {
      li.remove();
      updateTaskCount();
    });

    /* appendChild — PDF page 14 */
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);

    return li;
  }

  function addTask () {
    if (!jsTaskInput || !jsTaskList) return;
    const text = jsTaskInput.value.trim();
    if (!text) {
      /* is- state class for empty input */
      jsTaskInput.classList.add('is-error');
      setTimeout(function () {
        jsTaskInput.classList.remove('is-error');
      }, 600);
      return;
    }
    const item = createTaskItem(text);
    jsTaskList.appendChild(item);
    jsTaskInput.value = '';
    jsTaskInput.focus();
    updateTaskCount();
  }

  if (jsAddTask) {
    jsAddTask.addEventListener('click', addTask);
  }

  /* Keyboard Input — Enter key triggers add (PDF page 9) */
  if (jsTaskInput) {
    jsTaskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') addTask();
    });
  }


  /* ===========================================================
     5. ACCORDION / FAQ TOGGLE
     IPO: Input=click on question → Process=toggle is-open
          → Output=answer expands/collapses via CSS transition
     PDF Ref: classList.toggle, CSS handles visuals (page 15)
     =========================================================== */

  const jsAccordionBtns = document.querySelectorAll('.js-accordion-btn');

  jsAccordionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.js-accordion-item');
      if (!item) return;
      /* Close all others first */
      jsAccordionBtns.forEach(function (otherBtn) {
        const otherItem = otherBtn.closest('.js-accordion-item');
        if (otherItem && otherItem !== item) {
          otherItem.classList.remove('is-open');
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      });
      /* Toggle current — classList.toggle (PDF page 15) */
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });


  /* ===========================================================
     6. MOBILE NAV TOGGLE
     IPO: Input=hamburger click → Process=toggle is-open
          → Output=mobile menu shows/hides
     PDF Ref: classList.toggle, Event Listeners (pages 10,15)
     =========================================================== */

  const jsNavToggle  = document.querySelector('.js-nav-toggle');
  const jsNavMobile  = document.querySelector('.js-nav-mobile');

  if (jsNavToggle && jsNavMobile) {
    jsNavToggle.addEventListener('click', function () {
      const isOpen = jsNavMobile.classList.toggle('is-open');
      jsNavToggle.classList.toggle('is-open', isOpen);
      jsNavToggle.setAttribute('aria-expanded', String(isOpen));
    });

    jsNavMobile.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        jsNavMobile.classList.remove('is-open');
        jsNavToggle.classList.remove('is-open');
        jsNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ===========================================================
     7. SCROLL → HEADER SHADOW (System Trigger)
     IPO: Input=page scroll → Process=check scrollY
          → Output=add/remove is-scrolled class on header
     PDF Ref: System Triggers — page resizing (page 9)
     =========================================================== */

  const jsHeader = document.querySelector('.js-header');

  if (jsHeader) {
    window.addEventListener('scroll', function () {
      jsHeader.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }


  /* ===========================================================
     8. ACTIVE NAV ON SCROLL (IntersectionObserver)
     IPO: Input=section enters viewport → Process=find matching
          nav link → Output=add is-active class
     PDF Ref: System Triggers, DOM manipulation (pages 9,8)
     =========================================================== */

  const jsSections   = document.querySelectorAll('section[id]');
  const jsNavLinks   = document.querySelectorAll('.js-nav-link');

  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        jsNavLinks.forEach(function (link) {
          /* is- prefix for active state */
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  jsSections.forEach(function (sec) { navObserver.observe(sec); });


  /* ===========================================================
     9. SCROLL REVEAL (Fade-in on scroll)
     IPO: Input=element enters viewport → Process=IntersectionObserver
          → Output=add is-visible class (CSS handles transition)
     PDF Ref: CSS handles the visuals (page 15)
     =========================================================== */

  const jsRevealEls = document.querySelectorAll('.js-reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('is-visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  jsRevealEls.forEach(function (el) { revealObserver.observe(el); });


  /* ===========================================================
     10. BACK TO TOP BUTTON
     IPO: Input=scroll past 300px → Process=show btn
          → Output=is-visible class, click scrolls to top
     PDF Ref: System Triggers, addEventListener (pages 9,10)
     =========================================================== */

  const jsBackToTop = document.querySelector('.js-back-to-top');

  if (jsBackToTop) {
    window.addEventListener('scroll', function () {
      jsBackToTop.classList.toggle('is-visible', window.scrollY > 300);
    }, { passive: true });

    jsBackToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}); /* end DOMContentLoaded */