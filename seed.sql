-- Seed data for local development
-- All passwords: 123456

-- Teams (10 teams)
INSERT INTO teams (name, invite_code, score, hash) VALUES
  ('Алгоритмисты',     'a0000000-0000-0000-0000-000000000001', 0, 'a1b2c3d4'),
  ('Кодеры',           'a0000000-0000-0000-0000-000000000002', 0, 'b2c3d4e5'),
  ('Хакеры',           'a0000000-0000-0000-0000-000000000003', 0, 'c3d4e5f6'),
  ('Битовые маги',     'a0000000-0000-0000-0000-000000000004', 0, 'd4e5f6a7'),
  ('Нулевой день',     'a0000000-0000-0000-0000-000000000005', 0, 'e5f6a7b8'),
  ('Турингисты',       'a0000000-0000-0000-0000-000000000006', 0, 'f6a7b8c9'),
  ('Байтовые бойцы',   'a0000000-0000-0000-0000-000000000007', 0, 'a7b8c9d0'),
  ('Компиляторы',      'a0000000-0000-0000-0000-000000000008', 0, 'b8c9d0e1'),
  ('Стек оверфлоу',    'a0000000-0000-0000-0000-000000000009', 0, 'c9d0e1f2'),
  ('Рекурсия',         'a0000000-0000-0000-0000-000000000010', 0, 'd0e1f2a3')
ON CONFLICT (name) DO NOTHING;

-- Users (3 per team = 30 users + 1 admin)
-- password hash = bcrypt('123456')
DO $$
DECLARE
  pw TEXT := '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe';
  t RECORD;
BEGIN
  -- Admin user (no team)
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id)
  VALUES ('Администратор', 'admin@test.com', 'ADMIN', pw, NULL, true, NULL)
  ON CONFLICT (email) DO NOTHING;

  -- Team 1: Алгоритмисты
  SELECT id INTO t FROM teams WHERE name = 'Алгоритмисты';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Иванов Алексей Петрович', 'ivanov@test.com', '23101', pw, 'captain', false, t.id),
    ('Сидорова Мария Ивановна', 'sidorova@test.com', '23101', pw, 'member', false, t.id),
    ('Козлов Дмитрий Сергеевич', 'kozlov@test.com', '23101', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 2: Кодеры
  SELECT id INTO t FROM teams WHERE name = 'Кодеры';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Петров Никита Андреевич', 'petrov@test.com', '23102', pw, 'captain', false, t.id),
    ('Лебедева Анна Олеговна', 'lebedeva@test.com', '23102', pw, 'member', false, t.id),
    ('Морозов Артём Викторович', 'morozov@test.com', '23102', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 3: Хакеры
  SELECT id INTO t FROM teams WHERE name = 'Хакеры';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Новиков Егор Дмитриевич', 'novikov@test.com', '23103', pw, 'captain', false, t.id),
    ('Волкова Елена Сергеевна', 'volkova@test.com', '23103', pw, 'member', false, t.id),
    ('Соловьёв Михаил Игоревич', 'soloviev@test.com', '23103', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 4: Битовые маги
  SELECT id INTO t FROM teams WHERE name = 'Битовые маги';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Кузнецов Илья Александрович', 'kuznetsov@test.com', '23104', pw, 'captain', false, t.id),
    ('Попова Дарья Николаевна', 'popova@test.com', '23104', pw, 'member', false, t.id),
    ('Васильев Роман Олегович', 'vasiliev@test.com', '23104', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 5: Нулевой день
  SELECT id INTO t FROM teams WHERE name = 'Нулевой день';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Зайцев Максим Павлович', 'zaytsev@test.com', '23105', pw, 'captain', false, t.id),
    ('Смирнова Ольга Андреевна', 'smirnova@test.com', '23105', pw, 'member', false, t.id),
    ('Фёдоров Кирилл Владимирович', 'fedorov@test.com', '23105', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 6: Турингисты
  SELECT id INTO t FROM teams WHERE name = 'Турингисты';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Николаев Андрей Сергеевич', 'nikolaev@test.com', '23106', pw, 'captain', false, t.id),
    ('Орлова Виктория Дмитриевна', 'orlova@test.com', '23106', pw, 'member', false, t.id),
    ('Андреев Павел Михайлович', 'andreev@test.com', '23106', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 7: Байтовые бойцы
  SELECT id INTO t FROM teams WHERE name = 'Байтовые бойцы';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Макаров Тимур Алексеевич', 'makarov@test.com', '23107', pw, 'captain', false, t.id),
    ('Белова Алина Игоревна', 'belova@test.com', '23107', pw, 'member', false, t.id),
    ('Григорьев Даниил Петрович', 'grigoriev@test.com', '23107', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 8: Компиляторы
  SELECT id INTO t FROM teams WHERE name = 'Компиляторы';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Семёнов Владислав Сергеевич', 'semenov@test.com', '23108', pw, 'captain', false, t.id),
    ('Захарова Екатерина Олеговна', 'zakharova@test.com', '23108', pw, 'member', false, t.id),
    ('Степанов Арсений Викторович', 'stepanov@test.com', '23108', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 9: Стек оверфлоу
  SELECT id INTO t FROM teams WHERE name = 'Стек оверфлоу';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Алексеев Марк Дмитриевич', 'alekseev@test.com', '23109', pw, 'captain', false, t.id),
    ('Романова Софья Павловна', 'romanova@test.com', '23109', pw, 'member', false, t.id),
    ('Егоров Денис Андреевич', 'egorov@test.com', '23109', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;

  -- Team 10: Рекурсия
  SELECT id INTO t FROM teams WHERE name = 'Рекурсия';
  INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id) VALUES
    ('Павлов Глеб Николаевич', 'pavlov@test.com', '23110', pw, 'captain', false, t.id),
    ('Киселёва Полина Сергеевна', 'kiseleva@test.com', '23110', pw, 'member', false, t.id),
    ('Тихонов Лев Александрович', 'tikhonov@test.com', '23110', pw, 'member', false, t.id)
  ON CONFLICT (email) DO NOTHING;
END $$;

-- Extra standalone users (for admin/user management testing)
INSERT INTO users (name, email, university_group, password_hash, role, is_admin, team_id)
VALUES
  ('Тестовый Пользователь 1', 'user1@test.com', '23901', '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe', NULL, false, NULL),
  ('Тестовый Пользователь 2', 'user2@test.com', '23902', '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe', NULL, false, NULL),
  ('Тестовый Пользователь 3', 'user3@test.com', '23903', '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe', NULL, false, NULL),
  ('Тестовый Пользователь 4', 'user4@test.com', '23904', '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe', NULL, false, NULL),
  ('Тестовый Пользователь 5', 'user5@test.com', '23905', '$2a$10$MsGhoB3Tt8U/4JB4E1yO..PMF.Y6zf26A03riaLWuC6gFRGereZAe', NULL, false, NULL)
ON CONFLICT (email) DO NOTHING;

-- Tasks (5 tasks)
INSERT INTO tasks (number, name, description, max_points) VALUES
  (1, 'Сортировка', 'Реализовать алгоритм сортировки', 100),
  (2, 'Графы', 'Обход графа в глубину и ширину', 150),
  (3, 'Динамическое программирование', 'Задача о рюкзаке', 200),
  (4, 'Строки', 'Поиск подстроки в строке', 100),
  (5, 'Математика', 'Теоретико-числовые задачи', 150)
ON CONFLICT (number) DO NOTHING;

-- Additional tasks (for fuller end-to-end testing)
INSERT INTO tasks (number, name, description, link, max_points) VALUES
  (6,  'SQL и индексы', 'Оптимизация запросов и анализ планов выполнения', 'https://example.com/tasks/6', 120),
  (7,  'Docker', 'Контейнеризация сервиса и настройка compose', 'https://example.com/tasks/7', 90),
  (8,  'CI/CD', 'Сборка и деплой через pipeline', 'https://example.com/tasks/8', 130),
  (9,  'Безопасность', 'Валидация входных данных и hardening', 'https://example.com/tasks/9', 140),
  (10, 'REST API', 'Проектирование и версияция API', 'https://example.com/tasks/10', 100),
  (11, 'Frontend UX', 'Улучшение интерфейса и отзывчивости', 'https://example.com/tasks/11', 110),
  (12, 'Кэширование', 'Стратегии кэширования и инвалидирования', 'https://example.com/tasks/12', 95),
  (13, 'Мониторинг', 'Метрики, логи и алерты', 'https://example.com/tasks/13', 105),
  (14, 'Тестирование', 'Unit/E2E тесты и покрытие', 'https://example.com/tasks/14', 125),
  (15, 'Архитектура', 'Рефакторинг и разделение модулей', 'https://example.com/tasks/15', 160)
ON CONFLICT (number) DO NOTHING;

-- Deterministic score matrix for all teams x tasks
-- Re-runnable: existing rows are updated
INSERT INTO scores (team_id, task_id, points)
SELECT
  tm.id,
  tk.id,
  CASE
    WHEN (tm.id + tk.number) % 7 = 0 THEN 0
    WHEN tm.id <= 3 THEN LEAST(tk.max_points, ((tk.max_points * 78) / 100) + ((tm.id * tk.number) % 19))
    WHEN tm.id <= 6 THEN LEAST(tk.max_points, ((tk.max_points * 58) / 100) + ((tm.id * tk.number) % 23))
    ELSE LEAST(tk.max_points, ((tm.id * 17 + tk.number * 29) % (tk.max_points + 1)))
  END AS points
FROM teams tm
CROSS JOIN tasks tk
ON CONFLICT (team_id, task_id) DO UPDATE SET points = EXCLUDED.points;

-- News feed for dashboard/testing
INSERT INTO news (title, content, published_at)
SELECT n.title, n.content, n.published_at
FROM (
  VALUES
    ('Добро пожаловать', 'Система готова к тестированию. Проверьте все сценарии.', NOW() - INTERVAL '3 days'),
    ('Открыт прием решений', 'Команды могут отправлять результаты через pipeline.', NOW() - INTERVAL '2 days 3 hours'),
    ('Промежуточные итоги', 'Проверяйте таблицу результатов и прогресс команд.', NOW() - INTERVAL '1 day 6 hours'),
    ('Техническое обновление', 'Улучшена стабильность админ-панели и API.', NOW() - INTERVAL '12 hours'),
    ('Финальный рывок', 'До дедлайна осталось мало времени. Удачи всем!', NOW() - INTERVAL '2 hours')
) AS n(title, content, published_at)
WHERE NOT EXISTS (SELECT 1 FROM news x WHERE x.title = n.title);

-- Contacts for contacts table testing
INSERT INTO contacts (telegram, vk)
SELECT c.telegram, c.vk
FROM (
  VALUES
    ('@alg_team_lead', 'https://vk.com/alg_team_lead'),
    ('@coders_support', 'https://vk.com/coders_support'),
    ('t.me/hackers_contact', 'vk.com/hackers_contact'),
    ('@bit_mages', 'https://vk.com/bit_mages'),
    ('@turing_help', 'https://vk.com/turing_help'),
    ('@qa_channel', 'https://vk.com/qa_channel')
) AS c(telegram, vk)
WHERE NOT EXISTS (
  SELECT 1 FROM contacts x
  WHERE COALESCE(x.telegram, '') = COALESCE(c.telegram, '')
    AND COALESCE(x.vk, '') = COALESCE(c.vk, '')
);

-- Settings: make results and tasks visible
UPDATE settings SET value = 'true' WHERE key = 'results_visible';
UPDATE settings SET value = 'true' WHERE key = 'tasks_visible';

-- Set default deadline only if empty (UTC ISO string)
UPDATE settings
SET value = to_char((NOW() + INTERVAL '2 days') AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
WHERE key = 'results_deadline' AND (value = '' OR value IS NULL);
