import { Test, TestingModule } from '@nestjs/testing';
import { ClocksController } from './clocks.controller';

describe('ClocksController', () => {
  let controller: ClocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClocksController],
    }).compile();

    controller = module.get<ClocksController>(ClocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
