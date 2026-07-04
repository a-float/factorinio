import type { Component } from "./component";
import type * as THREE from "three";

export class DisplayComponent implements Component {
  readonly id = "display";
  public isDirty = false;

  constructor(
    public height: number,
    public color: THREE.ColorRepresentation,
  ) {}

  setDirty(value: boolean) {
    this.isDirty = value;
  }
}
