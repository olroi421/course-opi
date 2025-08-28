/**
 * Глобальне зберігання та синхронізація теми на всіх сторінках сайту
 */

(function () {
  "use strict";

  // Ключ для зберігання теми в localStorage
  const THEME_KEY = "__md_theme";

  // Функція для застосування теми
  function applyTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      try {
        const themeData = JSON.parse(savedTheme);
        const palette = document.querySelector('[data-md-component="palette"]');
        if (palette && themeData.index !== undefined) {
          // Встановлюємо збережену тему
          const paletteInputs = palette.querySelectorAll(
            'input[name="__palette"]',
          );
          if (paletteInputs[themeData.index]) {
            paletteInputs[themeData.index].checked = true;

            // Тригеримо подію зміни для застосування теми
            paletteInputs[themeData.index].dispatchEvent(new Event("change"));
          }
        }
      } catch (e) {
        console.warn("Помилка при застосуванні збереженої теми:", e);
      }
    }
  }

  // Застосовуємо тему при завантаженні сторінки
  document.addEventListener("DOMContentLoaded", function () {
    // Невелика затримка щоб дати MkDocs Material ініціалізуватися
    setTimeout(applyTheme, 50);

    // Додаємо слухачів для збереження вибору теми
    const palette = document.querySelector('[data-md-component="palette"]');
    if (palette) {
      palette.addEventListener("change", function (event) {
        const target = event.target;
        if (target.name === "__palette") {
          // Зберігаємо вибір у localStorage
          const paletteData = {
            index: Array.from(target.parentNode.parentNode.children).indexOf(
              target.parentNode,
            ),
          };
          localStorage.setItem(THEME_KEY, JSON.stringify(paletteData));

          // Оновлюємо тему для Mermaid діаграм
          updateMermaidTheme();
        }
      });
    }
  });

  // Функція для оновлення теми Mermaid діаграм
  function updateMermaidTheme() {
    if (typeof mermaid !== "undefined") {
      setTimeout(() => {
        const isDark =
          document.querySelector('[data-md-color-scheme="slate"]') !== null;
        const theme = isDark ? "dark" : "default";

        mermaid.initialize({
          theme: theme,
          startOnLoad: false,
        });

        // Перемальовуємо всі діаграми
        const diagrams = document.querySelectorAll(".mermaid");
        diagrams.forEach((diagram, index) => {
          if (diagram.getAttribute("data-processed") !== "true") {
            return; // Діаграма ще не була оброблена
          }

          const graphDefinition =
            diagram.getAttribute("data-mermaid") || diagram.textContent;
          if (graphDefinition) {
            diagram.innerHTML = "";
            diagram.removeAttribute("data-processed");

            try {
              mermaid
                .render(`mermaid-${Date.now()}-${index}`, graphDefinition)
                .then((result) => {
                  diagram.innerHTML = result.svg;
                })
                .catch((error) => {
                  console.warn(
                    "Помилка при оновленні Mermaid діаграми:",
                    error,
                  );
                });
            } catch (error) {
              console.warn("Помилка при рендері Mermaid діаграми:", error);
            }
          }
        });
      }, 100);
    }
  }
})();
