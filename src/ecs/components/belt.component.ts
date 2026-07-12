import type { itemPrototypes } from "../prototype";
import { Component } from "./component";

export type Direction = "top" | "right" | "bottom" | "left";

export class BeltComponent extends Component {
  readonly id = "belt";
  public items: { name: keyof typeof itemPrototypes; distance: number }[] = [];

  constructor(
    public prev: Direction,
    public next: Direction,
  ) {
    super();
  }
}
