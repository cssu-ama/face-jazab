document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const cameraModal = new bootstrap.Modal(document.getElementById('cameraModal'));
    let currentInput = null; // نگه داشتن مرجع اینکه کدام اینپوت باید پر شود
    let stream = null;
    // ۱. باز کردن دوربین وقتی کاربر روی دکمه کلیک می‌کند
    document.querySelectorAll('.open-camera-btn').forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            // پیدا کردن اینپوت مربوط به همین کارت
            currentInput = document.querySelectorAll('.fileInput')[index];
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user"
                    }, // استفاده از دوربین جلو
                    audio: false
                });
                video.srcObject = stream;
                cameraModal.show();
            } catch (err) {
                alert("خطا در دسترسی به دوربین! مطمئن شوید دسترسی داده شده است.");
                console.error(err);
            }
        });
    });
    // ۲. ثبت عکس (Capture)
    captureBtn.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // رسم فریم فعلی ویدیو روی کانواس
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // تبدیل کانواس به فایل (Blob) برای ارسال به سرور یا پردازش‌های بعدی
        canvas.toBlob((blob) => {
            const file = new File([blob], "captured_image.png", {
                type: "image/png"
            });
            // ایجاد یک DataTransfer برای شبیه‌سازی انتخاب فایل در Input
            const container = new DataTransfer();
            container.items.add(file);
            currentInput.files = container.files;
            // فراخوانی رویداد تغییر (Change) برای اینکه کدهای قبلی شما متوجه شوند فایل آپلود شده
            currentInput.dispatchEvent(new Event('change', {
                bubbles: true
            }));
            // بستن دوربین و مودال
            stopCamera();
            cameraModal.hide();
        }, 'image/png');
    });
    // ۳. متوقف کردن دوربین هنگام بستن مودال
    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
    document.getElementById('closeCamera').addEventListener('click', stopCamera);
    document.getElementById('cameraModal').addEventListener('hidden.bs.modal', stopCamera);
});