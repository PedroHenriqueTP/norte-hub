import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  let user = await prisma.user.findFirst();
  if (!user) {
    console.log('[VIGÍA_SISTEMA]: Criando usuário padrão...');
    
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Norte Personal Core',
        slug: 'norte-core',
      },
    });
    
    user = await prisma.user.create({
      data: {
        name: 'Pedrão da Norte',
        email: 'pedrao@norte.com',
        password: 'hash_password',
        tenantId: tenant.id,
        role: 'OWNER',
      },
    });
  }

  console.log(`[VIGÍA_SISTEMA]: Registrando treino para o usuário ${user.name}...`);

  const workout = await prisma.workout.create({
    data: {
      userId: user.id,
      title: 'PPL - Pull Day',
      durationMinutes: 60,
      notes: 'Foco na falha técnica e progressão de carga.',
      exercises: [
        {
          name: 'Levantamento Terra',
          sets: [
            { reps: 5, weight: 140 },
            { reps: 5, weight: 150 },
            { reps: 3, weight: 160 }, 
          ],
        },
        {
          name: 'Barra Fixa',
          sets: [
            { reps: 10, weight: 0 },
            { reps: 8, weight: 10 },
            { reps: 6, weight: 15 },
          ],
        },
      ],
    },
  });

  console.log(`[VIGÍA_SISTEMA]: Carga Registrada com sucesso!`);
  console.log(`[VIGÍA_SISTEMA]: Treino ID: ${workout.id}`);
  console.log(`[VIGÍA_SISTEMA]: Exercícios: 2 | Status: SALVO NO COFRE`);

  await prisma.$disconnect();
}

main().catch(console.error);
