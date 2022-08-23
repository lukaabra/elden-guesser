import { Test, TestingModule } from '@nestjs/testing';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

describe('AreaController', () => {
  let areaController: AreaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AreaController],
      providers: [AreaService],
    }).compile();

    areaController = app.get<AreaController>(AreaController);
  });

  describe('root', () => {
    it('should return single Area object in a promise', () => {
      return areaController.getOne('1').then((data) => {
        console.log(data, 'data');
      });
    });
  });
});
