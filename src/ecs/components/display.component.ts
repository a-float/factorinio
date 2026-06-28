import type { Component } from "./component";
import type * as THREE from "three";

export class DisplayComponent implements Component {
  readonly id = "display";

  constructor(public color: THREE.ColorRepresentation) {}
}
