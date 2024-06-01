import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardGateway } from './board.gateway';
import { BoardController } from './board.controller';

@Module({
  providers: [BoardGateway, BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
