const uploadBoxes = document.querySelectorAll('.uploadBox');
const fileInputs = document.querySelectorAll('.fileInput');
const fileNames = document.querySelectorAll('.fileName');
const btn = document.querySelector('#analyzeBtn');
const progress = document.querySelector('.progress');
const bar = document.getElementById('progressBar');
const status = document.querySelector('#status');

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