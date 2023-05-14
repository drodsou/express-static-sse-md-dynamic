-- USERS
drop table if exists users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password)
VALUES 
  ('user1', 'user1@example.com', 'password1'),
  ('user2', 'user2@example.com', 'password2'),
  ('user3', 'user3@example.com', 'password3'),
  ('user4', 'user4@example.com', 'password4'),
  ('user5', 'user5@example.com', 'password5');

-- GROUPS