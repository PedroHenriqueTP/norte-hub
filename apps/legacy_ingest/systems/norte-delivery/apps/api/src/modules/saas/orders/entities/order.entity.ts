import { Prisma } from '@prisma/client';

export const ORDER_INCLUDE = {
  items: {
    include: {
      product: true
    }
  },
  address: true,
  transactions: true,
  driver: true
} satisfies Prisma.OrderInclude as any;

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: typeof ORDER_INCLUDE;
}>;

