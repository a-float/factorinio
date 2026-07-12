import type { Direction } from "./belt.component";
import { Component } from "./component";

export class InserterComponent extends Component {
  readonly id = "inserter";
  public itemsPerSecond = 2;
  public timePassed = 0;

  // Assumes insertes can only be straight
  constructor(public next: Direction) {
    super();
  }
}
