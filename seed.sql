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

-- Tasks (5 tasks)
INSERT INTO tasks (number, name, description, max_points) VALUES
  (1, 'Сортировка', 'Реализовать алгоритм сортировки', 100),
  (2, 'Графы', 'Обход графа в глубину и ширину', 150),
  (3, 'Динамическое программирование', 'Задача о рюкзаке', 200),
  (4, 'Строки', 'Поиск подстроки в строке', 100),
  (5, 'Математика', 'Теоретико-числовые задачи', 150)
ON CONFLICT (number) DO NOTHING;

-- Settings: make results and tasks visible
UPDATE settings SET value = 'true' WHERE key = 'results_visible';
UPDATE settings SET value = 'true' WHERE key = 'tasks_visible';
