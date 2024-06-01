import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { Subject, interval, takeUntil, takeWhile } from 'rxjs';

const dimension = 3;

@Injectable()
export class BoardService implements OnModuleDestroy {
  private readonly boards = new Map<number, Board>();
  private readonly destroyed$ = new Subject<boolean>();

  onModuleDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  create(createBoardDto: CreateBoardDto) {
    const id = this.boards.size;
    const board = new Board();
    this.boards.set(id, board);
    board.id = id;
    board.title = createBoardDto.title;
    board.description = createBoardDto.description;
    board.pixels = Array.from({ length: Math.pow(dimension, 2) }).map((_v, i) => {
      const x = i % dimension;
      const y = Math.floor(i / dimension);
      const red = Math.floor((x / dimension) * 0xFF).toString(16).padStart(2, '0');
      const green = Math.floor((y / dimension) * 0xFF).toString(16).padStart(2, '0');
      const color = `#${red}${green}00`;
      return { x, y, color };
    });
    interval(500).pipe(
      takeUntil(this.destroyed$),
      takeWhile((i) => i < dimension ** 2)
    ).subscribe((i) => {
      board.pixels[i].color = '#0000ff';
    });
    return board;
  }

  findAll() {
    return [...this.boards.values()];
  }

  findOne(id: number) {
    const board = this.boards.get(id);
    if (board === undefined) {
      throw new Error();
    }
    return board;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    const board = this.boards.get(id);
    if (board === undefined) {
      throw new Error();
    }
    board.title = updateBoardDto.title ?? board.title;
    board.description = updateBoardDto.description ?? board.description;
    return board;
  }

  remove(id: number) {
    const deleted = this.boards.delete(id);
    if (!deleted) {
      throw new Error();
    }
  }
}
