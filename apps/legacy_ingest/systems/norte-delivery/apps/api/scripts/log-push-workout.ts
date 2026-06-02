import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('Nenhum usuário encontrado. Rode o script anterior primeiro.');
    return;
  }

  console.log(`[VIGÍA_SISTEMA]: Registrando treino de PUSH para o usuário ${user.name}...`);

  const workout = await prisma.workout.create({
    data: {
      userId: user.id,
      title: 'PPL - Push Day',
      durationMinutes: 45,
      notes: 'Foco em peito e ombro. Cargas subindo.',
      exercises: [
        {
          name: 'Supino Reto',
          sets: [
            { reps: 10, weight: 80 },
            { reps: 8, weight: 90 },
            { reps: 6, weight: 100 },
          ],
        },
        {
          name: 'Desenvolvimento Militar',
          sets: [
            { reps: 10, weight: 40 },
            { reps: 8, weight: 50 },
            { reps: 6, weight: 55 },
          ],
        },
      ],
    },
  });

  console.log(`[VIGÍA_SISTEMA]: Carga de PUSH Registrada com sucesso!`);
  console.log(`[VIGÍA_SISTEMA]: Treino ID: ${workout.id}`);
  console.log(`[VIGÍA_SISTEMA]: Exercícios: 2 | Status: SALVO NO COFRE`);

  await prisma.$disconnect();
}

main().catch(console.error);
