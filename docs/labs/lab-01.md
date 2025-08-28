# Лабораторна робота 1: Налаштування середовища розробки

## Мета роботи

Налаштувати повноцінне середовище розробки для курсу програмної інженерії, включаючи IDE, інструменти контролю версій та основні утиліти.

## Завдання

1. Встановити та налаштувати IDE
2. Налаштувати Git та GitHub
3. Встановити необхідні інструменти
4. Створити тестовий проєкт
5. Оформити звіт про виконану роботу

## Передумови

- Базові знання роботи з командним рядком
- Зареєстрований акаунт GitHub
- Права адміністратора на комп'ютері

## Час виконання

2 години

## Складність

⭐ Початківець

---

## Частина 1: Встановлення IDE

### Рекомендовані IDE

Оберіть одну з IDE для основної роботи:

=== "Visual Studio Code"

    **Переваги:**
    - Безкоштовна
    - Велика кількість розширень
    - Підтримка багатьох мов

    **Встановлення:**
    1. Завантажте з [code.visualstudio.com](https://code.visualstudio.com/)
    2. Встановіть за інструкціями для вашої ОС
    3. Запустіть та перевірте роботу

=== "JetBrains IntelliJ IDEA"

    **Переваги:**
    - Потужні інструменти рефакторингу
    - Вбудовані інструменти тестування
    - Інтелектуальний аналіз коду

    **Встановлення:**
    1. Завантажте Community Edition з [jetbrains.com](https://www.jetbrains.com/idea/)
    2. Встановіть та запустіть
    3. Налаштуйте initial setup

=== "Eclipse"

    **Переваги:**
    - Безкоштовна
    - Модульна архітектура
    - Багато плагінів

    **Встановлення:**
    1. Завантажте з [eclipse.org](https://www.eclipse.org/)
    2. Встановіть Java Development Tools
    3. Налаштуйте workspace

### Обов'язкові розширення для VS Code

```bash
# Встановлення через командний рядок
code --install-extension ms-vscode.vscode-json
code --install-extension ms-python.python
code --install-extension redhat.java
code --install-extension ms-vscode.cpptools
code --install-extension GitLens.gitlens
```

!!! tip "Корисна порада"
    Налаштуйте автозбереження файлів: `File → Auto Save`

---

## Частина 2: Налаштування Git

### Встановлення Git

=== "Windows"
    ```bash
    # Завантажте з git-scm.com або використайте Chocolatey
    choco install git
    ```

=== "macOS"
    ```bash
    # Використайте Homebrew
    brew install git
    ```

=== "Linux"
    ```bash
    # Ubuntu/Debian
    sudo apt-get install git

    # Fedora
    sudo dnf install git
    ```

### Початкове налаштування

```bash
# Встановлення користувача
git config --global user.name "Ваше Ім'я"
git config --global user.email "your.email@example.com"

# Налаштування редактора
git config --global core.editor "code --wait"

# Налаштування кольорів
git config --global color.ui auto

# Перевірка налаштувань
git config --list
```

### Налаштування SSH ключів для GitHub

```bash
# Генерація SSH ключа
ssh-keygen -t ed25519 -C "your.email@example.com"

# Запуск SSH агента
eval "$(ssh-agent -s)"

# Додавання ключа до агента
ssh-add ~/.ssh/id_ed25519

# Копіювання публічного ключа
cat ~/.ssh/id_ed25519.pub
```

!!! warning "Важливо"
    Додайте скопійований ключ до свого GitHub акаунта через Settings → SSH and GPG keys

### Тестування з'єднання

```bash
ssh -T git@github.com
```

Очікуваний результат:
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## Частина 3: Додаткові інструменти

### Node.js та npm

```bash
# Завантажте з nodejs.org або використайте менеджер версій

# Перевірка встановлення
node --version
npm --version
```

### Python

```bash
# Перевірка встановлення
python --version
pip --version

# Встановлення віртуального середовища
pip install virtualenv
```

### Інструменти командного рядка

=== "Windows"
    - **Git Bash** - Unix-подібний термінал
    - **Windows Terminal** - сучасний термінал
    - **PowerShell Core** - крос-платформний PowerShell

=== "macOS/Linux"
    - **zsh/bash** - стандартні оболонки
    - **Oh My Zsh** - покращення для zsh
    - **tmux** - мультиплексор терміналу

---

## Частина 4: Створення тестового проєкту

### 1. Створення локального репозиторію

```bash
# Створення директорії проєкту
mkdir my-first-project
cd my-first-project

# Ініціалізація Git репозиторію
git init

# Створення README файлу
echo "# My First Project" > README.md

# Додавання файлу до відстеження
git add README.md

# Перший commit
git commit -m "Initial commit"
```

### 2. Створення репозиторію на GitHub

1. Перейдіть на [github.com](https://github.com)
2. Натисніть "New repository"
3. Введіть назву: `my-first-project`
4. **НЕ** створюйте README.md (він вже існує локально)
5. Натисніть "Create repository"

### 3. З'єднання локального та віддаленого репозиторіїв

```bash
# Додавання віддаленого репозиторію
git remote add origin git@github.com:yourusername/my-first-project.git

# Відправлення коду на GitHub
git branch -M main
git push -u origin main
```

### 4. Створення простої програми

Створіть файл `hello.py`:

```python
#!/usr/bin/env python3
"""
Проста програма для тестування середовища розробки
"""

def main():
    """Головна функція програми"""
    name = input("Введіть ваше ім'я: ")
    print(f"Привіт, {name}! Ласкаво просимо до курсу програмної інженерії!")

if __name__ == "__main__":
    main()
```

### 5. Тестування та commit

```bash
# Тестування програми
python hello.py

# Додавання до Git
git add hello.py
git commit -m "Add hello.py - simple greeting program"

# Відправлення на GitHub
git push
```

---

## Частина 5: Документація проєкту

Розширте файл `README.md`:

```markdown
# My First Project

Тестовий проєкт для курсу програмної інженерії.

## Опис

Простий проєкт для перевірки налаштування середовища розробки.

## Встановлення

1. Клонуйте репозиторій:
   ```bash
   git clone https://github.com/yourusername/my-first-project.git
   ```

2. Перейдіть до директорії проєкту:
   ```bash
   cd my-first-project
   ```

## Використання

Запустіть програму:

```bash
python hello.py
```

## Автор

- Ваше Ім'я (@yourusername)

## Ліцензія

MIT License
```

---

## Критерії оцінювання

| Критерій | Бали | Опис |
|----------|------|------|
| **IDE налаштована** | 2 | IDE встановлена та готова до роботи |
| **Git налаштований** | 2 | Git налаштований з правильними credentials |
| **SSH підключення** | 2 | SSH ключі налаштовані для GitHub |
| **Тестовий проєкт** | 3 | Проєкт створений та завантажений на GitHub |
| **Якість коду** | 1 | Код відформатований та прокоментований |
| **Всього** | **10** | |

## Звіт про виконання

Створіть файл `lab1-report.md` з наступним змістом:

```markdown
# Звіт з лабораторної роботи 1

**Студент:** [Ваше ім'я]
**Група:** [Ваша група]
**Дата:** [Дата виконання]

## Виконані завдання

- [x] Встановлена IDE: [назва IDE]
- [x] Налаштований Git
- [x] Створені SSH ключі
- [x] Створений тестовий проєкт
- [x] Проєкт завантажений на GitHub

## Скріншоти

[Додайте скріншоти IDE, терміналу з git статусом, GitHub репозиторію]

## Виникли проблеми

[Опишіть проблеми, що виникли, та як їх вирішили]

## Висновки

[Ваші висновки про роботу]
```

## Додаткові завдання (бонус)

1. **Налаштуйте .gitignore** для вашої мови програмування
2. **Встановіть GitHub CLI** та спробуйте створити репозиторій через командний рядок
3. **Налаштуйте pre-commit hooks** для автоматичної перевірки коду

## Корисні посилання

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [VS Code Documentation](https://code.visualstudio.com/docs)

---

**Термін здачі:** Тиждень з моменту видачі завдання

**Форма здачі:** Посилання на GitHub репозиторій + звіт у форматі Markdown
