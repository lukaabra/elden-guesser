import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [LocationService, PrismaService],
    }).compile();

    locationController = moduleRef.get<LocationController>(LocationController);
    locationService = moduleRef.get<LocationService>(LocationService);
  });

  describe('findOne', () => {
    it('should return a single Location object', async () => {
      const result = {
        id: 1,
        label: 'Test Loc 1',
        areaId: 1,
        coordinatesId: 1,
        updated: new Date('2022-08-23T21:28:35.365Z'),
      };

      expect(await locationController.getOne('1')).toStrictEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all (3) Location objects', async () => {
      const result = [
        {
          id: 1,
          label: 'Test Loc 1',
          areaId: 1,
          coordinatesId: 1,
          updated: new Date('2022-08-23T21:28:35.365Z'),
        },
        {
          id: 2,
          label: 'Test Loc 2',
          areaId: 1,
          coordinatesId: 2,
          updated: new Date('2022-08-23T21:28:35.371Z'),
        },
        {
          id: 3,
          label: 'Test Loc 3',
          areaId: 2,
          coordinatesId: 3,
          updated: new Date('2022-08-23T21:28:35.376Z'),
        },
      ];

      expect(await locationController.getAll()).toStrictEqual(result);
    });
  });
});
