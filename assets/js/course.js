const siteImages = [{
  id: "logo",
  classList: "h-100",
  name: "logo"
}, {
  id: "instagram",
  classList: "h-100",
  name: "instagram"
}, {
  id: "cashCardIcon",
  classList: "w-100",
  name: "cashCardIcon"
}, {
  id: "whatsappIcon",
  classList: "h-100",
  name: "whatsappIcon"
}, {
  id: "telegramIcon",
  classList: "h-100",
  name: "telegramIcon"
}];
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
  } catch (error) {
    console.error(error);
  }
}

function renderImages(images) {
  let currentContainer = '';
  for (const image of siteImages) {
    const container = document.getElementById(image.id);
    if (currentContainer !== image.id) {
      container.innerHTML = '';
      currentContainer = image.id;
    }
    const img = document.createElement('img');
    img.src = images[image.name];
    img.alt = image.id;
    img.loading = 'lazy'; // بهینه‌سازی
    img.referrerPolicy = 'no-referrer'; // امنیت
    img.classList = image.classList;
    container.appendChild(img);
  }
}
getSiteImages();