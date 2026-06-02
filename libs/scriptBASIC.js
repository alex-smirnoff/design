'use strict';
const xD = function () {
  try {
    var h = String(location.hostname || '').toLowerCase();
    var p = String(location.pathname || '');
    return h === 'alex-smirnoff.github.io' && (p === '/design' || p.indexOf('/design/') === 0);
  } catch (e) {
    return false;
  }
}();
if (!xD) {
  document.documentElement.style.opacity = '0';
  setTimeout(() => {
    document.querySelectorAll('link[rel=stylesheet], style').forEach(e => e.remove());
  }, 0);
  throw Error();
}
const UI_LANG = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ua';
const UI_TEXT = {
  ua: {
    intent: 'Проблема (мета)',
    structure: 'Структура роботи',
    aim: 'Бізнес-ефект',
    details: 'Детальніше',
    mission: '— Космічна місія',
    intro: 'Я поєдную креативні індустрії з технічною експертизою. Це портфоліо я задизайнив і закодив самотужки.',
    motionDisable: 'Вимкнути важкі анімації',
    motionEnable: 'Увімкнути важкі анімації',
    motionOn: 'Анімації максимум',
    motionOff: 'Базові анімації',
    soundOn: 'Звук увімкнено',
    soundOff: 'Звук вимкнено',
    fill: 'Заповніть усі поля. Не забудьте @ в email.',
    sending: 'Надсилаю...',
    send: 'Надіслати',
    sent: '✓ Повідомлення надіслано. Відповім найближчим часом.',
    fail: 'Щось пішло не так. Напишіть напряму: alexander.smirnoff98@gmail.com'
  },
  en: {
    intent: 'Problem / goal',
    structure: 'Work structure',
    aim: 'Business impact',
    details: 'Explore case',
    mission: '— Cosmic mission',
    intro: 'I bring creative industries together with technical expertise. I designed and coded this portfolio myself.',
    motionDisable: 'Disable rich animations',
    motionEnable: 'Enable rich animations',
    motionOn: 'Full animations',
    motionOff: 'Basic animations',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    fill: 'Please fill in all fields. Please include @ in your email address.',
    sending: 'Sending...',
    send: 'Send',
    sent: '✓ Message sent. I’ll get back to you soon.',
    fail: 'Something went wrong. Please contact me directly: alexander.smirnoff98@gmail.com'
  }
}[UI_LANG];



const TOOLS = {
  intent:    { label:UI_TEXT.intent,    color:'#3d6fff', glow:'rgba(61,111,255,0.18)' },
  structure: { label:UI_TEXT.structure, color:'#8833ff', glow:'rgba(136,51,255,0.18)' },
  aim:       { label:UI_TEXT.aim,       color:'#00ddff', glow:'rgba(0,221,255,0.18)'  }
};
let activeTool = 'intent';


const MOTION_LIGHT_CLASS = 'xmdLite';
const ONBOARDING_MOTION_STORAGE_KEY = 'portfolio:onboarding:motion-complete';
const ONBOARDING_CASE_STORAGE_KEY = 'portfolio:onboarding:case-complete';
const ONBOARDING_MOTION_MODE_STORAGE_KEY = 'portfolio:onboarding:motion-mode';
let partialMotionDisabled = true;
let onboardingMotionChoice = readStoredMotionChoice();
let onboardingMotionGateComplete = readStorageFlag(ONBOARDING_MOTION_STORAGE_KEY);
let onboardingScrollLocked = false;
let onboardingLockedScrollY = 0;
const ONBOARDING_SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);
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

function readStoredMotionChoice() {
  const storedChoice = readStorageValue(ONBOARDING_MOTION_MODE_STORAGE_KEY);
  return storedChoice === 'max' || storedChoice === 'base' ? storedChoice : null;
}

const ANALYTICS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxlTa6eEH9PVB0aRhajHgHt4umP5rOep35UB4eEin08gOMdrM6bR51g7XRj9-aPdWF-/exec';
const user = `user${Math.floor(10000 + Math.random() * 90000)}`;
const analyticsOnceKeys = new Set();
const watchedCaseAspects = new Set();

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
  return cleanAnalyticsText(work?.querySelector?.('.xUbgIeF')?.textContent) || 'unknown case';
}

function getMotionCardTitle(card) {
  return cleanAnalyticsText(card?.querySelector?.('.xbaoZnQ6')?.textContent) || 'unknown motion case';
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(() => trackEvent('page opened'), { timeout: 3000 });
} else {
  window.addEventListener('load', () => setTimeout(() => trackEvent('page opened'), 1000), { once: true });
}

function preventOnboardingScroll(event) {
  if (!onboardingScrollLocked) return;
  event.preventDefault();
}

function preventOnboardingKeyScroll(event) {
  if (!onboardingScrollLocked || !ONBOARDING_SCROLL_KEYS.has(event.key)) return;
  event.preventDefault();
}

function keepOnboardingScrollPosition() {
  if (!onboardingScrollLocked) return;
  const currentScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  if (currentScrollY !== onboardingLockedScrollY) {
    window.scrollTo({ top: onboardingLockedScrollY, behavior: 'auto' });
  }
}

function lockOnboardingScroll() {
  if (onboardingScrollLocked) return;
  onboardingScrollLocked = true;
  onboardingLockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  window.addEventListener('wheel', preventOnboardingScroll, { passive: false, capture: true });
  window.addEventListener('touchmove', preventOnboardingScroll, { passive: false, capture: true });
  window.addEventListener('keydown', preventOnboardingKeyScroll, { capture: true });
  window.addEventListener('scroll', keepOnboardingScrollPosition, { passive: true, capture: true });
}

function unlockOnboardingScroll() {
  if (!onboardingScrollLocked) return;
  onboardingScrollLocked = false;
  window.removeEventListener('wheel', preventOnboardingScroll, { capture: true });
  window.removeEventListener('touchmove', preventOnboardingScroll, { capture: true });
  window.removeEventListener('keydown', preventOnboardingKeyScroll, { capture: true });
  window.removeEventListener('scroll', keepOnboardingScrollPosition, { capture: true });
}


const sf = document.getElementById('qciVDID');
const sfx = sf.getContext('2d');
let W = 0, H = 0;

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

function getStarGlowScale() {
  return W > 1700 ? 1 / Math.max(1, (W * H) / (1700 * 950)) : 1;
}

function createStar(i, staticTotal) {
  const baseX = Math.random();
  const baseY = Math.random();
  const isStatic = i < staticTotal; 
  const isTwinkling = !isStatic && Math.random() > 0.6; 

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
    scrollDepth: Math.random() * 10 + 0.2, 
    distToTarget: 999
  };
}


let stars = [];
function syncStars() {
  const { total, staticTotal } = getStarCounts();
  if (stars.length === total) return;
  stars = Array.from({length: total}, (_, i) => createStar(i, staticTotal));
}
syncStars();


const comets = [];
function createComet() {
  const angle = Math.random() * Math.PI * 1.6 + Math.PI * 0.25; 
  const speed = Math.random() * 0.0035 + 0.0018;
  const colors = [
    { core: [255, 150, 50], glow: [255, 120, 30], trail: [255, 180, 80] }, 
    { core: [255, 200, 50], glow: [255, 200, 30], trail: [255, 220, 100] }, 
    { core: [255, 100, 80], glow: [255, 80, 60], trail: [255, 140, 100] }  
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return {
    x: Math.random(),
    y: -0.18,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed + 0.0008, 
    life: 1,
    color: color,
    size: Math.random() * 3 + 2,
    brightness: Math.random() * 0.4 + 0.8
  };
}


setInterval(() => {
  if (isPartialMotionDisabled()) {
    comets.length = 0;
    return;
  }
  if (comets.length < 6) {
    comets.push(createComet());
  }
}, 3200);


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


const nebulae = [
  {x:.75, y:.20, baseX:.75, baseY:.20, r:380, dirX: -0.28, dirY: 0.15, drift: 0, driftSpeed: 0.00015, colors:[{stop:0, color:'rgba(136,51,255,0.24)'}, {stop:.3, color:'rgba(200,100,255,0.12)'}, {stop:1, color:'rgba(136,51,255,0)'}], scrollSpeed:0.18},
  {x:.20, y:.75, baseX:.20, baseY:.75, r:420, dirX: 0.32, dirY: -0.18, drift: 0, driftSpeed: 0.00012, colors:[{stop:0, color:'rgba(61,111,255,0.22)'}, {stop:.32, color:'rgba(100,150,255,0.11)'}, {stop:1, color:'rgba(61,111,255,0)'}], scrollSpeed:0.15},
  {x:.85, y:.65, baseX:.85, baseY:.65, r:350, dirX: -0.20, dirY: 0.25, drift: 0, driftSpeed: 0.00018, colors:[{stop:0, color:'rgba(255,100,150,0.2)'}, {stop:.38, color:'rgba(255,150,180,0.1)'}, {stop:1, color:'rgba(255,100,150,0)'}], scrollSpeed:0.2}
];


const finePointerQuery = window.matchMedia?.('(any-pointer: fine)');
let hasFinePointer = finePointerQuery?.matches ?? false;
if (!hasFinePointer) document.body.classList.add('xcg9AQD3');

let glowBrightness = 0;
let lastInputType = hasFinePointer ? 'mouse' : 'touch';
let lastTouchAt = 0;
const attractorInputs = {
  mouse: createAttractorInput(),
  touch: createAttractorInput()
};
const inputCaptureOptions = { passive: true, capture: true };
const ATTRACTOR_READY_DELAY = 0.5;
const SYNTHETIC_MOUSE_WINDOW = 1600;

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

function setFinePointerAvailable(isAvailable) {
  hasFinePointer = isAvailable;
  document.body.classList.toggle('xcg9AQD3', !hasFinePointer);
}

if (finePointerQuery) {
  const onFinePointerChange = e => setFinePointerAvailable(e.matches);
  if (finePointerQuery.addEventListener) {
    finePointerQuery.addEventListener('change', onFinePointerChange);
  } else if (finePointerQuery.addListener) {
    finePointerQuery.addListener(onFinePointerChange);
  }
}

function isLikelySyntheticMouseEvent(e) {
  if (e.pointerType === 'mouse') return false;
  if (e.sourceCapabilities?.firesTouchEvents) return true;
  if (!hasFinePointer && lastTouchAt) return true;
  if (!lastTouchAt) return false;
  return performance.now() - lastTouchAt <= SYNTHETIC_MOUSE_WINDOW;
}

function isRealMouseEvent(e) {
  return !isLikelySyntheticMouseEvent(e);
}

function setAttractorInput(type, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
  const input = attractorInputs[type];
  input.x = x;
  input.y = y;
  input.stoppedTime = 0;
  input.idleTime = 0;
  input.isIdle = false;
  input.lastAt = performance.now();
  input.seen = true;
  lastInputType = type;

  if (type === 'touch') {
    lastTouchAt = input.lastAt;
    document.body.classList.add('xckzgdOW');
  }

  return true;
}

function activateMouseInput(e) {
  if (isLikelySyntheticMouseEvent(e)) return false;
  setFinePointerAvailable(true);
  document.body.classList.remove('xckzgdOW');
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

function activateTouchInputAt(x, y, shouldSnapCursor = false) {
  const didSet = setAttractorInput('touch', x, y);
  if (didSet && typeof moveCursorTo === 'function') moveCursorTo(x, y, shouldSnapCursor);
  return didSet;
}

function activateTouchInput(e) {
  const touch = getTouchPointFromEvent(e);
  if (!touch) return false;
  return activateTouchInputAt(touch.clientX, touch.clientY, e.type === 'touchstart');
}

function activateTouchPointerInput(e) {
  if (e.pointerType === 'mouse') return false;
  return activateTouchInputAt(e.clientX, e.clientY, e.type === 'pointerdown');
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


document.addEventListener('touchstart', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchmove', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchend', activateTouchInput, inputCaptureOptions);
document.addEventListener('touchcancel', activateTouchInput, inputCaptureOptions);

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


setInterval(() => {
  updateAttractorIdle(attractorInputs.mouse);
  updateAttractorIdle(attractorInputs.touch);
}, 200);

function getReadyAttractor() {
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

let starfieldFrameId = null;

function scheduleStarfieldFrame() {
  if (starfieldFrameId !== null) return;
  starfieldFrameId = requestAnimationFrame(drawSF);
}

function drawStaticStarfield() {
  if (starfieldFrameId !== null) {
    cancelAnimationFrame(starfieldFrameId);
    starfieldFrameId = null;
  }
  drawSF(performance.now());
}

function drawSF(t) {
  starfieldFrameId = null;
  const motionOff = isPartialMotionDisabled();
  sfx.clearRect(0, 0, W, H);
  if (motionOff) {
    comets.length = 0;
    glowBrightness = 0;
  }
  
  
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
  
  
  if (!motionOff) for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];
    c.x += c.vx;
    c.y += c.vy;
    c.life -= 0.008; 
    
    if (c.life <= 0) {
      comets.splice(i, 1);
      continue;
    }
    
    const screenX = c.x * W;
    const screenY = c.y * H;
    const lifeAlpha = Math.pow(c.life, 1.2); 
    
    
    const trailDist = 650 * lifeAlpha; 
    const trailEndX = screenX - c.vx * trailDist * 80;
    const trailEndY = screenY - c.vy * trailDist * 80;
    
    
    const [r, g, b] = c.color.trail;
    
    
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
    
    
    const [hr, hg, hb] = c.color.glow;
    const haloGradient = sfx.createRadialGradient(screenX, screenY, 0, screenX, screenY, c.size * 12);
    haloGradient.addColorStop(0, `rgba(${hr}, ${hg}, ${hb}, ${lifeAlpha * 0.5})`);
    haloGradient.addColorStop(0.3, `rgba(${hr}, ${hg}, ${hb}, ${lifeAlpha * 0.15})`);
    haloGradient.addColorStop(1, 'rgba(255, 150, 80, 0)');
    sfx.fillStyle = haloGradient;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 12, 0, Math.PI * 2);
    sfx.fill();
    
    
    const [cr, cg, cb] = c.color.core;
    const coreGradient = sfx.createRadialGradient(screenX, screenY, 0, screenX, screenY, c.size * 4);
    coreGradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${lifeAlpha})`);
    coreGradient.addColorStop(0.5, `rgba(255, 200, 100, ${lifeAlpha * 0.6})`);
    coreGradient.addColorStop(1, 'rgba(255, 180, 100, 0)');
    sfx.fillStyle = coreGradient;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 4, 0, Math.PI * 2);
    sfx.fill();
    
    
    sfx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${lifeAlpha})`;
    sfx.beginPath();
    sfx.arc(screenX, screenY, c.size * 0.8, 0, Math.PI * 2);
    sfx.fill();
  }
  
  
  const attractor = motionOff ? null : getReadyAttractor();
  const attractorX = attractor?.x ?? -999;
  const attractorY = attractor?.y ?? -999;
  const isAttractorIdle = Boolean(attractor);
  const attractorStoppedTime = attractor?.stoppedTime ?? 0;
  
  const cursorXNorm = attractorX / W;
  const cursorYNorm = attractorY / H;
  
  stars.forEach(s => {
    if (motionOff) {
      
      s.x = s.baseX;
      s.y = s.baseY;
      s.vx = 0;
      s.vy = 0;
      s.distToTarget = 999;
    } else if (s.isStatic) {
      
      s.x = s.baseX;
      s.y = s.baseY;
    } else if (isAttractorIdle && attractorX > -999 && attractorStoppedTime > ATTRACTOR_READY_DELAY) {
      
      const distX = cursorXNorm - s.baseX;
      const distY = cursorYNorm - s.baseY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      s.distToTarget = distance;
      
      if (distance > 0.01) {
        const angle = Math.atan2(distY, distX);
        
        const accel = Math.max(0, 1 - distance * 0.7) * 0.000015;
        s.vx += Math.cos(angle) * accel;
        s.vy += Math.sin(angle) * accel;
      }
      
      s.vx *= 0.992; 
      s.vy *= 0.992;
      s.x += s.vx;
      s.y += s.vy;
    } else {
      
      const returnSpeed = 0.02; 
      s.x += (s.baseX - s.x) * returnSpeed;
      s.y += (s.baseY - s.y) * returnSpeed;
      s.vx *= 0.88;
      s.vy *= 0.88;
      s.distToTarget = 999;
    }
  });
  
  
  if (!motionOff && isAttractorIdle && attractorX > -999 && attractorStoppedTime > ATTRACTOR_READY_DELAY) {
    let nearbyBrightness = 0;
    const glowRadius = 0.22;
    
    stars.forEach(s => {
      const distToCursor = Math.sqrt(
        Math.pow(s.x - cursorXNorm, 2) + Math.pow(s.y - cursorYNorm, 2)
      );
      if (distToCursor < glowRadius) {
        nearbyBrightness += Math.max(0, 1 - distToCursor / glowRadius) * s.op;
      }
    });
    nearbyBrightness *= getStarGlowScale();
    
    
    glowBrightness += (nearbyBrightness - glowBrightness) * 0.15;
    
    
    if (glowBrightness > 0.3) {
      const glowSize = 30 + glowBrightness * 3;
      const glowOpacity = Math.min(0.85, glowBrightness * 0.15);
      const g = sfx.createRadialGradient(attractorX, attractorY, 0, attractorX, attractorY, glowSize);
      g.addColorStop(0, `rgba(220, 240, 255, ${glowOpacity})`);
      g.addColorStop(0.5, `rgba(100, 150, 255, ${glowOpacity * 0.5})`);
      g.addColorStop(1, 'rgba(61, 111, 255, 0)');
      sfx.fillStyle = g;
      sfx.beginPath();
      sfx.arc(attractorX, attractorY, glowSize, 0, Math.PI * 2);
      sfx.fill();
    }
  } else {
    
    glowBrightness *= 0.92;
  }
  
  
  const scrollY = window.scrollY || 0;
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  
  stars.forEach(s => {
    
    const parallaxOffset = motionOff ? 0 : (scrollY / maxScroll) * H * (1 - s.scrollDepth) * 0.08;
    
    let fl = 1;
    if (!motionOff && s.isTwinkling) {
      
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
  
  
  const referenceWidth = 1440; 
  
  const screenWidthFactor = Math.min(1, W / referenceWidth); 
  const smoothnessFactor = 0.4 + screenWidthFactor * 0.6; 
  const nebulaWidth = Math.min(W, 1700);
  const nebulaOffsetX = (W - nebulaWidth) / 2;
  const nebulaHeight = Math.min(H, 1500);
  const nebulaLift = H > 1500 ? 100 : 0;
  const nebulaBlurScale = W > 1700 ? 1.55 : 1;
  const nebulaOpacityScale = W > 1700 ? 0.65 : 1;
  
  nebulae.forEach(neb => {
    
    if (motionOff) {
      neb.drift = 0;
    } else {
      neb.drift += (Math.random() - 0.5) * neb.driftSpeed;
      neb.drift *= 0.98; 
    }
    
    const scrollProgress = motionOff ? 0 : scrollY / maxScroll;
    const nebulaScrollFade = W > 1700 ? Math.max(0, 1 - scrollProgress * 4) : 1;
    
    
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


const cRing = document.getElementById('qaoUumU');
const cDot  = document.getElementById('qbC929U');
let mx = -100, my = -100, rx = -100, ry = -100;
let cursorLoopRunning = false;
let cursorFrameId = 0;

function isCustomCursorEnabled() {
  return !isPartialMotionDisabled();
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
  if (!isCustomCursorEnabled() || !activateMouseInput(e)) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('mousedown', e => {
  if (!isCustomCursorEnabled() || !activateMouseInput(e)) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('mouseover', e => {
  if (!isCustomCursorEnabled() || !activateMouseInput(e)) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('pointermove', e => {
  if (!isCustomCursorEnabled() || e.pointerType !== 'mouse' || !activateMouseInput(e)) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);
document.addEventListener('pointerdown', e => {
  if (!isCustomCursorEnabled() || e.pointerType !== 'mouse' || !activateMouseInput(e)) return;
  moveCursorTo(e.clientX, e.clientY);
}, inputCaptureOptions);

function moveCursorToTouchPoint(touch, shouldSnap = false) {
  if (!isCustomCursorEnabled() || !touch) return false;
  moveCursorTo(touch.clientX, touch.clientY, shouldSnap);
  return true;
}

function moveCursorToTouchEvent(e, shouldSnap = false) {
  return moveCursorToTouchPoint(getTouchPointFromEvent(e), shouldSnap);
}

document.addEventListener('touchstart', e => {
  if (!moveCursorToTouchEvent(e, true) || !cRing) return;
  cRing.style.transform = 'translate(-50%,-50%) scale(.82)';
}, inputCaptureOptions);

document.addEventListener('touchmove', e => {
  moveCursorToTouchEvent(e);
}, inputCaptureOptions);

document.addEventListener('touchend', e => {
  if (!moveCursorToTouchEvent(e) || !cRing) return;
  cRing.style.transform = 'translate(-50%,-50%) scale(1)';
}, inputCaptureOptions);

document.addEventListener('touchcancel', e => {
  if (!moveCursorToTouchEvent(e) || !cRing) return;
  cRing.style.transform = 'translate(-50%,-50%) scale(1)';
}, inputCaptureOptions);


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


const pb = document.getElementById('qd5oUZq');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  pb.style.width = pct + '%';
}, {passive:true});


const toolBtns = document.querySelectorAll('.xfKXBRM[data-tool]');
const works    = document.querySelectorAll('.xFnnY3i');

function setTool(id) {
  activeTool = id;
  const t = TOOLS[id];
  toolBtns.forEach(b => b.classList.toggle('xg83bTW', b.dataset.tool === id));
  document.documentElement.style.setProperty('--viCMRzn', t.color);
  document.documentElement.style.setProperty('--vjr9lSB', t.glow);
  playUI('switch');
}

toolBtns.forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));


works.forEach((work, i) => {
  const vis  = work.querySelector('.xKOkyvb');
  const inn  = work.querySelector('.xLsRmys');
  const ov   = work.querySelector('.xO21hO3');
  const ovl  = work.querySelector('.xPO9T3Z');
  const ovt  = work.querySelector('.xQ1SFk2');
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
    ov.classList.add('xcl20x8K');
    const aspectKey = `${activeTool}:${i}`;
    if (!watchedCaseAspects.has(aspectKey)) {
      watchedCaseAspects.add(aspectKey);
      trackEvent(`${activeTool} case ${getWorkTitle(work)} watched`);
    }
  }

  vis.addEventListener('mousemove', e => {
    if (!isRealMouseEvent(e)) return;

    
    
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
    if (document.getElementById('qbAriNV8')?.classList.contains('xcl20x8K')) {
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
    ov.classList.remove('xcl20x8K');
  });
});

function clearWorkVisualStates() {
  works.forEach(work => {
    const vis = work.querySelector('.xKOkyvb');
    const inn = work.querySelector('.xLsRmys');
    const ov = work.querySelector('.xO21hO3');
    if (!vis || !inn || !ov) return;
    vis.style.transform = 'perspective(820px) rotateX(0) rotateY(0) translateZ(0)';
    inn.style.transform = 'none';
    ov.classList.remove('xcl20x8K');
  });
}

document.addEventListener('touchstart', e => {
  if (e.target?.closest?.('.xKOkyvb')) return;
  clearWorkVisualStates();
}, inputCaptureOptions);


const workObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('xciELGSI');
    } else {
      e.target.classList.remove('xciELGSI');
    }
  });
}, { threshold: 0.1 });
works.forEach(w => workObs.observe(w));


const motionParallaxObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('xcsYPUrz');
    } else {
      e.target.classList.remove('xcsYPUrz');
    }
  });
}, { threshold: 0.0, rootMargin: '10px 0px' });


document.querySelectorAll('.x5bOF2U').forEach(card => motionParallaxObs.observe(card));


const parallaxElementsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('xcsYPUrz');
    } else {
      e.target.classList.remove('xcsYPUrz');
    }
  });
}, { threshold: 0.0 });


document.querySelectorAll('.xbiCHYIO').forEach(item => parallaxElementsObs.observe(item));

document.querySelectorAll('.xbsJJer4').forEach(post => parallaxElementsObs.observe(post));


const MEDIA_LOADBOX_SELECTORS = [
  '.xNZWPaL',
  '.x8YhVeM',
  '.xbjZRSw5',
  '.xbzADRzC',
  '.xGK1S4V',
  '.xceeRNIt'
];

function getMediaLoadbox(media) {
  const box = media.closest(MEDIA_LOADBOX_SELECTORS.join(','));
  if (box) return box;

  const narratorText = document.getElementById('qbs8t4ks');
  if (narratorText?.contains(media) && media.parentElement) {
    media.parentElement.classList.add('xvJ5pOr');
    return media.parentElement;
  }

  return null;
}

function isMediaReady(media) {
  if (media.tagName === 'IMG') return media.complete && media.naturalWidth > 0;
  if (media.tagName === 'VIDEO') return media.readyState >= 2;
  return true;
}

function updateMediaLoadbox(media, state) {
  const box = getMediaLoadbox(media);
  if (!box) return;

  box.classList.add('xvQ8rMa');
  box.classList.toggle('xvU2bLq', state === 'loading');
  box.classList.toggle('xvK7nSp', state === 'error');
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


const nar        = document.getElementById('qbqYxC9f');
const narText    = document.getElementById('qbs8t4ks');
const narFrom    = document.getElementById('qbtgiqma');
const narClose   = document.getElementById('qbr5c5en');
let narHidden = false;
let activeTimers = [];
let activeIntervals = [];
let currentNarWork = null;
let narAutoScroll = true;
let narLastScrollTop = 0;

if (narText) {
  narText.addEventListener('scroll', () => {
    if (narText.scrollTop < narLastScrollTop - 2) {
      narAutoScroll = false;
    }
    narLastScrollTop = narText.scrollTop;
  }, { passive: true });
}

function clearAllTimers() {
  activeTimers.forEach(id => clearTimeout(id));
  activeIntervals.forEach(id => clearInterval(id));
  activeTimers = [];
  activeIntervals = [];
}

function typeWriter(htmlText) {
  if (!narText) return;
  clearAllTimers();
  narAutoScroll = true;
  narLastScrollTop = 0;
  
  const parts = htmlText.split('|||').map(p => p.trim());
  narText.innerHTML = '';
  let partIdx = 0;
  
  
  function scrollToBottom() {
    if (!narAutoScroll) return;
    narText.scrollTop = narText.scrollHeight;
    narLastScrollTop = narText.scrollTop;
  }
  
  function addPart() {
    if (partIdx >= parts.length) return;
    
    const part = parts[partIdx];
    
    if (part.startsWith('<')) {
      const span = document.createElement('span');
      span.innerHTML = part;
      narText.appendChild(span);
      initMediaPreloaders(span);
      
      
      scrollToBottom();
      
      
      const images = span.querySelectorAll('img');
      images.forEach(img => {
        img.addEventListener('load', scrollToBottom, { once: true });
        
        img.addEventListener('error', scrollToBottom, { once: true });
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
          scrollToBottom();
        } else {
          clearInterval(typeInterval);
          activeIntervals = activeIntervals.filter(id => id !== typeInterval);
          partIdx++;
          scrollToBottom();
          const timerId = setTimeout(addPart, 300);
          activeTimers.push(timerId);
        }
      }, 40);
      activeIntervals.push(typeInterval);
    }
  }
  
  addPart();
}


function showNarrator(workElement) {
  if (!nar || !narText || !narFrom) return;
  clearAllTimers();
  currentNarWork = workElement;
  narText.style.opacity = '0';
  const timerId = setTimeout(() => {
    narText.innerHTML = '';
    narFrom.textContent = '— ' + workElement.querySelector('.xUbgIeF').textContent;
    narText.style.opacity = '1';
    nar.classList.add('xcl20x8K');
    typeWriter(workElement.dataset.narrator);
  }, 260);
  activeTimers.push(timerId);
}


function initDetailsButtons() {
  works.forEach((work, idx) => {
    const meta = work.querySelector('.xRE6RU0');
    if (!meta) return;
    
    const btn = document.createElement('button');
    btn.className = 'xcpgRXWl';
    btn.textContent = UI_TEXT.details;
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.getElementById('qbuxgcb0')?.classList.contains('xcruLRQA')) return;
      trackEvent(`details clicked: ${getWorkTitle(work)}`);
      showNarrator(work);
    });
    
    meta.appendChild(btn);
  });
}

if (narClose) {
  narClose.addEventListener('click', () => {
    clearAllTimers();
    if (nar) nar.classList.remove('xcl20x8K');
    narHidden = true;
    currentNarWork = null;
    
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

observeAnalyticsScrollIn('#qWkDTWD', 'motion scrolled in');
observeAnalyticsScrollIn('#q0a7hXv', 'second cases scrolled in');
observeAnalyticsScrollIn('#qbbn0T5F', 'print scrolled in');
observeAnalyticsScrollIn('#qbgtqzGZ', 'smm scrolled in');
observeAnalyticsScrollIn('#qbi8Zcs1', 'footer scrolled in');

document.querySelector('.xygqP0E[href="#qbi8Zcs1"]')?.addEventListener('click', () => {
  trackEvent('contact clicked');
});

document.querySelectorAll('.xbcJk3ue').forEach(link => {
  link.addEventListener('click', () => {
    trackEvent(`motion link clicked: ${getMotionCardTitle(link.closest('.x5bOF2U'))}`);
  });
});

function showDefaultNarrator() {
  if (!nar || !narText || !narFrom) return;
  narFrom.textContent = UI_TEXT.mission;
  narText.style.opacity = '1';
  nar.classList.add('xcl20x8K');
  typeWriter(UI_TEXT.intro);
}

function finishCaseOnboardingWithFirstNarrator() {
  const firstWork = document.querySelector('.xFnnY3i');
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

document.getElementById('qbDFx2o3')?.addEventListener('click', () => {
  trackEvent('case onboarding step 4 next');
  finishCaseOnboardingWithFirstNarrator();
});


const floatPanel = document.getElementById('qbNYXaTB');
const floatPanelContent = document.getElementById('qbPvudXw');
const floatPanelClose = document.getElementById('qbOw8Y8q');

function openFloatPanel(contentElement) {
  if (!floatPanel || !floatPanelContent) return;
  
  floatPanelContent.innerHTML = '';
  
  if (contentElement) {
    floatPanelContent.appendChild(contentElement);
    initMediaPreloaders(floatPanelContent);
  }
  
  floatPanel.classList.add('xcl20x8K');
  
  
  floatPanel.style.right = 'auto';
  floatPanel.style.top = 'auto';
  floatPanel.style.left = '20px';
  floatPanel.style.bottom = '20px';
}

function closeFloatPanel() {
  if (floatPanel) {
    floatPanel.classList.remove('xcl20x8K');
    if (floatPanelContent) floatPanelContent.innerHTML = '';
  }
}


if (floatPanelClose) {
  floatPanelClose.addEventListener('click', closeFloatPanel);
}


window.addEventListener('resize', () => {
  if (floatPanel && floatPanel.classList.contains('xcl20x8K')) {
    floatPanel.style.right = 'auto';
    floatPanel.style.top = 'auto';
    floatPanel.style.left = '20px';
    floatPanel.style.bottom = '20px';
  }
}, { passive: true });


function attachFloatPanelListeners() {
  document.addEventListener('click', (e) => {
    const container = e.target.closest('.xGK1S4V');
    if (container && narText && narText.contains(container)) {
      e.preventDefault();
      e.stopPropagation();
      
      
      const media = container.querySelector('img, video');
      if (!media || !media.src) return;
      
      const tagName = media.tagName.toLowerCase();
      const newElement = document.createElement(tagName);
      newElement.src = media.src;
      newElement.style.maxWidth = '540px';
      newElement.style.width = '100%';
      newElement.style.height = 'auto';
      newElement.style.display = 'block';
      
      if (tagName === 'video') {
        newElement.autoplay = true;
        newElement.loop = true;
        newElement.muted = true;
        newElement.controls = false;
      }
      
      const wrapper = document.createElement('div');
      wrapper.style.width = '100%';
      wrapper.style.height = 'auto';
      wrapper.appendChild(newElement);
      openFloatPanel(wrapper);
    }
  }, true);
}

attachFloatPanelListeners();


window.addEventListener('scroll', () => {
  if (isPartialMotionDisabled()) return;
  works.forEach((work, i) => {
    const vis = work.querySelector('.xKOkyvb');
    if (!vis) return;
    
    const rect = vis.getBoundingClientRect();
    const scrollY = window.scrollY;
    const elementCenter = rect.top + scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    
    const rotX = distance * 18;
    const rotZ = Math.abs(distance) * 8;
    const scaleEffect = 1 - Math.abs(distance) * 0.08;
    
    vis.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scaleEffect})`;
  });
}, { passive: true });


let lastScrollY = 0;

function resetEnhancedParallaxStates() {
  document.querySelectorAll('.x5bOF2U, .xbiCHYIO, .xbsJJer4').forEach(el => {
    el.style.transform = '';
    el.style.opacity = '';
  });
}

function parallaxMotionCards() {
  if (isPartialMotionDisabled()) return;
  const cards = document.querySelectorAll('.x5bOF2U.xcsYPUrz');
  cards.forEach((card, idx) => {
    const rect = card.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    card.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    card.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

function parallaxPrintedItems() {
  if (isPartialMotionDisabled()) return;
  const items = document.querySelectorAll('.xbiCHYIO.xcsYPUrz');
  items.forEach((item, idx) => {
    const rect = item.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    item.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    item.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

function parallaxSocialPosts() {
  if (isPartialMotionDisabled()) return;
  const posts = document.querySelectorAll('.xbsJJer4.xcsYPUrz');
  posts.forEach((post, idx) => {
    const rect = post.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const viewportCenter = window.innerHeight / 2 + window.scrollY;
    const distance = (elementCenter - viewportCenter) / (window.innerHeight / 2);
    
    
    const translateY = Math.sin(distance * Math.PI) * 32;
    const rotateZ = distance * 5;
    const scale = 1 - Math.abs(distance) * 0.12;
    
    post.style.transform = `perspective(800px) translateY(${translateY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    post.style.opacity = Math.max(0.4, 1 - Math.abs(distance) * 0.25);
  });
}

window.addEventListener('scroll', () => {
  if (isPartialMotionDisabled()) return;
  parallaxMotionCards();
  parallaxPrintedItems();
  parallaxSocialPosts();
  lastScrollY = window.scrollY;
}, { passive: true });


const obOverlay  = document.getElementById('qbuxgcb0');
const obBackdrop = document.getElementById('qbvPDCEW');
const hiRing     = document.getElementById('qbMGRwhB');
 
let tipStep = 0;
let currentTargetEl  = null;   
let currentTipEl     = null;   
let resizeRAF        = null;   
 

const TIP_GAP    = 16;   
const TIP_MARGIN = 12;   
 
function positionTipCard(tipEl, targetRect) {
  if (!tipEl || !targetRect) return;
 
  
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
 
  const tr = targetRect; 
 
  
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
 
  if (tipEl.id === 'qbE6cV1W' && (chosen.name === 'right' || chosen.name === 'left')) {
    chosen.top = clamp(
      vh * 0.5 - th / 2,
      TIP_MARGIN,
      Math.max(TIP_MARGIN, vh - th - TIP_MARGIN)
    );
  }

  tipEl.style.position  = 'fixed';
  tipEl.style.left      = chosen.left + 'px';
  tipEl.style.top       = chosen.top  + 'px';
  tipEl.style.transform = 'none';
 
  
  ensureBothVisible(targetRect, {
    left: chosen.left, top: chosen.top,
    right: chosen.left + tw, bottom: chosen.top + th,
  });
}
 
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
 

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
  obBackdrop.style.setProperty('--vrEeQGD', cx + 'px');
  obBackdrop.style.setProperty('--vs6U8G2', cy + 'px');
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
 

function onViewportChange() {
  if (!currentTargetEl || !currentTipEl) return;
  cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(() => {
    requestAnimationFrame(refreshCurrentTipPosition);
  });
}
 
window.addEventListener('resize', onViewportChange);
window.addEventListener('scroll', onViewportChange, { passive: true });
 

 

const TIP_IDS = { 2: 'qbwCFuZN', 3: 'qbyDiuQX', 4: 'qbAriNV8', 5: 'qbCsxPct', 6: 'qbE6cV1W' };
const TIP_TARGETS = {
  2: { id: 'qeEAwre' },
  3: { id: 'qffN7wM' },
  4: { cls: 'xKOkyvb' },
  5: { cls: 'xcpgRXWl' },
  6: { id: 'qmtAw9v' }
};
 
function resolveTarget(cfg) {
  if (!cfg) return null;
  if (cfg.id)  return document.getElementById(cfg.id);
  if (cfg.cls) return document.getElementsByClassName(cfg.cls)[0] || null;
  return null;
}
 
function showTip(n) {
  document.body.classList.remove('xcfCORGD', 'xcjFJqAB', 'xcqZ09AM', 'xmdChMo');
  if (obBackdrop) obBackdrop.style.opacity = '';
  const nextTipId = n === 0 ? null : TIP_IDS[n];
  if (n === 6 && !onboardingMotionGateComplete) {
    lockOnboardingScroll();
  } else {
    unlockOnboardingScroll();
  }

  ['qbwCFuZN', 'qbyDiuQX', 'qbAriNV8', 'qbCsxPct', 'qbE6cV1W'].forEach(id => {
    if (id === nextTipId) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('xcl20x8K');
    setTimeout(() => { if (!el.classList.contains('xcl20x8K')) el.style.display = 'none'; }, 350);
  });

  if (hiRing) hiRing.style.display = 'none';
  currentTargetEl = null;
  currentTipEl    = null;

  if (n === 0) {
    if (obOverlay) obOverlay.classList.remove('xcruLRQA');
    return;
  }

  const tip = document.getElementById(TIP_IDS[n]);
  if (!tip) return;

  if (n === 3) document.body.classList.add('xcfCORGD');
  if (n === 4) document.body.classList.add('xcjFJqAB');
  if (n === 5) document.body.classList.add('xcqZ09AM');
  if (n === 6) document.body.classList.add('xmdChMo');

  const targetCfg = TIP_TARGETS[n] || null;
  const targetEl  = resolveTarget(targetCfg);

  tip.style.display     = '';
  tip.style.visibility  = 'hidden'; 

  requestAnimationFrame(() => requestAnimationFrame(() => {
    tip.classList.add('xcl20x8K');

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        currentTargetEl = targetEl;
        currentTipEl    = tip;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          settleTipPosition();
          tip.style.visibility = ''; 
        }));
      }, 400);
    } else {
      tip.style.position   = 'fixed';
      tip.style.top        = '50%';
      tip.style.left       = '50%';
      tip.style.transform  = 'translate(-50%,-50%)';
      tip.style.visibility = ''; 
    }
  }));
} 

function showOnboarding() {
  if (readStorageFlag(ONBOARDING_MOTION_STORAGE_KEY)) {
    return;
  }
  const overlay = document.getElementById('qbuxgcb0');
  if (!overlay) return;
  overlay.classList.add('xcruLRQA');
  showTip(6);
}
 
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(showOnboarding, 600));
} else {
  setTimeout(showOnboarding, 600);
}
 

document.getElementById('qbxp5ggb')?.addEventListener('click', () => {
  trackEvent('case onboarding step 1 next');
  const firstWork = document.querySelector('.xFnnY3i');
  if (firstWork) {
    firstWork.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => showTip(3), 800);
  }
});

document.getElementById('qbzUJBVQ')?.addEventListener('click', () => {
  trackEvent('case onboarding step 2 next');
  showTip(4);
});
 

document.querySelectorAll('.xfKXBRM[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (document.getElementById('qbyDiuQX')?.classList.contains('xcl20x8K')) {
      trackEvent('case onboarding step 2 action');
      showTip(4);
    }
  });
});
 

const firstWorkVis = document.querySelector('.xFnnY3i .xKOkyvb');
if (firstWorkVis) {
  firstWorkVis.addEventListener('mouseenter', e => {
    if (!isRealMouseEvent(e)) return;
    if (document.getElementById('qbAriNV8')?.classList.contains('xcl20x8K')) {
      trackEventOnce('case-onboarding-step-3-action', 'case onboarding step 3 action');
      setTimeout(() => showTip(5), 2000);
    }
  });
}
 
document.getElementById('qbBiWe1n')?.addEventListener('click', () => {
  trackEvent('case onboarding step 3 next');
  showTip(5);
});
 

const firstDetailsBtn = document.querySelector('.xFnnY3i .xcpgRXWl');
if (firstDetailsBtn) {
  firstDetailsBtn.addEventListener('click', e => {
    if (!document.getElementById('qbCsxPct')?.classList.contains('xcl20x8K')) return;
    e.preventDefault();
    e.stopPropagation();
    trackEvent('case onboarding step 4 action');
    trackEvent(`details clicked: ${getWorkTitle(firstDetailsBtn.closest('.xFnnY3i'))}`);
    finishCaseOnboardingWithFirstNarrator();
  });
}
 

const motionBtn  = document.getElementById('qmtAw9v');
const motionIcon = document.getElementById('qmtIc7p');
const MOTION_ICON_ON = '<path d="M5.8 4.3L19.4 12L5.8 19.7Z"/>';
const MOTION_ICON_OFF = '<path d="M5.8 4.3L19.4 12L5.8 19.7Z"/>';

function resetPartialMotionState() {
  comets.length = 0;
  glowBrightness = 0;

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

  document.querySelectorAll('.xBYIUYO, [class^="xQp9z"]').forEach(el => {
    el.style.marginLeft = '';
    el.style.opacity = '';
    el.style.filter = '';
  });
}

function restartHeroMotionAnimations() {
  const animatedEls = document.querySelectorAll('.xzPdPt2, .xARWISX, [class^="xQp9z"]');
  animatedEls.forEach(el => { el.style.animation = 'none'; });
  void document.body.offsetHeight;
  animatedEls.forEach(el => { el.style.animation = ''; });
}

function setPartialMotionDisabled(disabled, options = {}) {
  partialMotionDisabled = Boolean(disabled);
  resetPartialMotionState();
  document.body.classList.toggle(MOTION_LIGHT_CLASS, partialMotionDisabled);
  syncCustomCursorState();

  const heavyMotionEnabled = !partialMotionDisabled;
  if (motionBtn) {
    motionBtn.classList.toggle('xg83bTW', heavyMotionEnabled);
    motionBtn.setAttribute('aria-pressed', String(heavyMotionEnabled));
    motionBtn.title = heavyMotionEnabled ? UI_TEXT.motionDisable : UI_TEXT.motionEnable;
    const label = motionBtn.querySelector('.xh9b9KQ');
    if (label) label.textContent = heavyMotionEnabled ? UI_TEXT.motionOn : UI_TEXT.motionOff;
  }
  if (motionIcon) motionIcon.innerHTML = heavyMotionEnabled ? MOTION_ICON_ON : MOTION_ICON_OFF;

  if (heavyMotionEnabled) {
    restartHeroMotionAnimations();
    scheduleStarfieldFrame();
  } else {
    drawStaticStarfield();
  }

  if (!options.silent) playUI('switch');
  if (options.persist) {
    writeStorageValue(ONBOARDING_MOTION_MODE_STORAGE_KEY, partialMotionDisabled ? 'base' : 'max');
  }
}

function updateMotionChoiceUI() {
  document.querySelectorAll('[data-motion-choice]').forEach(choice => {
    choice.classList.toggle('xmdSel', choice.dataset.motionChoice === onboardingMotionChoice);
  });
  const next = document.getElementById('qbGvMpsZ');
  const hasChoice = Boolean(onboardingMotionChoice);
  if (next) {
    next.classList.toggle('xbRt5n7K', !hasChoice);
    next.setAttribute('aria-disabled', String(!hasChoice));
  }
}

function selectOnboardingMotionChoice(choice) {
  if (choice !== 'max' && choice !== 'base') return;
  onboardingMotionChoice = choice;
  writeStorageValue(ONBOARDING_MOTION_MODE_STORAGE_KEY, choice);
  updateMotionChoiceUI();
  playUI('click');
}

function toggleOnboardingMotionChoice() {
  const nextChoice = onboardingMotionChoice === 'max' ? 'base' : 'max';
  selectOnboardingMotionChoice(nextChoice);
}

function finishOnboardingFromMotionChoice() {
  if (!onboardingMotionChoice) return;
  onboardingMotionGateComplete = true;
  writeStorageValue(ONBOARDING_MOTION_MODE_STORAGE_KEY, onboardingMotionChoice);
  writeStorageFlag(ONBOARDING_MOTION_STORAGE_KEY);
  trackEvent(onboardingMotionChoice === 'max' ? 'maximum animation' : 'light animation');
  caseOnboardingScrollAllowedAt = Date.now() + 1400;
  setPartialMotionDisabled(onboardingMotionChoice !== 'max', { persist: true });
  showTip(0);
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showDefaultNarrator();
  }, 400);
}

setPartialMotionDisabled(onboardingMotionChoice !== 'max', { silent: true });
updateMotionChoiceUI();

let caseOnboardingStarted = false;
let caseOnboardingScrollAllowedAt = 0;
let caseOnboardingUserScrolled = false;
function startCaseOnboarding() {
  if (caseOnboardingStarted || !onboardingMotionGateComplete) return;
  if (readStorageFlag(ONBOARDING_CASE_STORAGE_KEY)) {
    caseOnboardingStarted = true;
    return;
  }
  const overlay = document.getElementById('qbuxgcb0');
  if (!overlay || overlay.classList.contains('xcruLRQA')) return;
  caseOnboardingStarted = true;
  trackEvent('case onboarding started');
  overlay.classList.add('xcruLRQA');
  showTip(2);
}

function shouldStartCaseOnboarding() {
  if (caseOnboardingStarted || !onboardingMotionGateComplete || onboardingScrollLocked) return false;
  if (Date.now() < caseOnboardingScrollAllowedAt) return false;
  if (!caseOnboardingUserScrolled) return false;
  const firstDetails = document.querySelector('.xFnnY3i .xcpgRXWl');
  if (!firstDetails) return false;
  return firstDetails.getBoundingClientRect().bottom <= window.innerHeight;
}

function checkCaseOnboardingAfterScroll() {
  if (shouldStartCaseOnboarding()) startCaseOnboarding();
}

function noteCaseOnboardingUserScroll() {
  if (!onboardingMotionGateComplete || onboardingScrollLocked || caseOnboardingStarted) return;
  caseOnboardingUserScrolled = true;
  requestAnimationFrame(checkCaseOnboardingAfterScroll);
  const wait = Math.max(0, caseOnboardingScrollAllowedAt - Date.now());
  if (wait) setTimeout(checkCaseOnboardingAfterScroll, wait + 20);
}

function handleCaseOnboardingScrollEvent() {
  if (onboardingMotionGateComplete && !onboardingScrollLocked && Date.now() >= caseOnboardingScrollAllowedAt) {
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

document.querySelectorAll('[data-motion-choice]').forEach(choice => {
  choice.addEventListener('click', () => selectOnboardingMotionChoice(choice.dataset.motionChoice));
  choice.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    selectOnboardingMotionChoice(choice.dataset.motionChoice);
  });
});

document.getElementById('qbGvMpsZ')?.addEventListener('click', finishOnboardingFromMotionChoice);

if (motionBtn) {
  motionBtn.addEventListener('click', (e) => {
    const onboardingIsOn = document.getElementById('qbuxgcb0')?.classList.contains('xcruLRQA');
    if (onboardingIsOn && !onboardingMotionGateComplete) {
      e.preventDefault();
      e.stopPropagation();
      if (document.getElementById('qbE6cV1W')?.classList.contains('xcl20x8K')) {
        toggleOnboardingMotionChoice();
      }
      return;
    }
    setPartialMotionDisabled(!partialMotionDisabled, { persist: true });
  });
}


let actx = null, ambGain = null, soundOn = false;
const soundBtn  = document.getElementById('qi9Xksc');
const soundIcon = document.getElementById('qjnsy8v');

function initAudio() {
  if (actx) return true;
  if (!window.AudioContext && !window.webkitAudioContext) return false;
  actx = new (window.AudioContext || window.webkitAudioContext)();
  const master = actx.createGain(); master.gain.value = 0.12; master.connect(actx.destination);
  ambGain = actx.createGain(); ambGain.gain.value = 0; ambGain.connect(master);

  
  
  return true;
}

async function enableAmbientAudio() {
  if (!initAudio()) return;
  if (actx.state === 'suspended') await actx.resume();
  soundOn = true;
  if (ambGain) ambGain.gain.setTargetAtTime(.45, actx.currentTime, 1.8);
  if (soundBtn) soundBtn.classList.add('xg83bTW');
  if (soundIcon) {
    soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
  }
  soundBtn?.querySelector('.xh9b9KQ') && (soundBtn.querySelector('.xh9b9KQ').textContent = UI_TEXT.soundOn);
}

if (soundBtn) {
  soundBtn.addEventListener('click', async () => {
    if (!soundOn) {
      await enableAmbientAudio();
    } else {
      soundOn = false;
      ambGain.gain.setTargetAtTime(0, actx.currentTime, .6);
      soundBtn.classList.remove('xg83bTW');
      soundIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
      soundBtn.querySelector('.xh9b9KQ').textContent = UI_TEXT.soundOff;
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


const langToggle = document.getElementById('qkTqibt');
const langBtn = document.getElementById('qlwNtsf');
const langMenuItems = langToggle?.querySelectorAll('.xmqIu9x');
const currentLang = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'ua';
function getLangPage(lang) {
  const target = lang === 'ua' ? './indexUA.html' : './index.html';
  return location.hash ? target + location.hash : target;
}

function updateLangUI() {
  langMenuItems?.forEach(item => {
    item.classList.toggle('xg83bTW', item.dataset.lang === currentLang);
  });
}

updateLangUI();


langBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langToggle?.classList.toggle('xchQMnU0');
  if (isOpen) {
    langBtn?.classList.add('xg83bTW');
  } else {
    langBtn?.classList.remove('xg83bTW');
  }
});


langMenuItems?.forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.dataset.lang;

    langToggle?.classList.remove('xchQMnU0');
    langBtn?.classList.remove('xg83bTW');

    if (selectedLang === currentLang) {
      return;
    }

    playUI('switch');
    setTimeout(() => {
      window.location.href = getLangPage(selectedLang);
    }, 150);
  });
});


document.addEventListener('click', () => {
  langToggle?.classList.remove('xchQMnU0');
  langBtn?.classList.remove('xg83bTW');
});


document.addEventListener('keydown', e => {
  if (e.shiftKey && e.key === 'R') {
    location.reload();
  }
});


window.addEventListener('load', () => {
  
  if (isPartialMotionDisabled()) return;
  requestAnimationFrame(() => {
    parallaxMotionCards();
    parallaxPrintedItems();
    parallaxSocialPosts();
  });
});


const motionTrack = document.getElementById('qXsdXlA');
const motionPrevBtn = document.getElementById('qYWKQQG');
const motionNextBtn = document.getElementById('qZar2Y5');
const motionCards = document.querySelectorAll('.x5bOF2U');

if (motionTrack && motionPrevBtn && motionNextBtn) {
  const scrollAmount = 480; 
  
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
  
  
  function updateNavButtons() {
    const maxScroll = motionTrack.scrollWidth - motionTrack.clientWidth;
    const isAtStart = motionTrack.scrollLeft <= 10;
    const isAtEnd = motionTrack.scrollLeft >= maxScroll - 10;
    
    motionPrevBtn.style.opacity = isAtStart ? '0.5' : '1';
    motionPrevBtn.disabled = isAtStart;
    motionNextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    motionNextBtn.disabled = isAtEnd;
  }
  
  motionTrack.addEventListener('scroll', updateNavButtons, { passive: true });
  window.addEventListener('resize', updateNavButtons, { passive: true });
  
  
  setTimeout(updateNavButtons, 100);
  
  
  let motionDemoRunning = false;
  const motionSection = document.getElementById('qWkDTWD');
  if (motionSection) {
    const demoObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !motionDemoRunning) {
          motionDemoRunning = true;
          motionTrack.scrollLeft = 0;
          setTimeout(() => {
            (async () => {
              
              scrollMotion('next');
              await new Promise(r => setTimeout(r, 1200));
              scrollMotion('next');
              await new Promise(r => setTimeout(r, 1200));
              
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


const printedTrack = document.getElementById('qbcKYCBk');
const printedPrevBtn = document.getElementById('qbeKjEMY');
const printedNextBtn = document.getElementById('qbfyzamt');

if (printedTrack && printedPrevBtn && printedNextBtn) {
  const scrollAmount = 420; 
  
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
  
  
  function updatePrintedNavButtons() {
    const maxScroll = printedTrack.scrollWidth - printedTrack.clientWidth;
    const isAtStart = printedTrack.scrollLeft <= 10;
    const isAtEnd = printedTrack.scrollLeft >= maxScroll - 10;
    
    printedPrevBtn.style.opacity = isAtStart ? '0.5' : '1';
    printedPrevBtn.disabled = isAtStart;
    printedNextBtn.style.opacity = isAtEnd ? '0.5' : '1';
    printedNextBtn.disabled = isAtEnd;
  }
  
  printedTrack.addEventListener('scroll', updatePrintedNavButtons, { passive: true });
  window.addEventListener('resize', updatePrintedNavButtons, { passive: true });
  
  
  setTimeout(updatePrintedNavButtons, 100);
  
  
  let printedDemoRunning = false;
  const printedSection = document.getElementById('qbbn0T5F');
  if (printedSection) {
    const printedDemoObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !printedDemoRunning) {
          printedDemoRunning = true;
          printedTrack.scrollLeft = 0;
          setTimeout(() => {
            (async () => {
              
              scrollPrinted('next');
              await new Promise(r => setTimeout(r, 1200));
              scrollPrinted('next');
              await new Promise(r => setTimeout(r, 1200));
              
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


window.addEventListener('load', function () {
  const photoWrapper = document.querySelector('.xARWISX');
  const photo        = document.querySelector('.xBYIUYO');
  const cloudEls     = document.querySelectorAll('[class^="xQp9z"]');
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

function loadDeferredBackgroundMedia() {
  const media = Array.from(document.querySelectorAll('[data-bg-src]'));
  let index = 0;

  const nextFrame = (fn, delay = 90) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 1200 });
    } else {
      setTimeout(fn, delay);
    }
  };

  function waitForMedia(el, done) {
    const target = el.tagName === 'SOURCE' ? el.closest('video') : el;
    if (!target) {
      done();
      return;
    }

    let finished = false;
    const cleanup = () => {
      target.removeEventListener('loadeddata', finish);
      target.removeEventListener('canplay', finish);
      target.removeEventListener('load', finish);
      target.removeEventListener('error', finish);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cleanup();
      done();
    };

    target.addEventListener('loadeddata', finish, { once: true });
    target.addEventListener('canplay', finish, { once: true });
    target.addEventListener('load', finish, { once: true });
    target.addEventListener('error', finish, { once: true });

    
    setTimeout(finish, 1800);
  }

  function loadOne(el, done) {
    const src = el.dataset.bgSrc;
    if (!src) {
      done();
      return;
    }

    el.setAttribute('src', src);
    el.removeAttribute('data-bg-src');

    if (el.tagName === 'SOURCE') {
      const video = el.closest('video');
      if (video) {
        updateMediaLoadbox(video, 'loading');
        video.load();
        if (video.autoplay) video.play().catch(() => {});
      }
      waitForMedia(el, done);
      return;
    }

    if (el.tagName === 'VIDEO') {
      updateMediaLoadbox(el, 'loading');
      el.load();
      if (el.autoplay) el.play().catch(() => {});
      waitForMedia(el, done);
      return;
    }

    if (el.tagName === 'IMG') {
      updateMediaLoadbox(el, 'loading');
      waitForMedia(el, done);
      return;
    }

    done();
  }

  function loadNext() {
    if (index >= media.length) return;
    const el = media[index];
    index += 1;
    loadOne(el, () => nextFrame(loadNext, 140));
  }

  loadNext();
}

window.addEventListener('load', () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadDeferredBackgroundMedia, { timeout: 1200 });
  } else {
    setTimeout(loadDeferredBackgroundMedia, 800);
  }
});






(function () {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyirWlm-m0eiFEUND8llLR3CginCxDQE2wqrDp1yuyIv3HrKqRW_xiqtBG42wFbbqtq3A/exec'; 
 
  const form   = document.getElementById('qbjYkSzn');
  const btn    = document.getElementById('qboCVzQM');
  const btnWrap = document.getElementById('qbnj3Jeh');
  const status = document.getElementById('qbp0C8cA');
  const msgField = document.getElementById('qbmPQrA4');
  const fields = {
    name: document.getElementById('qbkVf0X1'),
    email: document.getElementById('qblkoJ8J'),
    msg: document.getElementById('qbmPQrA4')
  };
  const SUBMIT_TIMEOUT_MS = 20000;
  let emailErrorArmed = false;
  let invalidHintTimer = null;
  let resultStatusPinned = false;

  function clearResultStatus() {
    if (!resultStatusPinned) return;
    resultStatusPinned = false;
    status.textContent = '';
    status.className   = 'xbR56y0H';
  }

  if (!form) return;

  msgField?.closest('.xbLivGcE.xbMyuHMl')?.addEventListener('click', () => {
    msgField.focus();
  });
 
  function setError(el) {
    el.classList.add('xctF7ZeO');
    el.closest('.xbLivGcE.xbMyuHMl')?.classList.add('xctF7ZeO');
    showInvalidFormHint();
  }

  function showInvalidFormHint(duration = 0) {
    clearTimeout(invalidHintTimer);
    resultStatusPinned = false;
    status.textContent = UI_TEXT.fill;
    status.className   = 'xbR56y0H err';

    if (duration) {
      invalidHintTimer = setTimeout(() => {
        if (!form.querySelector('.xctF7ZeO')) {
          status.textContent = '';
          status.className   = 'xbR56y0H';
        }
      }, duration);
    }
  }
 
  function clearError(el) {
    el.classList.remove('xctF7ZeO');
    el.closest('.xbLivGcE.xbMyuHMl')?.classList.remove('xctF7ZeO');
    if (!form.querySelector('.xctF7ZeO')) {
      status.textContent = '';
      status.className   = 'xbR56y0H';
    }
  }

  function isFieldValid(el) {
    const value = el.value.trim();
    if (!value) return false;
    return el.id !== 'qblkoJ8J' || value.includes('@');
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
    if (!resultStatusPinned && e.pointerType !== 'touch' && !form.querySelector('.xctF7ZeO')) {
      status.textContent = '';
      status.className   = 'xbR56y0H';
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
    btn.querySelector('.xbQ7hJJK').textContent = UI_TEXT.sending;
    resultStatusPinned = false;
    status.textContent = '';
    status.className   = 'xbR56y0H';
 
    const name  = document.getElementById('qbkVf0X1').value.trim();
    const email = document.getElementById('qblkoJ8J').value.trim();
    const msg   = document.getElementById('qbmPQrA4').value.trim();
 
    const payload = new URLSearchParams({
      event: 'contact_form',
      name,
      email,
      message: msg,
      page: location.href
    });
 
    let submitTimeout = null;

    try {
      const controller = new AbortController();
      submitTimeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: payload,
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Server error');
      }

      status.textContent = UI_TEXT.sent;
      status.className   = 'xbR56y0H ok';
      resultStatusPinned = true;
      form.reset();
    } catch (err) {
      status.textContent = UI_TEXT.fail;
      status.className   = 'xbR56y0H err';
      resultStatusPinned = true;
    } finally {
      clearTimeout(submitTimeout);
      btn.querySelector('.xbQ7hJJK').textContent = UI_TEXT.send;
      updateButtonState();
    }
  });
})();
