(function () {
    const copyBtn = document.getElementById('copyBtn');
    const cardEl = document.getElementById('cardNumber');
    const statusEl = document.getElementById('copyStatus');
    const noFileModalEl = document.getElementById('noFileModal');
    const noFileModal = new bootstrap.Modal(noFileModalEl);

    function getCardText() {
      // اگر می‌خواهی هنگام کپی، فاصله‌ها حذف شوند:
      return (cardEl.dataset.card || cardEl.textContent).replace(/\s+/g, '');
      // اگر می‌خواهی فاصله‌ها حفظ شوند، از خط بالا به:
      // return cardEl.dataset.card || cardEl.textContent;
    }

    async function copyToClipboard(text) {
      // تلاش با API مدرن
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (e) {
          // ادامه به روش قدیمی
        }
      }

      // روش قدیمی fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (e) {
        return false;
      }
    }

    copyBtn.addEventListener('click', async () => {
      const text = getCardText();
      const ok = await copyToClipboard(text);

      if (ok) {
        noFileModal.show();
      }
    });
  })();