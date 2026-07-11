import {
  buildingPrototypes,
  freeItemPrototypes,
  type FreeItemPrototype,
} from "../prototype";
import { Resource } from "./resource";

export type Rotation = number;

export type Tool =
  | {
      type: "build";
      building: keyof typeof buildingPrototypes;
      icon: string;
      prototype: (typeof buildingPrototypes)[keyof typeof buildingPrototypes];
    }
  | { type: "destroy"; icon: string }
  | { type: "debug:placeItem"; icon: string; item: FreeItemPrototype };

export class PlayerStateResource extends Resource {
  readonly tools: Tool[] = [
    ...Object.entries(buildingPrototypes).map(
      ([k, v]) =>
        ({ type: "build", building: k, prototype: v, icon: v.icon }) as Tool,
    ),
    { type: "destroy", icon: "DEL" },
    {
      type: "debug:placeItem",
      icon: freeItemPrototypes.ball.icon,
      item: freeItemPrototypes.ball,
    },
  ];
  private activeTool: Tool = this.tools[0];
  private rotation: Rotation = 0;
  public intersect: { x: number; z: number } = { x: 0, z: 0 };

  setActiveTool(tool: Tool) {
    // TODO rethink
    this.activeTool = tool;
    this.rotation = 0;
    window.dispatchEvent(new Event("activeToolChanged"));
  }

  getActiveTool() {
    return this.activeTool;
  }

  getRotation() {
    return this.rotation;
  }

  rotate() {
    this.rotation = this.rotation + 1;
  }

  // Do not save player state
  serialize(): string {
    return "";
  }

  hydrate() {}
}
