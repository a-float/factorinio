import type { Resource } from "./resource";

export class GridResource implements Resource {
  // store occupied cells in a Set keyed by "x,y" to act as a hashmap
  private occupied = new Set<string>();

  constructor(
    public width: number,
    public height: number,
  ) {}

  private getCellsFromRange(
    x: number,
    y: number,
    width: number,
    height: number,
  ): [number, number][] {
    const cells: [number, number][] = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        cells.push([x + i, y + j]);
      }
    }
    return cells;
  }

  public isEmpty(x: number, y: number, width: number, height: number): boolean {
    return this.getCellsFromRange(x, y, width, height).every(
      ([cx, cy]) => !this.occupied.has(`${cx},${cy}`),
    );
  }

  // ignores bounds for now
  public occupy(x: number, y: number, width: number, height: number): void {
    this.getCellsFromRange(x, y, width, height).forEach(([cx, cy]) => {
      this.occupied.add(`${cx},${cy}`);
    });
  }
}
