import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { BoardService } from './board.service';
import { Observable, concat, interval, map, of } from 'rxjs';
import { Board } from './entities/board.entity';

@WebSocketGateway()
export class BoardGateway {
  constructor(private readonly boardService: BoardService) {}

  private 

  @SubscribeMessage('findOneBoard')
  findOne(@MessageBody() id: number): Observable<WsResponse<Board>> {
    const buildWsResponse = () => ({
      event: 'findOneBoard',
      data: this.boardService.findOne(id),
    });
    return concat(of(buildWsResponse()), interval(2000).pipe(map(buildWsResponse)));
  }
}