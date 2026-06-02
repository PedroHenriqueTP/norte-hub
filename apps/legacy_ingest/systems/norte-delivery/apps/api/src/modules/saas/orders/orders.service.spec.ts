import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import { OrdersGateway } from './orders.gateway';
import { TenantContext } from '../../../common/tenant/tenant.context';
import { BadRequestException } from '@nestjs/common';

const mockPrismaService = {
    user: {
        upsert: jest.fn(),
    },
    orderItem: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
    extended: {
        order: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
        },
        product: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
        },
    },
};

const mockFinanceService = {
    recordOrderTransaction: jest.fn(),
};

const mockOrdersGateway = {
    broadcast: jest.fn(),
};

describe('OrdersService', () => {
    let service: OrdersService;
    let prisma: typeof mockPrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdersService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: FinanceService, useValue: mockFinanceService },
                { provide: OrdersGateway, useValue: mockOrdersGateway },
            ],
        }).compile();

        service = module.get<OrdersService>(OrdersService);
        prisma = module.get(PrismaService);

        // Clear mocks
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an order successfully', async () => {
            const tenantId = 'tenant-123';
            const dto = {
                items: [{ productId: 'prod-1', quantity: 1 }],
                deliveryFee: 10,
                customer: { name: 'John Doe', email: 'john@example.com' },
                address: { street: 'Main St', number: '123', neighborhood: 'DT', city: 'City', zipCode: '00000' }
            };

            // Mock dependencies
            prisma.extended.product.findMany.mockResolvedValue([
                { id: 'prod-1', price: new (require('@prisma/client').Prisma.Decimal)(100) }
            ]);
            prisma.user.upsert.mockResolvedValue({ id: 'user-1' });
            prisma.extended.order.create.mockResolvedValue({ id: 'order-1', total: new (require('@prisma/client').Prisma.Decimal)(110) });

            // Run in Tenant Context
            await TenantContext.run(tenantId, async () => {
                const result = await service.create(dto as any);
                expect(result).toBeDefined();
                // Check if create was called without manual tenant injection (handled by extension)
                const createCallArgs = prisma.extended.order.create.mock.calls[0][0];
                expect(createCallArgs.data.tenant).toBeUndefined();
            });
        });

        it('should throw error if tenant context is missing', async () => {
            const dto = {
                items: [{ productId: 'prod-1', quantity: 1 }],
                deliveryFee: 10,
                // Provide valid customer/address to pass early validations
                customer: { name: 'John Doe', email: 'john@example.com' },
                address: { street: 'Main St', number: '123', neighborhood: 'Downtown', city: 'City', zipCode: '00000000' }
            };

            // Mock dependencies for validation checks
            prisma.extended.product.findMany.mockResolvedValue([
                { id: 'prod-1', price: new (require('@prisma/client').Prisma.Decimal)(100) }
            ]);
            prisma.user.upsert.mockResolvedValue({ id: 'user-1' });

            await expect(service.create(dto as any)).rejects.toThrow('Tenant Context missing for Order');
        });
    });

    describe('findOne', () => {
        it('should use findFirst instead of findUnique', async () => {
            prisma.extended.order.findFirst.mockResolvedValue({ id: 'order-1' });

            await service.findOne('order-1');

            expect(prisma.extended.order.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'order-1' }
            }));
        });
    });

    describe('testConcurrency', () => {
        it('should validate context isolation under concurrency without leaks', async () => {
            const result = await service.testConcurrency();
            expect(result.total).toBe(100);
            expect(result.successCount).toBe(100);
            expect(result.failures.length).toBe(0);
        });
    });
});
