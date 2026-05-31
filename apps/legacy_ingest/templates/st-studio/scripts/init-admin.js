// Script para inicializar o admin padrão
// Execute: node scripts/init-admin.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studio-beleza';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@studio.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function initAdmin() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    // Verificar se admin já existe
    const existingAdmin = await usersCollection.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('Admin já existe:', existingAdmin.email);
      return;
    }

    // Criar admin
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = {
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await usersCollection.insertOne(admin);
    console.log('Admin criado com sucesso!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Senha:', ADMIN_PASSWORD);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
  } catch (error) {
    console.error('Erro ao inicializar admin:', error);
  } finally {
    await client.close();
  }
}

initAdmin();

