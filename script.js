(function(){
  'use strict';

  // Helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', ()=>{

    // Mobile nav toggle with ARIA
    const navToggle = $('#nav-toggle');
    const nav = $('#primary-nav');
    if(navToggle && nav){
      navToggle.addEventListener('click', ()=>{
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('open');
      });
    }

    // Theme toggle with persistence
    const themeToggle = $('#theme-toggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if(saved === 'light') root.setAttribute('data-theme','light');
    if(themeToggle){
      themeToggle.addEventListener('click', ()=>{
        const isLight = root.getAttribute('data-theme') === 'light';
        root.setAttribute('data-theme', isLight ? '': 'light');
        localStorage.setItem('theme', isLight ? '': 'light');
        themeToggle.setAttribute('aria-pressed', String(!isLight));
      });
    }

    // IntersectionObserver for reveal animations
    const reveals = $$('.reveal');
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('show');
            obs.unobserve(entry.target);
          }
        });
      }, {threshold: 0.12});
      reveals.forEach(r => io.observe(r));
    } else {
      // fallback: show all
      reveals.forEach(r => r.classList.add('show'));
    }

    // Modal preview (accessible)
    const modal = $('#preview-modal');
    const modalClose = $('#modal-close');
    const previewContent = $('#preview-content');
    let lastFocused = null;

    function openModal(html){
      if(!modal) return;
      lastFocused = document.activeElement;
      previewContent.innerHTML = html;
      modal.setAttribute('aria-hidden','false');
      // trap focus simply by focusing the content
      previewContent.focus();
    }
    function closeModal(){
      if(!modal) return;
      modal.setAttribute('aria-hidden','true');
      previewContent.innerHTML = '';
      if(lastFocused) lastFocused.focus();
    }

    // Attach preview buttons
    $$('.project-item button[data-preview]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-preview');
        // Lightweight placeholder preview. Replace with an iframe for real demos.
        openModal(`<h3 id="preview-title">Preview — ${id}</h3><p>This is a lightweight preview. Swap this with an iframe or screenshot for real demos.</p>`);
      });
    });
    if(modalClose) modalClose.addEventListener('click', closeModal);
    if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });

    // Smooth scrolling for same-page anchors (enhancement)
    $$('.nav-list a, .link[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(href && href.startsWith('#')){
          const target = document.querySelector(href);
          if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
          // close mobile nav if open
          if(nav && nav.classList.contains('open')){ nav.classList.remove('open'); navToggle && navToggle.setAttribute('aria-expanded','false'); }
        }
      });
    });

    // Simple progressive image enhancement: replace placeholders with hi-res images when network allows
    // (left as a comment for developer — implement if you have LQIP or srcset images)

  }); // DOMContentLoaded end
})();
