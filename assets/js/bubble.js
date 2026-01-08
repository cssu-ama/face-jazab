(() => {
  const glowLayer = document.createElement("div");
  glowLayer.style.position = "fixed";
  glowLayer.style.inset = "0";
  glowLayer.style.pointerEvents = "none";
  glowLayer.style.zIndex = "0";
  glowLayer.style.width = "100%";

  document.documentElement.appendChild(glowLayer);

  const count = Math.floor(Math.random() * 6) + 5; // 14 تا 30

  // 🎨 Weighted colors (pink dominant)
  const colors = [
    [255, 90, 170], // pink (x3)
    [255, 90, 170],
    [255, 90, 170],
    [120, 170, 255], // blue
    [120, 170, 255],
    [120, 170, 255],
    [120, 170, 255],
    [139, 92, 246],
    [255, 85, 165], // very light red (rare)
    [109, 40, 217],
  ];

  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  let index = 0;
  let isTurnRight = true;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= count) return;

      const glow = document.createElement("span");

      // ⬆️ بزرگ‌تر = پخش نرم‌تر
      const size = Math.random() * 280 + 220;

      const cellW = 100 / cols;
      const cellH = 100 / rows;

      // موقعیت پایه
      let x = col * cellW + Math.random() * cellW;
      let y = row * cellH + Math.random() * cellH;

      // فاصله از مرکز (50%, 50%)
      const distFromCenterX = Math.abs(x - 50);
      const distFromCenterY = Math.abs(y - 50);
      const distFromCenter = Math.sqrt(
        distFromCenterX ** 2 + distFromCenterY ** 2
      );

      // دایره‌هایی که در نزدیکی مرکز هستند به حاشیه‌ها منتقل شوند
      if (distFromCenter < 35) {
        // جهت حرکت به سمت نزدیک‌ترین حاشیه
        const moveX = x < 50 ? -1 : 1;
        const moveY = y < 50 ? -1 : 1;

        x = x + moveX * (35 - distFromCenter) * 0.8;
        y = y + moveY * (35 - distFromCenter) * 0.8;

        // محدود کردن به محدوده‌های معقول
        x = Math.max(5, Math.min(95, x));
        y = Math.max(5, Math.min(95, y));
      }

      const [r, g, b] = colors[Math.floor(Math.random() * colors.length)];

      glow.style.position = "absolute";
      glow.style.width = size + "px";
      glow.style.height = size + "px";

      if (isTurnRight) {
        glow.style.right = x + "%";
      } else {
        glow.style.left = x + "%";
      }

      isTurnRight = !isTurnRight;

      glow.style.top = y + "%";
      glow.style.borderRadius = "50%";

      /* 🌫 Ultra-diffused inner glow */
      glow.style.background = `
        radial-gradient(
          circle at center,
          rgba(${r},${g},${b},0.35) 0%,
          rgba(${r},${g},${b},0.28) 18%,
          rgba(${r},${g},${b},0.18) 38%,
          rgba(${r},${g},${b},0.10) 58%,
          rgba(${r},${g},${b},0.04) 72%,
          rgba(${r},${g},${b},0.0) 85%
        )
      `;

      /* 🫁 Breathing – خیلی نرم */
      glow.style.animation = `breathingGlow ${
        Math.random() * 10 + 14
      }s ease-in-out infinite`;
      glow.style.animationDelay = `${Math.random() * 8}s`;

      glowLayer.appendChild(glow);
      index++;
    }
  }
})();
