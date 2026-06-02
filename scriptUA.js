'use strict';
var __portfolio_external_script_part__ = document.currentScript && document.currentScript.getAttribute('data-portfolio-part');

if (__portfolio_external_script_part__ === 'carousel') {

          (function(){
            const carousel = document.getElementById('instaCarousel');
            if (!carousel) return;
            const track = carousel.querySelector('.carousel-track');
            const slides = Array.from(track.querySelectorAll('.carousel-slide'));
            const countEl = carousel.querySelector('.carousel-count');
            const prevBtn = carousel.querySelector('.carousel-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-btn.next');
            let idx = 0;
            let autoTimer = null;
            let isPaused = false;
            const AUTO_DELAY = 3200;
            const formatCount = value => String(value).padStart(2, '0');
            track.querySelectorAll('img').forEach(img => {
              img.addEventListener('error', () => {
                img.removeAttribute('src');
                img.removeAttribute('alt');
                img.hidden = true;
              }, { once: true });
            });
            function updateCarousel() {
              if (!slides.length) return;
              const style = window.getComputedStyle(track);
              const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
              track.style.transform = `translateX(${-idx * (slides[0].offsetWidth + gap)}px)`;
              if (countEl) countEl.textContent = `${formatCount(idx + 1)} / ${formatCount(slides.length)}`;
            }
            function stopAuto() {
              clearTimeout(autoTimer);
              autoTimer = null;
            }
            function scheduleAuto() {
              stopAuto();
              if (isPaused || slides.length < 2) return;
              autoTimer = setTimeout(() => {
                goTo(idx + 1, { manual: false });
              }, AUTO_DELAY);
            }
            function goTo(nextIndex, { manual = false } = {}) {
              if (!slides.length) return;
              idx = (nextIndex + slides.length) % slides.length;
              updateCarousel();
              if (manual) {
                isPaused = false;
              }
              scheduleAuto();
            }
            nextBtn.addEventListener('click',()=> goTo(idx + 1, { manual: true }));
            prevBtn.addEventListener('click',()=> goTo(idx - 1, { manual: true }));
            let startX = null;
            track.addEventListener('touchstart',e=>{ startX = e.touches[0].clientX; });
            track.addEventListener('touchend',e=>{
              if(startX===null) return;
              const dx = e.changedTouches[0].clientX - startX;
              if(Math.abs(dx)>40){
                goTo(idx + (dx < 0 ? 1 : -1), { manual: true });
              }
              startX = null;
            });
            carousel.addEventListener('keydown',e=>{
              if(e.key==='ArrowRight') goTo(idx + 1, { manual: true });
              if(e.key==='ArrowLeft') goTo(idx - 1, { manual: true });
            });
            carousel.addEventListener('mouseenter', ()=> { isPaused = true; stopAuto(); });
            carousel.addEventListener('mouseleave', ()=> { isPaused = false; scheduleAuto(); });
            carousel.addEventListener('focusin', ()=> { isPaused = true; stopAuto(); });
            carousel.addEventListener('focusout', ()=> { isPaused = false; scheduleAuto(); });
            const productCTA = document.querySelector('.product-case-cta');
            const productCaseLeft = document.querySelector('.product-case-left');
            const productCaseRight = document.querySelector('.product-case-right');
            const carouselTitle = document.querySelector('.carousel-title');
            const productMobileLayout = window.matchMedia('(max-width: 950px)');
            const syncProductCarouselPlacement = () => {
              if (!productCTA || !productCaseLeft || !productCaseRight || !carouselTitle || !carousel) return;
              if (productMobileLayout.matches) {
                productCTA.after(carousel, carouselTitle);
              } else {
                productCaseRight.append(carouselTitle, carousel);
              }
              updateCarousel();
            };
            if (productCTA) {
              productCTA.addEventListener('click', (event)=> {
                if (document.getElementById('obOverlay')?.classList.contains('on')) return;
                productCTA.classList.add('clicked');
                setTimeout(()=> productCTA.classList.remove('clicked'), 430);
                if (event.detail > 0 && document.activeElement === productCTA) productCTA.blur();
                if (typeof trackEvent === 'function') trackEvent('product case cosmos story clicked');
                if (typeof showProductCaseNarrator === 'function') showProductCaseNarrator();
              });
            }
            const planetScene = document.getElementById('planetScene');
            const planetFallback = document.getElementById('planetFallback');
            const neptuneModel = document.getElementById('neptuneModel');
            const productSection = document.querySelector('.product-case-section');
            const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
            let productSectionVisible = false;
            let planetModelNearViewport = false;
            let neptuneModelMounted = Boolean(neptuneModel?.parentElement);
            let neptuneModelLoaded = false;
            let neptuneModelError = false;
            const neptuneModelParent = neptuneModel?.parentElement || null;
            const neptuneModelSlot = document.createComment('neptune model slot');
            const neptuneModelSrc = neptuneModel?.dataset.modelSrc || '';
            const isPlanetMotionLite = () => document.body.classList.contains('motion-lite');
            if (neptuneModelParent && neptuneModel) {
              neptuneModelParent.insertBefore(neptuneModelSlot, neptuneModel);
            }
            const setNeptuneModelVisible = visible => {
              if (!neptuneModel) return;
              neptuneModel.style.opacity = visible ? '1' : '0';
              neptuneModel.style.pointerEvents = visible ? '' : 'none';
            };
            const setPlanetFallbackVisible = visible => {
              if (!planetFallback) return;
              planetFallback.style.display = visible ? 'block' : 'none';
            };
            const syncPlanetFallback = () => {
              const showFallback = isPlanetMotionLite() || !neptuneModelLoaded || neptuneModelError;
              setPlanetFallbackVisible(showFallback);
              setNeptuneModelVisible(!showFallback);
            };
            const unmountNeptuneModel = () => {
              if (!neptuneModel) return;
              neptuneModel.removeAttribute('auto-rotate');
              neptuneModel.removeAttribute('src');
              neptuneModelLoaded = false;
              neptuneModelError = false;
              setNeptuneModelVisible(false);
              if (neptuneModel.parentElement) neptuneModel.remove();
              neptuneModelMounted = false;
              syncPlanetFallback();
            };
            const mountNeptuneModel = () => {
              if (!neptuneModelParent || !neptuneModel || neptuneModelMounted) return;
              neptuneModelParent.insertBefore(neptuneModel, neptuneModelSlot.nextSibling);
              neptuneModelMounted = true;
            };
            const hydrateNeptuneModel = () => {
              if (!neptuneModel || isPlanetMotionLite() || !planetModelNearViewport) return;
              mountNeptuneModel();
              if (!neptuneModel.getAttribute('src') && neptuneModelSrc) {
                neptuneModel.setAttribute('src', neptuneModelSrc);
              }
              syncPlanetFallback();
            };
            if (isPlanetMotionLite()) {
              unmountNeptuneModel();
            } else {
              syncPlanetFallback();
            }
            const setPlanetAutoRotate = enabled => {
              if (!neptuneModel) return;
              if (enabled && productSectionVisible && !isPlanetMotionLite()) {
                neptuneModel.setAttribute('auto-rotate', '');
              } else {
                neptuneModel.removeAttribute('auto-rotate');
              }
            };
            const updatePlanet = () => {
              if (!planetScene || !productSection) return;
              const narrow = window.matchMedia('(max-width: 950px)').matches;
              if (isPlanetMotionLite()) {
                setPlanetAutoRotate(false);
                if (!narrow) {
                  planetScene.style.setProperty('--planet-translate-x', '8%');
                  planetScene.style.setProperty('--planet-translate-y', '0px');
                  planetScene.style.setProperty('--planet-tilt', '-4deg');
                  if (neptuneModel) neptuneModel.setAttribute('camera-orbit', '-36deg 72deg 190%');
                }
                return;
              }
              setPlanetAutoRotate(true);
              const rect = productSection.getBoundingClientRect();
              const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
              const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
              const startX = narrow ? 8 : 32;
              const endX = narrow ? -4 : -22;
              const offset = startX + (endX - startX) * progress;
              const lift = (0.5 - progress) * (narrow ? 14 : 32);
              const tilt = -5 + progress * (narrow ? 11 : 13);
              planetScene.style.setProperty('--planet-translate-x', `${offset.toFixed(2)}%`);
              planetScene.style.setProperty('--planet-translate-y', `${lift.toFixed(2)}px`);
              planetScene.style.setProperty('--planet-tilt', `${tilt.toFixed(2)}deg`);
              if (neptuneModel) {
                const orbit = -36 + progress * (narrow ? 132 : 148);
                const phi = 72 - progress * (narrow ? 9 : 11);
                neptuneModel.setAttribute('camera-orbit', `${orbit.toFixed(2)}deg ${phi.toFixed(2)}deg 190%`);
              }
            };
            const syncPlanetMode = () => {
              if (isPlanetMotionLite()) {
                unmountNeptuneModel();
              } else {
                hydrateNeptuneModel();
                syncPlanetFallback();
                setPlanetAutoRotate(true);
              }
              updatePlanet();
            };
            let ticking = false;
            window.addEventListener('scroll', ()=> {
              if (!ticking) {
                window.requestAnimationFrame(()=> { updatePlanet(); ticking=false; });
                ticking = true;
              }
            });
            neptuneModel?.addEventListener('load', () => {
              neptuneModelLoaded = true;
              neptuneModelError = false;
              syncPlanetFallback();
              updatePlanet();
            });
            neptuneModel?.addEventListener('error', () => {
              neptuneModelError = true;
              syncPlanetFallback();
            });
            if (productMobileLayout.addEventListener) {
              productMobileLayout.addEventListener('change', syncProductCarouselPlacement);
            } else if (productMobileLayout.addListener) {
              productMobileLayout.addListener(syncProductCarouselPlacement);
            }
            if (planetScene && neptuneModel) {
              if ('IntersectionObserver' in window) {
                const planetLoadObserver = new IntersectionObserver(entries => {
                  if (!entries.some(entry => entry.isIntersecting)) return;
                  planetModelNearViewport = true;
                  hydrateNeptuneModel();
                  planetLoadObserver.disconnect();
                }, { rootMargin: '120px 0px', threshold: 0 });
                planetLoadObserver.observe(planetScene);
              } else {
                planetModelNearViewport = true;
                hydrateNeptuneModel();
              }
            }
            if (productSection && neptuneModel) {
              if ('IntersectionObserver' in window) {
                const planetVisibilityObserver = new IntersectionObserver(entries => {
                  productSectionVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0);
                  setPlanetAutoRotate(true);
                }, { threshold: 0.01 });
                planetVisibilityObserver.observe(productSection);
              } else {
                productSectionVisible = true;
              }
            }
            if ('MutationObserver' in window) {
              new MutationObserver(syncPlanetMode).observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
              });
            }
            window.addEventListener('portfolio:motion-mode-change', syncPlanetMode);
            window.addEventListener('resize', ()=> { syncProductCarouselPlacement(); updatePlanet(); });
            syncProductCarouselPlacement();
            updateCarousel();
            scheduleAuto();
            updatePlanet();
          })();

}

if (__portfolio_external_script_part__ === 'main') {

'use strict';

const xD = (() => {
  const host = window.location.hostname.toLowerCase();
  return host === 'alex-smirnoff.github.io';
})();

if (!xD) {
  document.documentElement.style.opacity = '0';
  setTimeout(() => {
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove());
  }, 0);
  throw Error();
}

/* ─────────────────────────────────────────────
   TOOL CONFIG
───────────────────────────────────────────── */
const TOOLS = {
  intent:    { label:'Проблема (мета)',    color:'#3d6fff', glow:'rgba(61,111,255,0.18)' },
  structure: { label:'Структура роботи', color:'#8833ff', glow:'rgba(136,51,255,0.18)' },
  aim:       { label:'Бізнес-ефект',       color:'#00ddff', glow:'rgba(0,221,255,0.18)'  }
};
let activeTool = 'intent';

/* ─────────────────────────────────────────────
   PARTIAL ANIMATION TOGGLE STATE
───────────────────────────────────────────── */
const MOTION_LIGHT_CLASS = 'motion-lite';
const ONBOARDING_CASE_STORAGE_KEY = 'portfolio:onboarding:case-complete';
const MOTION_MODE_STORAGE_KEY = 'portfolio:motion-mode';
const MOTION_HELP_STORAGE_KEY = 'portfolio:motion-help-shown';
const AUTO_MOTION_LITE_SESSION_KEY = 'portfolio:auto-motion-lite';
let partialMotionDisabled = true;
let selectedMotionMode = null;
const ONBOARDING_SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']);
function isPartialMotionDisabled() {
  return partialMotionDisabled || document.body.classList.contains(MOTION_LIGHT_CLASS);
}

function readStorageFlag(key) {
  try {
    return window.localStorage?.getItem(key) === '1';
  } catch {
    return false;
  }
}

function readStorageValue(key) {
  try {
    return window.localStorage?.getItem(key) || null;
  } catch {
    return null;
  }
}

function readSessionFlag(key) {
  try {
    return window.sessionStorage?.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeSessionFlag(key) {
  try {
    window.sessionStorage?.setItem(key, '1');
  } catch {}
}

function removeSessionValue(key) {
  try {
    window.sessionStorage?.removeItem(key);
  } catch {}
}

function writeStorageFlag(key) {
  try {
    window.localStorage?.setItem(key, '1');
  } catch {}
}

function writeStorageValue(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch {}
}

function readStoredMotionMode() {
  const storedMode = readStorageValue(MOTION_MODE_STORAGE_KEY);
  return storedMode === 'max' || storedMode === 'base' ? storedMode : null;
}

const ANALYTICS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbySe1jQhE-AB9M0oSk5tLoQpUywasF0yfBgGPTNOzFfao0r5WYb7ERkX-mOVatsc70d/exec';
// const ANALYTICS_SCRIPT_URL = '';
const ANALYTICS_USER_SESSION_KEY = 'portfolio:analytics-user';
const analyticsOnceKeys = new Set();
const watchedCaseAspects = new Set();

function createAnalyticsUserId() {
  return `user${Math.floor(10000 + Math.random() * 90000)}`;
}

function getAnalyticsUserId() {
  try {
    const stored = window.sessionStorage?.getItem(ANALYTICS_USER_SESSION_KEY);
    if (stored) return stored;

    const nextUser = createAnalyticsUserId();
    window.sessionStorage?.setItem(ANALYTICS_USER_SESSION_KEY, nextUser);
    return nextUser;
  } catch {
    return createAnalyticsUserId();
  }
}

const user = getAnalyticsUserId();

function cleanAnalyticsText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function getAnalyticsViewport() {
  return `${window.innerWidth}x${window.innerHeight}`;
}

function trackEvent(eventName) {
  const cleanEvent = cleanAnalyticsText(eventName);
  if (!ANALYTICS_SCRIPT_URL || !cleanEvent) return;

  try {
    const payload = new URLSearchParams({
      user,
      event: cleanEvent,
      language: navigator.language || document.documentElement.lang || '',
      viewport: getAnalyticsViewport()
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload.toString()], {
        type: 'application/x-www-form-urlencoded;charset=UTF-8'
      });
      if (navigator.sendBeacon(ANALYTICS_SCRIPT_URL, blob)) return;
    }

    fetch(ANALYTICS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: payload,
      keepalive: true
    }).catch(() => {});
  } catch {}
}

function trackEventOnce(key, eventName) {
  if (analyticsOnceKeys.has(key)) return;
  analyticsOnceKeys.add(key);
  trackEvent(eventName);
}

function getWorkTitle(work) {
  return cleanAnalyticsText(work?.querySelector?.('.w-title')?.textContent) || 'unknown case';
}

function getMotionCardTitle(card) {
  return cleanAnalyticsText(card?.querySelector?.('.motion-card-title')?.textContent) || 'unknown motion case';
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => trackEvent('page opened'), { timeout: 3000 });
} else {
  window.addEventListener('load', () => setTimeout(() => trackEvent('page opened'), 1000), { once: true });
}

function initAiGuideDemo() {
  const section = document.getElementById('aiGuide');
  const form = document.getElementById('aiGuideForm');
  const input = document.getElementById('aiGuideInput');
  const submit = form?.querySelector('.ai-guide-submit');
  const guideTitle = document.getElementById('aiGuideTitle');
  const inputScrollbar = document.getElementById('aiGuideInputScrollbar');
  const inputScrollbarThumb = document.getElementById('aiGuideInputScrollbarThumb');
  const answerText = document.getElementById('aiGuideAnswerText');
  const status = document.getElementById('aiGuideStatus');
  const routesBox = document.getElementById('aiGuideRoutes');
  const answerMessage = answerText?.closest('.ai-guide-message');
  const answerBox = document.getElementById('aiGuideAnswerScroll') || answerMessage;
  const borderTracer = document.getElementById('aiGuideBorderTracer');
  const guideContent = section?.querySelector('.ai-guide-content');
  const guideSide = section?.querySelector('.ai-guide-side');
  const recommendationsPanel = section?.querySelector('.ai-guide-recommendations');
  const routesNav = document.getElementById('aiGuideRouteNav');
  const routesPrevBtn = document.getElementById('aiGuideRoutesPrev');
  const routesNextBtn = document.getElementById('aiGuideRoutesNext');
  if (!section || !form || !input || !submit || !answerText || !status || !routesBox) return;

  const AI_GUIDE_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwSYcVzSOXLdQSx7YxhgnUOFvShtaXtuijBi6f_jWUAm2k2vkchA_k26SLG9jROeEDRug/exec';
  const AI_GUIDE_TIMEOUT_MS = 60000;

  const recommendationSections = {
    works: {
      type: 'section',
      name: 'Кейси',
      desc: 'Основні UX/UI, product, brand і системні роботи.',
      target: 'works',
      visual: 'works',
      image: './previews/QuickWins.png'
    },
    motionSection: {
      type: 'section',
      name: 'Motion',
      desc: 'Відео, анімація, заставки та динамічний контент.',
      target: 'motionSection',
      visual: 'motion',
      video: './previews/aboutKPMGpreview.mp4'
    },
    printedSection: {
      type: 'section',
      name: 'Друк',
      desc: 'Брошури, листівки, плакати, сертифікати та prepress.',
      target: 'printedSection',
      visual: 'printed',
      image: './previews/hrBrochurePreview.png'
    },
    socialSection: {
      type: 'section',
      name: 'SMM',
      desc: 'Пости, каруселі, кампанії та контент для соцмереж.',
      target: 'socialSection',
      visual: 'social',
      image: './previews/dogCarousel1.jpg'
    },
    footer: {
      type: 'section',
      name: 'Контакти',
      desc: 'Форма, пошта та робочі посилання.',
      target: 'footer',
      visual: 'contact',
      image: './previews/myAvatar.png'
    }
  };

  const recommendationCards = {
    'atlant-ai': {
      type: 'case',
      name: 'Веб-сторінка Atlant AI',
      desc: 'UX/UI сторінка для AI-стартапу з адаптивом, компонентами та мікроанімаціями.',
      target: 'works',
      visual: 'works',
      video: './previews/atlant.webm'
    },
    'sa-merch': {
      type: 'case',
      name: 'Мерч SA Consulting',
      desc: 'Брендований мерч, prepress і робота з реальними носіями та підрядниками.',
      target: 'works',
      visual: 'works',
      video: './previews/sneakers.mp4'
    },
    'metinvest-mascot-system': {
      type: 'case',
      name: 'Дизайн-система з маскотом',
      desc: 'Маскот, key-visuals, внутрішні комунікації, CSS-анімації та AI-пайплайн.',
      target: 'works',
      visual: 'works',
      visualClass: 'is-cat-wide',
      video: './previews/metinvestCat.mp4'
    },
    'alumni-mip-crm': {
      type: 'case',
      name: 'CRM AlumniMiP',
      desc: 'Дашборд для роботи з випускниками: фільтри, профілі, картки та product-логіка.',
      target: 'works',
      visual: 'works',
      video: './previews/alumniCRMnew.mp4'
    },
    'business-card-automation': {
      type: 'case',
      name: 'Автоматизація дизайну',
      desc: 'BPMN, UX і front-end сервіс для автоматичного оформлення брендованих матеріалів.',
      target: 'works',
      visual: 'works',
      video: './previews/BusinessCard.webm'
    },
    'sticker-design-kit': {
      type: 'case',
      name: 'Стікер-пак і дизайн-кіт',
      desc: 'AI-assisted ілюстрації, стікери, презентації, email-візуали та бренд-система.',
      target: 'works',
      visual: 'works',
      video: './previews/catSticker7.mp4'
    },
    'document-design': {
      type: 'case',
      name: 'Дизайн документів',
      desc: 'Legal design, структура документів, фірмовий стиль і зручність сприйняття.',
      target: 'works',
      visual: 'works',
      video: './previews/docsPreview.mp4'
    },
    'presentation-design': {
      type: 'case',
      name: 'Дизайн презентацій',
      desc: 'Статичні й динамічні презентації, motion, 3D і впровадження AI у процес.',
      target: 'works',
      visual: 'works',
      video: './previews/presentationPreview.mp4'
    },
    'brand-identity-system': {
      type: 'case',
      name: 'Фірмовий стиль SA Consulting',
      desc: 'Повна система від мудборду до шаблонів, документів, презентацій та інфографіки.',
      target: 'works',
      visual: 'works',
      video: './previews/stylePrew6.mp4'
    },
    'product-case': {
      type: 'case',
      name: 'Цей сайт - product-кейс',
      desc: 'Власний сайт як продукт: логування, ітерації, UX-рішення, AI-чат і оптимізація.',
      target: 'works',
      visual: 'works',
      image: './previews/planetFallback.png'
    },
    'motion-kpmg-commercial-video': {
      type: 'video',
      name: 'Комерційний ролик про KPMG',
      target: 'motionSection',
      visual: 'video',
      video: './previews/aboutKPMGpreview.mp4',
      label: 'Video'
    },
    'motion-skyup-joinup-holiday-video': {
      type: 'video',
      name: 'Відео SkyUp & JoinUp!',
      target: 'motionSection',
      visual: 'video',
      video: './previews/CongratsToAlexAlba.mp4',
      label: 'Video'
    },
    'motion-kpmg-ukrainian-gateway': {
      type: 'video',
      name: 'KPMG Ukrainian Gateway',
      target: 'motionSection',
      visual: 'video',
      video: './previews/gatewayKPMGpreview.mp4',
      label: 'Video'
    },
    'motion-pwc-ai-animation': {
      type: 'video',
      name: 'Анімація для PwC',
      target: 'motionSection',
      visual: 'video',
      video: './previews/PwCpreview.mp4',
      label: 'Video'
    },
    'motion-tsum-kyiv-intro': {
      type: 'video',
      name: 'Заставка для ЦУМ Київ',
      target: 'motionSection',
      visual: 'video',
      video: './previews/TSUMpreview.mp4',
      label: 'Video'
    },
    'motion-sa-consulting-intro-series': {
      type: 'video',
      name: 'Інтро для SA Consulting',
      target: 'motionSection',
      visual: 'video',
      video: './previews/stylePreview.mp4',
      label: 'Video'
    },
    'motion-kpmg-reels': {
      type: 'video',
      name: 'Reels для KPMG',
      target: 'motionSection',
      visual: 'video',
      video: './previews/StoriesPreview.mp4',
      label: 'Video'
    },
    'motion-metinvest-css-animation': {
      type: 'video',
      name: 'CSS-анімація для Метінвесту',
      target: 'motionSection',
      visual: 'video',
      image: './previews/catAnimated.svg',
      label: 'Video'
    },
    'motion-kpmg-targeted-ad': {
      type: 'video',
      name: 'Таргетована реклама',
      target: 'motionSection',
      visual: 'video',
      video: './previews/targetPreview.mp4',
      label: 'Video'
    },
    'motion-kpmg-screensaver': {
      type: 'video',
      name: 'Screensaver для KPMG',
      target: 'motionSection',
      visual: 'video',
      video: './previews/screensaverPreview.mp4',
      label: 'Video'
    },
    'printed-hr-brochure': {
      type: 'photo',
      name: 'HR-буклет',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/hrBrochurePreview.png',
      label: 'Photo'
    },
    'printed-skyup-joinup-card': {
      type: 'photo',
      name: 'Листівка SkyUp & JoinUp!',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/CongratsToAlexAlbaImg.png',
      label: 'Photo'
    },
    'printed-medical-flyer': {
      type: 'photo',
      name: 'Медична листівка',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/medicalBrochurePreview.png',
      label: 'Photo'
    },
    'printed-corporate-certificate': {
      type: 'photo',
      name: 'Корпоративний сертифікат',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/certificatePreview.png',
      label: 'Photo'
    },
    'printed-corporate-posters': {
      type: 'photo',
      name: 'Корпоративні плакати',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/postersPreview.png',
      label: 'Photo'
    },
    'printed-career-fair-rollup': {
      type: 'photo',
      name: 'Рол-ап для ярмарки вакансій',
      target: 'printedSection',
      visual: 'photo',
      image: './previews/rollUpPreview.png',
      label: 'Photo'
    },
    'smm-kpmg-workdays-carousel': {
      type: 'photo',
      name: 'SMM-карусель KPMG',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/dogCarousel1.jpg',
      images: [
        './previews/dogCarousel1.jpg',
        './previews/dogCarousel2.jpg',
        './previews/dogCarousel3.jpg',
        './previews/dogCarousel4.jpg',
        './previews/dogCarousel5.jpg'
      ],
      label: 'Carousel'
    },
    'smm-metinvest-career-post': {
      type: 'photo',
      name: 'Кар’єрний пост Метінвест',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/jobPostPreview.png',
      label: 'Photo'
    },
    'smm-coffee-shop-opening-post': {
      type: 'photo',
      name: 'Пост про кав’ярню',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/coffeeShopOpeningPost.png',
      label: 'Photo'
    },
    'smm-privatbank-concept-target': {
      type: 'photo',
      name: 'Концепт для ПриватБанку',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/privatBankPost3.png',
      label: 'Photo'
    },
    'smm-privatbank-concept-spark': {
      type: 'photo',
      name: 'Концепт ПриватБанку',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/privatBankPost2.png',
      label: 'Photo'
    },
    'smm-sa-consulting-carousel': {
      type: 'photo',
      name: 'Карусель SA Consulting',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/saCarousel1.png',
      images: [
        './previews/saCarousel1.png',
        './previews/saCarousel2.png',
        './previews/saCarousel3.png',
        './previews/saCarousel4.png',
        './previews/saCarousel5.png',
        './previews/saCarousel6.png',
        './previews/saCarousel7.png'
      ],
      label: 'Carousel'
    },
    'smm-kpmg-delo-ua-post': {
      type: 'photo',
      name: 'Пост KPMG x Delo.ua',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/deloUApost.jpg',
      label: 'Photo'
    },
    'smm-metinvest-internship-post': {
      type: 'photo',
      name: 'Пост про стажування',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/internshipHorizontalPost.png',
      label: 'Photo'
    },
    'smm-skyup-quick-wins': {
      type: 'photo',
      name: 'Quick Wins',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/QuickWins.png',
      label: 'Photo'
    },
    'smm-metro-concept': {
      type: 'photo',
      name: 'Концепт для Metro',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/metro.png',
      label: 'Photo'
    },
    'smm-tochka-zrostu-key-visual': {
      type: 'photo',
      name: 'Key-visual Точка зросту',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/tochkaZrostu.png',
      label: 'Photo'
    },
    'smm-metinvest-viber-posts': {
      type: 'photo',
      name: 'Viber-пости Метінвест',
      target: 'socialSection',
      visual: 'photo',
      image: './previews/rectPostNew1.png',
      images: [
        './previews/rectPostNew1.png',
        './previews/rectPostNew2.png',
        './previews/rectPostNew3.png',
        './previews/rectPostNew4.png',
        './previews/rectPostNew5.png',
        './previews/rectPostNew6.png'
      ],
      label: 'Carousel'
    }
  };

  const caseTargets = new Map(
    Array.from(document.querySelectorAll('[data-case-id]'))
      .map(el => [el.dataset.caseId, el])
      .filter(([id]) => Boolean(id))
  );

  const routes = {
    contacts: {
      name: 'Контакти',
      desc: 'Швидкий шлях до форми, пошти та робочих посилань.',
      target: 'footer',
      visual: 'contact',
      image: './previews/myAvatar.png'
    }
  };

  const PREPARED_ANSWER_DELAY_MS = 420;
  const preparedQuestionAnswers = {
    revisions: `Правки — невід'ємна частина процесу. Якщо щось не так — краще дізнатися одразу, ніж здогадуватися. Чим довше я працюю в дизайні, тим більше розумію: дизайн — це про комунікацію, а не про рухання пікселів. Треба зрозуміти бізнес-вимогу, зрозуміти візію клієнта. Картинки телепатично не передаються — тому я ставлю питання, уточнюю, і якщо щось не подобається — прояснюю та виправляю.
Я не відступаю, коли є складнощі. Ітерую, дивлюся на фідбек. Ейнштейн казав: глупо робити одне й те саме та очікувати інший результат. Для дизайну — особливо UX/UI та product — це фундаментальна позиція.
<<<JSON
{"recommendations":[{"type":"case","id":"product-case"}]}
>>>`,
    'job-change': `Я прагну росту й розвитку. Постійно вчуся новому. Мрію працювати в потужній команді, у компанії, яка веде ринок за собою. Поточний контекст я переріс — хочу справді амбітних продуктів і простору для зростання. Готовий до релокації.`,
    companies: `Серед ключових — KPMG Ukraine, Metinvest-SMC, SA Consulting, PwC, SkyUp & JoinUp!, ЦУМ Київ, EuroTolerCulture / Erasmus+. Це різні індустрії та різні типи задач — від корпоративних дизайн-систем до комерційних роликів і продуктових інтерфейсів. Деталі — в кейсах.
<<<JSON
{"recommendations":[{"type":"case","id":"metinvest-mascot-system"},{"type":"video","id":"motion-kpmg-commercial-video"},{"type":"video","id":"motion-pwc-ai-animation"},{"type":"case","id":"brand-identity-system"}]}
>>>`,
    'best-case': `Мабуть, цей сайт. Я задизайнив і закодив його самотужки. Після запуску — низька конверсія. Я не відступив: прикріпив логування, проаналізував поведінку користувачів, переробив онбординг, додав скрипт адаптації анімації під можливості девайса, AI-чат і секцію-сюрприз. Продовжую ітерувати. Це і є продуктовий підхід — не "здав і забув", а живий процес на основі даних.
<<<JSON
{"recommendations":[{"type":"case","id":"product-case"}]}
>>>`,
    tasks: `Motion, UX/UI, Brand, Graphic, SMM, Prepress — і частково Front-end. Широкий профіль — не випадковість. Все моє професійне життя відбувалося в умовах війни. Ринок стискався, і треба було закривати більше завдань самому. Так і виріс у Design Generalist.
<<<JSON
{"recommendations":[{"type":"case","id":"product-case"},{"type":"case","id":"atlant-ai"},{"type":"case","id":"metinvest-mascot-system"},{"type":"case","id":"brand-identity-system"},{"type":"video","id":"motion-kpmg-commercial-video"},{"type":"photo","id":"smm-kpmg-workdays-carousel"},{"type":"case","id":"sa-merch"}]}
>>>`,
    concerns: `Лише одне — коли люди переходять на особистості. Правки, помилки, ітерації — це норма. Успішні продукти проходять далеко не одну ітерацію, щоб відкалібрувати інтерфейс і підлаштувати візуал. Я завжди стараюся зробити все на максимум своїх можливостей. Але жодна людина не робить все ідеально — і коли за це починають ображати, це для мене неприйнятно.`,
    'filter-uxui': `Займаюся UX/UI від wireframe до готового макету з автолейаутом, компонентами і всіма станами, а також із подальшою передачею розробникам. Активно використовую AI-засоби. Можу дизайнити як у Figma, так і безпосередньо у front-end коді. Знаю HTML/CSS/JS. Розумію продуктову логіку: досліджую поведінку користувачів, ітерую на основі даних, а не відчуттів.
<<<JSON
{"recommendations":[{"type":"case","id":"atlant-ai"},{"type":"case","id":"alumni-mip-crm"},{"type":"case","id":"business-card-automation"},{"type":"case","id":"product-case"},{"type":"case","id":"metinvest-mascot-system"}]}
>>>`,
    'filter-product': `Продуктовий підхід для мене — це не просто "красиво намалювати". Це логування, аналіз поведінки, ітерації на основі реальних даних. Саме так я працював над цим сайтом: запустив — побачив проблему — переробив — виміряв знову.
<<<JSON
{"recommendations":[{"type":"case","id":"product-case"},{"type":"case","id":"business-card-automation"},{"type":"case","id":"alumni-mip-crm"}]}
>>>`,
    'filter-interaction': `Interaction — це про те, як інтерфейс реагує на людину. Мікроанімації, стани, переходи, логіка поведінки елементів. Я працюю з Rive, Lottie, CSS-анімаціями вручну — і знаю, коли що доречно.
<<<JSON
{"recommendations":[{"type":"case","id":"product-case"},{"type":"case","id":"business-card-automation"},{"type":"video","id":"motion-metinvest-css-animation"},{"type":"case","id":"metinvest-mascot-system"}]}
>>>`,
    'filter-motion': `Повний пайплайн: розкадровка, After Effects, ротоскопінг, трекмати, expressions, синхронізація з аудіо. Працював для KPMG, PwC, SkyUp, ЦУМ. Використовую AI — Firefly, Wan, Veo, Kling та багато інших — але знаю, де він допомагає, а де краще зробити руками.
<<<JSON
{"recommendations":[{"type":"video","id":"motion-kpmg-commercial-video"},{"type":"video","id":"motion-kpmg-ukrainian-gateway"},{"type":"video","id":"motion-pwc-ai-animation"},{"type":"video","id":"motion-tsum-kyiv-intro"},{"type":"video","id":"motion-skyup-joinup-holiday-video"},{"type":"video","id":"motion-sa-consulting-intro-series"},{"type":"case","id":"metinvest-mascot-system"}]}
>>>`,
    'filter-brand': `Розробляв повні брендові системи — від мудборду до фінальних матеріалів. Документи, презентації, мерч, дизайн-кіти, маскоти. Працював із SA Consulting і Metinvest-SMC. Розумію бренд не як логотип, а як систему, яка працює на всіх носіях.
<<<JSON
{"recommendations":[{"type":"case","id":"brand-identity-system"},{"type":"case","id":"metinvest-mascot-system"},{"type":"case","id":"sa-merch"},{"type":"case","id":"sticker-design-kit"},{"type":"case","id":"document-design"},{"type":"case","id":"presentation-design"}]}
>>>`
  };

  let answerTimer = null;
  let aiRequestToken = 0;
  let typingTimer = null;
  let typingDoneTimer = null;
  let routesNavRaf = null;
  let answerHeightRaf = null;
  let answerSettleRaf = null;
  let answerAutoScroll = true;
  let answerLastScrollTop = 0;
  let answerUserScrollIntent = false;
  let answerUserScrollIntentTimer = null;
  let answerProgrammaticScroll = false;
  let answerProgrammaticScrollTimer = null;
  let answerScrollRaf = null;
  let borderTracerRaf = null;
  let borderTracerStart = 0;
  let inputScrollDrag = null;
  let titleShimmerTimer = null;
  let aiResultVisibilityTimer = null;
  let titleShimmerViewportRaf = null;
  let titleShimmerWasInView = false;
  let titleShimmerOnFirstScroll = false;
  let guideActivated = false;
  let hasAsked = false;
  const narrowComposerQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 350px)')
    : null;
  const desktopGuideQuery = typeof window.matchMedia === 'function'
    ? window.matchMedia('(min-width: 951px)')
    : null;
  const ANSWER_HEIGHT_MIN = 132;
  const ANSWER_HEIGHT_MAX = 236;
  const ANSWER_HEIGHT_COMPOSER_MAX = 188;

  function shouldKeepComposerOpen() {
    return input === document.activeElement
      || form.contains(document.activeElement)
      || input.value.trim().length > 0;
  }

  function hasPromptValue() {
    return input.value.trim().length > 0;
  }

  function syncSubmitState() {
    const isDisabled = !hasPromptValue();
    submit.disabled = isDisabled;
    submit.setAttribute('aria-disabled', String(isDisabled));
  }

  function syncInputScrollbar() {
    if (!inputScrollbar || !inputScrollbarThumb) return;

    const isComposer = form.classList.contains('is-composer');
    const maxScroll = Math.max(0, input.scrollHeight - input.clientHeight);
    const hasOverflow = isComposer && maxScroll > 1;
    form.classList.toggle('has-input-scroll', hasOverflow);

    if (!hasOverflow) {
      inputScrollbarThumb.style.height = '';
      inputScrollbarThumb.style.transform = '';
      return;
    }

    const trackHeight = inputScrollbar.clientHeight;
    const thumbHeight = Math.max(24, Math.round(trackHeight * (input.clientHeight / input.scrollHeight)));
    const maxThumbTop = Math.max(0, trackHeight - thumbHeight);
    const thumbTop = maxScroll > 0
      ? Math.round((input.scrollTop / maxScroll) * maxThumbTop)
      : 0;

    inputScrollbarThumb.style.height = `${thumbHeight}px`;
    inputScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
  }

  function setInputScrollFromPointer(clientY, dragOffset = 0) {
    if (!inputScrollbar || !inputScrollbarThumb) return;

    const maxScroll = Math.max(0, input.scrollHeight - input.clientHeight);
    const trackRect = inputScrollbar.getBoundingClientRect();
    const thumbHeight = inputScrollbarThumb.getBoundingClientRect().height || 24;
    const maxThumbTop = Math.max(1, trackRect.height - thumbHeight);
    const nextThumbTop = Math.min(
      Math.max(0, clientY - trackRect.top - dragOffset),
      maxThumbTop
    );

    input.scrollTop = (nextThumbTop / maxThumbTop) * maxScroll;
    syncInputScrollbar();
  }

  function resizeComposerInput(fromHeight = null) {
    if (input.tagName !== 'TEXTAREA') return;

    const isComposer = form.classList.contains('is-composer');
    const minHeight = isComposer && narrowComposerQuery?.matches ? 104 : isComposer ? 116 : 46;

    input.setAttribute('wrap', isComposer ? 'soft' : 'off');
    const startHeight = Number.isFinite(fromHeight)
      ? fromHeight
      : input.getBoundingClientRect().height || minHeight;

    const nextHeight = minHeight;

    if (Math.abs(startHeight - nextHeight) < 1) {
      input.style.height = `${nextHeight}px`;
      input.style.overflowY = isComposer ? 'auto' : 'hidden';
      syncInputScrollbar();
      return;
    }

    input.style.height = `${startHeight}px`;
    input.style.overflowY = 'hidden';
    requestAnimationFrame(() => {
      input.style.height = `${nextHeight}px`;
      input.style.overflowY = isComposer ? 'auto' : 'hidden';
      syncInputScrollbar();
      if (section.classList.contains('is-answer-ready')) syncAnswerBoxHeight();
    });
  }

  function setComposerOpen(isOpen) {
    const wasOpen = form.classList.contains('is-composer');
    const previousInputHeight = input.getBoundingClientRect().height;
    if (section.classList.contains('is-answer-ready')) lockGuideContentHeight();
    form.classList.toggle('is-composer', isOpen);
    resizeComposerInput(previousInputHeight);
    if (isOpen && !wasOpen) shimmerGuideTitle();
    if (section.classList.contains('is-answer-ready')) settleAnswerBoxHeight();
  }

  function syncComposerState() {
    syncSubmitState();
    setComposerOpen(shouldKeepComposerOpen());
  }

  function clearPromptInput() {
    input.value = '';
    input.scrollTop = 0;
    syncSubmitState();
    resizeComposerInput();
    syncInputScrollbar();
  }

  function shimmerGuideTitle() {
    section.classList.remove('is-title-shimmer');
    void section.offsetWidth;
    section.classList.add('is-title-shimmer');
    clearTimeout(titleShimmerTimer);
    titleShimmerTimer = setTimeout(() => {
      section.classList.remove('is-title-shimmer');
    }, 5900);
  }

  function isGuideTitleInShimmerView() {
    if (!guideTitle) return false;
    const rect = guideTitle.getBoundingClientRect();
    const height = Math.max(1, rect.height);
    const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visibleHeight / height >= .3;
  }

  function syncGuideTitleViewportShimmer(isFirstScroll = false) {
    titleShimmerViewportRaf = null;
    const isInView = isGuideTitleInShimmerView();

    if (titleShimmerOnFirstScroll) {
      if (!isFirstScroll && isInView) {
        titleShimmerWasInView = true;
        return;
      }

      titleShimmerOnFirstScroll = false;
      if (isFirstScroll && isInView) shimmerGuideTitle();
      titleShimmerWasInView = isInView;
      return;
    }

    if (isInView && !titleShimmerWasInView) {
      shimmerGuideTitle();
    }

    titleShimmerWasInView = isInView;
  }

  function requestGuideTitleViewportShimmer(isFirstScroll = false) {
    if (titleShimmerViewportRaf) return;
    titleShimmerViewportRaf = requestAnimationFrame(() => {
      syncGuideTitleViewportShimmer(isFirstScroll);
    });
  }

  function stopAnswerTyping() {
    clearInterval(typingTimer);
    clearTimeout(typingDoneTimer);
    typingTimer = null;
    typingDoneTimer = null;
    answerText.classList.remove('is-typing');
  }

  function normalizeAnswerQuestion(question) {
    return String(question || '').replace(/\s+/g, ' ').trim();
  }

  function setupAnswerContent(question = '', bodyText = '') {
    const cleanQuestion = normalizeAnswerQuestion(question);
    answerText.textContent = '';

    if (!cleanQuestion) {
      answerText.textContent = bodyText;
      return answerText;
    }

    const questionNode = document.createElement('div');
    questionNode.className = 'ai-guide-answer-question';
    const questionTextNode = document.createElement('span');
    questionTextNode.className = 'ai-guide-answer-question-text';
    questionTextNode.textContent = cleanQuestion;
    questionNode.appendChild(questionTextNode);

    const bodyNode = document.createElement('div');
    bodyNode.className = 'ai-guide-answer-body';
    bodyNode.textContent = bodyText;

    answerText.appendChild(questionNode);
    answerText.appendChild(bodyNode);
    return bodyNode;
  }

  function isGuideDesktopLayout() {
    return desktopGuideQuery ? desktopGuideQuery.matches : window.innerWidth > 950;
  }

  function hasVisibleRecommendations() {
    return Boolean(recommendationsPanel && !recommendationsPanel.hidden && routesBox.children.length);
  }

  function lockGuideContentHeight(sideRect = null) {
    if (!guideContent || !guideSide || !isGuideDesktopLayout()) return;
    if (!section.classList.contains('has-answer') || !section.classList.contains('is-answer-ready')) return;

    const currentSideRect = sideRect || guideSide.getBoundingClientRect();
    const contentRect = guideContent.getBoundingClientRect();
    const rowHeight = Math.round(currentSideRect.bottom - contentRect.top);

    if (Number.isFinite(rowHeight) && rowHeight > 0) {
      const currentHeight = Number.parseFloat(section.style.getPropertyValue('--ai-guide-content-min-height'));
      if (hasVisibleRecommendations() && Number.isFinite(currentHeight)) return;
      if (!Number.isFinite(currentHeight) || Math.abs(currentHeight - rowHeight) > 1) {
        section.style.setProperty('--ai-guide-content-min-height', `${rowHeight}px`);
      }
    }
  }

  function syncAnswerBoxHeight() {
    answerHeightRaf = null;
    if (!answerMessage) return;

    const answerReady = section.classList.contains('has-answer')
      && section.classList.contains('is-answer-ready')
      && !section.classList.contains('is-thinking');

    if (!answerReady || !guideSide || !isGuideDesktopLayout()) {
      section.style.removeProperty('--ai-guide-message-height');
      section.style.removeProperty('--ai-guide-content-min-height');
      return;
    }

    const sideRect = guideSide.getBoundingClientRect();
    const boxRect = answerMessage.getBoundingClientRect();
    const targetHeight = Math.round(sideRect.bottom - boxRect.top);
    lockGuideContentHeight(sideRect);

    if (Number.isFinite(targetHeight) && targetHeight > 0) {
      const maxHeight = form.classList.contains('is-composer')
        ? ANSWER_HEIGHT_COMPOSER_MAX
        : ANSWER_HEIGHT_MAX;
      const nextHeight = Math.min(Math.max(ANSWER_HEIGHT_MIN, targetHeight), maxHeight);
      const currentHeight = Number.parseFloat(section.style.getPropertyValue('--ai-guide-message-height'));
      if (!Number.isFinite(currentHeight) || Math.abs(currentHeight - nextHeight) > 1) {
        section.style.setProperty('--ai-guide-message-height', `${nextHeight}px`);
      }
    } else {
      section.style.removeProperty('--ai-guide-message-height');
    }
  }

  function requestAnswerBoxHeightSync() {
    if (answerHeightRaf) return;
    answerHeightRaf = requestAnimationFrame(syncAnswerBoxHeight);
  }

  function settleAnswerBoxHeight() {
    requestAnswerBoxHeightSync();
    if (answerSettleRaf) cancelAnimationFrame(answerSettleRaf);

    const startTime = typeof performance !== 'undefined' && performance.now
      ? performance.now()
      : Date.now();

    function tick(now) {
      syncAnswerBoxHeight();
      const currentTime = typeof now === 'number' ? now : Date.now();
      if (currentTime - startTime < 720) {
        answerSettleRaf = requestAnimationFrame(tick);
      } else {
        answerSettleRaf = null;
      }
    }

    answerSettleRaf = requestAnimationFrame(tick);
  }

  function isAnswerNearBottom(threshold = 12) {
    if (!answerBox) return true;
    return answerBox.scrollHeight - answerBox.clientHeight - answerBox.scrollTop <= threshold;
  }

  function markAnswerUserScrollIntent() {
    answerUserScrollIntent = true;
    clearTimeout(answerUserScrollIntentTimer);
    answerUserScrollIntentTimer = setTimeout(() => {
      answerUserScrollIntent = false;
    }, 700);
  }

  function handleAnswerWheel(event) {
    markAnswerUserScrollIntent();
    if (!answerBox || event.ctrlKey) return;

    if (event.deltaY < 0) answerAutoScroll = false;
  }

  function guardAnswerProgrammaticScroll() {
    answerProgrammaticScroll = true;
    clearTimeout(answerProgrammaticScrollTimer);
    answerProgrammaticScrollTimer = setTimeout(() => {
      answerProgrammaticScroll = false;
    }, 120);
  }

  function resetAnswerAutoScroll() {
    answerAutoScroll = true;
    answerUserScrollIntent = false;
    answerProgrammaticScroll = false;
    clearTimeout(answerUserScrollIntentTimer);
    clearTimeout(answerProgrammaticScrollTimer);
    if (answerScrollRaf) {
      cancelAnimationFrame(answerScrollRaf);
      answerScrollRaf = null;
    }
    answerLastScrollTop = answerBox ? answerBox.scrollTop : 0;
  }

  function setAnswerScrollTop(value) {
    if (!answerBox) return;
    guardAnswerProgrammaticScroll();
    answerBox.scrollTop = value;
    answerLastScrollTop = answerBox.scrollTop;
  }

  function applyAnswerScrollToBottom() {
    if (!answerBox || !answerAutoScroll) return;
    setAnswerScrollTop(answerBox.scrollHeight);
  }

  function scrollAnswerToBottom() {
    if (!answerBox || !answerAutoScroll) return;
    applyAnswerScrollToBottom();
    if (!answerScrollRaf) {
      answerScrollRaf = requestAnimationFrame(() => {
        answerScrollRaf = null;
        applyAnswerScrollToBottom();
      });
    }
  }

  function typeAnswer(text, question = '') {
    stopAnswerTyping();
    section.classList.add('is-answer-ready');
    const typingTarget = setupAnswerContent(question);
    resetAnswerAutoScroll();
    setAnswerScrollTop(0);
    settleAnswerBoxHeight();

    const chars = Array.from(text);
    let index = 0;
    answerText.classList.add('is-typing');

    function printChunk() {
      const chunkSize = index > 52 ? 2 : 1;
      typingTarget.textContent += chars.slice(index, index + chunkSize).join('');
      index += chunkSize;
      scrollAnswerToBottom();

      if (index >= chars.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        typingDoneTimer = setTimeout(() => {
          answerText.classList.remove('is-typing');
        }, 360);
      }
    }

    typingTimer = setInterval(printChunk, 18);
    printChunk();
  }

  function getRoutesScrollAmount() {
    const firstRoute = routesBox.querySelector('.ai-guide-route');
    if (!firstRoute) return Math.max(220, routesBox.clientWidth * .72);

    const styles = window.getComputedStyle(routesBox);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 12;
    return firstRoute.getBoundingClientRect().width + gap;
  }

  function updateRoutesNav() {
    if (!routesNav || !routesPrevBtn || !routesNextBtn) return;

    const maxScroll = Math.max(0, routesBox.scrollWidth - routesBox.clientWidth);
    const canScroll = maxScroll > 2;
    const isAtStart = routesBox.scrollLeft <= 2;
    const isAtEnd = routesBox.scrollLeft >= maxScroll - 2;

    routesNav.classList.toggle('is-hidden', !canScroll);
    routesPrevBtn.disabled = !canScroll || isAtStart;
    routesNextBtn.disabled = !canScroll || isAtEnd;
  }

  function requestRoutesNavUpdate() {
    if (routesNavRaf) return;
    routesNavRaf = requestAnimationFrame(() => {
      routesNavRaf = null;
      updateRoutesNav();
    });
  }

  function scrollRoutes(direction) {
    const delta = getRoutesScrollAmount();
    routesBox.scrollTo({
      left: routesBox.scrollLeft + (direction === 'next' ? delta : -delta),
      behavior: 'smooth'
    });
  }

  function getRecommendationType(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getRecommendationId(value) {
    return String(value || '').trim();
  }

  function buildRouteFromRecommendation(recommendation) {
    if (!recommendation || typeof recommendation !== 'object') return null;

    const type = getRecommendationType(recommendation.type);
    const id = getRecommendationId(recommendation.id);
    if (!type || !id) return null;

    if (type === 'section') {
      const sectionRoute = recommendationSections[id];
      if (!sectionRoute || !document.getElementById(sectionRoute.target)) return null;
      return { ...sectionRoute };
    }

    if (type !== 'case' && type !== 'video' && type !== 'photo') return null;

    const card = recommendationCards[id];
    const target = caseTargets.get(id);
    if (!card || !target || card.type !== type) return null;

    return {
      ...card,
      caseId: id
    };
  }

  function buildRoutesFromRecommendations(recommendations) {
    if (!Array.isArray(recommendations)) return [];

    const seen = new Set();
    const items = [];

    recommendations.forEach(recommendation => {
      const route = buildRouteFromRecommendation(recommendation);
      if (!route) return;

      const key = route.caseId || route.target;
      if (!key || seen.has(key)) return;
      seen.add(key);
      items.push(route);
    });

    return items;
  }

  function parseAiGuideResponse(rawAnswer) {
    const rawText = String(rawAnswer || '').trim();
    const jsonMatch = rawText.match(/<<<JSON\s*([\s\S]*?)\s*>>>/i);
    const cleanText = rawText.replace(/<<<JSON\s*[\s\S]*?\s*>>>/gi, '').trim();
    let recommendations = [];

    if (jsonMatch?.[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1].trim());
        recommendations = Array.isArray(parsed.recommendations)
          ? parsed.recommendations
          : [];
      } catch {
        recommendations = [];
      }
    }

    return {
      text: cleanText || 'Ось що я раджу подивитися за цим запитом.',
      routes: buildRoutesFromRecommendations(recommendations)
    };
  }

  async function requestAiGuideAnswer(question) {
    const controller = typeof AbortController !== 'undefined'
      ? new AbortController()
      : null;
    const timeout = controller
      ? setTimeout(() => controller.abort(), AI_GUIDE_TIMEOUT_MS)
      : null;

    try {
      const response = await fetch(AI_GUIDE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({ message: question }),
        signal: controller?.signal
      });

      if (!response.ok) {
        throw new Error(`AI endpoint failed with status ${response.status}`);
      }

      const payload = await response.json();
      if (!payload?.ok || !payload.answer) {
        throw new Error(payload?.error || 'Empty AI response');
      }

      return String(payload.answer);
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  function resolveRoute(routeItem) {
    if (!routeItem) return null;
    if (typeof routeItem === 'string') return routes[routeItem] || null;
    if (typeof routeItem === 'object') return routeItem;
    return null;
  }

  function markRouteMediaLoading(visual, media) {
    if (!visual || !media) return;

    visual.classList.add('media-loadbox', 'media-loading');

    const markReady = () => {
      visual.classList.remove('media-loading', 'media-error');
    };
    const markError = () => {
      visual.classList.remove('media-loading');
      visual.classList.add('media-error');
    };

    if (media.tagName === 'IMG') {
      media.addEventListener('load', markReady, { once: true });
      media.addEventListener('error', markError, { once: true });
      if (media.complete && media.naturalWidth > 0) markReady();
    } else if (media.tagName === 'VIDEO') {
      media.addEventListener('loadeddata', markReady, { once: true });
      media.addEventListener('canplay', markReady, { once: true });
      media.addEventListener('error', markError, { once: true });
      if (media.readyState >= 2) markReady();
    }
  }

  function setRecommendationsVisible(isVisible) {
    if (!recommendationsPanel) return;
    recommendationsPanel.hidden = !isVisible;
  }

  function getRectVisibleRatio(rect, topOffset = 0, bottomOffset = 0) {
    if (!rect || rect.height <= 0) return 0;
    const viewportTop = topOffset;
    const viewportBottom = (window.innerHeight || document.documentElement.clientHeight) - bottomOffset;
    const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportBottom) - Math.max(rect.top, viewportTop));
    return visibleHeight / rect.height;
  }

  function getUnionRect(rects) {
    const validRects = rects.filter(rect => rect && rect.width > 0 && rect.height > 0);
    if (!validRects.length) return null;
    return validRects.reduce((acc, rect) => ({
      top: Math.min(acc.top, rect.top),
      right: Math.max(acc.right, rect.right),
      bottom: Math.max(acc.bottom, rect.bottom),
      left: Math.min(acc.left, rect.left),
      width: Math.max(acc.right, rect.right) - Math.min(acc.left, rect.left),
      height: Math.max(acc.bottom, rect.bottom) - Math.min(acc.top, rect.top)
    }));
  }

  function ensureAiResultInViewport(hasRecommendations = false) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (!viewportHeight) return;

    const topOffset = viewportHeight < 520 ? 10 : 18;
    const bottomOffset = viewportHeight < 520 ? 16 : 28;
    const viewportBottom = viewportHeight - bottomOffset;
    const answerRect = answerMessage?.getBoundingClientRect?.();
    const hasVisibleRoutes = hasRecommendations && recommendationsPanel && !recommendationsPanel.hidden && routesBox.children.length;
    const recommendationsRect = hasVisibleRoutes
      ? recommendationsPanel.getBoundingClientRect()
      : null;
    const resultRect = getUnionRect([answerRect, recommendationsRect]);

    if (!resultRect) return;

    const availableHeight = viewportHeight - topOffset - bottomOffset;
    let targetY = null;

    if (resultRect.height <= availableHeight) {
      if (resultRect.top >= topOffset && resultRect.bottom <= viewportBottom) return;
      targetY = window.pageYOffset + (
        resultRect.top < topOffset
          ? resultRect.top - topOffset
          : resultRect.bottom - viewportBottom
      );
    } else if (recommendationsRect) {
      const recommendationsRatio = getRectVisibleRatio(recommendationsRect, topOffset, bottomOffset);
      const answerRatio = getRectVisibleRatio(answerRect, topOffset, bottomOffset);
      const recommendationsBarelyVisible = recommendationsRatio < .34 || recommendationsRect.top > viewportBottom - 120;

      if (!recommendationsBarelyVisible && answerRatio > .28) return;
      targetY = window.pageYOffset + recommendationsRect.top - Math.min(viewportHeight * .58, 360);
    } else {
      const answerRatio = getRectVisibleRatio(answerRect, topOffset, bottomOffset);
      if (answerRatio > .55) return;
      targetY = window.pageYOffset + resultRect.top - topOffset;
    }

    if (targetY === null) return;
    targetY = Math.max(0, targetY);
    if (Math.abs(targetY - window.pageYOffset) < 8) return;

    try {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, targetY);
    }
  }

  function requestAiResultVisibilitySync(hasRecommendations = false) {
    clearTimeout(aiResultVisibilityTimer);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ensureAiResultInViewport(hasRecommendations));
    });
    aiResultVisibilityTimer = setTimeout(() => ensureAiResultInViewport(hasRecommendations), 360);
  }

  function renderRoutes(routeItems) {
    routeItems = Array.isArray(routeItems) ? routeItems : [];
    const normalizedRoutes = routeItems.map(resolveRoute).filter(Boolean);
    setRecommendationsVisible(normalizedRoutes.length > 0);
    routesBox.textContent = '';
    routesBox.dataset.routeCount = String(normalizedRoutes.length);
    routesBox.scrollLeft = 0;
    normalizedRoutes.forEach((route, index) => {
      const btn = document.createElement('button');
      btn.className = `ai-guide-route${route.type ? ` is-${route.type}` : ''}`;
      btn.type = 'button';
      btn.dataset.aiTarget = route.target;
      if (route.type) btn.dataset.aiType = route.type;
      if (route.caseId) btn.dataset.aiCaseId = route.caseId;
      btn.style.setProperty('--route-index', index);

      const visual = document.createElement('span');
      visual.className = `ai-guide-route-visual is-${route.visual}`;
      if (route.visualClass) {
        route.visualClass.split(/\s+/).filter(Boolean).forEach(cls => visual.classList.add(cls));
      }
      visual.setAttribute('aria-hidden', 'true');

      if (route.video) {
        const video = document.createElement('video');
        video.src = route.video;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        visual.appendChild(video);
        markRouteMediaLoading(visual, video);
        video.play?.().catch(() => {});
      } else if (route.image) {
        const image = document.createElement('img');
        image.src = route.image;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        visual.appendChild(image);
        markRouteMediaLoading(visual, image);
      }

      if (route.label) {
        const label = document.createElement('span');
        label.className = 'ai-guide-route-kind';
        label.textContent = route.label;
        visual.appendChild(label);
      }

      if (route.type === 'video') {
        const play = document.createElement('span');
        play.className = 'ai-guide-route-play';
        visual.appendChild(play);
      }

      const name = document.createElement('span');
      name.className = 'ai-guide-route-name';
      name.textContent = route.name;

      const desc = document.createElement('span');
      desc.className = 'ai-guide-route-desc';
      desc.textContent = route.desc;

      const action = document.createElement('span');
      action.className = 'ai-guide-route-action';
      action.textContent = 'Перейти';

      btn.appendChild(visual);
      btn.appendChild(name);
      btn.appendChild(desc);
      btn.appendChild(action);
      routesBox.appendChild(btn);
    });
    requestAnimationFrame(updateRoutesNav);
  }

  function paintBorderTracer(now) {
    if (!borderTracer || !answerMessage || !section.classList.contains('is-thinking')) {
      stopBorderTracer();
      return;
    }

    const width = answerMessage.clientWidth;
    const height = answerMessage.clientHeight;
    if (width < 24 || height < 24) {
      borderTracer.style.opacity = '0';
      borderTracerRaf = requestAnimationFrame(paintBorderTracer);
      return;
    }

    const pad = 1;
    const lineLength = Math.min(68, Math.max(42, Math.min(width, height) * 0.42));
    const travelWidth = Math.max(1, width - lineLength - pad * 2);
    const travelHeight = Math.max(1, height - lineLength - pad * 2);
    const perimeter = (travelWidth + travelHeight) * 2;
    const speed = 220;
    const elapsed = Math.max(0, now - borderTracerStart);
    const distance = (elapsed / 1000 * speed) % perimeter;

    let x = pad;
    let y = 0;
    let segmentWidth = lineLength;
    let segmentHeight = 1;
    let angle = 90;

    if (distance < travelWidth) {
      x = pad + distance;
      y = 0;
      angle = 90;
    } else if (distance < travelWidth + travelHeight) {
      x = width - pad;
      y = pad + distance - travelWidth;
      segmentWidth = 1;
      segmentHeight = lineLength;
      angle = 180;
    } else if (distance < travelWidth * 2 + travelHeight) {
      x = pad + travelWidth - (distance - travelWidth - travelHeight);
      y = height - pad;
      angle = 270;
    } else {
      x = 0;
      y = pad + travelHeight - (distance - travelWidth * 2 - travelHeight);
      segmentWidth = 1;
      segmentHeight = lineLength;
      angle = 0;
    }

    borderTracer.style.width = `${segmentWidth}px`;
    borderTracer.style.height = `${segmentHeight}px`;
    borderTracer.style.opacity = '1';
    borderTracer.style.background = `linear-gradient(${angle}deg, transparent, rgba(61,111,255,.94), rgba(0,221,255,.44), transparent)`;
    borderTracer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    borderTracerRaf = requestAnimationFrame(paintBorderTracer);
  }

  function startBorderTracer() {
    if (!borderTracer || borderTracerRaf) return;
    borderTracerStart = typeof performance !== 'undefined' && performance.now
      ? performance.now()
      : Date.now();
    borderTracerRaf = requestAnimationFrame(paintBorderTracer);
  }

  function stopBorderTracer() {
    if (borderTracerRaf) {
      cancelAnimationFrame(borderTracerRaf);
      borderTracerRaf = null;
    }
    if (borderTracer) borderTracer.style.opacity = '0';
  }

  function setThinking(isThinking) {
    section.classList.toggle('is-thinking', isThinking);
    if (isThinking) {
      startBorderTracer();
      if (answerSettleRaf) cancelAnimationFrame(answerSettleRaf);
      answerSettleRaf = null;
      clearTimeout(titleShimmerTimer);
      section.classList.remove('is-title-shimmer', 'is-answer-ready', 'is-error');
      section.style.removeProperty('--ai-guide-message-height');
      section.style.removeProperty('--ai-guide-content-min-height');
    } else {
      stopBorderTracer();
    }
    status.textContent = isThinking ? 'ALEX AI:' : 'ALEX AI:';
    requestAnswerBoxHeightSync();
  }

  function activateGuide() {
    section.classList.add('is-open');
    if (guideActivated) return;
    guideActivated = true;
    if (!hasAsked) renderRoutes(['contacts']);
  }

  function scrollToRecommendedSection(target) {
    const top = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - 58);
    try {
      window.scrollTo({ top, behavior: 'smooth' });
    } catch {
      target.scrollIntoView();
    }
  }

  function suppressCaseOnboardingForAiNavigation() {
    if (typeof suppressCaseOnboardingForContactJump === 'function') {
      suppressCaseOnboardingForContactJump();
    }
  }

  function openRecommendedCase(caseId) {
    if (!caseId) return false;

    const target = caseTargets.get(caseId);
    if (!target) return false;

    suppressCaseOnboardingForAiNavigation();

    if (caseId === 'product-case') {
      showProductCaseNarrator();
      return true;
    }

    if (target.matches?.('.work') && target.dataset.narrator) {
      showNarrator(target);
      return true;
    }

    return false;
  }

  function openRecommendedMedia(card) {
    if (!card) return false;

    const carouselSources = Array.isArray(card.images)
      ? card.images.filter(Boolean)
      : [];
    const mediaSrc = card.video || card.image;
    const canOpenCarousel = carouselSources.length > 1 && typeof openFloatPanelCarousel === 'function';
    const canOpenMedia = mediaSrc && typeof openFloatPanelMedia === 'function';
    if (!canOpenCarousel && !canOpenMedia) return false;

    if (nar?.classList.contains('show')) {
      clearAllTimers();
      nar.classList.remove('show');
      clearNarratorContent();
      narHidden = true;
      currentNarWork = null;
    }

    if (canOpenCarousel) {
      return openFloatPanelCarousel(carouselSources);
    }

    return openFloatPanelMedia(card.video ? 'video' : 'img', mediaSrc);
  }

  function getPreparedQuestionAnswer(trigger) {
    const presetKey = trigger?.dataset?.aiPreset;
    return presetKey ? preparedQuestionAnswers[presetKey] || null : null;
  }

  function getAiTriggerLabel(trigger) {
    return cleanAnalyticsText(trigger?.textContent || trigger?.dataset?.aiPrompt || 'unknown button');
  }

  function getAiTriggerKind(trigger) {
    return trigger?.classList?.contains('ai-guide-chip') ? 'quick filter' : 'prepared question';
  }

  function formatAiRecommendationsForAnalytics(routes) {
    if (!Array.isArray(routes) || !routes.length) return 'no recommendations';

    return routes.map((route, index) => {
      const type = cleanAnalyticsText(route?.type || 'item');
      const id = cleanAnalyticsText(route?.caseId || route?.target || 'unknown');
      const title = cleanAnalyticsText(route?.name || '');
      return `${index + 1}. ${type} ${id}${title ? ` (${title})` : ''}`;
    }).join('; ');
  }

  let aiGuideLastAnalyticsContext = {
    source: '',
    label: '',
    prompt: '',
    recommendations: ''
  };

  function rememberAiGuideAnalyticsContext(source, label, prompt, routes) {
    aiGuideLastAnalyticsContext = {
      source: cleanAnalyticsText(source),
      label: cleanAnalyticsText(label),
      prompt: cleanAnalyticsText(prompt),
      recommendations: formatAiRecommendationsForAnalytics(routes)
    };
  }

  function trackAiGuideRecommendationClick(btn, card) {
    const routeType = cleanAnalyticsText(btn?.dataset?.aiType || card?.type || 'section');
    const routeId = cleanAnalyticsText(btn?.dataset?.aiCaseId || btn?.dataset?.aiTarget || 'unknown');
    const title = cleanAnalyticsText(
      card?.name
      || btn?.querySelector?.('.ai-guide-route-title')?.textContent
      || btn?.querySelector?.('.ai-guide-route-name')?.textContent
      || btn?.textContent
      || ''
    );
    const position = Array.prototype.indexOf.call(routesBox.children, btn) + 1;
    const context = aiGuideLastAnalyticsContext;

    trackEvent(
      `ai recommendation clicked: ${position}. ${routeType} ${routeId}${title ? ` (${title})` : ''}; ` +
      `after ${context.source || 'default recommendations'}${context.label ? ` button ${context.label}` : ''}; ` +
      `prompt: ${context.prompt || 'no prompt yet'}`
    );
  }

  function waitForPreparedAnswer() {
    return new Promise(resolve => setTimeout(resolve, PREPARED_ANSWER_DELAY_MS));
  }

  async function answerPreparedQuestion(question, rawAnswer, trigger = null) {
    const cleanQuestion = String(question || '').trim();
    if (!cleanQuestion || !rawAnswer) return;
    const triggerKind = getAiTriggerKind(trigger);
    const triggerLabel = getAiTriggerLabel(trigger);

    const requestToken = ++aiRequestToken;
    activateGuide();
    hasAsked = true;
    section.classList.add('has-answer');
    clearTimeout(answerTimer);
    stopAnswerTyping();
    section.classList.remove('is-answer-ready');
    setThinking(true);
    renderRoutes([]);
    setupAnswerContent(cleanQuestion, 'Генерація відповіді на запит');
    resetAnswerAutoScroll();
    setAnswerScrollTop(0);
    requestAnswerBoxHeightSync();
    trackEvent(`ai ${triggerKind} clicked: ${triggerLabel}; prompt: ${cleanQuestion}`);

    await waitForPreparedAnswer();
    if (requestToken !== aiRequestToken) return;

    const parsed = parseAiGuideResponse(rawAnswer);
    setThinking(false);
    section.classList.remove('is-error');
    typeAnswer(parsed.text, cleanQuestion);
    renderRoutes(parsed.routes);
    if (parsed.routes.length) settleAnswerBoxHeight();
    requestAiResultVisibilitySync(parsed.routes.length > 0);
    rememberAiGuideAnalyticsContext(triggerKind, triggerLabel, cleanQuestion, parsed.routes);
    trackEvent(
      `ai prepared answer shown after ${triggerKind} ${triggerLabel}; ` +
      `prompt: ${cleanQuestion}; answer: ${parsed.text}; recommendations: ${formatAiRecommendationsForAnalytics(parsed.routes)}`
    );
  }

  async function ask(question) {
    const cleanQuestion = String(question || '').trim();
    if (!cleanQuestion) return;

    const requestToken = ++aiRequestToken;
    activateGuide();
    hasAsked = true;
    section.classList.add('has-answer');
    clearTimeout(answerTimer);
    stopAnswerTyping();
    section.classList.remove('is-answer-ready');
    setThinking(true);
    renderRoutes([]);
    setupAnswerContent(cleanQuestion, 'Генерація відповіді на запит');
    resetAnswerAutoScroll();
    setAnswerScrollTop(0);
    requestAnswerBoxHeightSync();
    trackEvent(`ai gemini prompt sent: ${cleanQuestion}`);

    try {
      const rawAnswer = await requestAiGuideAnswer(cleanQuestion);
      if (requestToken !== aiRequestToken) return;

      const parsed = parseAiGuideResponse(rawAnswer);
      setThinking(false);
      section.classList.remove('is-error');
      typeAnswer(parsed.text, cleanQuestion);
      renderRoutes(parsed.routes);
      if (parsed.routes.length) settleAnswerBoxHeight();
      requestAiResultVisibilitySync(parsed.routes.length > 0);
      rememberAiGuideAnalyticsContext('gemini', 'free prompt', cleanQuestion, parsed.routes);
      trackEvent(
        `ai gemini answer received; prompt: ${cleanQuestion}; ` +
        `answer: ${parsed.text}; recommendations: ${formatAiRecommendationsForAnalytics(parsed.routes)}`
      );
    } catch (err) {
      if (requestToken !== aiRequestToken) return;

      setThinking(false);
      section.classList.add('is-error');
      typeAnswer('Помилка. Не вдалося згенерувати відповідь.', cleanQuestion);
      renderRoutes([]);
      requestAiResultVisibilitySync(false);
      rememberAiGuideAnalyticsContext('gemini error', 'free prompt', cleanQuestion, []);
      trackEvent(`ai gemini error; prompt: ${cleanQuestion}; error: ${cleanAnalyticsText(err?.message || err || 'unknown error')}`);
      console.warn('AI guide request failed:', err);
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    syncComposerState();
    if (!hasPromptValue()) return;
    const question = input.value;
    clearPromptInput();
    ask(question);
  });

  form.addEventListener('click', e => {
    if (e.target.closest('.ai-guide-submit')) return;
    input.focus();
  });

  input.addEventListener('focus', () => {
    activateGuide();
    setComposerOpen(true);
  });
  input.addEventListener('input', syncComposerState);
  input.addEventListener('paste', () => {
    requestAnimationFrame(() => {
      syncComposerState();
      syncInputScrollbar();
    });
  });
  input.addEventListener('scroll', syncInputScrollbar, { passive: true });
  input.addEventListener('keydown', e => {
    if (input.tagName !== 'TEXTAREA' || e.key !== 'Enter' || e.isComposing) return;
    if (e.shiftKey) return;
    syncSubmitState();
    if (submit.disabled || !hasPromptValue()) return;
    e.preventDefault();
    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else {
      syncComposerState();
      if (!hasPromptValue()) return;
      const question = input.value;
      clearPromptInput();
      ask(question);
    }
  });
  form.addEventListener('focusout', () => {
    setTimeout(syncComposerState, 0);
  });

  inputScrollbar?.addEventListener('pointerdown', e => {
    if (!form.classList.contains('has-input-scroll')) return;
    e.preventDefault();
    const thumbRect = inputScrollbarThumb.getBoundingClientRect();
    const isThumb = e.target === inputScrollbarThumb;
    inputScrollDrag = {
      pointerId: e.pointerId,
      offset: isThumb ? e.clientY - thumbRect.top : thumbRect.height / 2
    };
    inputScrollbar.setPointerCapture?.(e.pointerId);
    setInputScrollFromPointer(e.clientY, inputScrollDrag.offset);
    input.focus({ preventScroll: true });
  });
  inputScrollbar?.addEventListener('pointermove', e => {
    if (!inputScrollDrag || inputScrollDrag.pointerId !== e.pointerId) return;
    e.preventDefault();
    setInputScrollFromPointer(e.clientY, inputScrollDrag.offset);
  });
  inputScrollbar?.addEventListener('pointerup', e => {
    if (inputScrollDrag?.pointerId !== e.pointerId) return;
    inputScrollbar.releasePointerCapture?.(e.pointerId);
    inputScrollDrag = null;
  });
  inputScrollbar?.addEventListener('pointercancel', e => {
    if (inputScrollDrag?.pointerId === e.pointerId) {
      inputScrollDrag = null;
    }
  });
  inputScrollbar?.addEventListener('wheel', e => {
    e.preventDefault();
    const deltaScale = e.deltaMode === 1
      ? 16
      : e.deltaMode === 2
        ? input.clientHeight
        : 1;
    input.scrollTop += e.deltaY * deltaScale;
    input.focus({ preventScroll: true });
    syncInputScrollbar();
  }, { passive: false });

  if (narrowComposerQuery?.addEventListener) {
    narrowComposerQuery.addEventListener('change', resizeComposerInput);
  } else if (narrowComposerQuery?.addListener) {
    narrowComposerQuery.addListener(resizeComposerInput);
  }
  if (desktopGuideQuery?.addEventListener) {
    desktopGuideQuery.addEventListener('change', requestAnswerBoxHeightSync);
  } else if (desktopGuideQuery?.addListener) {
    desktopGuideQuery.addListener(requestAnswerBoxHeightSync);
  }
  titleShimmerWasInView = isGuideTitleInShimmerView();
  titleShimmerOnFirstScroll = titleShimmerWasInView;
  window.addEventListener('scroll', () => requestGuideTitleViewportShimmer(titleShimmerOnFirstScroll), { passive: true });
  window.addEventListener('resize', () => {
    resizeComposerInput();
    section.style.removeProperty('--ai-guide-content-min-height');
    requestAnswerBoxHeightSync();
    syncInputScrollbar();
    requestGuideTitleViewportShimmer(false);
  }, { passive: true });

  answerBox?.addEventListener('wheel', handleAnswerWheel, { passive: true });
  answerBox?.addEventListener('touchmove', markAnswerUserScrollIntent, { passive: true });
  answerBox?.addEventListener('pointerdown', e => {
    const rect = answerBox.getBoundingClientRect();
    if (e.clientX >= rect.right - 16) markAnswerUserScrollIntent();
  }, { passive: true });
  answerBox?.addEventListener('scroll', () => {
    if (answerProgrammaticScroll) {
      answerLastScrollTop = answerBox.scrollTop;
      return;
    }

    if (isAnswerNearBottom()) {
      answerAutoScroll = true;
    } else if (answerUserScrollIntent && answerBox.scrollTop < answerLastScrollTop - 2) {
      answerAutoScroll = false;
    }

    answerLastScrollTop = answerBox.scrollTop;
  }, { passive: true });

  section.querySelectorAll('[data-ai-prompt]').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.aiPrompt || '';
      syncSubmitState();
      setComposerOpen(true);
      const question = input.value;
      clearPromptInput();
      if (chip.dataset.aiPreset) {
        const preparedAnswer = getPreparedQuestionAnswer(chip);
        if (preparedAnswer) {
          answerPreparedQuestion(question, preparedAnswer, chip);
        } else {
          console.warn('AI guide prepared answer is missing:', chip.dataset.aiPreset);
        }
        return;
      }
      ask(question);
    });
  });

  routesPrevBtn?.addEventListener('click', () => scrollRoutes('prev'));
  routesNextBtn?.addEventListener('click', () => scrollRoutes('next'));
  routesBox.addEventListener('scroll', requestRoutesNavUpdate, { passive: true });
  window.addEventListener('resize', requestRoutesNavUpdate, { passive: true });

  routesBox.addEventListener('click', e => {
    const btn = e.target.closest('.ai-guide-route');
    if (!btn) return;
    const caseId = btn.dataset.aiCaseId;
    const routeType = btn.dataset.aiType || '';
    const card = caseId ? recommendationCards[caseId] : null;
    trackAiGuideRecommendationClick(btn, card);

    if (routeType === 'case' && openRecommendedCase(caseId)) {
      trackEvent(`ai guide case opened: ${caseId}`);
      return;
    }

    if ((routeType === 'video' || routeType === 'photo') && openRecommendedMedia(card)) {
      trackEvent(`ai guide media opened: ${caseId}`);
      return;
    }

    const target = caseId
      ? caseTargets.get(caseId)
      : document.getElementById(btn.dataset.aiTarget);
    if (!target) return;
    suppressCaseOnboardingForAiNavigation();
    if (typeof playUI === 'function') playUI('switch');
    scrollToRecommendedSection(target);
  });

  syncSubmitState();
  renderRoutes(['contacts']);
  resizeComposerInput();
  syncInputScrollbar();
}

initAiGuideDemo();

/* ─────────────────────────────────────────────
   STARFIELD with Mouse Gravity
───────────────────────────────────────────── */
const sf = document.getElementById('starfield');
const sfx = sf.getContext('2d');
let W = 0, H = 0;
let starfieldFrameId = null;
const STARFIELD_FRAME_MS = 1000 / 18;
let lastStarfieldDrawAt = 0;
let glowBrightness = 0;
const cursorGlow = {
  x: -999,
  y: -999,
  targetX: -999,
  targetY: -999,
  size: 0,
  opacity: 0,
  active: false,
  inputType: 'mouse'
};

function resizeSF() {
  W = sf.width  = window.innerWidth;
  H = sf.height = window.innerHeight;
}
resizeSF();
window.addEventListener('resize', () => {
  resizeSF();
  syncStars();
  if (isPartialMotionDisabled()) drawStaticStarfield();
});

function getStarCounts() {
  const baseTotal = 380;
  const baseStatic = 120;
  const areaScale = W > 1700 ? Math.max(1, (W * H) / (1700 * 950)) : 1;
  const total = Math.round(baseTotal * areaScale);
  const staticTotal = Math.round(baseStatic * areaScale);

  return { total, staticTotal };
}

function createStar(i, staticTotal) {
  const baseX = Math.random();
  const baseY = Math.random();
  const isStatic = i < staticTotal; // Keep part of stars static for visual balance
  const isTwinkling = !isStatic && Math.random() > 0.6; // 40% of moving stars twinkle

  return {
    baseX: baseX,
    baseY: baseY,
    x: baseX,
    y: baseY,
    r: Math.random() * 1.5 + 0.15,
    op: Math.random() * 0.8 + 0.1,
    sp: Math.random() * 0.0002 + 0.00003,
    ph: Math.random() * Math.PI * 2,
    vx: 0,
    vy: 0,
    isStatic: isStatic,
    isTwinkling: isTwinkling,
    scrollDepth: Math.random() * 10 + 0.2, // Parallax depth 0.2-1.0
    distToTarget: 999
  };
}

// Create stars with base positions for gravity effect
let stars = [];
function syncStars() {
  const { total, staticTotal } = getStarCounts();
  if (stars.length === total) return;
  stars = Array.from({length: total}, (_, i) => createStar(i, staticTotal));
}
syncStars();

// Beautiful falling comets
const comets = [];
function createComet() {
  const angle = Math.random() * Math.PI * 1.6 + Math.PI * 0.25; // More downward angles
  const speed = Math.random() * 0.0035 + 0.0018;
  const colors = [
    { core: [255, 150, 50], glow: [255, 120, 30], trail: [255, 180, 80] }, // Orange
    { core: [255, 200, 50], glow: [255, 200, 30], trail: [255, 220, 100] }, // Yellow
    { core: [255, 100, 80], glow: [255, 80, 60], trail: [255, 140, 100] }  // Red-orange
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    x: Math.random(),
    y: -0.18,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed + 0.0008, // Slight downward bias
    life: 1,
    color: color,
    size: Math.random() * 3 + 2,
    brightness: Math.random() * 0.4 + 0.8
  };
}

// // Spawn comets periodically
setInterval(() => {
  if (isPartialMotionDisabled()) {
    comets.length = 0;
    return;
  }
  if (comets.length < 6) {
    comets.push(createComet());
  }
}, 3200);

// More nebula clusters for realistic starfield + beautiful nebulae
const nebs = [
  {x:.82, y:.18, r:200, c:'rgba(61,111,255,0.035)'},
  {x:.18, y:.72, r:240, c:'rgba(136,51,255,0.025)'},
  {x:.55, y:.88, r:160, c:'rgba(0,255,170,0.02)'},
  {x:.35, y:.25, r:180, c:'rgba(61,111,255,0.02)'},
  {x:.75, y:.55, r:140, c:'rgba(136,51,255,0.015)'},
  {x:.15, y:.35, r:120, c:'rgba(0,255,170,0.015)'},
  {x:.90, y:.45, r:100, c:'rgba(61,111,255,0.018)'},
  {x:.45, y:.70, r:130, c:'rgba(136,51,255,0.012)'}
];

// Beautiful nebulae - minimal and elegant with strong scroll movement
const nebulae = [
  {x:.75, y:.20, baseX:.75, baseY:.20, r:380, dirX: -0.28, dirY: 0.15, drift: 0, driftSpeed: 0.00015, colors:[{stop:0, color:'rgba(136,51,255,0.24)'}, {stop:.3, color:'rgba(200,100,255,0.12)'}, {stop:1, color:'rgba(136,51,255,0)'}], scrollSpeed:0.18},
  {x:.20, y:.75, baseX:.20, baseY:.75, r:420, dirX: 0.32, dirY: -0.18, drift: 0, driftSpeed: 0.00012, colors:[{stop:0, color:'rgba(61,111,255,0.22)'}, {stop:.32, color:'rgba(100,150,255,0.11)'}, {stop:1, color:'rgba(61,111,255,0)'}], scrollSpeed:0.15},
  {x:.85, y:.65, baseX:.85, baseY:.65, r:350, dirX: -0.20, dirY: 0.25, drift: 0, driftSpeed: 0.00018, colors:[{stop:0, color:'rgba(255,100,150,0.2)'}, {stop:.38, color:'rgba(255,150,180,0.1)'}, {stop:1, color:'rgba(255,100,150,0)'}], scrollSpeed:0.2}
];

// Pointer mode: real mouse/fine pointers get the custom cursor; touch remains touch-safe on mobile and hybrids.
const desktopPointerQuery = window.matchMedia?.('(any-pointer: fine)');
const SYNTHETIC_MOUSE_WINDOW = 1600;

function isDesktopPointerEnvironment() {
  return Boolean(desktopPointerQuery?.matches);
}

let hasFinePointer = isDesktopPointerEnvironment();
let attractorSuppressed = false;
let lastTouchAt = 0;
let lastInputType = hasFinePointer ? 'mouse' : 'touch';

// Cursor state is intentionally initialized before syncPointerEnvironment() runs.
// Some media-query/resize callbacks can fire while the script is still booting.
var cRing = document.getElementById('curRing');
var cDot  = document.getElementById('curDot');
var mx = -100, my = -100, rx = -100, ry = -100;
var cursorLoopRunning = false;
var cursorFrameId = 0;
var customCursorSuppressed = false;
const CUSTOM_CURSOR_SUPPRESS_SELECTOR = [
  '.ai-guide-form',
  '.ai-guide-answer',
  '.ai-guide-message',
  '.ai-guide-message-scroll',
  '#aiGuideAnswerText',
  '.footer-form .ff-field',
  'input',
  'textarea',
  'select',
  '[contenteditable="true"]'
].join(', ');

const attractorInputs = {
  mouse: createAttractorInput(),
  touch: createAttractorInput()
};
const inputCaptureOptions = { passive: true, capture: true };
const ATTRACTOR_READY_DELAY = 0.5;

function createAttractorInput() {
  return {
    x: -999,
    y: -999,
    lastX: -999,
    lastY: -999,
    idleTime: 0,
    isIdle: false,
    stoppedTime: 0,
    lastAt: 0,
    seen: false
  };
}

function syncPointerEnvironment() {
  hasFinePointer = isDesktopPointerEnvironment();
  const isTouchOnlyTools = !hasFinePointer;
  const isUsingTouch = isTouchOnlyTools || lastInputType === 'touch';
  document.documentElement.classList.toggle('touch-only-tools', isTouchOnlyTools);
  document.documentElement.classList.toggle('using-touch', isUsingTouch);
  document.body.classList.toggle('touch-only-tools', isTouchOnlyTools);
  document.body.classList.toggle('using-touch', isUsingTouch);
  if (typeof syncCustomCursorState === 'function') syncCustomCursorState();
}

if (desktopPointerQuery?.addEventListener) {
  desktopPointerQuery.addEventListener('change', syncPointerEnvironment);
} else if (desktopPointerQuery?.addListener) {
  desktopPointerQuery.addListener(syncPointerEnvironment);
}
syncPointerEnvironment();

function isLikelySyntheticMouseEvent(e) {
  if (!e) return true;
  if (e.pointerType && e.pointerType !== 'mouse') return true;
  if (e.sourceCapabilities?.firesTouchEvents) return true;
  if (!lastTouchAt) return false;
  return performance.now() - lastTouchAt <= SYNTHETIC_MOUSE_WINDOW;
}

function isRealMouseEvent(e) {
  if (!hasFinePointer) return false;
  return !isLikelySyntheticMouseEvent(e);
}

function canUseMouseCursorEvent(e) {
  return isRealMouseEvent(e);
}

function setCursorGlowTarget(type, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  cursorGlow.inputType = type;
  cursorGlow.targetX = x;
  cursorGlow.targetY = y;
  if (cursorGlow.x < -900 || cursorGlow.y < -900) {
    cursorGlow.x = x;
    cursorGlow.y = y;
  }
  cursorGlow.active = true;
  requestStarfieldInputFrame();
}

function releaseCursorGlow() {
  cursorGlow.active = false;
  requestStarfieldInputFrame();
}

function resetCursorGlow() {
  glowBrightness = 0;
  cursorGlow.x = -999;
  cursorGlow.y = -999;
  cursorGlow.targetX = -999;
  cursorGlow.targetY = -999;
  cursorGlow.size = 0;
  cursorGlow.opacity = 0;
  cursorGlow.active = false;
}

function drawCursorGlow(motionOff) {
  if (motionOff) {
    resetCursorGlow();
    return;
  }

  const targetSize = cursorGlow.active
    ? (cursorGlow.inputType === 'touch' ? 74 : 58)
    : 0;
  const targetOpacity = cursorGlow.active
    ? (cursorGlow.inputType === 'touch' ? 0.34 : 0.42)
    : 0;

  if (cursorGlow.active) {
    cursorGlow.x = cursorGlow.targetX;
    cursorGlow.y = cursorGlow.targetY;
    cursorGlow.size += (targetSize - cursorGlow.size) * 0.3;
    cursorGlow.opacity += (targetOpacity - cursorGlow.opacity) * 0.22;
    glowBrightness += (1 - glowBrightness) * 0.2;
  } else {
    // Fade mainly by size first; opacity follows after the glow has collapsed.
    cursorGlow.size *= 0.84;
    const opacityFade = cursorGlow.size > 18 ? 0.965 : 0.82;
    cursorGlow.opacity *= opacityFade;
    glowBrightness *= 0.86;
  }

  if (cursorGlow.size < 0.7 && cursorGlow.opacity < 0.01) {
    cursorGlow.size = 0;
    cursorGlow.opacity = 0;
    return;
  }

  if (cursorGlow.x < -900 || cursorGlow.y < -900) return;

  const glowSize = Math.max(1, cursorGlow.size * (0.84 + glowBrightness * 0.16));
  const glowOpacity = Math.max(0, Math.min(0.65, cursorGlow.opacity));
  const g = sfx.createRadialGradient(cursorGlow.x, cursorGlow.y, 0, cursorGlow.x, cursorGlow.y, glowSize);
  g.addColorStop(0, `rgba(220, 240, 255, ${glowOpacity})`);
  g.addColorStop(0.42, `rgba(100, 150, 255, ${glowOpacity * 0.45})`);
  g.addColorStop(1, 'rgba(61, 111, 255, 0)');
  sfx.fillStyle = g;
  sfx.beginPath();
  sfx.arc(cursorGlow.x, cursorGlow.y, glowSize, 0, Math.PI * 2);
  sfx.fill();
}

function requestStarfieldInputFrame() {
  if (isPartialMotionDisabled()) return;
  lastStarfieldDrawAt = 0;
  scheduleStarfieldFrame();
}

function suppressAttractorAtCurrentFrame() {
  attractorSuppressed = true;
  releaseCursorGlow();
  requestStarfieldInputFrame();
}

function setAttractorInput(type, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const input = attractorInputs[type];
  const now = performance.now();
  input.x = x;
  input.y = y;
  input.stoppedTime = 0;
  input.idleTime = 0;
  input.isIdle = false;
  input.lastAt = now;
  input.seen = true;
  lastInputType = type;
  attractorSuppressed = false;

  if (type === 'touch') {
    lastTouchAt = now;
    document.documentElement.classList.add('using-touch');
    document.body.classList.add('using-touch');
  } else {
    document.documentElement.classList.remove('using-touch');
    document.body.classList.remove('using-touch');
  }

  setCursorGlowTarget(type, x, y);
  return true;
}

function activateMouseInput(e) {
  if (!canUseMouseCursorEvent(e)) return false;
  if (shouldSuppressCustomCursor(e.target)) {
    suppressAttractorAtCurrentFrame();
    return false;
  }
  return setAttractorInput('mouse', e.clientX, e.clientY);
}

function getTouchPointFromEvent(e) {
  const changed = e.changedTouches;
  const active = e.touches;
  if ((e.type === 'touchstart' || e.type === 'touchmove') && active?.length) {
    return active[active.length - 1];
  }
  if (changed?.length) return changed[changed.length - 1];
  if (active?.length) return active[active.length - 1];
  return null;
}

function activateTouchInputAt(x, y) {
  return setAttractorInput('touch', x, y);
}

function activateTouchInput(e) {
  if (shouldSuppressCustomCursor(e.target)) {
    suppressAttractorAtCurrentFrame();
    return false;
  }
  const touch = getTouchPointFromEvent(e);
  if (!touch) return false;
  return activateTouchInputAt(touch.clientX, touch.clientY);
}

function activateTouchPointerInput(e) {
  if (e.pointerType === 'mouse') return false;
  if (shouldSuppressCustomCursor(e.target)) {
    suppressAttractorAtCurrentFrame();
    return false;
  }
  return activateTouchInputAt(e.clientX, e.clientY);
}

document.addEventListener('mousemove', activateMouseInput, inputCaptureOptions);
document.addEventListener('mousedown', activateMouseInput, inputCaptureOptions);
document.addEventListener('mouseover', activateMouseInput, inputCaptureOptions);
document.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') activateMouseInput(e);
  else activateTouchPointerInput(e);
}, inputCaptureOptions);
document.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse') activateMouseInput(e);
  else activateTouchPointerInput(e);
}, inputCaptureOptions);

// Touch events for mobile
document.addEventListener('touchstart', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchmove', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchend', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchcancel', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchend', releaseCursorGlow, inputCaptureOptions);
document.addEventListener('touchcancel', releaseCursorGlow, inputCaptureOptions);
document.addEventListener('pointerup', e => {
  if (e.pointerType && e.pointerType !== 'mouse') releaseCursorGlow();
}, inputCaptureOptions);
document.addEventListener('pointercancel', e => {
  if (e.pointerType && e.pointerType !== 'mouse') releaseCursorGlow();
}, inputCaptureOptions);

function updateAttractorIdle(input) {
  if (!input.seen) return;

  if (input.x === input.lastX && input.y === input.lastY) {
    input.idleTime += 0.2;
    input.stoppedTime += 0.2;
    if (input.idleTime > 0.3) {
      input.isIdle = true;
    }
  } else {
    input.lastX = input.x;
    input.lastY = input.y;
    input.idleTime = 0;
    input.isIdle = false;
    input.stoppedTime = 0;
  }
}

// Check if the latest mouse/touch point is idle
setInterval(() => {
  updateAttractorIdle(attractorInputs.mouse);
  updateAttractorIdle(attractorInputs.touch);
}, 200);

function getReadyAttractor() {
  if (attractorSuppressed) return null;

  const latest = attractorInputs[lastInputType];
  if (
    latest?.seen &&
    (!latest.isIdle || latest.stoppedTime <= ATTRACTOR_READY_DELAY)
  ) {
    return null;
  }

  return Object.entries(attractorInputs)
    .filter(([, input]) => (
      input.seen &&
      input.isIdle &&
      input.x > -999 &&
      input.stoppedTime > ATTRACTOR_READY_DELAY
    ))
    .sort((a, b) => b[1].lastAt - a[1].lastAt)[0]?.[1] ?? null;
}

function scheduleStarfieldFrame() {
  if (starfieldFrameId !== null) return;
  starfieldFrameId = requestAnimationFrame(drawSF);
}

function drawStaticStarfield() {
  if (starfieldFrameId !== null) {
    cancelAnimationFrame(starfieldFrameId);
    starfieldFrameId = null;
  }
  lastStarfieldDrawAt = 0;
  drawSF(performance.now());
}

function drawSF(t) {
  starfieldFrameId = null;
  const motionOff = isPartialMotionDisabled();
  if (!motionOff && t - lastStarfieldDrawAt < STARFIELD_FRAME_MS) {
    scheduleStarfieldFrame();
    return;
  }
  lastStarfieldDrawAt = t;

  sfx.clearRect(0, 0, W, H);
  if (motionOff) {
    comets.length = 0;
    attractorSuppressed = false;
  }
  
  // Draw nebula clusters
  const bgNebWidth = Math.min(W, 1700);
  const bgNebOffsetX = (W - bgNebWidth) / 2;
  const bgNebHeight = Math.min(H, 1500);
  const bgNebLift = H > 1500 ? 100 : 0;
  nebs.forEach(n => {
    const bgNebX = bgNebOffsetX + n.x * bgNebWidth;
    const bgNebY = n.y * bgNebHeight - bgNebLift;
    const g = sfx.createRadialGradient(bgNebX, bgNebY, 0, bgNebX, bgNebY, n.r);
    g.addColorStop(0, n.c); g.addColorStop(1, 'rgba(0,0,0,0)');
    sfx.fillStyle = g;
    sfx.beginPath(); sfx.arc(bgNebX, bgNebY, n.r, 0, Math.PI*2); sfx.fill();
  });
  
  // Draw falling comets with elegant trails
  if (!motionOff) for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];
    c.x += c.vx;
    c.y += c.vy;
    c.life -= 0.008; // Smooth fade
    
    if (c.life <= 0) {
      comets.splice(i, 1);
      continue;
    }
    
    const screenX = c.x * W;
    const screenY = c.y * H;
    const lifeAlpha = Math.pow(c.life, 1.2); // Smooth curve fade
    
    // Calculate trail direction (opposite to velocity) - MUCH LONGER
    const trailDist = 650 * lifeAlpha; // Very long visible trail
    const trailEndX = screenX - c.vx * trailDist * 80;
    const trailEndY = screenY - c.vy * trailDist * 80;
    
    // Get RGB components
    const [r, g, b] = c.color.trail;
    
    // Draw long gradient trail with multiple layers for smooth blur effect
    const trailGradient = sfx.createLinearGradient(screenX, screenY, trailEndX, trailEndY);
    trailGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${lifeAlpha})`);
    trailGradient.addColorStop(0.05, `rgba(255, 210, 120, ${lifeAlpha * 0.85})`);
    trailGradient.addColorStop(0.12, `rgba(255, 190, 100, ${lifeAlpha * 0.72})`);
    trailGradient.addColorStop(0.2, `rgba(255, 170, 85, ${lifeAlpha * 0.6})`);
    trailGradient.addColorStop(0.32, `rgba(255, 150, 70, ${lifeAlpha * 0.42})`);
    trailGradient.addColorStop(0.5, `rgba(230, 120, 55, ${lifeAlpha * 0.25})`);
    trailGradient.addColorStop(0.7, `rgba(210, 100, 45, ${lifeAlpha * 0.12})`);
    trailGradient.addColorStop(0.9, `rgba(190, 80, 40, ${lifeAlpha * 0.04})`);
    trailGradient.addColorStop(1, 'rgba(170, 70, 35, 0)');
    
    sfx.strokeStyle = trailGradient;
    sfx.lineWidth = Math.max(5.5, (c.size * 3.2 + Math.max(0, c.size - 3) * 1.6) * lifeAlpha);
    sfx.lineCap = 'round';
    sfx.lineJoin = 'round';
    sfx.shadowColor = `rgba(255, 140, 80, ${lifeAlpha * 0.5})`;
    sfx.shadowBlur = 18 + Math.max(0, c.size - 3) * 22;
    sfx.shadowOffsetX = 0;
    sfx.shadowOffsetY = 0;
    sfx.beginPath();
    sfx.moveTo(screenX, screenY);
    sfx.lineTo(trailEndX, trailEndY);
    sfx.stroke();
    sfx.shadowColor = 'rgba(0,0,0,0)';
    sfx.shadowBlur = 0;
    
    // Draw glowing halo around comet
    const [hr, hg, hb] = c.color.glow;
    const haloGradient = sfx.createRadialGradient(screenX, screenY, 0, screenX, screenY, c.size * 12);
    haloGradient.addColorStop(0, `rgba(${hr}, ${hg}, ${hb}, ${lifeAlpha * 0.5})`);
    haloGradient.addColorStop(0.3, `rgba(${hr}, ${hg}, ${hb}, ${lifeAlpha * 0.15})`);
    haloGradient.addColorStop(1, 'rgba(255, 150, 80, 0)');
    sfx.fillStyle = haloGradient;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 12, 0, Math.PI * 2);
    sfx.fill();
    
    // Draw bright comet core
    const [cr, cg, cb] = c.color.core;
    const coreGradient = sfx.createRadialGradient(screenX, screenY, 0, screenX, screenY, c.size * 4);
    coreGradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${lifeAlpha})`);
    coreGradient.addColorStop(0.5, `rgba(255, 200, 100, ${lifeAlpha * 0.6})`);
    coreGradient.addColorStop(1, 'rgba(255, 180, 100, 0)');
    sfx.fillStyle = coreGradient;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 4, 0, Math.PI * 2);
    sfx.fill();
    
    // Draw bright center point
    sfx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${lifeAlpha})`;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 0.8, 0, Math.PI * 2);
    sfx.fill();
  }
  
  // Draw stars with gravity effect around the latest idle mouse/touch point.
  const attractor = motionOff ? null : getReadyAttractor();
  const attractorX = attractor?.x ?? -999;
  const attractorY = attractor?.y ?? -999;
  const isAttractorIdle = Boolean(attractor);
  const attractorStoppedTime = attractor?.stoppedTime ?? 0;
  
  const cursorXNorm = attractorX / W;
  const cursorYNorm = attractorY / H;
  
  stars.forEach(s => {
    if (motionOff) {
      // Animation-lite mode: stars stay as a pure static background.
      s.x = s.baseX;
      s.y = s.baseY;
      s.vx = 0;
      s.vy = 0;
      s.distToTarget = 999;
    } else if (s.isStatic) {
      // Static stars don't move
      s.x = s.baseX;
      s.y = s.baseY;
    } else if (isAttractorIdle && attractorX > -999 && attractorStoppedTime > ATTRACTOR_READY_DELAY) {
      // VERY slow gravity pull - approximately 120-180 seconds to reach attractor
      const distX = cursorXNorm - s.baseX;
      const distY = cursorYNorm - s.baseY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      s.distToTarget = distance;
      
      if (distance > 0.01) {
        const angle = Math.atan2(distY, distX);
        // Ultra-small acceleration for 3-4 minute approach (slower gravity)
        const accel = Math.max(0, 1 - distance * 0.7) * 0.000015;
        s.vx += Math.cos(angle) * accel;
        s.vy += Math.sin(angle) * accel;
      }
      
      s.vx *= 0.992; // Very high damping for super smooth motion
      s.vy *= 0.992;
      s.x += s.vx;
      s.y += s.vy;
    } else {
      // Return to base position when attractor moves or not idle
      const returnSpeed = 0.02; // Slower return for smoothness
      s.x += (s.baseX - s.x) * returnSpeed;
      s.y += (s.baseY - s.y) * returnSpeed;
      s.vx *= 0.88;
      s.vy *= 0.88;
      s.distToTarget = 999;
    }
  });
  
  drawCursorGlow(motionOff);
  
  // Draw individual stars with parallax and twinkling
  const scrollY = window.scrollY || 0;
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  
  stars.forEach(s => {
    // Calculate parallax offset
    const parallaxOffset = motionOff ? 0 : (scrollY / maxScroll) * H * (1 - s.scrollDepth) * 0.08;
    
    let fl = 1;
    if (!motionOff && s.isTwinkling) {
      // Beautiful smooth twinkling with easing
      const twinklePeriod = 3000 + (s.ph % 2000);
      const twinkling = Math.sin(t * 0.001 * (2000 / twinklePeriod) + s.ph) * 0.35 + 0.65;
      fl = twinkling;
    } else if (!motionOff) {
      fl = Math.sin(t * s.sp * 1000 + s.ph) * 0.25 + 0.75;
    }
    
    const opacity = motionOff ? s.op : (s.isStatic ? s.op : s.op * fl);
    sfx.beginPath();
    sfx.arc(s.x * W, s.y * H + parallaxOffset, s.r, 0, Math.PI * 2);
    sfx.fillStyle = `rgba(200, 200, 255, ${opacity})`;
    sfx.fill();
  });
  
  // Draw beautiful nebulae with parallax and adaptive speed based on screen width
  const referenceWidth = 1440; // Base resolution for consistent timing across screens
  // Adaptive smoothness: smaller screens get smoother (slower) exit, larger screens faster
  const screenWidthFactor = Math.min(1, W / referenceWidth); // 0.24 on 350px, 1.0 on 1440px
  const smoothnessFactor = 0.4 + screenWidthFactor * 0.6; // 0.4-1.0 multiplier
  const nebulaWidth = Math.min(W, 1700);
  const nebulaOffsetX = (W - nebulaWidth) / 2;
  const nebulaHeight = Math.min(H, 1500);
  const nebulaLift = H > 1500 ? 100 : 0;
  const nebulaBlurScale = W > 1700 ? 1.55 : 1;
  const nebulaOpacityScale = W > 1700 ? 0.65 : 1;
  
  nebulae.forEach(neb => {
    // Update drift for organic micro-movement
    if (motionOff) {
      neb.drift = 0;
    } else {
      neb.drift += (Math.random() - 0.5) * neb.driftSpeed;
      neb.drift *= 0.98; // Damping
    }
    
    const scrollProgress = motionOff ? 0 : scrollY / maxScroll;
    const nebulaScrollFade = W > 1700 ? Math.max(0, 1 - scrollProgress * 4) : 1;
    
    // Adaptive movement speed based on screen width
    const baseMovement = scrollProgress * neb.dirX * 40 * smoothnessFactor;
    const parallaxNebX = nebulaOffsetX + neb.baseX * nebulaWidth + baseMovement * referenceWidth + neb.drift * nebulaWidth * 0.08;
    const parallaxNebY = neb.baseY * nebulaHeight - nebulaLift - (scrollProgress * nebulaHeight * neb.scrollSpeed * 0.35) + (scrollProgress * nebulaHeight * neb.dirY * 1.6);
    const nebulaRadius = neb.r * nebulaBlurScale;
    
    const nebGradient = sfx.createRadialGradient(
      parallaxNebX, parallaxNebY, 0,
      parallaxNebX, parallaxNebY, nebulaRadius
    );
    
    neb.colors.forEach(c => {
      const nebulaColor = c.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/, (_, r, g, b, a) => `rgba(${r},${g},${b},${parseFloat(a) * nebulaOpacityScale * nebulaScrollFade})`);
      nebGradient.addColorStop(c.stop, nebulaColor);
    });
    
    sfx.fillStyle = nebGradient;
    sfx.beginPath();
    sfx.arc(parallaxNebX, parallaxNebY, nebulaRadius, 0, Math.PI * 2);
    sfx.fill();
  });
  
  if (!motionOff) scheduleStarfieldFrame();
}
scheduleStarfieldFrame();

/* ─────────────────────────────────────────────
   CURSOR
───────────────────────────────────────────── */
cRing = cRing || document.getElementById('curRing');
cDot  = cDot  || document.getElementById('curDot');

function isCustomCursorEnabled() {
  return hasFinePointer && !isPartialMotionDisabled() && !customCursorSuppressed;
}

function shouldSuppressCustomCursor(target) {
  return Boolean(target?.closest?.(CUSTOM_CURSOR_SUPPRESS_SELECTOR));
}

function syncCustomCursorSuppression(target) {
  const shouldSuppress = shouldSuppressCustomCursor(target);
  if (customCursorSuppressed === shouldSuppress) return;

  customCursorSuppressed = shouldSuppress;
  attractorSuppressed = shouldSuppress;
  if (shouldSuppress) {
    stopCustomCursorLoop();
  } else {
    syncCustomCursorState();
  }
}

function setCursorElementsVisible(visible) {
  if (!cRing || !cDot) return;
  cRing.style.display = visible ? '' : 'none';
  cDot.style.display = visible ? '' : 'none';
  cRing.style.opacity = visible ? '' : '0';
  cDot.style.opacity = visible ? '' : '0';
}

function moveCursorTo(x, y, shouldSnap = false) {
  if (!isCustomCursorEnabled()) return;
  mx = x;
  my = y;
  if (shouldSnap) {
    rx = x;
    ry = y;
  }
  startCustomCursorLoop();
}

function startCustomCursorLoop() {
  if (!cRing || !cDot || cursorLoopRunning || !isCustomCursorEnabled()) return;
  cursorLoopRunning = true;
  setCursorElementsVisible(true);
  cursorFrameId = requestAnimationFrame(loopCursor);
}

function stopCustomCursorLoop() {
  cursorLoopRunning = false;
  if (cursorFrameId) {
    cancelAnimationFrame(cursorFrameId);
    cursorFrameId = 0;
  }
  setCursorElementsVisible(false);
}

function syncCustomCursorState() {
  if (isCustomCursorEnabled()) {
    setCursorElementsVisible(true);
    startCustomCursorLoop();
  } else {
    stopCustomCursorLoop();
  }
}

document.addEventListener('mousemove', e => {
  syncCustomCursorSuppression(e.target);
  if (!activateMouseInput(e) || !isCustomCursorEnabled()) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('mousedown', e => {
  syncCustomCursorSuppression(e.target);
  if (!activateMouseInput(e) || !isCustomCursorEnabled()) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('mouseover', e => {
  syncCustomCursorSuppression(e.target);
  if (!activateMouseInput(e) || !isCustomCursorEnabled()) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('pointermove', e => {
  syncCustomCursorSuppression(e.target);
  if (e.pointerType !== 'mouse' || !activateMouseInput(e) || !isCustomCursorEnabled()) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('pointerdown', e => {
  syncCustomCursorSuppression(e.target);
  if (e.pointerType !== 'mouse' || !activateMouseInput(e) || !isCustomCursorEnabled()) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);

document.addEventListener('focusin', e => {
  syncCustomCursorSuppression(e.target);
}, true);

document.addEventListener('focusout', () => {
  setTimeout(() => syncCustomCursorSuppression(document.activeElement), 0);
}, true);

// Lag ring — runs only when heavy animations are enabled.
function loopCursor() {
  if (!cursorLoopRunning || !isCustomCursorEnabled() || !cRing || !cDot) {
    stopCustomCursorLoop();
    return;
  }

  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cDot.style.left = `${mx}px`;
  cDot.style.top = `${my}px`;
  cRing.style.left = `${rx}px`;
  cRing.style.top = `${ry}px`;
  cRing.style.width = '30px';
  cRing.style.height = '30px';
  cursorFrameId = requestAnimationFrame(loopCursor);
}

syncCustomCursorState();

document.addEventListener('mousedown', e => {
  if (!isCustomCursorEnabled() || !cRing || isLikelySyntheticMouseEvent(e)) return;
  cRing.style.transform = 'translate(-50%,-50%) scale(.82)';
}, inputCaptureOptions);
document.addEventListener('mouseup', e => {
  if (!isCustomCursorEnabled() || !cRing || isLikelySyntheticMouseEvent(e)) return;
  cRing.style.transform = 'translate(-50%,-50%) scale(1)';
}, inputCaptureOptions);

/* ─────────────────────────────────────────────
   SCROLL PROGRESS
───────────────────────────────────────────── */
const pb = document.getElementById('pb');
let scrollProgressRaf = null;

function updateScrollProgress() {
  if (!pb) return;
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  pb.style.width = pct + '%';
}

function requestScrollProgressUpdate() {
  if (scrollProgressRaf) return;
  scrollProgressRaf = requestAnimationFrame(() => {
    scrollProgressRaf = null;
    updateScrollProgress();
  });
}

window.addEventListener('scroll', requestScrollProgressUpdate, { passive:true });
window.addEventListener('resize', requestScrollProgressUpdate, { passive:true });
updateScrollProgress();

/* ─────────────────────────────────────────────
   TOOLS
───────────────────────────────────────────── */
const toolBtns = document.querySelectorAll('.tool-btn[data-tool]');
const works    = document.querySelectorAll('.work');
const workVisuals = Array.from(works, work => work.querySelector('.work-visual')).filter(Boolean);

function setTool(id) {
  activeTool = id;
  const t = TOOLS[id];
  toolBtns.forEach(b => b.classList.toggle('active', b.dataset.tool === id));
  document.documentElement.style.setProperty('--ion', t.color);
  document.documentElement.style.setProperty('--ion-glow', t.glow);
  playUI('switch');
}

toolBtns.forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));

/* ─────────────────────────────────────────────
   3D TILT + TOOL OVERLAY
───────────────────────────────────────────── */
works.forEach((work, i) => {
  const vis  = work.querySelector('.work-visual');
  const inn  = work.querySelector('.wv-inner');
  const ov   = work.querySelector('.wv-overlay');
  const ovl  = work.querySelector('.ov-label');
  const ovt  = work.querySelector('.ov-text');
  vis.addEventListener('mouseenter', e => {
    if (!isRealMouseEvent(e)) return;
    playUI('hover');
    showWorkOverlay();
  });

  function showWorkOverlay() {
    const tc = TOOLS[activeTool];
    ovl.textContent = tc.label;
    ovl.style.color = tc.color;
    ovt.textContent = work.dataset[activeTool];
    ov.classList.add('show');
    const aspectKey = `${activeTool}:${i}`;
    if (!watchedCaseAspects.has(aspectKey)) {
      watchedCaseAspects.add(aspectKey);
      trackEvent(`${activeTool} case ${getWorkTitle(work)} watched`);
    }
  }

  vis.addEventListener('mousemove', e => {
    if (!isRealMouseEvent(e)) return;

    // In motion-lite the overlay is handled by mouseenter/click.
    // Do not run per-frame tilt calculations on every mousemove.
    if (isPartialMotionDisabled()) return;

    const r  = vis.getBoundingClientRect();
    const x  = (e.clientX - r.left)  / r.width  - 0.5;
    const y  = (e.clientY - r.top)   / r.height - 0.5;
    const tx = y * -8, ty = x * 8;
    vis.style.transform  = `perspective(820px) rotateX(${tx}deg) rotateY(${ty}deg) translateZ(10px)`;
    inn.style.transform  = `translateX(${x * -7}px) translateY(${y * -7}px)`;

    showWorkOverlay();
  });

  vis.addEventListener('touchstart', () => {
    playUI('hover');
    showWorkOverlay();
    if (document.getElementById('tip4')?.classList.contains('show')) {
      trackEventOnce('case-onboarding-step-3-action', 'case onboarding step 3 action');
      setTimeout(() => showTip(5), 900);
    }
  }, { passive: true });

  vis.addEventListener('click', e => {
    if (!isRealMouseEvent(e)) return;
    showWorkOverlay();
  });

  vis.addEventListener('mouseleave', e => {
    if (!isRealMouseEvent(e)) return;
    vis.style.transform = 'perspective(820px) rotateX(0) rotateY(0) translateZ(0)';
    inn.style.transform = 'none';
    ov.classList.remove('show');
  });
});

function clearWorkVisualStates() {
  works.forEach(work => {
    const vis = work.querySelector('.work-visual');
    const inn = work.querySelector('.wv-inner');
    const ov = work.querySelector('.wv-overlay');
    if (!vis || !inn || !ov) return;
    vis.style.transform = 'perspective(820px) rotateX(0) rotateY(0) translateZ(0)';
    inn.style.transform = 'none';
    ov.classList.remove('show');
  });
}

document.addEventListener('touchstart', e => {
  if (e.target?.closest?.('.work-visual')) return;
  clearWorkVisualStates();
}, inputCaptureOptions);

/* ─────────────────────────────────────────────
   PARALLAX SCROLL REVEAL - REPEATING FOR WORKS
───────────────────────────────────────────── */
if ('IntersectionObserver' in window) {
  const workObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      } else {
        e.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  works.forEach(w => workObs.observe(w));
} else {
  works.forEach(w => w.classList.add('visible'));
}

/* ─────────────────────────────────────────────
   PARALLAX REVEAL FOR MOTION (EARLY)
───────────────────────────────────────────── */
const motionCardsForReveal = document.querySelectorAll('.motion-card');
if ('IntersectionObserver' in window) {
  const motionParallaxObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('parallax-visible');
      } else {
        e.target.classList.remove('parallax-visible');
      }
    });
  }, { threshold: 0.0, rootMargin: '10px 0px' });

  // Observe motion cards with early trigger
  motionCardsForReveal.forEach(card => motionParallaxObs.observe(card));
} else {
  motionCardsForReveal.forEach(card => card.classList.add('parallax-visible'));
}

/* ─────────────────────────────────────────────
   PARALLAX REVEAL FOR PRINTED & SOCIAL
───────────────────────────────────────────── */
const printedItemsForReveal = document.querySelectorAll('.printed-item');
const socialPostsForReveal = document.querySelectorAll('.social-post');
if ('IntersectionObserver' in window) {
  const parallaxElementsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('parallax-visible');
      } else {
        e.target.classList.remove('parallax-visible');
      }
    });
  }, { threshold: 0.0 });

  // Observe printed items
  printedItemsForReveal.forEach(item => parallaxElementsObs.observe(item));
  // Observe social posts
  socialPostsForReveal.forEach(post => parallaxElementsObs.observe(post));
} else {
  printedItemsForReveal.forEach(item => item.classList.add('parallax-visible'));
  socialPostsForReveal.forEach(post => post.classList.add('parallax-visible'));
}

/* ─────────────────────────────────────────────
   MEDIA PRELOADERS
───────────────────────────────────────────── */
const MEDIA_LOADBOX_SELECTORS = [
  '.wv-media',
  '.motion-card-media',
  '.printed-visual',
  '.post-visual',
  '.expandable-media-container',
  '.float-panel-content'
];

function getMediaLoadbox(media) {
  const box = media.closest(MEDIA_LOADBOX_SELECTORS.join(','));
  if (box) return box;

  const narratorText = document.getElementById('narText');
  if (narratorText?.contains(media) && media.parentElement) {
    const parent = media.parentElement;
    if (parent.tagName === 'SPAN' && parent.parentElement === narratorText) {
      syncNarratorInlineMediaSpacing(media, parent);
      parent.classList.add('nar-inline-media-loadbox', 'nar-generated-media-loadbox');
    }
    return parent;
  }

  return null;
}

function syncNarratorInlineMediaSpacing(media, box) {
  if (!media || !box || box.dataset.narSpacingSynced === '1') return;
  const style = window.getComputedStyle?.(media);
  box.style.marginTop = media.style.marginTop || style?.marginTop || '0px';
  box.style.marginRight = media.style.marginRight || style?.marginRight || '0px';
  box.style.marginBottom = media.style.marginBottom || style?.marginBottom || '0px';
  box.style.marginLeft = media.style.marginLeft || style?.marginLeft || '0px';
  box.dataset.narSpacingSynced = '1';
}

function isMediaReady(media) {
  if (media.tagName === 'IMG') return media.complete && media.naturalWidth > 0;
  if (media.tagName === 'VIDEO') return media.readyState >= 2;
  return true;
}

function updateMediaLoadbox(media, state) {
  const box = getMediaLoadbox(media);
  if (!box) return;

  box.classList.add('media-loadbox');
  box.classList.toggle('media-loading', state === 'loading');
  box.classList.toggle('media-error', state === 'error');
}

function syncMediaLoadbox(media) {
  const box = getMediaLoadbox(media);
  if (!box) return;

  const mediaItems = Array.from(box.querySelectorAll('img, video'));

  if (mediaItems.some(item => item.dataset.preloaderError === '1')) {
    updateMediaLoadbox(media, 'error');
    return;
  }

  if (mediaItems.length && mediaItems.every(isMediaReady)) {
    updateMediaLoadbox(media, 'ready');
  } else {
    updateMediaLoadbox(media, 'loading');
  }
}

function prepareMediaPreloader(media) {
  if (!media || media.dataset.preloaderReady === '1') return;
  media.dataset.preloaderReady = '1';

  const hasDeferredSource = Boolean(media.dataset.bgSrc || media.querySelector?.('source[data-bg-src]'));
  const hasImmediateSource = Boolean(media.currentSrc || media.src || media.querySelector?.('source[src]'));

  if (!isMediaReady(media) || hasDeferredSource || !hasImmediateSource) {
    updateMediaLoadbox(media, 'loading');
  }

  const markReady = () => {
    media.dataset.preloaderError = '0';
    syncMediaLoadbox(media);
  };
  const markError = () => {
    media.dataset.preloaderError = '1';
    updateMediaLoadbox(media, 'error');
  };

  if (media.tagName === 'IMG') {
    media.addEventListener('load', markReady, { once: true });
    media.addEventListener('error', markError, { once: true });
  } else if (media.tagName === 'VIDEO') {
    media.addEventListener('loadeddata', markReady, { once: true });
    media.addEventListener('canplay', markReady, { once: true });
    media.addEventListener('error', markError, { once: true });
  }

  if (isMediaReady(media) && hasImmediateSource && !hasDeferredSource) {
    markReady();
  }
}

function initMediaPreloaders(root = document) {
  root.querySelectorAll?.('img, video').forEach(prepareMediaPreloader);
}

initMediaPreloaders();

/* ─────────────────────────────────────────────
   VIEWPORT VIDEO PLAYBACK
───────────────────────────────────────────── */
const VIEWPORT_VIDEO_EXCLUDE_SELECTOR = '#narrator, #floatPanel';
const VIEWPORT_VIDEO_SELECTOR = 'video[data-viewport-video]';
const viewportManagedVideos = new Set();
const viewportVideoVisibility = new WeakMap();
let viewportVideoLoadObserver = null;
let viewportVideoObserver = null;
let viewportVideoFallbackRaf = null;

function isViewportVideoExcluded(video) {
  return Boolean(video.closest?.(VIEWPORT_VIDEO_EXCLUDE_SELECTOR));
}

function isVideoInViewport(video) {
  if (!video.isConnected || isViewportVideoExcluded(video)) return false;
  const rect = video.getBoundingClientRect();
  return rect.width > 0
    && rect.height > 0
    && rect.bottom > 0
    && rect.right > 0
    && rect.top < window.innerHeight
    && rect.left < window.innerWidth;
}

function hydrateDeferredVideo(video) {
  let shouldLoad = false;

  if (video.dataset.bgSrc) {
    video.setAttribute('src', video.dataset.bgSrc);
    video.removeAttribute('data-bg-src');
    shouldLoad = true;
  }

  video.querySelectorAll?.('source[data-bg-src]').forEach(source => {
    source.setAttribute('src', source.dataset.bgSrc);
    source.removeAttribute('data-bg-src');
    shouldLoad = true;
  });

  if (shouldLoad) {
    updateMediaLoadbox(video, 'loading');
    video.load();
  }
}

function ensureViewportVideoLoadObserver() {
  if (viewportVideoLoadObserver || !('IntersectionObserver' in window)) {
    return viewportVideoLoadObserver;
  }

  viewportVideoLoadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      hydrateDeferredVideo(entry.target);
      viewportVideoLoadObserver.unobserve(entry.target);
    });
  }, { rootMargin: '120px 0px', threshold: 0 });

  return viewportVideoLoadObserver;
}

function syncViewportVideo(video, visible = isVideoInViewport(video)) {
  if (!video || !video.matches?.(VIEWPORT_VIDEO_SELECTOR)) return;

  if (!video.isConnected || isViewportVideoExcluded(video)) {
    video.pause();
    return;
  }

  viewportVideoVisibility.set(video, visible);

  if (!visible || document.hidden) {
    video.pause();
    return;
  }

  hydrateDeferredVideo(video);
  video.play().catch(() => {});
}

function ensureViewportVideoObserver() {
  if (viewportVideoObserver || !('IntersectionObserver' in window)) {
    return viewportVideoObserver;
  }

  viewportVideoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      syncViewportVideo(entry.target, entry.isIntersecting && entry.intersectionRatio > 0);
    });
  }, { threshold: 0.01 });

  return viewportVideoObserver;
}

function registerViewportVideo(video) {
  if (!video || !video.matches?.(VIEWPORT_VIDEO_SELECTOR) || viewportManagedVideos.has(video)) return;
  if (isViewportVideoExcluded(video)) return;

  viewportManagedVideos.add(video);
  video.pause();

  const loadObserver = ensureViewportVideoLoadObserver();
  if (loadObserver) {
    loadObserver.observe(video);
  }

  const observer = ensureViewportVideoObserver();
  if (observer) {
    observer.observe(video);
  } else {
    syncViewportVideo(video);
  }
}

function initViewportVideoPlayback(root = document) {
  if (root.matches?.(VIEWPORT_VIDEO_SELECTOR)) {
    registerViewportVideo(root);
  }
  root.querySelectorAll?.(VIEWPORT_VIDEO_SELECTOR).forEach(registerViewportVideo);
}

function syncAllViewportVideos() {
  viewportManagedVideos.forEach(video => {
    if (!video.isConnected) {
      viewportVideoLoadObserver?.unobserve(video);
      viewportVideoObserver?.unobserve(video);
      viewportManagedVideos.delete(video);
      return;
    }
    syncViewportVideo(video, viewportVideoVisibility.get(video) ?? isVideoInViewport(video));
  });
}

function requestViewportVideoFallbackSync() {
  if (viewportVideoObserver || viewportVideoFallbackRaf) return;
  viewportVideoFallbackRaf = requestAnimationFrame(() => {
    viewportVideoFallbackRaf = null;
    syncAllViewportVideos();
  });
}

initViewportVideoPlayback();

if (!viewportVideoObserver) {
  window.addEventListener('scroll', requestViewportVideoFallbackSync, { passive: true });
  window.addEventListener('resize', requestViewportVideoFallbackSync, { passive: true });
}

document.addEventListener('visibilitychange', syncAllViewportVideos);

/* ─────────────────────────────────────────────
   NARRATOR
───────────────────────────────────────────── */
const nar        = document.getElementById('narrator');
const narText    = document.getElementById('narText');
const narFrom    = document.getElementById('narFrom');
const narClose   = document.getElementById('narClose');
let narHidden = false;
let activeTimers = [];
let activeIntervals = [];
let currentNarWork = null;
let narAutoScroll = true;
let narLastScrollTop = 0;
let narUserScrollIntent = false;
let narUserScrollIntentTimer = null;
let narProgrammaticScroll = false;
let narProgrammaticScrollTimer = null;
let narScrollRaf = null;

function scheduleNarratorFrame(callback) {
  const schedule = window.requestAnimationFrame || (cb => window.setTimeout(cb, 16));
  return schedule(callback);
}

function cancelNarratorFrame(id) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

function isNarratorNearBottom(threshold = 12) {
  if (!narText) return true;
  return narText.scrollHeight - narText.clientHeight - narText.scrollTop <= threshold;
}

function markNarratorUserScrollIntent() {
  narUserScrollIntent = true;
  clearTimeout(narUserScrollIntentTimer);
  narUserScrollIntentTimer = setTimeout(() => {
    narUserScrollIntent = false;
  }, 700);
}

function guardNarratorProgrammaticScroll() {
  narProgrammaticScroll = true;
  clearTimeout(narProgrammaticScrollTimer);
  narProgrammaticScrollTimer = setTimeout(() => {
    narProgrammaticScroll = false;
  }, 120);
}

function resetNarratorAutoScroll() {
  narAutoScroll = true;
  narUserScrollIntent = false;
  narProgrammaticScroll = false;
  clearTimeout(narUserScrollIntentTimer);
  clearTimeout(narProgrammaticScrollTimer);
  if (narScrollRaf) {
    cancelNarratorFrame(narScrollRaf);
    narScrollRaf = null;
  }
  narLastScrollTop = narText ? narText.scrollTop : 0;
}

function applyNarratorScrollToBottom() {
  if (!narText || !narAutoScroll) return;
  guardNarratorProgrammaticScroll();
  narText.scrollTop = narText.scrollHeight;
  narLastScrollTop = narText.scrollTop;
  requestNarratorVideoSync();
}

function scrollNarratorToBottom() {
  if (!narText || !narAutoScroll) return;
  applyNarratorScrollToBottom();
  if (!narScrollRaf) {
    narScrollRaf = scheduleNarratorFrame(() => {
      narScrollRaf = null;
      applyNarratorScrollToBottom();
    });
  }
}

if (narText) {
  narText.addEventListener('wheel', markNarratorUserScrollIntent, { passive: true });
  narText.addEventListener('touchmove', markNarratorUserScrollIntent, { passive: true });
  narText.addEventListener('pointerdown', (e) => {
    const rect = narText.getBoundingClientRect();
    if (e.clientX >= rect.right - 16) markNarratorUserScrollIntent();
  }, { passive: true });
  narText.addEventListener('scroll', () => {
    if (narProgrammaticScroll) {
      narLastScrollTop = narText.scrollTop;
      requestNarratorVideoSync();
      return;
    }

    if (isNarratorNearBottom()) {
      narAutoScroll = true;
    } else if (narUserScrollIntent && narText.scrollTop < narLastScrollTop - 2) {
      narAutoScroll = false;
    }

    narLastScrollTop = narText.scrollTop;
    requestNarratorVideoSync();
  }, { passive: true });
}

function clearAllTimers() {
  activeTimers.forEach(id => clearTimeout(id));
  activeIntervals.forEach(id => clearInterval(id));
  activeTimers = [];
  activeIntervals = [];
}

function releaseLoadedMedia(root) {
  if (!root) return;

  root.querySelectorAll('video, audio').forEach(media => {
    media.pause?.();
    media.removeAttribute('src');
    media.querySelectorAll('source').forEach(source => {
      source.removeAttribute('src');
      source.removeAttribute('srcset');
    });
    media.load?.();
  });

  root.querySelectorAll('img').forEach(img => {
    img.removeAttribute('src');
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
  });

  root.querySelectorAll('picture source').forEach(source => {
    source.removeAttribute('src');
    source.removeAttribute('srcset');
    source.removeAttribute('sizes');
  });
}

function clearNarratorContent() {
  if (!narText) return;
  pauseNarratorVideos();
  releaseLoadedMedia(narText);
  guardNarratorProgrammaticScroll();
  narText.innerHTML = '';
  narText.scrollTop = 0;
  narLastScrollTop = 0;
}

function pauseNarratorVideos(exceptVideo = null) {
  if (!narText) return;
  narText.querySelectorAll('video[data-narrator-video-managed="1"]').forEach(video => {
    if (video !== exceptVideo) video.pause?.();
  });
}

function getNarratorVideoVisibleRatio(video) {
  if (!narText || !video?.isConnected) return 0;
  const rootRect = narText.getBoundingClientRect();
  const rect = video.getBoundingClientRect();
  if (!rect.width || !rect.height) return 0;

  const visibleWidth = Math.max(0, Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, rootRect.bottom) - Math.max(rect.top, rootRect.top));
  return (visibleWidth * visibleHeight) / (rect.width * rect.height);
}

let narratorVideoSyncRaf = null;
const NARRATOR_VIDEO_VISIBLE_THRESHOLD = 0.12;

function syncNarratorVideos() {
  narratorVideoSyncRaf = null;
  if (!narText) return;

  const videos = Array.from(narText.querySelectorAll('video[data-narrator-video-managed="1"]'));
  if (!videos.length) return;

  const isFloatPanelOpen = document.getElementById('floatPanel')?.classList.contains('show');
  const canPlayInline = nar?.classList.contains('show')
    && !document.hidden
    && !isFloatPanelOpen;

  if (!canPlayInline) {
    pauseNarratorVideos();
    return;
  }

  videos.forEach(video => {
    const ratio = getNarratorVideoVisibleRatio(video);
    if (ratio >= NARRATOR_VIDEO_VISIBLE_THRESHOLD) {
      hydrateDeferredVideo(video);
      video.play?.().catch(() => {});
    } else {
      video.pause?.();
    }
  });
}

function requestNarratorVideoSync() {
  if (narratorVideoSyncRaf) return;
  const schedule = window.requestAnimationFrame || (callback => window.setTimeout(callback, 16));
  narratorVideoSyncRaf = schedule(syncNarratorVideos);
}

function deferNarratorVideoSources(video) {
  if (video.dataset.bgSrc || video.querySelector?.('source[data-bg-src]')) return;

  const src = video.getAttribute('src');
  if (src) {
    video.dataset.bgSrc = src;
    video.removeAttribute('src');
  }

  video.querySelectorAll?.('source[src]').forEach(source => {
    const sourceSrc = source.getAttribute('src');
    if (!sourceSrc) return;
    source.dataset.bgSrc = sourceSrc;
    source.removeAttribute('src');
  });
}

function prepareNarratorVideoPlayback(root) {
  if (!narText || !root) return;

  root.querySelectorAll?.('video').forEach(video => {
    if (video.dataset.narratorVideoManaged === '1') return;

    video.dataset.narratorVideoManaged = '1';
    video.removeAttribute('autoplay');
    video.autoplay = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.preload = 'none';
    deferNarratorVideoSources(video);
    updateMediaLoadbox(video, 'loading');
    video.pause?.();
    video.load?.();
  });

  requestNarratorVideoSync();
}

function typeWriter(htmlText) {
  if (!narText) return;
  clearAllTimers();
  resetNarratorAutoScroll();
  
  const parts = htmlText.split('|||').map(p => p.trim());
  clearNarratorContent();
  let partIdx = 0;
  
  function addPart() {
    if (partIdx >= parts.length) return;
    
    const part = parts[partIdx];
    
    if (part.startsWith('<')) {
      const span = document.createElement('span');
      span.innerHTML = part;
      narText.appendChild(span);
      initMediaPreloaders(span);
      prepareNarratorVideoPlayback(span);
      
      // Scroll immediately after adding HTML
      scrollNarratorToBottom();
      
      // Handle images that might load later
      const images = span.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('load', scrollNarratorToBottom, { once: true });
        // Also scroll if image fails to load
        img.addEventListener('error', scrollNarratorToBottom, { once: true });
      });

      const videos = span.querySelectorAll('video');
      videos.forEach(video => {
        ['loadedmetadata', 'loadeddata', 'canplay', 'error'].forEach(eventName => {
          video.addEventListener(eventName, scrollNarratorToBottom, { once: true });
        });
      });
      
      partIdx++;
      const timerId = setTimeout(addPart, 600);
      activeTimers.push(timerId);
    } else {
      const textSpan = document.createElement('span');
      narText.appendChild(textSpan);
      let charIdx = 0;
      
      const typeInterval = setInterval(() => {
        if (charIdx < part.length) {
          textSpan.textContent += part[charIdx];
          charIdx++;
          scrollNarratorToBottom();
        } else {
          clearInterval(typeInterval);
          activeIntervals = activeIntervals.filter(id => id !== typeInterval);
          partIdx++;
          scrollNarratorToBottom();
          const timerId = setTimeout(addPart, 300);
          activeTimers.push(timerId);
        }
      }, 10);
      activeIntervals.push(typeInterval);
    }
  }
  
  addPart();
}

window.addEventListener('resize', requestNarratorVideoSync, { passive: true });
document.addEventListener('visibilitychange', syncNarratorVideos);

// Show narrator on Details button click
function showNarrator(workElement) {
  if (!nar || !narText || !narFrom) return;
  clearAllTimers();
  closeFloatPanel();
  currentNarWork = workElement;
  narText.style.opacity = '0';
  const timerId = setTimeout(() => {
    narFrom.textContent = '— ' + workElement.querySelector('.w-title').textContent;
    narText.style.opacity = '1';
    nar.classList.add('show');
    typeWriter(workElement.dataset.narrator);
  }, 260);
  activeTimers.push(timerId);
}

function showProductCaseNarrator() {
  if (!nar || !narText || !narFrom) return;
  clearAllTimers();
  closeFloatPanel();
  currentNarWork = null;
  narHidden = false;
  narText.style.opacity = '0';
  const timerId = setTimeout(() => {
    narFrom.textContent = '— Історія космосу';
    narText.style.opacity = '1';
    nar.classList.add('show');
    typeWriter('У мене виникла ідея: космічний sci-fi з пультами управління та багатошаровим наративом. Концепт видавався мені глибоким і мав би сам собою, за умови акуратного візуалу, привернути увагу та спонукати до співпраці. Мовляв, дивіться: креативний спеціаліст із потужною технічною базою. ||| <div style="height:12px;"></div> ||| Але після запуску ресурсу фідбек був далеким від очікуваного. Я бачив, що сайт відвідують, але на ньому не затримуються й не повертаються. ||| <div style="height:12px;"></div> ||| Я засмутився. Але не відступив. Окей, результат незадовільний, але тепер ти знаєш, що у сайту низька конверсія. Ти ж дизайнер. Ти же знаєш, що робити із низькою конверсією. ||| <div style="height:12px;"></div> ||| Потрібно було копати глибше. Я прикріпив логування до ключових дій. Зробив це акуратно, по мінімуму, щоб не порушити GDPR. І поглянув на логи. ||| <div style="height:12px;"></div> ||| Першим деструктивним елементом був онбординг. Раніше мені здавалося, що детальна екскурсія із 9 кроків, із вибором режиму анімації та розповіддю про мене як особистість — крута ідея. Але користувачі не хотіли багато читати. І просто йшли із сайту, навіть не догортавши до робіт. Ось як це виглядало на початку: ||| <div class="expandable-media-container"><svg class="emc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" color="var(--ion)"><path d="M8 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 17h6M9 13h6"/></svg><div class="emc-content"><video autoplay muted playsinline loop src="./productCase/firstIteration.mp4" style="width:100%; height:auto; display:block; border-radius: 5px;"></video><div class="expandable-label">Натисніть сюди, щоб збільшити</div></div></div> ||| Я почав реформатувати онбординг. Роботи стали ближчими для юзера. Тепер їх відділяв лише режим анімації, а решта онбордингу була скорочена до 4 кроків і показувалася безпосередньо там, де це справді актуально: біля секції з кейсами. ||| <div class="expandable-media-container"><svg class="emc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" color="var(--ion)"><path d="M8 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 17h6M9 13h6"/></svg><div class="emc-content"><video autoplay muted playsinline loop src="./productCase/secondIteration.mp4" style="width:100%; height:auto; display:block; border-radius: 5px;"></video><div class="expandable-label">Натисніть сюди, щоб збільшити</div></div></div> |||  У логах я побачив, що люди почали гортати сторінку глибше, клацали на кейси. Прийшло кілька листів із питаннями від рекрутерів. Отже, я рухався у правильному напрямку. Відтепер мені хотілося взагалі не закривати головний екран. Щоб сторінка показувалася юзеру одразу. Для цього треба було вирішити проблему з вибором режиму анімацію. Він був важливим. Адже слабкі девайси не тягнуть велику кількість трансформацій, безкінечний автоплей і пачки медіа. По-перше, я оптимізував медіа-менеджмент сторінки за допомогою Codex від Open AI. По-друге, придумав скрипт, який самостійно підлаштовує режим анімації під можливості девайса. Нарешті юзер-флоу став логічним, нічого не закриває основну сторінку: ||| <div class="expandable-media-container"><svg class="emc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" color="var(--ion)"><path d="M8 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 17h6M9 13h6"/></svg><div class="emc-content"><video autoplay muted playsinline loop src="./productCase/thirdIteration.mp4" style="width:100%; height:auto; display:block; border-radius: 5px;"></video><div class="expandable-label">Натисніть сюди, щоб збільшити</div></div></div> ||| Логи стали стабільно кращими. Хоча конверсія все ще була не на висоті. Так я прийшов до наступної важливої зміни: урізноманітнення UX. Раніше сторінка була насичена матеріалом, але... візуально одноманітною. Не було вау-ефекту. А саме це потрібно для того, щоб культивувати імпульс співпраці. Бо зараз кожен може зробити сайт, хай і візуально шаблонний. Але далеко не кожен може проєктувати унікальний користувацький досвід. І так я додав секцію-сюрприз, штучний інтелект, а також унормував візуали кейсів. ||| <div style="height:12px;"></div> ||| Раніше було ось так: ||| <div class="expandable-media-container"><svg class="emc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" color="var(--ion)"><path d="M8 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 17h6M9 13h6"/></svg><div class="emc-content"><video autoplay muted playsinline loop src="./productCase/fourthIterationBefore.mp4" style="width:100%; height:auto; display:block; border-radius: 5px;"></video><div class="expandable-label">Натисніть сюди, щоб збільшити</div></div></div> ||| А стало так: ||| <div class="expandable-media-container"><svg class="emc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" color="var(--ion)"><path d="M8 3H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M9 17h6M9 13h6"/></svg><div class="emc-content"><video autoplay muted playsinline loop src="./productCase/fourthIterationAfter.mp4" style="width:100%; height:auto; display:block; border-radius: 5px;"></video><div class="expandable-label">Натисніть сюди, щоб збільшити</div></div></div> ||| І це ще далеко не фініш. Я продовжую вивчати поведінку користувачів, експериментувати й розвивати свій продукт. Попри складнощі війни в тому місці, де я зараз живу, попри страх, попри початковий поганий фідбек. Мабуть, описане найкраще характеризує мій процес мислення. Я не відступаю, коли бачу невдачу, а намагаюся зрозуміти, чому так трапилося і як змінити систему, щоб досягти успіху. Я вважаю, що це мислення справжнього продуктового дизайнера, яким я мрію стати.');
  }, 160);
  activeTimers.push(timerId);
}

// Add Details button to each work
function initDetailsButtons() {
  works.forEach((work, idx) => {
    const meta = work.querySelector('.work-meta');
    if (!meta) return;
    
    const btn = document.createElement('button');
    btn.className = 'details-btn';
    btn.textContent = 'Детальніше';
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.getElementById('obOverlay')?.classList.contains('on')) return;
      trackEvent(`details clicked: ${getWorkTitle(work)}`);
      showNarrator(work);
    });
    
    meta.appendChild(btn);
  });
}

if (narClose) {
  narClose.addEventListener('click', () => {
    clearAllTimers();
    if (nar) nar.classList.remove('show');
    clearNarratorContent();
    narHidden = true;
    currentNarWork = null;
    // Close float panel when narrator is closed
    closeFloatPanel();
  });
}

initDetailsButtons();

function observeAnalyticsScrollIn(selector, eventName) {
  const el = document.querySelector(selector);
  if (!el || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      trackEventOnce(`scroll:${eventName}`, eventName);
      observer.disconnect();
    });
  }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
  observer.observe(el);
}

observeAnalyticsScrollIn('#aiGuide', 'ai guide scrolled in');
observeAnalyticsScrollIn('#works', 'first cases scrolled in');
observeAnalyticsScrollIn('.product-case-section', 'product case scrolled in');
observeAnalyticsScrollIn('#motionSection', 'motion scrolled in');
observeAnalyticsScrollIn('#worksSecond', 'second cases scrolled in');
observeAnalyticsScrollIn('#printedSection', 'print scrolled in');
observeAnalyticsScrollIn('#socialSection', 'smm scrolled in');
observeAnalyticsScrollIn('#footer', 'footer scrolled in');

document.querySelector('.hero-cta[href="#footer"]')?.addEventListener('click', () => {
  suppressCaseOnboardingForContactJump();
  trackEvent('contact clicked');
});

document.querySelectorAll('.motion-card-cta').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent(`motion link clicked: ${getMotionCardTitle(link.closest('.motion-card'))}`);
  });
});

function showDefaultNarrator() {
  if (!nar || !narText || !narFrom) return;
  narFrom.textContent = '— Космічна місія';
  narText.style.opacity = '1';
  nar.classList.add('show');
  typeWriter('Я поєдную креативні індустрії з технічною експертизою.');
}

function showDefaultNarratorIfIdle() {
  if (narHidden || currentNarWork || nar?.classList.contains('show')) return;
  if (document.getElementById('obOverlay')?.classList.contains('on')) return;
  showDefaultNarrator();
}

function finishCaseOnboardingWithFirstNarrator() {
  const firstWork = document.querySelector('.work');
  writeStorageFlag(ONBOARDING_CASE_STORAGE_KEY);
  trackEventOnce('case-onboarding-completed', 'case onboarding completed');
  showTip(0);
  if (firstWork) showNarrator(firstWork);
}

function skipCaseOnboarding() {
  writeStorageFlag(ONBOARDING_CASE_STORAGE_KEY);
  trackEvent('case onboarding skipped');
  showTip(0);
}

document.querySelectorAll('[data-case-onboarding-skip]').forEach(skip => {
  skip.addEventListener('click', skipCaseOnboarding);
});

document.getElementById('tipN5')?.addEventListener('click', () => {
  trackEvent('case onboarding step 4 next');
  finishCaseOnboardingWithFirstNarrator();
});

/* ─────────────────────────────────────────────
   FLOAT PANEL (Background Mode) - JavaScript
───────────────────────────────────────────── */
const floatPanel = document.getElementById('floatPanel');
const floatPanelContent = document.getElementById('floatPanelContent');
const floatPanelClose = document.getElementById('floatPanelClose');
let floatPanelCarouselTimer = null;

function stopFloatPanelCarousel() {
  if (!floatPanelCarouselTimer) return;
  clearInterval(floatPanelCarouselTimer);
  floatPanelCarouselTimer = null;
}

function openFloatPanel(contentElement) {
  if (!floatPanel || !floatPanelContent) return;
  
  stopFloatPanelCarousel();
  pauseNarratorVideos();
  releaseLoadedMedia(floatPanelContent);
  floatPanelContent.innerHTML = '';
  
  if (contentElement) {
    floatPanelContent.appendChild(contentElement);
    initMediaPreloaders(floatPanelContent);
  }
  
  floatPanel.classList.add('show');
  
  // Reset position to bottom-left on open
  floatPanel.style.right = 'auto';
  floatPanel.style.top = 'auto';
  floatPanel.style.left = '20px';
  floatPanel.style.bottom = '20px';
}

function closeFloatPanel() {
  if (floatPanel) {
    stopFloatPanelCarousel();
    floatPanel.classList.remove('show');
    if (floatPanelContent) {
      releaseLoadedMedia(floatPanelContent);
      floatPanelContent.innerHTML = '';
    }
    requestNarratorVideoSync();
  }
}

function openFloatPanelCarousel(mediaSources) {
  const sources = Array.from(new Set((Array.isArray(mediaSources) ? mediaSources : []).filter(Boolean)));
  if (!sources.length) return false;
  if (sources.length === 1) return openFloatPanelMedia('img', sources[0]);

  const wrapper = document.createElement('div');
  wrapper.className = 'float-media-carousel';

  const stage = document.createElement('div');
  stage.className = 'float-media-carousel-stage';
  const transitionMs = 820;
  let isTransitioning = false;

  const slides = sources.map((src, index) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.decoding = 'async';
    image.className = `float-media-carousel-slide${index === 0 ? ' is-active' : ''}`;
    image.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    stage.appendChild(image);
    return image;
  });

  let activeIndex = 0;

  const setSlidePosition = (slide, offset, animate = true) => {
    const travel = offset === 0
      ? '0'
      : offset > 0
        ? 'calc(100% + 3px)'
        : 'calc(-100% - 3px)';
    slide.style.transition = animate ? '' : 'none';
    slide.style.transform = `translate3d(${travel}, 0, 0)`;
  };

  const clearSlideVisibilityOverride = slide => {
    slide.style.opacity = '';
    slide.style.visibility = '';
  };

  const hideSlideInstantly = (slide, offset = 1) => {
    slide.style.transition = 'none';
    slide.style.opacity = '0';
    slide.style.visibility = 'hidden';
    setSlidePosition(slide, offset, false);
  };

  const syncCarousel = (nextIndex, animate = true) => {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    if (isTransitioning || (normalizedIndex === activeIndex && animate)) return;

    if (!animate || slides.length < 2) {
      activeIndex = normalizedIndex;
      slides.forEach((slide, index) => {
        const isActive = index === activeIndex;
        if (isActive) clearSlideVisibilityOverride(slide);
        slide.classList.toggle('is-active', isActive);
        slide.classList.remove('is-exiting');
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        setSlidePosition(slide, isActive ? 0 : 1, false);
      });
      requestAnimationFrame(() => slides.forEach(slide => {
        slide.style.transition = '';
      }));
      return;
    }

    const previousIndex = activeIndex;
    const previousSlide = slides[previousIndex];
    const nextSlide = slides[normalizedIndex];
    if (!previousSlide || !nextSlide || previousSlide === nextSlide) return;

    isTransitioning = true;
    activeIndex = normalizedIndex;
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      const isExiting = slide === previousSlide;
      if (isActive || isExiting) clearSlideVisibilityOverride(slide);
      slide.classList.toggle('is-active', isActive);
      slide.classList.toggle('is-exiting', isExiting);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      if (!isActive && !isExiting) setSlidePosition(slide, 1, false);
    });

    setSlidePosition(nextSlide, 1, false);
    requestAnimationFrame(() => {
      setSlidePosition(previousSlide, -1);
      setSlidePosition(nextSlide, 0);
    });

    setTimeout(() => {
      hideSlideInstantly(previousSlide, 1);
      previousSlide.classList.remove('is-exiting');
      slides.forEach((slide, index) => {
        if (index !== activeIndex && slide !== previousSlide) hideSlideInstantly(slide, 1);
      });
      requestAnimationFrame(() => slides.forEach(slide => {
        clearSlideVisibilityOverride(slide);
        slide.style.transition = '';
      }));
      isTransitioning = false;
    }, transitionMs);
  };

  wrapper.appendChild(stage);
  syncCarousel(0, false);
  openFloatPanel(wrapper);
  floatPanelCarouselTimer = setInterval(() => {
    if (!floatPanel?.classList.contains('show')) {
      stopFloatPanelCarousel();
      return;
    }
    syncCarousel(activeIndex + 1);
  }, 2000);
  return true;
}

function openFloatPanelMedia(tagName, mediaSrc) {
  const normalizedTag = String(tagName || '').toLowerCase();
  if (!mediaSrc || (normalizedTag !== 'img' && normalizedTag !== 'video')) return false;

  const newElement = document.createElement(normalizedTag);
  newElement.src = mediaSrc;
  newElement.style.maxWidth = '540px';
  newElement.style.width = 'auto';
  newElement.style.height = 'auto';
  newElement.style.maxHeight = 'min(400px, calc(100vh - 90px))';
  newElement.style.margin = '0 auto';
  newElement.style.display = 'block';

  if (normalizedTag === 'video') {
    newElement.autoplay = true;
    newElement.loop = true;
    newElement.muted = true;
    newElement.defaultMuted = true;
    newElement.controls = false;
    newElement.playsInline = true;
    newElement.setAttribute('muted', '');
    newElement.setAttribute('playsinline', '');
  } else {
    newElement.alt = '';
    newElement.decoding = 'async';
  }

  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  wrapper.style.height = 'auto';
  wrapper.appendChild(newElement);
  openFloatPanel(wrapper);
  return true;
}

// Close button
if (floatPanelClose) {
  floatPanelClose.addEventListener('click', closeFloatPanel);
}

// Ensure panel stays in bottom-left on window resize
window.addEventListener('resize', () => {
  if (floatPanel && floatPanel.classList.contains('show')) {
    floatPanel.style.right = 'auto';
    floatPanel.style.top = 'auto';
    floatPanel.style.left = '20px';
    floatPanel.style.bottom = '20px';
  }
}, { passive: true });

// Add click handler to expandable media containers in narrator
function attachFloatPanelListeners() {
  document.addEventListener('click', (e) => {
    const container = e.target.closest('.expandable-media-container');
    if (container && narText && narText.contains(container)) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get img or video inside container
      const media = container.querySelector('img, video');
      if (!media) return;
      
      const tagName = media.tagName.toLowerCase();
      const sourceElement = media.querySelector?.('source[src], source[data-bg-src]');
      const mediaSrc = media.currentSrc
        || media.getAttribute('src')
        || media.dataset.bgSrc
        || sourceElement?.getAttribute('src')
        || sourceElement?.dataset.bgSrc;
      if (!mediaSrc) return;

      openFloatPanelMedia(tagName, mediaSrc);
    }
  }, true);
}

attachFloatPanelListeners();

/* ─────────────────────────────────────────────
   SCROLL PARALLAX 3D
───────────────────────────────────────────── */
let workScrollParallaxRaf = null;

function updateWorkScrollParallax() {
  if (isPartialMotionDisabled()) return;
  const scrollY = window.scrollY;
  const viewportCenter = window.innerHeight / 2 + scrollY;
  const viewportHalf = window.innerHeight / 2;

  workVisuals.forEach(vis => {
    const rect = vis.getBoundingClientRect();
    const elementCenter = rect.top + scrollY + rect.height / 2;
    const distance = (elementCenter - viewportCenter) / viewportHalf;
    
    // Усиленный 3D параллакс
    const rotX = distance * 18;
    const rotZ = Math.abs(distance) * 8;
    const scaleEffect = 1 - Math.abs(distance) * 0.08;
    
    vis.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scaleEffect})`;
  });
}

function requestWorkScrollParallaxUpdate() {
  if (isPartialMotionDisabled() || workScrollParallaxRaf) return;
  workScrollParallaxRaf = requestAnimationFrame(() => {
    workScrollParallaxRaf = null;
    updateWorkScrollParallax();
  });
}

window.addEventListener('scroll', requestWorkScrollParallaxUpdate, { passive: true });
window.addEventListener('resize', requestWorkScrollParallaxUpdate, { passive: true });

/* ─────────────────────────────────────────────
   ENHANCED PARALLAX FOR ALL ELEMENTS
───────────────────────────────────────────── */
let lastScrollY = 0;
let enhancedParallaxRaf = null;

function resetEnhancedParallaxStates() {
  document.querySelectorAll('.motion-card, .printed-item, .social-post').forEach(el => {
    el.style.transform = '';
    el.style.opacity = '';
  });
}

function parallaxMotionCards() {
  if (isPartialMotionDisabled()) return;
  const cards = document.querySelectorAll('.motion-card.parallax-visible');
  cards.forEach((card, idx) => {
    const rect = card.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    // Same floating parallax as social posts
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    card.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    card.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

function parallaxPrintedItems() {
  if (isPartialMotionDisabled()) return;
  const items = document.querySelectorAll('.printed-item.parallax-visible');
  items.forEach((item, idx) => {
    const rect = item.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    // Same floating parallax as social posts
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    item.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    item.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

function parallaxSocialPosts() {
  if (isPartialMotionDisabled()) return;
  const posts = document.querySelectorAll('.social-post.parallax-visible');
  posts.forEach((post, idx) => {
    const rect = post.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    // Enhanced floating parallax for social posts
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    post.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    post.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

function updateEnhancedParallax() {
  if (isPartialMotionDisabled()) return;
  parallaxMotionCards();
  parallaxPrintedItems();
  parallaxSocialPosts();
  lastScrollY = window.scrollY;
}

function requestEnhancedParallaxUpdate() {
  if (isPartialMotionDisabled() || enhancedParallaxRaf) return;
  enhancedParallaxRaf = requestAnimationFrame(() => {
    enhancedParallaxRaf = null;
    updateEnhancedParallax();
  });
}

window.addEventListener('scroll', requestEnhancedParallaxUpdate, { passive: true });
window.addEventListener('resize', requestEnhancedParallaxUpdate, { passive: true });

/* ─────────────────────────────────────────────
   ONBOARDING
───────────────────────────────────────────── */
const obOverlay  = document.getElementById('obOverlay');
const obBackdrop = document.getElementById('obBackdrop');
const hiRing     = document.getElementById('hiRing');
 
let tipStep = 0;
let currentTargetEl  = null;   // елемент, який підсвічується зараз
let currentTipEl     = null;   // картка-підказка, що показується зараз
let resizeRAF        = null;   // requestAnimationFrame для resize-debounce
 
/* ─────────────────────────────────────────────
   УТИЛІТА: позиціонування картки відносно target
   Порядок пріоритетів: right → top → left → bottom
   Картка НІКОЛИ не перекриває target
───────────────────────────────────────────── */
const TIP_GAP    = 16;   // px між карткою та ring/target
const TIP_MARGIN = 12;   // мінімальний відступ від країв viewport
 
function positionTipCard(tipEl, targetRect) {
  if (!tipEl || !targetRect) return;
 
  /* скидаємо попередні інлайн-стилі позиції */
  tipEl.style.top    = '';
  tipEl.style.left   = '';
  tipEl.style.right  = '';
  tipEl.style.bottom = '';
  tipEl.style.width  = '';
  tipEl.style.maxHeight = '';
  tipEl.style.overflowY = '';
  tipEl.style.transform = '';
 
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isNarrowShort = vw < 420 && vh <= 740;
  const isUltraNarrow = vw < 320;
  const targetIsLeftRail = targetRect.left <= 8 && targetRect.width <= 80;

  if (isNarrowShort) {
    tipEl.style.maxHeight = `calc(100vh - ${TIP_MARGIN * 2}px)`;
    tipEl.style.overflowY = 'auto';

    if (targetIsLeftRail) {
      const compactGap = isUltraNarrow ? 8 : TIP_GAP;
      const sideWidth = vw - targetRect.right - compactGap - TIP_MARGIN;
      if (sideWidth >= 150) tipEl.style.width = Math.min(280, sideWidth) + 'px';
    }
  }

  const rect = tipEl.getBoundingClientRect();
  const tw = rect.width  || 280;
  const th = Math.min(rect.height || 160, vh - TIP_MARGIN * 2);
 
  const tr = targetRect; // target rect (viewport-relative)
 
  /* 4 варіанти позиції: right, top, left, bottom */
  const candidates = [
    {
      name: 'top',
      left: clamp(tr.left + tr.width / 2 - tw / 2, TIP_MARGIN, vw - tw - TIP_MARGIN),
      top:  tr.top - th - TIP_GAP,
    },
    {
      name: 'right',
      left: tr.right + TIP_GAP,
      top:  clamp(tr.top + tr.height / 2 - th / 2, TIP_MARGIN, vh - th - TIP_MARGIN),
    },
    {
      name: 'bottom',
      left: clamp(tr.left + tr.width / 2 - tw / 2, TIP_MARGIN, vw - tw - TIP_MARGIN),
      top:  tr.bottom + TIP_GAP,
    },
    {
      name: 'left',
      left: tr.left - tw - TIP_GAP,
      top:  clamp(tr.top + tr.height / 2 - th / 2, TIP_MARGIN, vh - th - TIP_MARGIN),
    },
  ];

  if (isNarrowShort && targetIsLeftRail) {
    const compactGap = isUltraNarrow ? 8 : TIP_GAP;
    candidates.find(c => c.name === 'right').left = tr.right + compactGap;
    candidates.sort((a, b) => (a.name === 'right' ? -1 : b.name === 'right' ? 1 : 0));
  }
 
  /* перший варіант, який повністю вміщується у viewport */
  const chosen = candidates.find(c =>
    c.left >= TIP_MARGIN &&
    c.top  >= TIP_MARGIN &&
    c.left + tw <= vw - TIP_MARGIN &&
    c.top  + th <= vh - TIP_MARGIN
  ) || {
    name: 'viewport',
    left: clamp(candidates[0].left, TIP_MARGIN, Math.max(TIP_MARGIN, vw - tw - TIP_MARGIN)),
    top: clamp(candidates[0].top, TIP_MARGIN, Math.max(TIP_MARGIN, vh - th - TIP_MARGIN)),
  };
 
  tipEl.style.position  = 'fixed';
  tipEl.style.left      = chosen.left + 'px';
  tipEl.style.top       = chosen.top  + 'px';
  tipEl.style.transform = 'none';
 
  /* прокручуємо так, щоб і target, і картка були видимі */
  ensureBothVisible(targetRect, {
    left: chosen.left, top: chosen.top,
    right: chosen.left + tw, bottom: chosen.top + th,
  });
}
 
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
 
/* плавний скрол, щоб обидва елементи потрапили у viewport */
function ensureBothVisible(targetRect, tipRect) {
  const padding = 24;
  const combinedTop    = Math.min(targetRect.top,    tipRect.top)    - padding;
  const combinedBottom = Math.max(targetRect.bottom, tipRect.bottom) + padding;
 
  const currentScrollY = window.scrollY;
  const viewportH      = window.innerHeight;
 
  if (combinedTop < 0) {
    window.scrollTo({ top: currentScrollY + combinedTop, behavior: 'smooth' });
  } else if (combinedBottom > viewportH) {
    window.scrollTo({ top: currentScrollY + combinedBottom - viewportH, behavior: 'smooth' });
  }
}
 
/* ─────────────────────────────────────────────
   HIGHLIGHT RING — оновлення позиції/розміру
───────────────────────────────────────────── */
function updateRing(targetEl) {
  if (!hiRing || !targetEl) return;
  const r = targetEl.getBoundingClientRect();
  hiRing.style.cssText = `
    display:block;
    position:absolute;
    left:${r.left - 4}px;
    top:${r.top  - 4}px;
    width:${r.width  + 8}px;
    height:${r.height + 8}px;
  `;
  updateSpotlight(r);
}
 
function updateSpotlight(rect) {
  if (!obBackdrop) return;
  const r = rect || (hiRing.style.display !== 'none'
    ? hiRing.getBoundingClientRect()
    : null);
  if (!r) return;
  const cx = r.left + r.width  / 2;
  const cy = r.top  + r.height / 2;
  obBackdrop.style.setProperty('--spotlight-x', cx + 'px');
  obBackdrop.style.setProperty('--spotlight-y', cy + 'px');
}

function refreshCurrentTipPosition() {
  if (!currentTargetEl || !currentTipEl) return;
  updateRing(currentTargetEl);
  const r = currentTargetEl.getBoundingClientRect();
  positionTipCard(currentTipEl, r);
}

function settleTipPosition(times = 5, delay = 140) {
  refreshCurrentTipPosition();
  if (times <= 1) return;
  setTimeout(() => settleTipPosition(times - 1, delay), delay);
}
 
/* ─────────────────────────────────────────────
   RESIZE / SCROLL — перераховуємо все
───────────────────────────────────────────── */
function onViewportChange() {
  if (!currentTargetEl || !currentTipEl) return;
  cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(() => {
    requestAnimationFrame(refreshCurrentTipPosition);
  });
}
 
window.addEventListener('resize', onViewportChange);
window.addEventListener('scroll', onViewportChange, { passive: true });
 
/* ─────────────────────────────────────────────
   showTip(n) — головна функція
───────────────────────────────────────────── */
 
/* mapа: крок → { targetSelector, targetId, targetClass }
   null = центр екрану (без підсвітки) */
const TIP_TARGETS = {
  2: { id: 'toolbar' },
  3: { id: 'btn-intent' },
  4: { cls: 'work-visual' },
  5: { cls: 'details-btn' }
};
 
function resolveTarget(cfg) {
  if (!cfg) return null;
  if (cfg.id)  return document.getElementById(cfg.id);
  if (cfg.cls) return document.getElementsByClassName(cfg.cls)[0] || null;
  return null;
}

function closeNarratorForOnboarding() {
  if (!nar || !narText) return;
  if (!nar.classList.contains('show') && !narText.childNodes.length) return;

  clearAllTimers();
  nar.classList.remove('show');
  clearNarratorContent();
  narHidden = true;
  currentNarWork = null;
  requestNarratorVideoSync();
}
 
function showTip(n) {
  if (obOverlay) obOverlay.classList.remove('inline-help');
  document.body.classList.remove('selecting-lens', 'hovering-work', 'clicking-details');
  if (obBackdrop) obBackdrop.style.opacity = '';
  const nextTipId = n === 0 ? null : 'tip' + n;

  if (n !== 0 && typeof closeFloatPanel === 'function') {
    closeFloatPanel();
  }
  if (n !== 0) closeNarratorForOnboarding();

  ['tip2', 'tip3', 'tip4', 'tip5', 'motionModeHelp'].forEach(id => {
    if (id === nextTipId) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('show');
    setTimeout(() => { if (!el.classList.contains('show')) el.style.display = 'none'; }, 350);
  });

  if (hiRing) hiRing.style.display = 'none';
  currentTargetEl = null;
  currentTipEl    = null;

  if (n === 0) {
    if (obOverlay) obOverlay.classList.remove('on');
    return;
  }

  const tip = document.getElementById('tip' + n);
  if (!tip) return;

  if (n === 3) document.body.classList.add('selecting-lens');
  if (n === 4) document.body.classList.add('hovering-work');
  if (n === 5) document.body.classList.add('clicking-details');

  const targetCfg = TIP_TARGETS[n] || null;
  const targetEl  = resolveTarget(targetCfg);

  tip.style.display     = '';
  tip.style.visibility  = 'hidden'; // прячем до финальной позиции

  requestAnimationFrame(() => requestAnimationFrame(() => {
    tip.classList.add('show');

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        currentTargetEl = targetEl;
        currentTipEl    = tip;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          settleTipPosition();
          tip.style.visibility = ''; // показываем только после позиционирования
        }));
      }, 400);
    } else {
      tip.style.position   = 'fixed';
      tip.style.top        = '50%';
      tip.style.left       = '50%';
      tip.style.transform  = 'translate(-50%,-50%)';
      tip.style.visibility = ''; // без target — сразу показываем
    }
  }));
} 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(showDefaultNarratorIfIdle, 900));
} else {
  setTimeout(showDefaultNarratorIfIdle, 900);
}
 
/* ─────────────────────────────────────────────
   НАВІГАЦІЯ МІЖ КРОКАМИ
───────────────────────────────────────────── */
document.getElementById('tipN2')?.addEventListener('click', () => {
  trackEvent('case onboarding step 1 next');
  const firstWork = document.querySelector('.work');
  if (firstWork) {
    firstWork.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => showTip(3), 800);
  }
});

document.getElementById('tipN3')?.addEventListener('click', () => {
  trackEvent('case onboarding step 2 next');
  showTip(4);
});
 
/* Крок 3 → 4: клік по інструменту */
document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('tip3')?.classList.contains('show')) {
      trackEvent('case onboarding step 2 action');
      showTip(4);
    }
  });
});
 
/* Крок 4 → 5: hover по візуалу */
const firstWorkVis = document.querySelector('.work .work-visual');
if (firstWorkVis) {
  firstWorkVis.addEventListener('mouseenter', e => {
    if (!isRealMouseEvent(e)) return;
    if (document.getElementById('tip4')?.classList.contains('show')) {
      trackEventOnce('case-onboarding-step-3-action', 'case onboarding step 3 action');
      setTimeout(() => showTip(5), 2000);
    }
  });
}
 
document.getElementById('tipN4')?.addEventListener('click', () => {
  trackEvent('case onboarding step 3 next');
  showTip(5);
});
 
/* Крок 5: завершення або закриття */
const firstDetailsBtn = document.querySelector('.work .details-btn');
if (firstDetailsBtn) {
  firstDetailsBtn.addEventListener('click', e => {
    if (!document.getElementById('tip5')?.classList.contains('show')) return;
    e.preventDefault();
    e.stopPropagation();
    trackEvent('case onboarding step 4 action');
    trackEvent(`details clicked: ${getWorkTitle(firstDetailsBtn.closest('.work'))}`);
    finishCaseOnboardingWithFirstNarrator();
  });
}
 
/* ─────────────────────────────────────────────
   PARTIAL ANIMATION TOGGLE
───────────────────────────────────────────── */
const motionBtn  = document.getElementById('btn-motion');
const motionIcon = document.getElementById('motion-icon');
const MOTION_ICON_ON = '<path d="M5.8 4.3L19.4 12L5.8 19.7Z"/>';
const MOTION_ICON_OFF = '<path d="M5.8 4.3L19.4 12L5.8 19.7Z"/>';

function resetPartialMotionState() {
  comets.length = 0;
  attractorSuppressed = false;
  resetCursorGlow();

  stars.forEach(s => {
    s.x = s.baseX;
    s.y = s.baseY;
    s.vx = 0;
    s.vy = 0;
    s.distToTarget = 999;
  });
  nebulae.forEach(neb => { neb.drift = 0; });

  clearWorkVisualStates();
  resetEnhancedParallaxStates();

  document.querySelectorAll('.hero-photo-clip, [class^="hero-clouds"]').forEach(el => {
    el.style.marginLeft = '';
    el.style.opacity = '';
    el.style.filter = '';
  });
}

function restartHeroMotionAnimations() {
  const animatedEls = document.querySelectorAll('.hero-orb, .hero-photo-wrapper, [class^="hero-clouds"]');
  animatedEls.forEach(el => { el.style.animation = 'none'; });
  void document.body.offsetHeight;
  animatedEls.forEach(el => { el.style.animation = ''; });
}

function setPartialMotionDisabled(disabled, options = {}) {
  partialMotionDisabled = Boolean(disabled);
  resetPartialMotionState();
  document.body.classList.toggle(MOTION_LIGHT_CLASS, partialMotionDisabled);
  if (typeof Event === 'function') {
    window.dispatchEvent(new Event('portfolio:motion-mode-change'));
  } else {
    const event = document.createEvent('Event');
    event.initEvent('portfolio:motion-mode-change', false, false);
    window.dispatchEvent(event);
  }
  syncCustomCursorState();

  const heavyMotionEnabled = !partialMotionDisabled;
  if (options.persist) {
    selectedMotionMode = partialMotionDisabled ? 'base' : 'max';
    removeSessionValue(AUTO_MOTION_LITE_SESSION_KEY);
    writeStorageValue(MOTION_MODE_STORAGE_KEY, selectedMotionMode);
  }

  if (motionBtn) {
    motionBtn.classList.toggle('active', heavyMotionEnabled);
    motionBtn.setAttribute('aria-pressed', String(heavyMotionEnabled));
    motionBtn.title = heavyMotionEnabled ? 'Вимкнути важкі анімації' : 'Увімкнути важкі анімації';
    const label = motionBtn.querySelector('.tlabel');
    if (label) label.textContent = heavyMotionEnabled ? 'Анімації максимум' : 'Базові анімації';
  }
  if (motionIcon) motionIcon.innerHTML = heavyMotionEnabled ? MOTION_ICON_ON : MOTION_ICON_OFF;

  if (heavyMotionEnabled) {
    restartHeroMotionAnimations();
    scheduleStarfieldFrame();
    if (runtimeJankWatchStarted) restartRuntimeJankWatchIfNeeded();
    else startRuntimeJankWatchOnce();
  } else {
    drawStaticStarfield();
  }

  if (!options.silent) playUI('switch');
}

const RUNTIME_JANK_START_DELAY_MS = 120;
const RUNTIME_JANK_GRACE_MS = 250;
const RUNTIME_JANK_WINDOW_MS = 700;
const RUNTIME_JANK_MIN_FRAMES = 6;
const RUNTIME_JANK_LONG_FRAME_MS = 120;
const RUNTIME_JANK_BAD_RATIO = 0.74;
const RUNTIME_JANK_LOW_FPS = 10;
const RUNTIME_JANK_EMERGENCY_FRAME_MS = 240;
const RUNTIME_JANK_EMERGENCY_COUNT = 2;
const RUNTIME_JANK_VERY_LONG_FRAME_MS = 280;
const RUNTIME_JANK_BURST_BASE_MS = 80;
const RUNTIME_JANK_BURST_LIMIT = 30;
const RUNTIME_JANK_BURST_DECAY = 0.55;
const RUNTIME_JANK_CONFIRM_MS = 2600;
const RUNTIME_JANK_CANDIDATE_TTL_MS = 6500;
const RUNTIME_JANK_CATASTROPHIC_FRAME_MS = 520;
const RUNTIME_JANK_CATASTROPHIC_FPS = 6;
let runtimeJankWatchStarted = false;
let runtimeJankWatchTimer = 0;
let runtimeJankRaf = 0;
let runtimeJankCandidateAt = 0;
let runtimeJankCandidateUntil = 0;
let runtimeJankIgnoredBySection = false;

function shouldWatchRuntimeJank() {
  return !isPartialMotionDisabled()
    && !selectedMotionMode
    && !runtimeJankIgnoredBySection
    && !document.hidden;
}

function clearRuntimeJankCandidate() {
  runtimeJankCandidateAt = 0;
  runtimeJankCandidateUntil = 0;
}

function triggerAutoMotionLite(reason = {}) {
  if (isPartialMotionDisabled()) return true;

  const now = performance.now();
  const isCatastrophic = reason.worstFrame >= RUNTIME_JANK_CATASTROPHIC_FRAME_MS
    || (reason.avgFps > 0 && reason.avgFps <= RUNTIME_JANK_CATASTROPHIC_FPS);

  if (!isCatastrophic) {
    const candidateExpired = !runtimeJankCandidateAt || now > runtimeJankCandidateUntil;

    if (candidateExpired) {
      runtimeJankCandidateAt = now;
      runtimeJankCandidateUntil = now + RUNTIME_JANK_CANDIDATE_TTL_MS;
      return false;
    }

    if (now - runtimeJankCandidateAt < RUNTIME_JANK_CONFIRM_MS) {
      return false;
    }
  }

  runtimeJankCandidateAt = 0;
  runtimeJankCandidateUntil = 0;
  writeSessionFlag(AUTO_MOTION_LITE_SESSION_KEY);
  trackEventOnce(
    'auto-motion-lite',
    `auto light animation: fps ${Math.round(reason.avgFps || 0)}, bad ${Math.round((reason.badRatio || 0) * 100)}%`
  );
  setPartialMotionDisabled(true, { silent: true, persist: false });
  return true;
}

function watchRuntimeJank() {
  if (!shouldWatchRuntimeJank()) {
    runtimeJankRaf = 0;
    return;
  }

  const raf = window.requestAnimationFrame || (cb => setTimeout(() => cb(performance.now()), 16));
  let last = performance.now();
  let sampleStart = last;
  let ignoreUntil = last + RUNTIME_JANK_GRACE_MS;
  let frames = 0;
  let badFrames = 0;
  let worstFrame = 0;
  let emergencyFrames = 0;
  let burstScore = 0;

  function resetSample(now) {
    sampleStart = now;
    frames = 0;
    badFrames = 0;
    worstFrame = 0;
    emergencyFrames = 0;
    burstScore = Math.max(0, burstScore - RUNTIME_JANK_BURST_DECAY * 2);
  }

  function tick(now) {
    runtimeJankRaf = 0;

    if (!shouldWatchRuntimeJank()) return;

    const dt = now - last;
    last = now;

    if (document.hidden || dt > 1000) {
      ignoreUntil = now + RUNTIME_JANK_GRACE_MS;
      resetSample(now);
      runtimeJankRaf = raf(tick);
      return;
    }

    if (now < ignoreUntil) {
      resetSample(now);
      runtimeJankRaf = raf(tick);
      return;
    }

    frames += 1;
    if (dt > RUNTIME_JANK_LONG_FRAME_MS) {
      badFrames += 1;
      worstFrame = Math.max(worstFrame, dt);
    }

    if (dt > RUNTIME_JANK_BURST_BASE_MS) {
      burstScore += Math.min(4, (dt - RUNTIME_JANK_BURST_BASE_MS) / 35);
    } else {
      burstScore = Math.max(0, burstScore - RUNTIME_JANK_BURST_DECAY);
    }

    if (burstScore >= RUNTIME_JANK_BURST_LIMIT) {
      const elapsed = Math.max(now - sampleStart, 1);
      const didSwitch = triggerAutoMotionLite({
        avgFps: frames / (elapsed / 1000),
        badRatio: badFrames / Math.max(frames, 1),
        worstFrame
      });
      resetSample(now);
      if (didSwitch) return;
    }

    emergencyFrames = dt > RUNTIME_JANK_EMERGENCY_FRAME_MS ? emergencyFrames + 1 : 0;
    if (emergencyFrames >= RUNTIME_JANK_EMERGENCY_COUNT) {
      const elapsed = Math.max(now - sampleStart, 1);
      const didSwitch = triggerAutoMotionLite({
        avgFps: frames / (elapsed / 1000),
        badRatio: badFrames / Math.max(frames, 1),
        worstFrame
      });
      resetSample(now);
      if (didSwitch) return;
    }

    const elapsed = now - sampleStart;
    if (elapsed >= RUNTIME_JANK_WINDOW_MS) {
      const badRatio = badFrames / frames;
      const avgFps = frames / (elapsed / 1000);
      const enoughFrames = frames >= RUNTIME_JANK_MIN_FRAMES;
      const enoughJank = enoughFrames && badRatio >= RUNTIME_JANK_BAD_RATIO
        || (avgFps < RUNTIME_JANK_LOW_FPS && badFrames >= 6)
        || (worstFrame > RUNTIME_JANK_VERY_LONG_FRAME_MS && badFrames >= 2);

      if (enoughJank) {
        const didSwitch = triggerAutoMotionLite({ avgFps, badRatio, worstFrame });
        resetSample(now);
        if (didSwitch) return;
      }

      resetSample(now);
    }

    runtimeJankRaf = raf(tick);
  }

  runtimeJankRaf = raf(tick);
}

function startRuntimeJankWatchOnce() {
  if (runtimeJankWatchStarted || runtimeJankWatchTimer || !shouldWatchRuntimeJank()) return;

  runtimeJankWatchTimer = setTimeout(() => {
    runtimeJankWatchTimer = 0;
    if (runtimeJankWatchStarted || !shouldWatchRuntimeJank()) return;
    runtimeJankWatchStarted = true;
    watchRuntimeJank();
  }, RUNTIME_JANK_START_DELAY_MS);
}

function restartRuntimeJankWatchIfNeeded() {
  if (!runtimeJankWatchStarted || runtimeJankRaf || !shouldWatchRuntimeJank()) return;
  watchRuntimeJank();
}

function setRuntimeJankSectionIgnored(ignored) {
  const next = Boolean(ignored);
  if (runtimeJankIgnoredBySection === next) return;
  runtimeJankIgnoredBySection = next;

  if (runtimeJankIgnoredBySection) {
    clearRuntimeJankCandidate();
    return;
  }

  restartRuntimeJankWatchIfNeeded();
}

function isRuntimeJankIgnoredSectionInViewport() {
  return ['motionSection', 'printedSection'].some(id => {
    const section = document.getElementById(id);
    if (!section) return false;
    const rect = section.getBoundingClientRect();
    return rect.width > 0
      && rect.height > 0
      && rect.bottom > 0
      && rect.right > 0
      && rect.top < window.innerHeight
      && rect.left < window.innerWidth;
  });
}

function syncRuntimeJankIgnoredSections() {
  setRuntimeJankSectionIgnored(isRuntimeJankIgnoredSectionInViewport());
}

if ('IntersectionObserver' in window) {
  const runtimeJankIgnoredSections = ['motionSection', 'printedSection']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const runtimeJankIgnoredVisibility = new WeakMap();

  const runtimeJankSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      runtimeJankIgnoredVisibility.set(entry.target, entry.isIntersecting && entry.intersectionRatio > 0);
    });
    setRuntimeJankSectionIgnored(
      runtimeJankIgnoredSections.some(section => runtimeJankIgnoredVisibility.get(section))
    );
  }, { threshold: 0.01 });

  runtimeJankIgnoredSections.forEach(section => runtimeJankSectionObserver.observe(section));
  syncRuntimeJankIgnoredSections();
} else {
  window.addEventListener('scroll', syncRuntimeJankIgnoredSections, { passive: true });
  window.addEventListener('resize', syncRuntimeJankIgnoredSections, { passive: true });
  syncRuntimeJankIgnoredSections();
}

window.addEventListener('scroll', startRuntimeJankWatchOnce, { passive: true });
window.addEventListener('wheel', startRuntimeJankWatchOnce, { passive: true, once: true });
window.addEventListener('touchstart', startRuntimeJankWatchOnce, { passive: true, once: true });
window.addEventListener('pointerdown', startRuntimeJankWatchOnce, { passive: true, once: true });
window.addEventListener('keydown', event => {
  if (!ONBOARDING_SCROLL_KEYS.has(event.key)) return;
  startRuntimeJankWatchOnce();
}, { passive: true });
document.addEventListener('visibilitychange', restartRuntimeJankWatchIfNeeded);

function hideMotionModeHelp() {
  const help = document.getElementById('motionModeHelp');
  if (!help) return;

  help.classList.remove('show');
  setTimeout(() => {
    if (!help.classList.contains('show')) help.style.display = 'none';
  }, 350);

  if (hiRing) hiRing.style.display = 'none';
  currentTargetEl = null;
  currentTipEl = null;
  if (obOverlay) obOverlay.classList.remove('on', 'inline-help');
}

function showMotionModeHelpOnce() {
  if (readStorageFlag(MOTION_HELP_STORAGE_KEY)) return;
  if (!obOverlay || obOverlay.classList.contains('on') || !motionBtn) return;

  const help = document.getElementById('motionModeHelp');
  if (!help) return;

  writeStorageFlag(MOTION_HELP_STORAGE_KEY);
  if (typeof closeFloatPanel === 'function') closeFloatPanel();
  closeNarratorForOnboarding();
  document.body.classList.remove('selecting-lens', 'hovering-work', 'clicking-details');
  obOverlay.classList.add('on', 'inline-help');
  help.style.display = '';
  help.style.visibility = 'hidden';

  requestAnimationFrame(() => requestAnimationFrame(() => {
    help.classList.add('show');
    currentTargetEl = motionBtn;
    currentTipEl = help;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      updateRing(motionBtn);
      positionTipCard(help, motionBtn.getBoundingClientRect());
      help.style.visibility = '';
    }));
  }));
}

document.getElementById('motionModeHelpOk')?.addEventListener('click', hideMotionModeHelp);

selectedMotionMode = readStoredMotionMode();
if (selectedMotionMode) {
  removeSessionValue(AUTO_MOTION_LITE_SESSION_KEY);
}
const autoMotionLiteRestored = !selectedMotionMode && readSessionFlag(AUTO_MOTION_LITE_SESSION_KEY);
setPartialMotionDisabled(
  selectedMotionMode === 'base' || autoMotionLiteRestored,
  { silent: true }
);

let caseOnboardingStarted = false;
let caseOnboardingScrollAllowedAt = Date.now() + 900;
let caseOnboardingUserScrolled = false;
let caseOnboardingSuppressedUntil = 0;
let caseOnboardingSuspendedBelowCases = false;

function startCaseOnboarding() {
  if (caseOnboardingStarted) return;
  if (readStorageFlag(ONBOARDING_CASE_STORAGE_KEY)) {
    caseOnboardingStarted = true;
    return;
  }
  const overlay = document.getElementById('obOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('on')) return;
  caseOnboardingStarted = true;
  trackEvent('case onboarding started');
  if (typeof closeFloatPanel === 'function') closeFloatPanel();
  overlay.classList.add('on');
  showTip(2);
}

function shouldStartCaseOnboarding() {
  if (caseOnboardingStarted) return false;
  const firstDetails = document.querySelector('.work .details-btn');
  if (!firstDetails) return false;

  if (caseOnboardingSuspendedBelowCases) {
    if (firstDetails.getBoundingClientRect().top >= window.innerHeight) {
      caseOnboardingSuspendedBelowCases = false;
      caseOnboardingUserScrolled = false;
    } else {
      return false;
    }
  }

  if (Date.now() < caseOnboardingSuppressedUntil) return false;
  if (Date.now() < caseOnboardingScrollAllowedAt) return false;
  if (!caseOnboardingUserScrolled) return false;
  return firstDetails.getBoundingClientRect().bottom <= window.innerHeight;
}

function suppressCaseOnboardingForContactJump() {
  if (caseOnboardingStarted || readStorageFlag(ONBOARDING_CASE_STORAGE_KEY)) return;
  caseOnboardingUserScrolled = false;
  caseOnboardingSuspendedBelowCases = true;
  caseOnboardingSuppressedUntil = Date.now() + 6000;
}

function checkCaseOnboardingAfterScroll() {
  if (shouldStartCaseOnboarding()) startCaseOnboarding();
}

function noteCaseOnboardingUserScroll() {
  if (caseOnboardingStarted) return;
  caseOnboardingUserScrolled = true;
  requestAnimationFrame(checkCaseOnboardingAfterScroll);
  const wait = Math.max(0, caseOnboardingScrollAllowedAt - Date.now());
  if (wait) setTimeout(checkCaseOnboardingAfterScroll, wait + 20);
}

function handleCaseOnboardingScrollEvent() {
  if (Date.now() >= caseOnboardingScrollAllowedAt) {
    caseOnboardingUserScrolled = true;
  }
  checkCaseOnboardingAfterScroll();
}

window.addEventListener('scroll', handleCaseOnboardingScrollEvent, { passive: true });
window.addEventListener('wheel', noteCaseOnboardingUserScroll, { passive: true });
window.addEventListener('touchmove', noteCaseOnboardingUserScroll, { passive: true });
window.addEventListener('keydown', event => {
  if (!ONBOARDING_SCROLL_KEYS.has(event.key)) return;
  noteCaseOnboardingUserScroll();
}, { capture: true });

if (motionBtn) {
  motionBtn.addEventListener('click', () => {
    const overlay = document.getElementById('obOverlay');
    if (overlay?.classList.contains('on') && !overlay.classList.contains('inline-help')) return;
    setPartialMotionDisabled(!partialMotionDisabled, { persist: true });
    showMotionModeHelpOnce();
  });
}

/* ─────────────────────────────────────────────
   AUDIO  (Web Audio API — no files needed)
───────────────────────────────────────────── */
let actx = null, ambGain = null, soundOn = false;
const soundBtn  = document.getElementById('btn-sound');
const soundIcon = document.getElementById('sound-icon');

function initAudio() {
  if (actx) return true;
  if (!window.AudioContext && !window.webkitAudioContext) return false;
  actx = new (window.AudioContext || window.webkitAudioContext)();
  const master = actx.createGain(); master.gain.value = 0.12; master.connect(actx.destination);
  ambGain = actx.createGain(); ambGain.gain.value = 0; ambGain.connect(master);

  // Ambient drone removed: no constant 55 / 82.41 / 110 Hz background oscillators.
  // The audio context is kept only for short UI sounds triggered by user interaction.
  return true;
}

async function enableAmbientAudio() {
  if (!initAudio()) return;
  if (actx.state === 'suspended') await actx.resume();
  soundOn = true;
  if (ambGain) ambGain.gain.setTargetAtTime(.45, actx.currentTime, 1.8);
  if (soundBtn) soundBtn.classList.add('active');
  if (soundIcon) {
    soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
  }
  soundBtn?.querySelector('.tlabel') && (soundBtn.querySelector('.tlabel').textContent = 'Звук увімкнено');
}

if (soundBtn) {
  soundBtn.addEventListener('click', async () => {
    if (!soundOn) {
      await enableAmbientAudio();
    } else {
      soundOn = false;
      ambGain.gain.setTargetAtTime(0, actx.currentTime, .6);
      soundBtn.classList.remove('active');
      soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
      soundBtn.querySelector('.tlabel').textContent = 'Звук вимкнено';
    }
  });
}

function playUI(type) {
  if (!soundOn || !actx) return;
  const g = actx.createGain(); g.connect(actx.destination);
  const o = actx.createOscillator();
  if (type === 'switch') {
    o.type = 'sine'; o.frequency.setValueAtTime(900, actx.currentTime);
    o.frequency.setTargetAtTime(700, actx.currentTime, .04);
    g.gain.setValueAtTime(.06, actx.currentTime);
    g.gain.setTargetAtTime(0, actx.currentTime + .04, .04);
    o.connect(g); o.start(); o.stop(actx.currentTime + .18);
  } else if (type === 'hover') {
    o.type = 'sine'; o.frequency.value = 1440;
    g.gain.setValueAtTime(.025, actx.currentTime);
    g.gain.setTargetAtTime(0, actx.currentTime, .07);
    o.connect(g); o.start(); o.stop(actx.currentTime + .22);
  }
}

/* ─────────────────────────────────────────────
   LANGUAGE TOGGLE
───────────────────────────────────────────── */
const langToggle = document.getElementById('lang-toggle');
const langBtn = document.getElementById('lang-btn');
const langMenuItems = langToggle?.querySelectorAll('.lang-menu-item');
const currentLang = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ua';
const langPages = {
  ua: './indexUA-source.html',
  en: './index-source.html'
};

function updateLangUI() {
  langMenuItems?.forEach(item => {
    item.classList.toggle('active', item.dataset.lang === currentLang);
  });
}

updateLangUI();

// Toggle menu
langBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langToggle?.classList.toggle('open');
  if (isOpen) {
    langBtn?.classList.add('active');
  } else {
    langBtn?.classList.remove('active');
  }
});

// Menu item click
langMenuItems?.forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.dataset.lang;

    langToggle?.classList.remove('open');
    langBtn?.classList.remove('active');

    if (selectedLang === currentLang) {
      return;
    }

    playUI('switch');
    setTimeout(() => {
      window.location.href = langPages[selectedLang] || langPages.ua;
    }, 150);
  });
});

// Close menu on outside click
document.addEventListener('click', () => {
  langToggle?.classList.remove('open');
  langBtn?.classList.remove('active');
});

// Keep audio idle until a user gesture, so browser autoplay policies do not block it.
window.addEventListener('load', () => {
  // Trigger initial parallax pass only in full animation mode.
  if (isPartialMotionDisabled()) return;
  requestAnimationFrame(() => {
    parallaxMotionCards();
    parallaxPrintedItems();
    parallaxSocialPosts();
  });
});

/* ─────────────────────────────────────────────
   MOTION DESIGN SECTION - HORIZONTAL SCROLL
───────────────────────────────────────────── */
const motionTrack = document.getElementById('motionTrack');
const motionPrevBtn = document.getElementById('motionPrev');
const motionNextBtn = document.getElementById('motionNext');
const motionCards = document.querySelectorAll('.motion-card');
const MOTION_DEMO_SEEN_STORAGE_KEY = 'portfolioMotionDemoSeen';
const PRINTED_DEMO_SEEN_STORAGE_KEY = 'portfolioPrintedDemoSeen';

if (motionTrack && motionPrevBtn && motionNextBtn) {
  const scrollAmount = 480; // width of card + gap
  
  function scrollMotion(direction) {
    const currentScroll = motionTrack.scrollLeft;
    const targetScroll = direction === 'next' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;
    
    motionTrack.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }
  
  motionPrevBtn.addEventListener('click', () => scrollMotion('prev'));
  motionNextBtn.addEventListener('click', () => scrollMotion('next'));
  
  // Update button states based on scroll position
  let navButtonsRaf = null;

  function updateNavButtons() {
    const maxScroll = motionTrack.scrollWidth - motionTrack.clientWidth;
    const isAtStart = motionTrack.scrollLeft <= 10;
    const isAtEnd = motionTrack.scrollLeft >= maxScroll - 10;
    
    motionPrevBtn.style.opacity = isAtStart ? '0.5' : '1';
    motionPrevBtn.disabled = isAtStart;
    motionNextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    motionNextBtn.disabled = isAtEnd;
  }

  function requestNavButtonsUpdate() {
    if (navButtonsRaf) return;
    navButtonsRaf = requestAnimationFrame(() => {
      navButtonsRaf = null;
      updateNavButtons();
    });
  }
  
  motionTrack.addEventListener('scroll', requestNavButtonsUpdate, { passive: true });
  window.addEventListener('resize', requestNavButtonsUpdate, { passive: true });
  
  // Initial button state
  setTimeout(updateNavButtons, 100);
  
  // Auto-demo when section's top edge is in viewport
  let motionDemoRunning = false;
  const motionSection = document.getElementById('motionSection');
  if (motionSection && 'IntersectionObserver' in window && !readStorageFlag(MOTION_DEMO_SEEN_STORAGE_KEY)) {
    const demoObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !motionDemoRunning && !readStorageFlag(MOTION_DEMO_SEEN_STORAGE_KEY)) {
          motionDemoRunning = true;
          writeStorageFlag(MOTION_DEMO_SEEN_STORAGE_KEY);
          demoObs.unobserve(motionSection);
          motionTrack.scrollLeft = 0;
          setTimeout(() => {
            (async () => {
              // Forward 2 times
              scrollMotion('next');
              await new Promise(r => setTimeout(r, 1200));
              scrollMotion('next');
              await new Promise(r => setTimeout(r, 1200));
              // Back 2 times
              scrollMotion('prev');
              await new Promise(r => setTimeout(r, 1200));
              scrollMotion('prev');
              motionDemoRunning = false;
            })();
          }, 300);
        }
      });
    }, { threshold: 0 });
    demoObs.observe(motionSection);
  }
}

/* ─────────────────────────────────────────────
   PRINTED MATERIALS SECTION - HORIZONTAL SCROLL
───────────────────────────────────────────── */
const printedTrack = document.getElementById('printedTrack');
const printedPrevBtn = document.getElementById('printedPrev');
const printedNextBtn = document.getElementById('printedNext');

if (printedTrack && printedPrevBtn && printedNextBtn) {
  const scrollAmount = 420; // width of item + gap
  
  function scrollPrinted(direction) {
    const currentScroll = printedTrack.scrollLeft;
    const targetScroll = direction === 'next' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;
    
    printedTrack.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }
  
  printedPrevBtn.addEventListener('click', () => scrollPrinted('prev'));
  printedNextBtn.addEventListener('click', () => scrollPrinted('next'));
  
  // Update button states based on scroll position
  let printedNavButtonsRaf = null;

  function updatePrintedNavButtons() {
    const maxScroll = printedTrack.scrollWidth - printedTrack.clientWidth;
    const isAtStart = printedTrack.scrollLeft <= 10;
    const isAtEnd = printedTrack.scrollLeft >= maxScroll - 10;
    
    printedPrevBtn.style.opacity = isAtStart ? '0.5' : '1';
    printedPrevBtn.disabled = isAtStart;
    printedNextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    printedNextBtn.disabled = isAtEnd;
  }

  function requestPrintedNavButtonsUpdate() {
    if (printedNavButtonsRaf) return;
    printedNavButtonsRaf = requestAnimationFrame(() => {
      printedNavButtonsRaf = null;
      updatePrintedNavButtons();
    });
  }
  
  printedTrack.addEventListener('scroll', requestPrintedNavButtonsUpdate, { passive: true });
  window.addEventListener('resize', requestPrintedNavButtonsUpdate, { passive: true });
  
  // Initial button state
  setTimeout(updatePrintedNavButtons, 100);
  
  // Auto-demo when section's top edge is in viewport
  let printedDemoRunning = false;
  const printedSection = document.getElementById('printedSection');
  if (printedSection && 'IntersectionObserver' in window && !readStorageFlag(PRINTED_DEMO_SEEN_STORAGE_KEY)) {
    const printedDemoObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !printedDemoRunning && !readStorageFlag(PRINTED_DEMO_SEEN_STORAGE_KEY)) {
          printedDemoRunning = true;
          writeStorageFlag(PRINTED_DEMO_SEEN_STORAGE_KEY);
          printedDemoObs.unobserve(printedSection);
          printedTrack.scrollLeft = 0;
          setTimeout(() => {
            (async () => {
              // Forward 2 times
              scrollPrinted('next');
              await new Promise(r => setTimeout(r, 1200));
              scrollPrinted('next');
              await new Promise(r => setTimeout(r, 1200));
              // Back 2 times
              scrollPrinted('prev');
              await new Promise(r => setTimeout(r, 1200));
              scrollPrinted('prev');
              printedDemoRunning = false;
            })();
          }, 300);
        }
      });
    }, { threshold: 0 });
    printedDemoObs.observe(printedSection);
  }
}

/* ═══════════════════════════════════════════════════════════════
   HERO PARALLAX ON SCROLL
═══════════════════════════════════════════════════════════════ */
window.addEventListener('load', function () {
  const photoWrapper = document.querySelector('.hero-photo-wrapper');
  const photo        = document.querySelector('.hero-photo-clip');
  const cloudEls     = document.querySelectorAll('[class^="hero-clouds"]');
  if (!photoWrapper || !photo) return;

  const cloudOriginalFilters = Array.from(cloudEls).map(el =>
    getComputedStyle(el).filter
  );

  let rafId = null;

  function resetHeroParallax() {
    photo.style.marginLeft = '';
    photo.style.opacity    = '';
    cloudEls.forEach(el => {
      el.style.marginLeft = '';
      el.style.filter     = '';
    });
  }

  function onScroll() {
    if (isPartialMotionDisabled()) {
      resetHeroParallax();
      return;
    }
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;

      const rect   = photoWrapper.getBoundingClientRect();
      const vh     = window.innerHeight;
      const center = rect.top + rect.height / 2;

      const effectVh = Math.min(vh, 700);
      const start = effectVh * 0.9;
      const end   = -rect.height * 0.5;
      const raw   = (start - center) / (start - end);
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const p = scrollY <= 1 ? 0 : Math.min(1, Math.max(0, raw - 0.28));

      const isMobile = window.innerWidth <= 950;
      const photoDrift = isMobile ? 130 : 200;
      const cloudDrift = isMobile ? -120 : -250;

      if (p <= 0) {
        photo.style.marginLeft = '';
        photo.style.opacity    = '';
        cloudEls.forEach(el => {
          el.style.marginLeft = '';
          el.style.filter     = '';
        });
        return;
      }

      photo.style.marginLeft = `${p * photoDrift}px`;
      photo.style.opacity    = String(Math.max(0, 1 - p * 1.7));

      cloudEls.forEach((el, i) => {
        el.style.marginLeft = `${p * cloudDrift}px`;
        el.style.filter     = `opacity(${Math.max(0, 1 - p * 1.8)}) ${cloudOriginalFilters[i]}`;
      });
    });
  }

  window.addEventListener('resize', () => {
    resetHeroParallax();
    onScroll();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

/* ─────────────────────────────────────────────
   VIEWPORT IMAGE LOADING
───────────────────────────────────────────── */
/* ---------------------------------------------
   SOCIAL POST CAROUSELS
--------------------------------------------- */
function initSocialPostCarousels(root = document) {
  const carousels = root.querySelectorAll?.('.post-visual[data-social-carousel]') || [];

  carousels.forEach(visual => {
    if (visual.dataset.socialCarouselReady === '1') return;

    const slides = Array.from(visual.children)
      .filter(slide => slide.matches?.('img, video'));

    if (!slides.length) return;

    visual.dataset.socialCarouselReady = '1';
    let activeIndex = 0;
    let timerId = null;
    let isTransitioning = false;
    let carouselHydrated = false;
    let carouselStartPending = false;
    const interval = Math.max(1400, Number(visual.dataset.socialCarouselInterval) || 2000);
    const transitionMs = 700;

    function isSocialSlideReady(slide) {
      if (slide.dataset.preloaderError === '1') return true;
      if (slide.dataset.bgSrc || slide.querySelector?.('source[data-bg-src]')) return false;
      return isMediaReady(slide);
    }

    function areSocialSlidesReady() {
      return slides.every(isSocialSlideReady);
    }

    function hydrateSocialCarousel() {
      if (carouselHydrated) return;
      carouselHydrated = true;
      slides.forEach(slide => {
        if (slide.tagName === 'IMG') {
          hydrateDeferredImage(slide);
        } else if (slide.tagName === 'VIDEO') {
          hydrateDeferredVideo(slide);
        }
      });
      syncSocialCarouselStart();
    }

    function syncSocialCarouselStart() {
      if (!carouselStartPending || timerId || slides.length < 2) return;
      if (!carouselHydrated || !areSocialSlidesReady()) return;
      timerId = setInterval(() => setActiveSlide(activeIndex + 1), interval);
    }

    slides.forEach(slide => {
      const syncStart = () => syncSocialCarouselStart();
      if (slide.tagName === 'IMG') {
        slide.addEventListener('load', syncStart);
        slide.addEventListener('error', syncStart);
      } else if (slide.tagName === 'VIDEO') {
        slide.addEventListener('loadeddata', syncStart);
        slide.addEventListener('canplay', syncStart);
        slide.addEventListener('error', syncStart);
      }
    });

    function setSlidePosition(slide, offset, animate = true) {
      const travel = offset === 0
        ? '0'
        : offset > 0
          ? 'calc(100% + 3px)'
          : 'calc(-100% - 3px)';
      slide.style.transition = animate ? '' : 'none';
      slide.style.transform = `translate3d(${travel}, 0, 0)`;
    }

    function clearSlideVisibilityOverride(slide) {
      slide.style.opacity = '';
      slide.style.visibility = '';
    }

    function hideSlideInstantly(slide, offset = 1) {
      slide.style.transition = 'none';
      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
      setSlidePosition(slide, offset, false);
    }

    function setActiveSlide(nextIndex, animate = true) {
      const normalizedIndex = (nextIndex + slides.length) % slides.length;
      if (isTransitioning || (normalizedIndex === activeIndex && animate)) return;

      if (!animate || slides.length < 2) {
        activeIndex = normalizedIndex;
        slides.forEach((slide, index) => {
          const isActive = index === normalizedIndex;
          if (isActive) clearSlideVisibilityOverride(slide);
          slide.classList.toggle('social-carousel-active', isActive);
          slide.classList.remove('social-carousel-exiting');
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          setSlidePosition(slide, isActive ? 0 : 1, false);
        });
        requestAnimationFrame(() => slides.forEach(slide => {
          slide.style.transition = '';
        }));
        return;
      }

      const previousIndex = activeIndex;
      const previousSlide = slides[previousIndex];
      const nextSlide = slides[normalizedIndex];
      isTransitioning = true;
      activeIndex = normalizedIndex;

      slides.forEach((slide, index) => {
        const isActive = index === normalizedIndex;
        const isExiting = index === previousIndex;
        if (isActive || isExiting) clearSlideVisibilityOverride(slide);
        slide.classList.toggle('social-carousel-active', isActive);
        slide.classList.toggle('social-carousel-exiting', isExiting);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if (!isActive && !isExiting) {
          setSlidePosition(slide, 1, false);
        }

        if (slide.tagName === 'VIDEO') {
          if (isActive && slide.autoplay) {
            slide.play().catch(() => {});
          } else if (!isActive && !isExiting) {
            slide.pause();
          }
        }
      });

      setSlidePosition(nextSlide, 1, false);
      requestAnimationFrame(() => {
        setSlidePosition(previousSlide, -1);
        setSlidePosition(nextSlide, 0);
      });

      setTimeout(() => {
        hideSlideInstantly(previousSlide, 1);
        previousSlide.classList.remove('social-carousel-exiting');
        if (previousSlide.tagName === 'VIDEO') previousSlide.pause();
        slides.forEach((slide, index) => {
          if (index !== activeIndex && slide !== previousSlide) hideSlideInstantly(slide, 1);
        });
        requestAnimationFrame(() => slides.forEach(slide => {
          clearSlideVisibilityOverride(slide);
          slide.style.transition = '';
        }));
        isTransitioning = false;
      }, transitionMs);
    }

    function startCarousel() {
      if (timerId || slides.length < 2) return;
      carouselStartPending = true;
      hydrateSocialCarousel();
      syncSocialCarouselStart();
    }

    function stopCarousel() {
      carouselStartPending = false;
      if (!timerId) return;
      clearInterval(timerId);
      timerId = null;
    }

    setActiveSlide(0, false);

    if ('IntersectionObserver' in window) {
      const loadObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          hydrateSocialCarousel();
          loadObserver.unobserve(visual);
        });
      }, { rootMargin: '120px 0px', threshold: 0 });

      loadObserver.observe(visual);

      if (slides.length < 2) return;

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCarousel();
          } else {
            stopCarousel();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(visual);
    } else {
      hydrateSocialCarousel();
      startCarousel();
    }
  });
}

initSocialPostCarousels();

const VIEWPORT_IMAGE_SELECTOR = 'img[data-bg-src]';
const viewportManagedImages = new Set();
let viewportImageLoadObserver = null;
let viewportImageFallbackRaf = null;

function isElementNearViewport(el, margin = 120) {
  if (!el.isConnected) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0
    && rect.height > 0
    && rect.bottom > -margin
    && rect.right > -margin
    && rect.top < window.innerHeight + margin
    && rect.left < window.innerWidth + margin;
}

function hydrateDeferredImage(img) {
  const src = img?.dataset?.bgSrc;
  if (!src) return;

  img.setAttribute('src', src);
  img.removeAttribute('data-bg-src');
  updateMediaLoadbox(img, 'loading');
}

function isSocialCarouselImage(img) {
  return Boolean(img.closest?.('.post-visual[data-social-carousel]'));
}

function ensureViewportImageLoadObserver() {
  if (viewportImageLoadObserver || !('IntersectionObserver' in window)) {
    return viewportImageLoadObserver;
  }

  viewportImageLoadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      hydrateDeferredImage(entry.target);
      viewportImageLoadObserver.unobserve(entry.target);
      viewportManagedImages.delete(entry.target);
    });
  }, { rootMargin: '120px 0px', threshold: 0 });

  return viewportImageLoadObserver;
}

function registerViewportImage(img) {
  if (!img || !img.matches?.(VIEWPORT_IMAGE_SELECTOR) || viewportManagedImages.has(img)) return;
  if (isSocialCarouselImage(img)) return;

  const observer = ensureViewportImageLoadObserver();
  if (observer) {
    viewportManagedImages.add(img);
    observer.observe(img);
  } else if (isElementNearViewport(img)) {
    hydrateDeferredImage(img);
  } else {
    viewportManagedImages.add(img);
  }
}

function initViewportImageLoading(root = document) {
  if (root.matches?.(VIEWPORT_IMAGE_SELECTOR)) {
    registerViewportImage(root);
  }
  root.querySelectorAll?.(VIEWPORT_IMAGE_SELECTOR).forEach(registerViewportImage);
}

function syncViewportImagesFallback() {
  viewportManagedImages.forEach(img => {
    if (!img.isConnected || !img.dataset.bgSrc) {
      viewportManagedImages.delete(img);
      return;
    }

    if (isElementNearViewport(img)) {
      hydrateDeferredImage(img);
      viewportManagedImages.delete(img);
    }
  });
}

function requestViewportImageFallbackSync() {
  if (viewportImageLoadObserver || viewportImageFallbackRaf) return;
  viewportImageFallbackRaf = requestAnimationFrame(() => {
    viewportImageFallbackRaf = null;
    syncViewportImagesFallback();
  });
}

initViewportImageLoading();

if (!viewportImageLoadObserver) {
  window.addEventListener('scroll', requestViewportImageFallbackSync, { passive: true });
  window.addEventListener('resize', requestViewportImageFallbackSync, { passive: true });
}

// ═══════════════════════════════════════════════════════════════
//    FOOTER JS — Google Apps Script endpoint
//    Put your deployed Apps Script Web App URL below.
// ═══════════════════════════════════════════════════════════════

(function () {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyirWlm-m0eiFEUND8llLR3CginCxDQE2wqrDp1yuyIv3HrKqRW_xiqtBG42wFbbqtq3A/exec'; // ← сюда
 
  const form   = document.getElementById('contactForm');
  const btn    = document.getElementById('ffBtn');
  const btnWrap = document.getElementById('ffBtnWrap');
  const status = document.getElementById('ffStatus');
  const msgField = document.getElementById('ff-msg');
  const fields = {
    name: document.getElementById('ff-name'),
    email: document.getElementById('ff-email'),
    msg: document.getElementById('ff-msg')
  };
  const SUBMIT_TIMEOUT_MS = 20000;
  let emailErrorArmed = false;
  let invalidHintTimer = null;
  let resultStatusPinned = false;

  function clearResultStatus() {
    if (!resultStatusPinned) return;
    resultStatusPinned = false;
    status.textContent = '';
    status.className   = 'ff-status';
  }

  if (!form) return;

  msgField?.closest('.ff-field.outer')?.addEventListener('click', () => {
    msgField.focus();
  });
 
  function setError(el) {
    el.classList.add('error');
    el.closest('.ff-field.outer')?.classList.add('error');
    showInvalidFormHint();
  }

  function showInvalidFormHint(duration = 0) {
    clearTimeout(invalidHintTimer);
    resultStatusPinned = false;
    status.textContent = 'Заповніть усі поля. Не забудьте @ в email.';
    status.className   = 'ff-status err';

    if (duration) {
      invalidHintTimer = setTimeout(() => {
        if (!form.querySelector('.error')) {
          status.textContent = '';
          status.className   = 'ff-status';
        }
      }, duration);
    }
  }
 
  function clearError(el) {
    el.classList.remove('error');
    el.closest('.ff-field.outer')?.classList.remove('error');
    if (!form.querySelector('.error')) {
      status.textContent = '';
      status.className   = 'ff-status';
    }
  }

  function isFieldValid(el) {
    const value = el.value.trim();
    if (!value) return false;
    return el.id !== 'ff-email' || value.includes('@');
  }

  function updateButtonState() {
    btn.disabled = !Object.values(fields).every(isFieldValid);
  }

  function updateFieldState(el, eventType) {
    const value = el.value.trim();

    if (!value) {
      clearError(el);
      if (el === fields.email) emailErrorArmed = false;
      updateButtonState();
      return false;
    }

    if (el === fields.email && !isFieldValid(el)) {
      if (eventType === 'focusout') {
        emailErrorArmed = true;
      }
      if (emailErrorArmed) {
        setError(el);
      }
      updateButtonState();
      return false;
    }

    clearError(el);
    updateButtonState();
    return true;
  }

  Object.values(fields).forEach(el => {
    el.addEventListener('focus', clearResultStatus);
    el.addEventListener('focusout', () => updateFieldState(el, 'focusout'));
    el.addEventListener('input', () => {
      clearResultStatus();
      updateFieldState(el, 'input');
    });
  });

  btnWrap.addEventListener('pointerenter', e => {
    if (!resultStatusPinned && e.pointerType !== 'touch' && !validateForm()) {
      showInvalidFormHint();
    }
  });

  btnWrap.addEventListener('pointerleave', e => {
    if (!resultStatusPinned && e.pointerType !== 'touch' && !form.querySelector('.error')) {
      status.textContent = '';
      status.className   = 'ff-status';
    }
  });

  btnWrap.addEventListener('pointerdown', e => {
    clearResultStatus();
    if ((e.pointerType === 'touch' || e.pointerType === 'pen') && !validateForm()) {
      showInvalidFormHint(5000);
    }
  });

  function validateForm() {
    return Object.values(fields).every(isFieldValid);
  }

  updateButtonState();
 
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    btn.disabled = true;
    btn.querySelector('.ff-btn-text').textContent = 'Надсилаю...';
    resultStatusPinned = false;
    status.textContent = '';
    status.className   = 'ff-status';
 
    const name  = document.getElementById('ff-name').value.trim();
    const email = document.getElementById('ff-email').value.trim();
    const msg   = document.getElementById('ff-msg').value.trim();
 
    const payload = new URLSearchParams({
      event: 'contact_form',
      name,
      email,
      message: msg,
      page: location.href
    });
 
    let submitTimeout = null;

    try {
      const controller = typeof AbortController !== 'undefined'
        ? new AbortController()
        : null;
      submitTimeout = controller
        ? setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
        : null;
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        signal: controller?.signal,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Server error');
      }

      status.textContent = '✓ Повідомлення надіслано. Відповім найближчим часом.';
      status.className   = 'ff-status ok';
      resultStatusPinned = true;
      form.reset();
    } catch (err) {
      status.textContent = 'Щось пішло не так. Напишіть напряму: alexander.smirnoff98@gmail.com';
      status.className   = 'ff-status err';
      resultStatusPinned = true;
    } finally {
      clearTimeout(submitTimeout);
      btn.querySelector('.ff-btn-text').textContent = 'Надіслати';
      updateButtonState();
    }
  });
})();

}
