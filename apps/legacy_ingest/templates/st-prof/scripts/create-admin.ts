import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10)

        const admin = await prisma.user.upsert({
            where: { email: 'admin@profissional.com' },
            update: {},
            create: {
                name: 'Administrador',
                email: 'admin@profissional.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        })

        console.log('✅ Usuário administrador criado com sucesso!')
        console.log('📧 Email: admin@profissional.com')
        console.log('🔑 Senha: admin123')
        console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
    } catch (error) {
        console.error('❌ Erro ao criar administrador:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
