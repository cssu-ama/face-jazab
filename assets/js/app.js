const siteImages = [
  {id: "logo", classList: "h-100", name: "logo"},
  {id: "instagram", classList: "h-100", name: "instagram"},
  {id: "faceCorrect", classList: "icon", name: "correctIcon"},
  {id: "faceCorrect", classList: "face", name: "faceCorrect"},
  {id: "faceWrong", classList: "icon", name: "wrongIcon"},
  {id: "faceWrong", classList: "face", name: "faceWrong"},
  {id: "profileCorrect", classList: "icon", name: "correctIcon"},
  {id: "profileCorrect", classList: "face", name: "profileCorrect"},
  {id: "profileWrong", classList: "icon", name: "wrongIcon"},
  {id: "profileWrong", classList: "face", name: "profileWrong"},
  {id: "arrowIcon", classList: "", name: "arrowIcon"},
  {id: "faceIcon", classList: "", name: "faceIcon"},
  {id: "viewIcon", classList: "", name: "viewIcon"},
  {id: "analyzeIcon", classList: "", name: "analyzeIcon"},
  {id: "faceOne", classList: "face", name: "before1"},
  {id: "faceOne", classList: "face after", name: "after1"},
  {id: "faceTwo", classList: "face", name: "before2"},
  {id: "faceTwo", classList: "face after", name: "after2"},
  {id: "faceThree", classList: "face", name: "before3"},
  {id: "faceThree", classList: "face after", name: "after3"},
  {id: "faceFour", classList: "face", name: "before4"},
  {id: "faceFour", classList: "face after", name: "after4"},
  {id: "faceFive", classList: "face", name: "before5"},
  {id: "faceFive", classList: "face after", name: "after5"},
  {id: "courseTitle", classList: "", name: "courseTitle"},
  {id: "check-icon", classList: "w-100", name: "checkIcon", isClass: true},
  {id: "course-banner-wrapper", classList: "w-100 rounded", name: "courseBannerLg"},
  {id: "finishIcon", classList: "h-100", name: "finishIcon"},
  {id: "unCheckedIcon", classList: "w-100 h-100 checked", name: "unCheckedIcon", isClass: true}
];

const uploadBoxes = document.querySelectorAll('.uploadBox');
const fileInputs = document.querySelectorAll('.fileInput');
const fileNames = document.querySelectorAll('.fileName');
const btn = document.querySelector('#analyzeBtn');
const progress = document.querySelector('.progress');
const bar = document.getElementById('progressBar');
const status = document.querySelector('#status');
const analyzeResult = document.querySelector('#analyzeResult');
const analyzeProgress = document.querySelector('#analyzeProgress');

const STORAGE_ANALYSIS = 'analysis_state';
const STORAGE_CHECKED = 'checked_state';
const INTERVAL = 1 * 10 * 1000; // 2 دقیقه
let sliderInterval;
let imageList = [];
let apiImages = {};

// =======================
// Fetch and render images
// =======================
async function getSiteImages() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/site-images/');
    if (!res.ok) throw new Error('خطا در دریافت تصاویر');

    apiImages = await res.json();
    renderBaseImages(apiImages);
    renderCheckedImages(apiImages);
  } catch (e) {
    console.error(e);
  }
}

function renderBaseImages(images) {
  let currentContainer = '';
  for (const image of siteImages) {
    if (image.isClass) {
      const nodes = document.querySelectorAll(`.${image.id}`);
      nodes.forEach(node => {
        node.innerHTML = '';
        const img = document.createElement('img');
        img.src = images[image.name];
        img.alt = image.name;
        img.className = image.classList;
        img.loading = 'lazy';
        node.appendChild(img);
      });
    } else {
      const container = document.getElementById(image.id);
      if (currentContainer !== image.id) container.innerHTML = '';
      currentContainer = image.id;

      const img = document.createElement('img');
      img.src = images[image.name];
      img.alt = image.id;
      img.className = image.classList;
      img.loading = 'lazy';
      container.appendChild(img);
    }
  }
}

function renderCheckedImages(images) {
  const state = getCheckedState();
  const imgEls = document.querySelectorAll('.checked');

  imgEls.forEach((img, i) => {
    img.src = state[i] || images.unCheckedIcon;
  });
}

function getCheckedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CHECKED)) || {};
  } catch {
    localStorage.removeItem(STORAGE_CHECKED);
    return {};
  }
}

function saveCheckedState(index, src) {
  const state = getCheckedState();
  state[index] = src;
  localStorage.setItem(STORAGE_CHECKED, JSON.stringify(state));
}

// ======================
// Upload Box Events
// ======================
uploadBoxes.forEach((box, i) => box.addEventListener('click', () => fileInputs[i].click()));
fileInputs.forEach((input, i) => {
  input.addEventListener('change', () => {
    if (input.files.length > 0) fileNames[i].textContent = input.files[0].name;
  });
});

// ======================
// Main analysis flow
// ======================
btn.addEventListener('click', async () => {
  const frontFile = fileInputs[0].files[0];
  const sideFile = fileInputs[1].files[0];

  if (!frontFile || !sideFile) {
    const noFileModal = new bootstrap.Modal(document.getElementById('noFileModal'));
    noFileModal.show();
    return;
  }

  resetAnalysis();
  startAnalysis();

  await runAnalysis(frontFile, sideFile);
});

function resetAnalysis() {
  clearInterval(sliderInterval);
  localStorage.removeItem(STORAGE_ANALYSIS);
  localStorage.removeItem(STORAGE_CHECKED);
  renderCheckedImages(apiImages);

  setProgress(0);
  progress.classList.add('visually-hidden');
  status.classList.add('visually-hidden');
  status.textContent = '';
  analyzeResult.classList.add('visually-hidden');
  analyzeProgress.classList.add('visually-hidden');
  btn.classList.remove('fade-shadow');
}

function startAnalysis() {
  const state = {
    started: true,
    startedAt: Date.now()
  };
  localStorage.setItem(STORAGE_ANALYSIS, JSON.stringify(state));
}

// ======================
// Analysis process
// ======================
async function runAnalysis(frontFile, sideFile) {
  progress.classList.remove("visually-hidden");
  status.classList.remove("visually-hidden");
  status.textContent = 'در حال آپلود...';
  btn.classList.add('fade-shadow');

  fakeProgress(1000 + Math.random() * 2000);

  const formData = new FormData();
  formData.append('front_image', frontFile);
  formData.append('side_image', sideFile);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/face-analysis/', {
      method: 'POST',
      body: formData
    });
    if (res.ok) status.textContent = 'ارسال شد';
    else status.textContent = 'خطا در ارسال';
    await res.json();
  } catch {
    status.textContent = 'اینترنت شما مشکل دارد';
  }

  // شروع اسلایدر تصاویر
  initSlider();
}

// ======================
// Progress bar
// ======================
function fakeProgress(duration) {
  const start = Date.now();
  function step() {
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
    setProgress(pct);
    if (pct < 100) requestAnimationFrame(step);
  }
  step();
}

function setProgress(value) {
  bar.style.width = value + '%';
  bar.textContent = value + '%';
}

// ======================
// Slider logic
// ======================
function initSlider() {
  const imgEls = document.querySelectorAll('.checked');
  if (!imgEls.length) return;

  // ادامه از state اگر refresh شد
  const state = JSON.parse(localStorage.getItem(STORAGE_ANALYSIS)) || {startedAt: Date.now()};
  const elapsed = Date.now() - state.startedAt;
  const startIndex = Math.floor(elapsed / INTERVAL);
  let currentIndex = startIndex;

  const checkedIcon = apiImages.checkedIcon;

  function showImage(idx) {
    if (!imgEls[idx]) return;
    imgEls[idx].src = checkedIcon;
    saveCheckedState(idx, checkedIcon);
  }

  // نمایش تصویر شروع
  showImage(currentIndex);

  sliderInterval = setInterval(() => {
    currentIndex++;
    if (currentIndex >= imgEls.length) {
      clearInterval(sliderInterval);
      return;
    }
    showImage(currentIndex);
  }, INTERVAL);
}

// ======================
// Auto resume on page load
// ======================
window.addEventListener('DOMContentLoaded', () => {
  getSiteImages().then(() => {
    const state = JSON.parse(localStorage.getItem(STORAGE_ANALYSIS));
    if (state?.started) initSlider();
  });
});
