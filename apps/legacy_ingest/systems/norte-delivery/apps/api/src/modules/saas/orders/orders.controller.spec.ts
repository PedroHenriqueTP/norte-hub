import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    create: jest.fn().mockResolvedValue({ id: 'mock_id', status: 'success' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'mock_id', name: 'Test Item' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'mock_id', name: 'Test Item' }),
    update: jest.fn().mockResolvedValue({ id: 'mock_id', updated: true }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Teste Básico de Criação (Gerado pelo SpecFactory)
  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { name: 'Test Data', value: 100 }; // Seed genérico
      await controller.create(dto as any); // Cast para any apenas para o scaffold
      expect(service.create).toHaveBeenCalled();
    });
  });

  // Teste Básico de Leitura
  describe('findAll', () => {
    it('should return an array', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 'mock_id', name: 'Test Item' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
