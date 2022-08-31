import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // it('should register account', () => {
  //   expect(controller).toBeDefined();
  // });

  // it('should fail to register new account', () => {
  //   expect(controller).toBeDefined();
  // });

  // it('should login account', () => {
  //   expect(controller).toBeDefined();
  // });

  // it('should fail to login account', () => {
  //   expect(controller).toBeDefined();
  // });
});
