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
];

const uploadBoxes = document.querySelectorAll('.uploadBox');
const fileInputs = document.querySelectorAll('.fileInput');
const fileNames = document.querySelectorAll('.fileName');
const btn = document.querySelector('#analyzeBtn');
const progress = document.querySelector('.progress');
const bar = document.getElementById('progressBar');
const status = document.querySelector('#status');
const courseBanner = document.querySelector('#course-banner');

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

    const data = await response.json();

    renderImages(data);

  } catch(error) {
    console.error(error);
  }
}

function renderImages(images) {
  let currentContainer = '';
  for (const image of siteImages) {
    if(image?.isClass) {
      const containers = document.querySelectorAll(`.${image.id}`);

      containers.forEach(node => {
        node.innerHTML = '';
        const img = document.createElement('img');
        img.src = images[image.name];
        img.alt = image.name;
        img.loading = 'lazy';   // بهینه‌سازی
        img.referrerPolicy = 'no-referrer'; // امنیت
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
      img.loading = 'lazy';   // بهینه‌سازی
      img.referrerPolicy = 'no-referrer'; // امنیت
      img.classList = image.classList;

      container.appendChild(img);
    }
  }
}

getSiteImages();

uploadBoxes[0].addEventListener('click', function () {
  fileInputs[0].click();
});

uploadBoxes[1].addEventListener('click', function () {
  fileInputs[1].click();
});

fileInputs[0].addEventListener('change', function () {
  if (this.files.length > 0) {
    fileNames[0].textContent = this.files[0].name;
  }
});

fileInputs[1].addEventListener('change', function () {
  if (this.files.length > 0) {
    fileNames[1].textContent = this.files[0].name;
  }
});

const noFileModalEl = document.getElementById('noFileModal');
const noFileModal = new bootstrap.Modal(noFileModalEl);

btn.addEventListener('click', async () => {
  const files = [];
  files.push(fileInputs[0].files);
  files.push(fileInputs[1].files);

  if (files[0].length === 0 || files[0].length === 0) {
    noFileModal.show();
    return;
  }

  progress.classList.remove("visually-hidden");
  status.classList.remove("visually-hidden");
  status.textContent = 'در حال آپلود...';
      
  btn.classList.add('fade-shadow');

  fakeProgress(1000 + Math.random() * 2000); // بین 1 تا 3 ثانیه

  const faceData = new FormData();
  for (let i = 0; i < files.length; i++) faceData.append('files', files[i]);

  /*try {
    const res = await fetch('https://your-api.example.com/api/uploads', {
      method: 'POST',
      body: fd,
      // headers: { }  -- !!! نذار Content-Type اینجا
    });
    const json = await res.json();
    if (res.ok) {
      setProgress(100);
      status.textContent = 'ارسال شد';
    } else {
      status.textContent = 'خطا در ارسال';
    }
  } catch (err) {
    status.textContent = 'اینترنت شما مشکل دارد';
  } finally {
    setTimeout(() => btn.classList.remove('fade-shadow'), 400);
    setTimeout(() => progress.classList.add('visually-hidden'), 400);
    setTimeout(() => status.classList.add('visually-hidden'), 400);
  }*/
});

function fakeProgress(duration) {
  const start = Date.now();

  function step() {
    const elapsed = Date.now() - start;
    const pct = Math.min(100, Math.floor((elapsed / duration) * 100));

    setProgress(pct);

    if (pct < 100) {
      requestAnimationFrame(step);
    }
  }

  step();
}

function setProgress(value) {
  bar.style.width = value + '%';
  bar.textContent = value + '%';
}

/**function updateImage() {
  const width = window.innerWidth;

  if (width < 992) {
    courseBanner.src = "./assets/images/course-banner.jpg";
  } else {
    courseBanner.src = "./assets/images/course-banner-lg.png";
  }
}

updateImage();

window.addEventListener("resize", updateImage);*/
