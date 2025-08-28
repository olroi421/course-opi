/**
 * Простий скрипт для глобального зберігання теми
 */

(function () {
  "use strict";

  // Ключ для зберігання теми в localStorage
  const THEME_KEY = "__md_theme";

  // Функція для застосування збереженої теми
  function applyTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        const palette = document.querySelector('[data-md-component="palette"]');
        if (palette && themeData.index !== undefined) {
          const paletteInputs = palette.querySelectorAll(
            'input[name="__palette"]',
          );
          if (paletteInputs[themeData.index]) {
            paletteInputs[themeData.index].checked = true;
            paletteInputs[themeData.index].dispatchEvent(new Event("change"));
          }
        }
      } catch (e) {
        console.warn("Помилка при застосуванні збереженої теми:", e);
      }
    }
  }

  // Застосовуємо тему при завантаженні
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(applyTheme, 50);

    // Зберігаємо вибір теми
    const palette = document.querySelector('[data-md-component="palette"]');
    if (palette) {
      palette.addEventListener("change", function (event) {
        const target = event.target;
        if (target.name === "__palette") {
          const paletteData = {
            index: Array.from(target.parentNode.parentNode.children).indexOf(
              target.parentNode,
            ),
          };
          localStorage.setItem(THEME_KEY, JSON.stringify(paletteData));
        }
      });
    }
  });
})();
