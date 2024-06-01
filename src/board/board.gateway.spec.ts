import { Test, TestingModule } from '@nestjs/testing';
import { BoardGateway } from './board.gateway';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { lastValueFrom, map, pairwise, take } from 'rxjs';
import { Board } from './entities/board.entity';

describe('BoardGateway', () => {
  let module: TestingModule;
  let gateway: BoardGateway;
  let service: BoardService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [BoardGateway, BoardService],
    }).compile();

    gateway = module.get<BoardGateway>(BoardGateway);
    service = module.get<BoardService>(BoardService);
  });

  afterAll(() => {
    module.close();
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('findOne', () => {
    let startingBoard: Board;

    beforeAll(() => {
      const createBoardDto = new CreateBoardDto();
      createBoardDto.title = "Main Board";
      createBoardDto.description = "Only board for now.";
      startingBoard = service.create(createBoardDto);
    });

    it('board state event should be emitted every 2s', async () => {
      const startTime = (new Date()).getTime();
      await lastValueFrom(gateway.findOne(startingBoard.id).pipe(take(2)));
      const durationInMs = (new Date()).getTime() - startTime;
      expect(durationInMs).toBeGreaterThan(2000);
      expect(durationInMs).toBeLessThan(2050);
    }, 2100);

    it('board state should progress between WS events', async () => {
      const board$ = gateway.findOne(startingBoard.id).pipe(
        take(3),
        map(({ data }) => data),
      );
      board$.pipe(
        map(({ pixels }) => pixels.map(({ color }) => color)),
        pairwise(),
      ).subscribe(([previousColors, nextColors]) => {
        const changedPixelsCount = previousColors.filter((previousColor, i) => {
          const nextColor = nextColors[i];
          return previousColor !== nextColor;
        }).length;
        console.log(changedPixelsCount);
        expect(changedPixelsCount).toBeGreaterThan(0);
        expect(changedPixelsCount).toBeLessThan(5);
      });
      await lastValueFrom(board$);
    }, 5000);
  });
});
