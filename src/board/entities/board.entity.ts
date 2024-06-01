export class Board {
  id: number;
  title: string;
  description: string;
  pixels: Array<{
    x: number,
    y: number,
    color: string,
  }>;
}
