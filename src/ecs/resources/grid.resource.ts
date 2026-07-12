import type { Entity } from "../entity/entity";
import { Resource } from "./resource";

export class GridResource extends Resource {
  // store occupied cells in a Map keyed by "x,y" to act as a hashmap
  private occupied = new Map<string, Entity["id"]>();

  public get occupiedCells(): IterableIterator<[string, Entity["id"]]> {
    return this.occupied.entries();
  }

  private getCellsFromRange(
    x: number,
    z: number,
    width: number,
    height: number,
  ): [number, number][] {
    const cells: [number, number][] = [];
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        cells.push([x + i, z + j]);
      }
    }
    return cells;
  }

  public isEmpty(x: number, y: number, width: number, height: number): boolean {
    return this.getCellsFromRange(x, y, width, height).every(
      ([cx, cz]) => !this.occupied.has(`${cx},${cz}`),
    );
  }

  public getEntityIdAtCell(x: number, z: number): Entity["id"] | undefined {
    return this.occupied.get(`${x},${z}`);
  }

  // ignores bounds for now
  public occupy(
    x: number,
    z: number,
    width: number,
    height: number,
    entity: Entity,
  ): void {
    this.getCellsFromRange(x, z, width, height).forEach(([cx, cz]) => {
      this.occupied.set(`${cx},${cz}`, entity.id);
    });
  }

  public free(x: number, z: number, width: number, height: number) {
    this.getCellsFromRange(x, z, width, height).forEach(([cx, cz]) => {
      this.occupied.delete(`${cx},${cz}`);
    });
  }

  serialize() {
    return JSON.stringify({ occupied: [...this.occupied.entries()] });
  }

  hydrate(state: string): void {
    const parsed = JSON.parse(state);
    this.occupied = new Map(parsed.occupied);
  }
}
