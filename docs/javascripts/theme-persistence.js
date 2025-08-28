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

    // Ініціалізуємо Mermaid з покращеними налаштуваннями
    initializeMermaid();
  });

  // Функція для ініціалізації Mermaid з кращими налаштуваннями для темної теми
  function initializeMermaid() {
    if (typeof mermaid !== "undefined") {
      const isDark =
        document.querySelector('[data-md-color-scheme="slate"]') !== null;

      // Покращена конфігурація для темної теми
      const config = {
        startOnLoad: true,
        theme: isDark ? "dark" : "default",
        themeVariables: isDark
          ? {
              // Кастомні кольори для темної теми - краща читабельність
              primaryColor: "#4f46e5",
              primaryTextColor: "#ffffff",
              primaryBorderColor: "#6366f1",
              lineColor: "#64748b",

              // Кольори для тексту
              textColor: "#f1f5f9",
              mainBkg: "#334155",
              secondBkg: "#475569",
              tertiaryColor: "#64748b",

              // Кольори для flowchart
              nodeBkg: "#475569",
              nodeBorder: "#64748b",
              clusterBkg: "#1e293b",
              clusterBorder: "#475569",

              // Кольори для sequence діаграм
              actorBkg: "#475569",
              actorBorder: "#64748b",
              actorTextColor: "#f1f5f9",
              actorLineColor: "#64748b",
              signalColor: "#f1f5f9",
              signalTextColor: "#f1f5f9",

              // Кольори для gantt діаграм
              gridColor: "#64748b",
              section0: "#4f46e5",
              section1: "#7c3aed",
              section2: "#059669",
              section3: "#dc2626",

              // Кольори для pie діаграм
              pie1: "#4f46e5",
              pie2: "#7c3aed",
              pie3: "#059669",
              pie4: "#dc2626",
              pie5: "#ea580c",
              pie6: "#0891b2",
              pie7: "#be123c",
              pie8: "#7c2d12",
              pie9: "#365314",
              pie10: "#581c87",
              pie11: "#0f172a",
              pie12: "#1e1b4b",
            }
          : {},
      };

      mermaid.initialize(config);
    }
  }

  // Функція для оновлення теми Mermaid діаграм
  function updateMermaidTheme() {
    if (typeof mermaid !== "undefined") {
      setTimeout(() => {
        // Повторна ініціалізація з новими налаштуваннями
        initializeMermaid();

        // Перемальовуємо всі діаграми
        const diagrams = document.querySelectorAll(".mermaid");
        diagrams.forEach((diagram, index) => {
          const originalContent = diagram.textContent || diagram.innerHTML;

          // Очищуємо діаграму
          diagram.innerHTML = "";
          diagram.removeAttribute("data-processed");

          // Створюємо новий контент
          const tempDiv = document.createElement("div");
          tempDiv.textContent = originalContent.replace(/<[^>]*>/g, ""); // Видаляємо HTML теги

          // Замінюємо контент діаграми
          diagram.innerHTML = tempDiv.textContent;

          // Повторно обробляємо діаграму
          try {
            mermaid.init(undefined, diagram);
          } catch (error) {
            console.warn("Помилка при оновленні Mermaid діаграми:", error);
            // Якщо є проблеми, залишаємо текстовий варіант
            diagram.innerHTML = `<pre style="color: var(--md-default-fg-color); background: var(--md-code-bg-color); padding: 1rem; border-radius: 0.4rem;">${tempDiv.textContent}</pre>`;
          }
        });
      }, 200);
    }
  }
})();
