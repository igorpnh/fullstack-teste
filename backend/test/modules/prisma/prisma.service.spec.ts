import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  const mockConfigService = {
    get: jest.fn(),
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should throw an error if DATABASE_URL is not defined', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => {
        new PrismaService(mockConfigService as unknown as ConfigService);
      }).toThrow('DATABASE_URL is not defined in environment variables');
    });

    it('should create an instance when DATABASE_URL is defined', () => {
      mockConfigService.get.mockReturnValue(
        'postgresql://postgres:postgres@localhost:5432/myapp',
      );

      const prismaService = new PrismaService(
        mockConfigService as unknown as ConfigService,
      );

      expect(prismaService).toBeDefined();
      expect(mockConfigService.get).toHaveBeenCalledWith('DATABASE_URL');
    });
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue(
        'postgresql://postgres:postgres@localhost:5432/myapp',
      );

      service = new PrismaService(
        mockConfigService as unknown as ConfigService,
      );
    });

    it('should call $connect and $queryRaw on init', async () => {
      const connectSpy = jest
        .spyOn(service, '$connect')
        .mockResolvedValue(undefined);

      const queryRawSpy = jest
        .spyOn(service, '$queryRaw')
        .mockResolvedValue([{ '?column?': 1 }]);

      const loggerSpy = jest
        .spyOn(service['logger'], 'log')
        .mockImplementation(() => {});

      await service.onModuleInit();

      expect(connectSpy).toHaveBeenCalled();
      expect(queryRawSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        'Prisma connection to PostgreSQL successful',
      );
    });

    it('should throw and log error if $connect fails', async () => {
      const dbError = new Error('Connection refused');

      jest.spyOn(service, '$connect').mockRejectedValue(dbError);

      const loggerErrorSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation(() => {});

      await expect(service.onModuleInit()).rejects.toThrow(
        'Connection refused',
      );

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Prisma connection error:',
        dbError,
      );
    });

    it('should throw and log error if $queryRaw fails', async () => {
      const dbError = new Error('Query failed');

      jest.spyOn(service, '$connect').mockResolvedValue(undefined);
      jest.spyOn(service, '$queryRaw').mockRejectedValue(dbError);

      const loggerErrorSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation(() => {});

      await expect(service.onModuleInit()).rejects.toThrow('Query failed');

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Prisma connection error:',
        dbError,
      );
    });
  });

  describe('onModuleDestroy', () => {
    beforeEach(() => {
      mockConfigService.get.mockReturnValue(
        'postgresql://postgres:postgres@localhost:5432/myapp',
      );

      service = new PrismaService(
        mockConfigService as unknown as ConfigService,
      );
    });

    it('should call $disconnect on destroy', async () => {
      const disconnectSpy = jest
        .spyOn(service, '$disconnect')
        .mockResolvedValue(undefined);

      const loggerSpy = jest
        .spyOn(service['logger'], 'log')
        .mockImplementation(() => {});

      await service.onModuleDestroy();

      expect(disconnectSpy).toHaveBeenCalled();
      expect(loggerSpy).toHaveBeenCalledWith(
        'Prisma disconnected from PostgreSQL',
      );
    });
  });
});
