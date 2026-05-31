const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log(' Criando usuário administrador...\n')
    
    const hash = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@profissional.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@profissional.com',
        password: hash,
        role: 'ADMIN'
      }
    })
    
    console.log(' Usuário administrador criado com sucesso!\n')
    console.log(' Email: admin@profissional.com')
    console.log(' Senha: admin123')
    console.log('\n  IMPORTANTE: Altere a senha após o primeiro login!')
    console.log('\n Acesse: http://localhost:3000/login')
    console.log('  Painel Admin: http://localhost:3000/admin\n')
    
  } catch (error) {
    console.error(' Erro:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
