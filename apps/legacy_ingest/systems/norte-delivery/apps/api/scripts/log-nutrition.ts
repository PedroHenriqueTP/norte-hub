import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('Nenhum usuário encontrado. Rode o script de treino primeiro.');
    return;
  }

  console.log(`[VIGÍA_NUTRIÇÃO]: Registrando refeição para o usuário ${user.name}...`);

  const dietLog = await prisma.dietLog.create({
    data: {
      userId: user.id,
      totalCalories: 1200,
      protein: 80.0,
      carbs: 20.0,
      fats: 90.0,
      meals: [
        {
          name: 'Barbecue Brasileiro',
          items: [
            { name: 'Picanha', quantity: '300g', protein: 60, carbs: 0, fats: 60 },
            { name: 'Linguiça', quantity: '150g', protein: 20, carbs: 5, fats: 30 },
          ],
        },
      ],
    },
  });

  console.log(`[VIGÍA_NUTRIÇÃO]: Refeição Registrada com sucesso!`);
  console.log(`[VIGÍA_NUTRIÇÃO]: Log ID: ${dietLog.id}`);
  console.log(`[VIGÍA_NUTRIÇÃO]: Calorias: 1200 kcal | Proteína: 80g | Status: SALVO NO COFRE`);

  await prisma.$disconnect();
}

main().catch(console.error);
