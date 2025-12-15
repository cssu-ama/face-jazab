(() => {
  const glassLayer = document.createElement("div");
  glassLayer.style.position = "fixed";
  glassLayer.style.inset = "0";
  glassLayer.style.pointerEvents = "none";
  glassLayer.style.zIndex = "0";
  glassLayer.style.height = "100vh";
  glassLayer.style.width = "100%";

  document.body.appendChild(glassLayer);

  const count = Math.floor(Math.random() * 11) + 5; // 10 تا 30

  // محاسبه تعداد ستون و ردیف بر اساس تعداد دایره‌ها
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  let index = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= count) return;

      const circle = document.createElement("span");

      const size = Math.random() * 80 + 10;

      // محدوده هر سلول
      const cellWidth = 80 / cols;
      const cellHeight = 80 / rows;

      // موقعیت رندوم داخل سلول
      const left = col * cellWidth + Math.random() * cellWidth;
      const top = row * cellHeight + Math.random() * cellHeight;

      circle.style.position = "absolute";
      circle.style.width = size + "px";
      circle.style.height = size + "px";
      circle.style.left = left + "%";
      circle.style.top = top + "%";
      circle.style.borderRadius = "50%";

      /* Glass Effect */
      circle.style.background = "rgba(0,0,0,0.18)";
      circle.style.backdropFilter = "blur(14px)";
      circle.style.webkitBackdropFilter = "blur(14px)";
      circle.style.border = "1px solid rgba(255,255,255,0.08)";
      circle.style.boxShadow = "0 10px 35px rgba(0,0,0,0.35)";

      glassLayer.appendChild(circle);
      index++;
    }
  }
})();