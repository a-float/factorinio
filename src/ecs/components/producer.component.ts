import type { itemPrototypes } from "../prototype";
import { Component } from "./component";

export class ProducerComponent extends Component {
  id = "producer";
  public timePassed = 0;
  public itemCount = 0;
  public readonly maxItems = 3;

  constructor(
    public item: keyof typeof itemPrototypes,
    public itemsPerSecond: number,
  ) {
    super();
  }
}
