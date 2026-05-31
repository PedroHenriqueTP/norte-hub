// Script para popular o banco com dados de exemplo
// Execute: node scripts/seed-data.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studio-beleza';

const sampleServices = [
  {
    name: 'Manicure Completa',
    description: 'Cuidado completo das unhas com esmaltação',
    price: 45.00,
    duration: 60,
    category: 'unhas',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Pedicure',
    description: 'Cuidado completo dos pés',
    price: 50.00,
    duration: 60,
    category: 'unhas',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Alongamento de Unhas',
    description: 'Alongamento com gel ou acrílico',
    price: 120.00,
    duration: 120,
    category: 'unhas',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Tatuagem Pequena',
    description: 'Tatuagem até 10cm',
    price: 300.00,
    duration: 120,
    category: 'tatuagem',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Corte de Cabelo',
    description: 'Corte moderno e personalizado',
    price: 60.00,
    duration: 45,
    category: 'cabelo',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Coloração',
    description: 'Coloração completa com produtos premium',
    price: 150.00,
    duration: 180,
    category: 'cabelo',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const samplePortfolio = [
  {
    title: 'Nail Art Moderno',
    description: 'Design moderno com cores vibrantes e detalhes em folha de ouro',
    category: 'unhas',
    images: [
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
    ],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Tatuagem Minimalista',
    description: 'Tatuagem delicada com linhas finas e estilo minimalista',
    category: 'tatuagem',
    images: [
      'https://images.unsplash.com/photo-1611915387728-741c9b6b6c0a?w=800',
    ],
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Corte e Coloração',
    description: 'Transformação completa com corte moderno e coloração balayage',
    category: 'cabelo',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    ],
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();

    // Inserir serviços
    const servicesCollection = db.collection('services');
    const existingServices = await servicesCollection.countDocuments();
    
    if (existingServices === 0) {
      await servicesCollection.insertMany(sampleServices);
      console.log(`✅ ${sampleServices.length} serviços inseridos`);
    } else {
      console.log('⚠️  Serviços já existem, pulando...');
    }

    // Inserir portfólio
    const portfolioCollection = db.collection('portfolios');
    const existingPortfolio = await portfolioCollection.countDocuments();
    
    if (existingPortfolio === 0) {
      await portfolioCollection.insertMany(samplePortfolio);
      console.log(`✅ ${samplePortfolio.length} itens de portfólio inseridos`);
    } else {
      console.log('⚠️  Portfólio já existe, pulando...');
    }

    console.log('\n✅ Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
  } finally {
    await client.close();
  }
}

seedData();

