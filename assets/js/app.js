const siteImages = [{
  id: "logo",
  classList: "h-100",
  name: "logo"
}, {
  id: "instagram",
  classList: "h-100",
  name: "instagram"
}, {
  id: "faceCorrect",
  classList: "icon",
  name: "correctIcon"
}, {
  id: "faceCorrect",
  classList: "face",
  name: "faceCorrect"
}, {
  id: "faceWrong",
  classList: "icon",
  name: "wrongIcon"
}, {
  id: "faceWrong",
  classList: "face",
  name: "faceWrong"
}, {
  id: "profileCorrect",
  classList: "icon",
  name: "correctIcon"
}, {
  id: "profileCorrect",
  classList: "face",
  name: "profileCorrect"
}, {
  id: "profileWrong",
  classList: "icon",
  name: "wrongIcon"
}, {
  id: "profileWrong",
  classList: "face",
  name: "profileWrong"
}, {
  id: "arrowIcon",
  classList: "",
  name: "arrowIcon"
}, {
  id: "faceIcon",
  classList: "",
  name: "faceIcon"
}, {
  id: "viewIcon",
  classList: "",
  name: "viewIcon"
}, {
  id: "analyzeIcon",
  classList: "",
  name: "analyzeIcon"
}, {
  id: "faceOne",
  classList: "face",
  name: "before1"
}, {
  id: "faceOne",
  classList: "face after",
  name: "after1"
}, {
  id: "faceTwo",
  classList: "face",
  name: "before2"
}, {
  id: "faceTwo",
  classList: "face after",
  name: "after2"
}, {
  id: "faceThree",
  classList: "face",
  name: "before3"
}, {
  id: "faceThree",
  classList: "face after",
  name: "after3"
}, {
  id: "faceFour",
  classList: "face",
  name: "before4"
}, {
  id: "faceFour",
  classList: "face after",
  name: "after4"
}, {
  id: "faceFive",
  classList: "face",
  name: "before5"
}, {
  id: "faceFive",
  classList: "face after",
  name: "after5"
}, {
  id: "courseTitle",
  classList: "",
  name: "courseTitle"
}, {
  id: "check-icon",
  classList: "w-100",
  name: "checkIcon",
  isClass: true
}, {
  id: "course-banner-wrapper",
  classList: "w-100 rounded",
  name: "courseBannerLg"
}, {
  id: "finishIcon",
  classList: "h-100",
  name: "finishIcon"
}, {
  id: "jawIcon",
  classList: "w-100 h-100",
  name: "jawIcon"
}, {
  id: "eyesIcon",
  classList: "w-100 h-100",
  name: "eyesIcon"
}, {
  id: "noseIcon",
  classList: "w-100 h-100",
  name: "noseIcon"
}, {
  id: "faceAnalyzeIcon",
  classList: "w-100 h-100",
  name: "faceAnalyzeIcon"
}, {
  id: "finalizeAnalyzeIcon",
  classList: "w-100 h-100",
  name: "finalizeAnalyzeIcon"
}, {
  id: "unCheckedIcon",
  classList: "w-100 h-100 checked",
  name: "unCheckedIcon",
  isClass: true
}];
const uploadCards = document.querySelectorAll('#cardContainer .card');
const uploadBoxes = document.querySelectorAll('.uploadBox');
const fileInputs = document.querySelectorAll('.fileInput');
const firstNextBtn = document.querySelector('#firstNext');
const secondNextBtn = document.querySelector('#secondNext');
const btn = document.querySelector('#analyzeBtn');
const previewWrappers = document.querySelectorAll('.preview-wrapper');
const previewImgs = document.querySelectorAll('.img-preview');
const removeBtns = document.querySelectorAll('.remove-image');
const courseBanner = document.querySelector('#course-banner');
const analyzeResult = document.querySelector('#analyzeResult');
const analyzeProgress = document.querySelector('#analyzeProgress');
const resultFace = document.querySelector('#resultFace');
const congras = document.querySelector('#congras');
const resultDetail = document.querySelector('#resultDetail');
const resultScore = document.querySelector('#resultScore');
// Global Variables
const faceData = new FormData();
const STORAGE_INDEX = 'slider_index';
const STORAGE_TIME = 'slider_last_time';
const INTERVAL = 1 * 5 * 1000;
const imagesLength = 5;
const props = {};
// modals
const noFileModalEl = document.getElementById('noFileModal');
const noFileModal = new bootstrap.Modal(noFileModalEl);
const loadingModalEl = document.getElementById('loadingModal');
const loadingModal = new bootstrap.Modal(loadingModalEl);
const invalidImageModalEl = document.getElementById('invalidImageModal');
const invalidImageModal = new bootstrap.Modal(invalidImageModalEl);
async function getSiteImages() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/site-images/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('خطا در دریافت تصاویر');
    }
    props["data"] = await response.json();
    const {
      data
    } = props;
    renderBaseImages(data);
    renderCheckedImages(data);
  } catch (error) {
    console.error(error);
  }
}

function renderBaseImages(images) {
  let currentContainer = '';
  for (const image of siteImages) {
    if (image.isClass) {
      const containers = document.querySelectorAll(`.${image.id}`);
      containers.forEach(node => {
        node.innerHTML = '';
        const img = document.createElement('img');
        img.src = images[image.name];
        img.alt = image.name;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.classList = image.classList;
        node.appendChild(img);
      });
    } else {
      const container = document.getElementById(image.id);
      if (currentContainer !== image.id) {
        container.innerHTML = '';
        currentContainer = image.id;
      }
      const img = document.createElement('img');
      img.src = images[image.name];
      img.alt = image.id;
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.classList = image.classList;
      container.appendChild(img);
    }
  }
}

function renderCheckedImages(images) {
  const state = getCheckedState();
  const imgEls = document.querySelectorAll('.checked');
  imgEls.forEach((img, index) => {
    if (state[index]) {
      img.src = state[index];
    } else {
      img.src = images.unCheckedIcon;
    }
  });
}
getSiteImages();
document.addEventListener('DOMContentLoaded', () => {
  if (isInProgress()) {
    btn.classList.remove('fade-shadow');
    analyzeResult.classList.remove('visually-hidden');
    analyzeProgress.classList.remove('visually-hidden');
    init();
  } else {
    resetAll();
  }
});
uploadBoxes.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    fileInputs[index].click();
  })
  fileInputs[index].addEventListener('change', () => {
    const file = fileInputs[index].files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    previewImgs[index].src = url;
    previewWrappers[index].classList.remove('visually-hidden');
  });
  removeBtns[index].addEventListener('click', () => {
    fileInputs[index].value = '';
    previewImgs[index].src = '';
    previewWrappers[index].classList.add('visually-hidden');
  });
});
firstNextBtn.addEventListener('click', async function() {
  const frontFile = fileInputs[0].files[0];
  if (!frontFile) {
    noFileModal.show();
    return;
  }
  const tempFaceData = new FormData();
  tempFaceData.append('front_image', frontFile);
  faceData.append('front_image', frontFile);
  try {
    loadingModal.show();
    const res = await fetch('http://127.0.0.1:8000/api/front-face-detection/', {
      method: 'POST',
      body: tempFaceData
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!res.ok) {
      // const data = await res.json();
      // if (data.isCorrect) {
      uploadCards[0].classList.add("visually-hidden");
      firstNextBtn.classList.add("visually-hidden");
      secondNextBtn.classList.remove("visually-hidden");
      uploadCards[1].classList.remove("visually-hidden");
      // } else {
      //   invalidImageModal.show();
      // }
    } else {
      invalidImageModal.show();
    }
  } catch (err) {
    console.error(err);
    invalidImageModal.show();
  } finally {
    loadingModal.hide();
    loadingModalEl.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.style.overflow = 'auto';
    }, {
      once: true
    });
  }
});
secondNextBtn.addEventListener('click', async function() {
  const sideFile = fileInputs[1].files[0];
  if (!sideFile) {
    noFileModal.show();
    return;
  }
  const tempFaceData = new FormData();
  tempFaceData.append('side_image', sideFile);
  faceData.append('side_image', sideFile);
  try {
    loadingModal.show();
    const res = await fetch('http://127.0.0.1:8000/api/side-face-detection/', {
      method: 'POST',
      body: tempFaceData
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!res.ok) {
      // const data = await res.json();
      // if (data.isCorrect) {
      secondNextBtn.classList.add("visually-hidden");
      btn.classList.remove("visually-hidden");
      btn.click();
      // } else {
      //   invalidImageModal.show();
      // }
    } else {
      invalidImageModal.show();
    }
  } catch (err) {
    console.error(err);
    invalidImageModal.show();
  } finally {
    loadingModal.hide();
    loadingModalEl.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.style.overflow = 'auto';
    }, {
      once: true
    });
  }
});

function isInProgress() {
  try {
    return JSON.parse(localStorage.getItem('inprogress')) === true;
  } catch {
    return false;
  }
}
btn.addEventListener('click', async () => {
  resetAll();
  const frontFile = fileInputs[0].files[0];
  const sideFile = fileInputs[1].files[0];
  if (!frontFile || !sideFile) {
    noFileModal.show();
    localStorage.setItem('inprogress', JSON.stringify(false));
    return;
  }
  loadingModal.show();
  localStorage.setItem('inprogress', JSON.stringify(true));
  btn.classList.add('fade-shadow');
  try {
    const res = await fetch('http://127.0.0.1:8000/api/face-analysis/', {
      method: 'POST',
      body: faceData
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('analyzeRes', JSON.stringify(data));
      btn.classList.remove('fade-shadow');
      analyzeResult.classList.remove('visually-hidden');
      analyzeProgress.classList.remove('visually-hidden');
      btn.classList.add("visually-hidden");
      document.querySelector('#privacy').classList.add("visually-hidden");
    } else {
      invalidImageModal.show();
    }
  } catch (err) {
    console.error(err);
    invalidImageModal.show();
  } finally {
    loadingModal.hide();
    loadingModalEl.addEventListener('hidden.bs.modal', () => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.style.overflow = 'auto';
    }, {
      once: true
    });
    init();
  }
});

function resetAll() {
  localStorage.removeItem('slider_index');
  localStorage.removeItem('slider_last_time');
  localStorage.removeItem('checked_state');
  localStorage.removeItem('inprogress');
  localStorage.removeItem('analyzeRes');
  const {
    unCheckedIcon
  } = !props["data"] ? '' : props["data"];
  document.querySelectorAll('.checked').forEach(img => {
    img.src = unCheckedIcon;
  });
  analyzeResult.classList.add('visually-hidden');
  analyzeProgress.classList.add('visually-hidden');
  resultFace.classList.add('visually-hidden');
  congras.classList.add('visually-hidden');
  resultDetail.classList.add('visually-hidden');
  resultScore.classList.add('visually-hidden');
  btn.classList.remove('fade-shadow');
}
async function getImage() {
  const res = await fetch('http://127.0.0.1:8000/api/site-images/');
  const data = await res.json();
  const image = data.checkedIcon;
  return image;
}
async function init() {
  restoreCheckedImages();
  const index = getCurrentIndex();
  await startSlider(index);
}

function restoreCheckedImages() {
  const state = getCheckedState();
  if (!state) return;
  const imgEls = document.querySelectorAll('.checked');
  Object.keys(state).forEach(index => {
    if (imgEls[index]) {
      imgEls[index].src = state[index];
    }
  });
}

function getCheckedState() {
  try {
    const raw = localStorage.getItem('checked_state');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('checked_state خراب بود، ریست شد');
    localStorage.removeItem('checked_state');
    return {};
  }
}

function getCurrentIndex() {
  const savedIndex = parseInt(localStorage.getItem(STORAGE_INDEX)) || 0;
  const lastTime = parseInt(localStorage.getItem(STORAGE_TIME)) || Date.now();
  const elapsed = Date.now() - lastTime;
  const steps = Math.floor(elapsed / INTERVAL);
  let newIndex = savedIndex + steps;
  if (newIndex >= imagesLength) {
    newIndex = imagesLength - 1;
    state.inProgress = true;
  }
  return newIndex;
}
async function startSlider(startIndex) {
  let currentIndex = startIndex;
  await showImage(currentIndex);
  const interval = setInterval(async () => {
    currentIndex++;
    if (currentIndex >= imagesLength) {
      clearInterval(interval);
      localStorage.setItem('inprogress', JSON.stringify(false));
      const result = getAnalyzeRes();
      const img = document.createElement('img');
      // must be changed
      img.src = `H:/پروژه‌ها/جذاب شو/backend/config${result.front_image}`;
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      img.style.borderRadius = '50%';
      img.style.border = '4px solid green';
      img.classList = 'w-100 h-100';
      resultFace.innerHTML = '';
      resultFace.appendChild(img);
      const strengths = JSON.parse(result.strengths);
      const weaknesses = JSON.parse(result.weaknesses);
      const score = JSON.parse(result.score);
      const strengthsList = document.querySelector('#resultDetail .card:nth-child(2) .card-body ul');
      strengthsList.innerHTML = '';
      strengths.forEach(strength => {
        const li = document.createElement('li');
        li.textContent = strength;
        strengthsList.appendChild(li);
      });
      const weaknessesList = document.querySelector('#resultDetail .card:nth-child(1) .card-body ul');
      weaknessesList.innerHTML = '';
      weaknesses.forEach(weakness => {
        const li = document.createElement('li');
        li.textContent = weakness;
        weaknessesList.appendChild(li);
      });
      const scoreRes = document.querySelector('#resultScore .card:nth-child(1) .card-body h3 span');
      scoreRes.innerHTML = '';
      scoreRes.textContent = score;
      const optimizeRes = document.querySelector('#resultScore .card:nth-child(2) .card-body h3 span');
      optimizeRes.innerHTML = '';
      optimizeRes.textContent = score;
      resultFace.classList.remove('visually-hidden');
      congras.classList.remove('visually-hidden');
      resultDetail.classList.remove('visually-hidden');
      resultScore.classList.remove('visually-hidden');
      return;
    }
    await showImage(currentIndex);
  }, INTERVAL);
}
async function showImage(index) {
  const image = await getImage();
  const imgEls = document.querySelectorAll('.checked');
  imgEls[index].src = image;
  localStorage.setItem(STORAGE_INDEX, index);
  localStorage.setItem(STORAGE_TIME, Date.now());
  saveCheckedState(index, image);
}

function saveCheckedState(index, src) {
  const state = getCheckedState();
  state[index] = src;
  localStorage.setItem('checked_state', JSON.stringify(state));
}

function getAnalyzeRes() {
  try {
    const raw = localStorage.getItem('analyzeRes');
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('checked_state خراب بود، ریست شد');
    localStorage.removeItem('analyzeRes');
    return {};
  }
}