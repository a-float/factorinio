import type { Entity } from "../entity/entity";
import { Component } from "./component";

type Neighbour = Entity["id"] | null;

export class NetworkComponent extends Component {
  readonly id = "network";
  public networkId: number = -1; // -1 is uninitialized

  // TODO Not sure about this adjecency shape
  public neighbours: Record<"top" | "right" | "bottom" | "left", Neighbour> = {
    top: null,
    right: null,
    bottom: null,
    left: null,
  };
}
