import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn().mockResolvedValue({ id: 'mock_id', status: 'success' }),
    findAll: jest.fn().mockResolvedValue([{ id: 'mock_id', name: 'Test Item' }]),
    findOne: jest.fn().mockResolvedValue({ id: 'mock_id', name: 'Test Item' }),
    update: jest.fn().mockResolvedValue({ id: 'mock_id', updated: true }),
    remove: jest.fn().mockResolvedValue({ deleted: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
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
