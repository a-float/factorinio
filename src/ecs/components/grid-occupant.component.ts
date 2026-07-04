import type { Rotation } from "../resources/player-state.resource";
import type { Component } from "./component";

export function getRotatedFootprint(
  width: number,
  height: number,
  rotation: Rotation,
): { width: number; height: number } {
  return rotation % 2 === 0
    ? { width, height }
    : { width: height, height: width };
}

export class GridOccupantComponent implements Component {
  readonly id = "gridOccupant";

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public rotation: Rotation,
  ) {}
}
