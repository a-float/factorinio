import { Component } from "./component";

export type Direction = "top" | "right" | "bottom" | "left";

export class BeltComponent extends Component {
  readonly id = "belt";

  constructor(
    public prev: Direction,
    public next: Direction,
  ) {
    super();
  }
}
