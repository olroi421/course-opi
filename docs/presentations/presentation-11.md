# RESTful API: принципи проєктування, тестування та документування

## План лекції

1. Що таке REST та API
2. Принципи REST архітектури
3. Проєктування RESTful API
4. HTTP методи та коди статусу
5. Безпека API
6. Тестування API
7. Документування з OpenAPI

## 1. Що таке REST та API

## API - Application Programming Interface

### 🔌 Інтерфейс для взаємодії програм:

```mermaid
graph LR
    A[Мобільний додаток] -->|API запити| B[Сервер]
    C[Вебсайт] -->|API запити| B
    D[Інший сервіс] -->|API запити| B

    B -->|JSON відповіді| A
    B -->|JSON відповіді| C
    B -->|JSON відповіді| D
```

### 🎯 Навіщо потрібен API:

- Розділення frontend та backend
- Мобільні додатки
- Інтеграція між сервісами
- Мікросервісна архітектура

## REST - Representational State Transfer

### 📜 Історія:

Архітектурний стиль запропонований **Роєм Філдінгом у 2000** році

Аналіз успіху архітектури вебу

### 🔑 Ключова ідея:

Взаємодія з **ресурсами** через стандартизований інтерфейс

Ресурс = будь-яка інформація (користувач, товар, замовлення)

### 🌐 REST використовує HTTP:

- Методи (GET, POST, PUT, DELETE)
- URI для ідентифікації ресурсів
- Коди статусу для результатів
- Заголовки для метаданих

## 2. Принципи REST

## 6 обмежень REST архітектури

```mermaid
graph TB
    A[REST Constraints] --> B[Client-Server]
    A --> C[Stateless]
    A --> D[Cacheable]
    A --> E[Uniform Interface]
    A --> F[Layered System]
    A --> G[Code on Demand<br/>опціонально]
```

## Client-Server

### 🔄 Розділення відповідальності:

**Клієнт:**
- Інтерфейс користувача
- Представлення даних

**Сервер:**
- Бізнес-логіка
- Зберігання даних

### ✅ Переваги:

Незалежна еволюція компонентів

Краща масштабованість

Спрощення серверних компонентів

## Stateless - без стану

```mermaid
sequenceDiagram
    participant C as Клієнт
    participant S as Сервер

    C->>S: GET /api/products (+ Auth Token)
    S->>C: 200 OK + список товарів

    C->>S: POST /api/orders (+ Auth Token + дані)
    S->>C: 201 Created + нове замовлення

    Note over C,S: Кожен запит містить ВСЮ необхідну інформацію
```

### 🎯 Кожен запит самодостатній:

Сервер не зберігає стан клієнта

Вся інформація сесії на клієнті

### ✅ Переваги:

Проста масштабованість, надійність, кешування

## Uniform Interface

### 🎯 Уніфікований інтерфейс має 4 аспекти:

**1. Ідентифікація ресурсів через URI**
```
/api/products/123
/api/users/456/orders
```

**2. Маніпуляція через представлення**
- JSON, XML для передачі стану ресурсу

**3. Самоописові повідомлення**
- HTTP методи, коди статусу, заголовки

**4. HATEOAS** (Hypermedia as Engine of Application State)
- Посилання на пов'язані ресурси

## 3. Проєктування API

## Ресурси та URI

### 🎯 Проєктуйте навколо ресурсів (іменників):

```
✅ Добре:
GET    /api/products              # Колекція товарів
GET    /api/products/123          # Окремий товар
GET    /api/products/123/reviews  # Відгуки товару
POST   /api/products              # Створення
PUT    /api/products/123          # Оновлення
DELETE /api/products/123          # Видалення

❌ Погано (дієслова в URI):
GET    /api/getProduct?id=123
POST   /api/createProduct
POST   /api/deleteProduct?id=123
```

## Іменування URI

### ✅ Найкращі практики:

- 📝 Використовуйте **множину** для колекцій
- 🔡 **Lowercase** з дефісами: `/product-categories`
- 🌲 **Ієрархія** відображає зв'язки
- 🔢 **Версіонування**: `/api/v1/products`
- 🚫 Уникайте **дієслів** та операцій в URI

```
# Ієрархія ресурсів
/products                      # Всі товари
/products/123                  # Конкретний товар
/products/123/reviews          # Відгуки товару
/products/123/reviews/456      # Конкретний відгук

/customers/789/orders          # Замовлення клієнта
/orders/321/items              # Товари в замовленні
```

## 4. HTTP методи

## CRUD → HTTP методи

```mermaid
graph LR
    A[CRUD операції] --> B[Create → POST]
    A --> C[Read → GET]
    A --> D[Update → PUT/PATCH]
    A --> E[Delete → DELETE]
```

## GET - читання даних

```http
GET /api/products HTTP/1.1
Host: example.com
Authorization: Bearer token123
```

### ✅ Властивості:

- **Безпечний** - не змінює стан сервера
- **Ідемпотентний** - множинні запити = один результат
- **Кешується** - можна кешувати відповіді

### 🎯 Використання:

- Отримання списку ресурсів
- Отримання окремого ресурсу
- З query параметрами для фільтрації

## POST - створення ресурсу

```http
POST /api/products HTTP/1.1
Content-Type: application/json

{
  "name": "Ноутбук Dell XPS 15",
  "price": 45999,
  "category": "Electronics"
}
```

### ✅ Властивості:

- **НЕ ідемпотентний** - повторний запит створить новий ресурс
- Повертає **201 Created** при успіху
- Заголовок **Location** з URI нового ресурсу

```http
HTTP/1.1 201 Created
Location: /api/products/789
```

## PUT vs PATCH

### PUT - повне оновлення:

```http
PUT /api/products/123 HTTP/1.1
Content-Type: application/json

{
  "name": "Оновлена назва",
  "price": 42999,
  "category": "Electronics",
  "in_stock": true
}
```

Потрібно надіслати **всі поля**

**Ідемпотентний**

### PATCH - часткове оновлення:

```http
PATCH /api/products/123 HTTP/1.1
Content-Type: application/json

{
  "price": 42999
}
```

Надсилаємо **лише змінені поля**

## DELETE - видалення

```http
DELETE /api/products/123 HTTP/1.1
Authorization: Bearer token123
```

### ✅ Властивості:

- **Ідемпотентний** - повторне видалення = той самий ефект
- Повертає **204 No Content** або **200 OK**
- Видалення неіснуючого → **404 Not Found**

### ⚠️ Безпека:

Завжди вимагайте авторизацію!

## HTTP коди статусу

## 2xx - Успіх

- **200 OK** - успішний GET, PUT, PATCH
- **201 Created** - успішний POST, ресурс створено
- **204 No Content** - успішно, але немає тіла відповіді (DELETE)

## 4xx - Помилки клієнта

- **400 Bad Request** - некоректний синтаксис запиту
- **401 Unauthorized** - потрібна автентифікація
- **403 Forbidden** - доступ заборонено (навіть з автентифікацією)
- **404 Not Found** - ресурс не знайдено
- **409 Conflict** - конфлікт зі станом ресурсу
- **422 Unprocessable Entity** - помилки валідації

## 5xx - Помилки сервера

- **500 Internal Server Error** - загальна помилка сервера
- **503 Service Unavailable** - сервіс тимчасово недоступний

## Фільтрація, сортування, пагінація

### 🔍 Фільтрація через query параметри:

```
GET /api/products?category=electronics&price_min=1000&price_max=5000
GET /api/products?in_stock=true&brand=Apple
GET /api/orders?status=pending&created_after=2024-01-01
```

### 📊 Сортування:

```
GET /api/products?sort=price          # за зростанням
GET /api/products?sort=-price         # за спаданням
GET /api/products?sort=category,price # множинне
```

### 📄 Пагінація:

```
GET /api/products?page=2&limit=20
```

## Відповідь з пагінацією

```json
{
  "data": [
    {
      "id": 21,
      "name": "Товар 21",
      "price": 999
    }
    // ... ще 19 товарів
  ],
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "pages": 8,
    "next": "/api/products?page=3&limit=20",
    "prev": "/api/products?page=1&limit=20"
  }
}
```

## Обробка помилок

### 📋 Консистентна структура:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Помилки валідації в наданих даних",
    "timestamp": "2024-10-11T10:30:00Z",
    "path": "/api/products",
    "validation_errors": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Email має невалідний формат"
      },
      {
        "field": "price",
        "code": "OUT_OF_RANGE",
        "message": "Ціна має бути більше 0"
      }
    ]
  }
}
```

## 5. Безпека API

## Автентифікація vs Авторизація

```mermaid
graph TB
    A[Безпека API] --> B[Автентифікація<br/>Хто ти?]
    A --> C[Авторизація<br/>Що тобі дозволено?]

    B --> D[API Keys]
    B --> E[OAuth 2.0]
    B --> F[JWT Tokens]

    C --> G[Ролі користувачів]
    C --> H[Права доступу]
```

## JWT - JSON Web Tokens

### 🔑 Структура JWT:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IklWYW4gUGV0cmVua28iLCJpYXQiOjE1MTYyMzkwMjJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

### ✅ Переваги:

- **Stateless** - вся інформація в токені
- **Самодостатній** - не потребує БД для перевірки
- **Компактний** - передається в заголовку

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## OAuth 2.0 Flow

```mermaid
sequenceDiagram
    participant U as Користувач
    participant C as Клієнт
    participant A as Auth Server
    participant R as API Server

    U->>C: Запит доступу
    C->>A: Перенаправлення
    U->>A: Логін + дозвіл
    A->>C: Authorization Code
    C->>A: Обмін code на token
    A->>C: Access Token
    C->>R: API запит + Token
    R->>C: Дані
```

## Rate Limiting

### ⚠️ Обмеження кількості запитів:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1634567890
```

### 🚫 Перевищення ліміту:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Перевищено ліміт запитів",
    "retry_after": 60
  }
}
```

## Захист від атак

### 🛡️ Основні заходи:

**SQL Ін'єкції:**
```python
# ❌ НІКОЛИ
query = f"SELECT * FROM users WHERE email = '{email}'"

# ✅ ЗАВЖДИ параметризовані запити
query = "SELECT * FROM users WHERE email = %s"
cursor.execute(query, (email,))
```

**CORS - Cross-Origin Resource Sharing:**
```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**HTTPS завжди в production!**

## 6. Тестування API

## Типи тестів

```mermaid
graph TB
    A[Тестування API] --> B[Unit Tests<br/>Окремі функції]
    A --> C[Integration Tests<br/>Ендпоінти з БД]
    A --> D[E2E Tests<br/>Повні сценарії]

    B --> E[Швидкі<br/>Багато]
    C --> F[Середні<br/>Помірно]
    D --> G[Повільні<br/>Мало]
```

## Integration тести з Python

```python
import requests
import unittest

class TestProductAPI(unittest.TestCase):
    BASE_URL = "http://localhost:8000/api"

    def test_create_product(self):
        product_data = {
            "name": "Тестовий товар",
            "price": 999,
            "category": "Electronics"
        }

        response = requests.post(
            f"{self.BASE_URL}/products",
            json=product_data,
            headers={"Authorization": f"Bearer {self.token}"}
        )

        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertEqual(data["name"], product_data["name"])
        self.assertIn("id", data)

    def test_unauthorized_access(self):
        response = requests.post(
            f"{self.BASE_URL}/products",
            json={"name": "Test"}
        )
        self.assertEqual(response.status_code, 401)
```

## Postman для тестування

### 🧪 Postman Test Scripts:

```javascript
// Перевірка статус коду
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Перевірка структури відповіді
pm.test("Response has products array", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('products');
    pm.expect(jsonData.products).to.be.an('array');
});

// Перевірка даних
pm.test("Product has required fields", function () {
    const product = pm.response.json().products[0];
    pm.expect(product).to.have.property('id');
    pm.expect(product).to.have.property('name');
    pm.expect(product).to.have.property('price');
});

// Збереження змінної для наступних тестів
pm.environment.set("productId", jsonData.id);
```

## 7. Документування API

## Чому документація критична?

### 📚 Хороша документація:

- Прискорює інтеграцію розробників
- Зменшує кількість питань підтримки
- Служить контрактом між frontend та backend
- Допомагає при онбордингу нових розробників

### 📋 Що має включати:

- Опис кожного ендпоінту
- Параметри запитів
- Формати відповідей
- Коди помилок
- Приклади використання
- Authentication flows

## OpenAPI Specification (Swagger)

### 📄 Стандарт опису REST API:

```yaml
openapi: 3.0.0
info:
  title: Products API
  version: 1.0.0
  description: API для управління товарами

servers:
  - url: https://api.example.com/v1
    description: Production server

paths:
  /products:
    get:
      summary: Отримати список товарів
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Успішна відповідь
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Product'
```

## OpenAPI: схеми даних

```yaml
components:
  schemas:
    Product:
      type: object
      required:
        - name
        - price
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          minLength: 1
          maxLength: 200
        price:
          type: number
          format: double
          minimum: 0
        category:
          type: string
        in_stock:
          type: boolean
          default: true
        created_at:
          type: string
          format: date-time
          readOnly: true
```

## Swagger UI

### 🎨 Інтерактивна документація:

```mermaid
graph LR
    A[OpenAPI Spec<br/>YAML/JSON] --> B[Swagger UI]
    B --> C[Інтерактивна<br/>документація]
    B --> D[Можливість<br/>тестування]
    B --> E[Автогенерація<br/>клієнтів]
```

### ✅ Переваги:

- Візуальна документація
- Тестування API в браузері
- Автоматична генерація з коду
- Генерація клієнтських бібліотек

## Найкращі практики

### ✅ Консистентність:

- Одне іменування для всього API
- Єдиний формат відповідей
- Консистентна обробка помилок

### ✅ Версіонування:

```
/api/v1/products
/api/v2/products
```

Підтримка старих версій, попередження про deprecation

### ✅ Продуктивність:

- Compression (gzip)
- ETags для conditional requests
- Field filtering: `?fields=id,name,price`
- Pagination за замовчуванням

## Моніторинг та логування

### 📊 Що відстежувати:

```mermaid
graph TB
    A[API Metrics] --> B[Response Time<br/>Латентність]
    A --> C[Error Rate<br/>Кількість помилок]
    A --> D[Throughput<br/>Запитів/сек]
    A --> E[Popular Endpoints<br/>Топ ендпоінтів]
```

### 🔍 Correlation IDs:

```http
X-Correlation-ID: 550e8400-e29b-41d4-a716-446655440000
```

Відстеження запиту через всю систему

## Висновки

### 🎯 Ключові моменти:

1. **REST принципи** - stateless, uniform interface, ресурси
2. **HTTP правильно** - методи за семантикою, коди статусу
3. **Проєктування навколо ресурсів** - іменники, не дієслова
4. **Безпека багатошарова** - автентифікація, rate limiting, HTTPS
5. **Тестування на всіх рівнях** - unit, integration, e2e
6. **Документація критична** - OpenAPI/Swagger
7. **Найкращі практики** - консистентність, версіонування, моніторинг

### 💡 Головна думка:

RESTful API - стандарт для створення зрозумілих, масштабованих та надійних вебсервісів
