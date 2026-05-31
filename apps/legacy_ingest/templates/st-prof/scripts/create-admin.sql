-- Script SQL para criar usuário administrador
-- Execute este script no Prisma Studio ou diretamente no banco de dados

-- Senha: admin123 (hash bcrypt)
INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
VALUES (
  'admin-' || hex(randomblob(16)),
  'Administrador',
  'admin@profissional.com',
  '$2a$10$YourHashHere', -- Você precisará gerar o hash
  'ADMIN',
  datetime('now'),
  datetime('now')
);

-- NOTA: Para gerar o hash da senha, use o código abaixo em um console Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('admin123', 10).then(hash => console.log(hash));
