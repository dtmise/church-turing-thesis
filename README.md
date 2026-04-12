# Church-Turing Thesis

Исходный код платформы Church-Turing Thesis (API + Web + PostgreSQL + Docker).

## Содержание
1. Локальный запуск (Docker)
2. Развертывание на сервере (production)
3. Как выполнить SQL-запрос к БД
4. Миграция старой версии без потери данных
5. Полезные команды

## 1. Локальный запуск (Docker)

Локальный стек поднимается через `docker-compose.yml` и включает:
- PostgreSQL
- API
- Web
- Redirect

### Шаги

```bash
docker compose up -d --build
```

Что происходит при первом запуске:
- База инициализируется схемой из `createScheme.sql`
- Применяется тестовый сид из `seed.sql`
- Собираются и запускаются контейнеры `api`, `web`, `redirect`

Локальный адрес:
- `http://localhost:3000`

Проверка:

```bash
docker compose ps
docker compose logs api --tail=100
docker compose logs web --tail=100
docker compose logs db --tail=100
```

Важно:
- Сид (`seed.sql`) из `docker-entrypoint-initdb.d` применяется только при создании пустого тома БД.
- Если хотите полностью переинициализировать локальную БД с нуля:

```bash
docker compose down -v
docker compose up -d --build
```

### Почта администратора: admin@test.com
### Все пользователи имею пароль: 123456

## 2. Развертывание на сервере (production)

Продакшн-стек использует `docker-compose.server.yml` и Caddy как reverse proxy с TLS.

### Подготовка
1. Привяжите домен (A-запись) к IP сервера.
2. Откройте порты `80` и `443`.
3. Скопируйте env-файл и заполните значения:

```bash
cp docker.server.env.example docker.server.env
```

Минимально проверьте значения:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `API_JWT_SECRET`
- `CORS_ORIGIN`
- `APP_DOMAIN`
- `ACME_EMAIL`

### Запуск

```bash
docker compose -f docker-compose.server.yml up -d --build
```

Проверка:

```bash
docker compose -f docker-compose.server.yml ps
docker compose -f docker-compose.server.yml logs caddy --tail=100
docker compose -f docker-compose.server.yml logs api --tail=100
docker compose -f docker-compose.server.yml logs web --tail=100
docker compose -f docker-compose.server.yml logs db --tail=100
```

Ожидаемое поведение:
- `http://ваш-домен` -> редирект на `https://ваш-домен`
- `https://ваш-домен` -> фронтенд
- `https://ваш-домен/api/*` -> API

## 3. Как выполнить SQL-запрос к БД

### Локально

```bash
docker compose exec -T db psql -U thesis_prod -d thesis_prod -c "SELECT NOW();"
```

### На сервере (через server compose)

```bash
docker compose -f docker-compose.server.yml exec -T db \
	sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT NOW();"'
```

### Войти в интерактивную консоль psql

```bash
docker compose -f docker-compose.server.yml exec db \
	sh -lc 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

## 4. Миграция старой версии без потери данных

Ниже безопасная схема миграции для уже работающего сервера.

### Критично важно
- Не запускайте `createScheme.sql` на существующей production БД: в нем есть `DROP TABLE`.
- Для production используйте только миграции:
	- `migration_add_tasks.sql`
	- `migration_pipeline.sql`

### Шаг 1. Сделайте резервную копию БД

Создайте каталог под бэкапы:

```bash
mkdir -p backups
```

Полный backup в формате custom (`.dump`):

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > backups/prod_$(date +%F_%H-%M-%S).dump
```

Дополнительно можно сделать plain SQL:

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > backups/prod_$(date +%F_%H-%M-%S).sql
```

### Шаг 2. (Рекомендуется) минимизировать запись во время миграции

Чтобы снизить риск гонок:
- временно ограничьте внешние обновления (например, отключите/остановите внешние pipeline-джобы)
- выполняйте миграции в короткое окно обслуживания

### Шаг 3. Примените миграции по порядку

1) Миграция задач/результатов/настроек:

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < migration_add_tasks.sql
```

2) Миграция pipeline (хэши команд + токены):

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < migration_pipeline.sql
```

### Шаг 4. Пересоберите и перезапустите сервисы

```bash
docker compose -f docker-compose.server.yml up -d --build
```

### Шаг 5. Проверка после миграции

Проверка таблиц и колонок:

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\
	SELECT to_regclass('\''public.tasks'\'') AS tasks, \
				 to_regclass('\''public.scores'\'') AS scores, \
				 to_regclass('\''public.settings'\'') AS settings, \
				 to_regclass('\''public.pipeline_tokens'\'') AS pipeline_tokens;\
	"'
```

Проверка, что у команд есть hash:

```bash
docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT id, name, hash FROM teams LIMIT 10;"'
```

### Шаг 6. Если что-то пошло не так: восстановление из бэкапа

Пример восстановления из custom backup:

```bash
cat backups/имя_файла.dump | docker compose -f docker-compose.server.yml exec -T db sh -lc \
	'dropdb -U "$POSTGRES_USER" "$POSTGRES_DB" && createdb -U "$POSTGRES_USER" "$POSTGRES_DB" && pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Перед восстановлением убедитесь, что понимаете последствия (перезапись текущих данных).

## 5. Полезные команды

### Назначить пользователя админом

```bash
docker compose -f docker-compose.server.yml exec db sh -lc \
	'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "UPDATE users SET is_admin = true WHERE email = '\''admin@mail.ru'\'';"'
```

### Перезапуск только API и Web

```bash
docker compose -f docker-compose.server.yml up -d --build api web
```

### Просмотр последних логов

```bash
docker compose -f docker-compose.server.yml logs api --tail=200
docker compose -f docker-compose.server.yml logs web --tail=200
docker compose -f docker-compose.server.yml logs db --tail=200
```