import type { Component } from "./component";

export class GridOccupantComponent implements Component {
  readonly id = "gridOccupant";

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}
}
