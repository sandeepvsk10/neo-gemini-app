// ==UserScript==
// @name         Gemini composer sizing
// @namespace    local.gemini.theme
// @version      0.2.0
// @description  Expand only when input wraps; no network requests or storage.
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(() => {
  'use strict';
  // Avoid duplicate observers if the userscript is executed twice.
  if (document.getElementById('local-gemini-sizing-probe')) return;
  // Measure wrapped text in an invisible local element; no requests, storage, or message submission.
  const probe = document.createElement('div');
  probe.id = 'local-gemini-sizing-probe';
  probe.setAttribute('aria-hidden', 'true');
  Object.assign(probe.style, {
    position: 'fixed', left: '-10000px', top: '0', visibility: 'hidden',
    pointerEvents: 'none', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
    padding: '0', margin: '0', border: '0', height: 'auto', boxSizing: 'border-box'
  });
  document.body.append(probe);
  let field, editor, textObserver, resizeObserver, pending = false;
  const pixels = (style, property, fallback) => {
    const value = parseFloat(style.getPropertyValue(property));
    return Number.isFinite(value) ? value : fallback;
  };
  // Coalesce typing and resize events into one update per animation frame.
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }
  function update() {
    // Submitted prompts: show the fade and Show more control only when content exceeds the CSS preview height.
    document.querySelectorAll('user-query .user-query-bubble-with-background').forEach(bubble => {
      const text = bubble.querySelector('.query-text');
      if (!text) return;
      const preview = pixels(getComputedStyle(bubble), '--local-gemini-prompt-preview', 264);
      bubble.classList.add('local-prompt-sizing-ready');
      bubble.classList.toggle('local-prompt-overflow', text.scrollHeight > preview + 2);
    });
    if (!field?.isConnected || !editor?.isConnected) return;
    // Keep the floating composer’s bottom scroll clearance in sync with its current height.
    const inputContainer = field.closest('input-container');
    const chatContainer = inputContainer?.parentElement;
    if (chatContainer) {
      chatContainer.style.setProperty('--local-gemini-composer-offset',
        `${Math.ceil(inputContainer.getBoundingClientRect().height + 16)}px`);
    }
    const style = getComputedStyle(editor);
    const outer = getComputedStyle(field);
    const controls = field.querySelector('.trailing-actions-wrapper');
    // These are the compact dimensions even when the editor is already expanded.
    const width = field.clientWidth
      - 2 * pixels(outer, '--local-gemini-compact-padding', 12)
      - pixels(outer, '--local-gemini-leading-width', 40)
      - (controls?.getBoundingClientRect().width || 0)
      - 2 * pixels(outer, '--local-gemini-control-gap', 8);
    // Skip hidden or very narrow layouts until a useful width is available.
    if (width < 40) return;
    if (!probe.isConnected) document.body.append(probe);
    // Match the editor typography so natural wrapping, long unbroken text, and explicit newlines are measured consistently.
    Object.assign(probe.style, {
      width: `${width}px`, fontFamily: style.fontFamily, fontSize: style.fontSize,
      fontWeight: style.fontWeight, fontStyle: style.fontStyle,
      fontVariationSettings: 'normal', letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight, fontStretch: 'normal',
      tabSize: style.tabSize, textIndent: style.textIndent
    });
    // Measure at the compact width even while expanded, preventing layout oscillation.
    // The zero-width character preserves trailing line breaks when measuring; it never changes the actual input.
    probe.textContent = editor.classList.contains('ql-blank') ? '' : editor.innerText + '\u200b';
    const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
    // Small hysteresis avoids flickering at fractional pixel boundaries; short or cleared inputs collapse again.
    const threshold = field.classList.contains('local-gemini-expanded') ? line + 1 : line + 3;
    const expanded = probe.textContent !== '' && probe.scrollHeight > threshold;
    field.classList.add('local-gemini-sizing-ready');
    field.classList.toggle('local-gemini-expanded', expanded);
    probe.textContent = '';
    // Read the final height after changing layout so the floating bar cannot hide final messages.
    if (chatContainer) {
      chatContainer.style.setProperty('--local-gemini-composer-offset',
        `${Math.ceil(inputContainer.getBoundingClientRect().height + 16)}px`);
    }
  }
  // Gemini replaces its editor during navigation: disconnect old observers and bind the current field.
  function bind() {
    const next = document.querySelector('input-container .text-input-field .ql-editor');
    if (next === editor && next?.closest('.text-input-field') === field) return;
    textObserver?.disconnect();
    resizeObserver?.disconnect();
    field?.classList.remove('local-gemini-expanded');
    field?.classList.remove('local-gemini-sizing-ready');
    field?.closest('input-container')?.parentElement?.style.removeProperty('--local-gemini-composer-offset');
    editor = next;
    field = next?.closest('.text-input-field');
    if (!editor) return;
    textObserver = new MutationObserver(schedule);
    textObserver.observe(editor, { childList: true, characterData: true, subtree: true });
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(field);
    const controls = field.querySelector('.trailing-actions-wrapper');
    if (controls) resizeObserver.observe(controls);
    schedule();
  }
  // Observe new messages and replaced editors; ignore our own probe mutations to prevent a self-triggering loop.
  new MutationObserver(records => {
    if (records.every(record => probe.contains(record.target))) return;
    bind();
    schedule();
  }).observe(document.body, {
    childList: true, characterData: true, subtree: true
  });
  document.addEventListener('input', event => {
    if (editor?.contains(event.target)) schedule();
  }, true);
  // Recheck wrapping after window resizing and font loading, as well as typing and control-size changes.
  window.addEventListener('resize', schedule);
  document.fonts?.ready.then(schedule);
  bind();
})();
