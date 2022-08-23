import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../prisma.service';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

describe('AreaController', () => {
  let areaController: AreaController;
  let areaService: AreaService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService, PrismaService],
    }).compile();

    areaController = moduleRef.get<AreaController>(AreaController);
    areaService = moduleRef.get<AreaService>(AreaService);
  });

  describe('findOne', () => {
    it('should return a single Area object', async () => {
      const result = {
        id: 1,
        label: 'Test Area',
        updated: new Date('2022-08-23T20:52:03.781Z'),
      };

      expect(await areaController.getOne('1')).toStrictEqual(result);
    });

    it('should return all (2) Area objects', async () => {
      const result = [
        {
          id: 1,
          label: 'Test Area',
          updated: new Date('2022-08-23T20:52:03.781Z'),
        },
        {
          id: 2,
          label: 'Test Area 2',
          updated: new Date('2022-08-23T20:52:03.781Z'),
        },
      ];

      expect(await areaController.getAll()).toStrictEqual(result);
    });
  });
});
