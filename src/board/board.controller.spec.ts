import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './board.service';

describe('BoardController', () => {
  let controller: BoardController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService],
    }).compile();

    controller = module.get<BoardController>(BoardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should enable board creation', () => {
    const createBoardDto = new CreateBoardDto();
    createBoardDto.title = "Main Board";
    createBoardDto.description = "Only board for now.";
    const board = controller.create(createBoardDto);
    expect(board).toMatchObject(createBoardDto);
  })
});
