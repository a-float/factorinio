import { buildingPrototypes } from "../prototype";
import { Resource } from "./resource";

export type Rotation = 0 | 1 | 2 | 3;

export type Tool =
  | {
      type: "build";
      building: keyof typeof buildingPrototypes;
      icon: string;
      prototype: (typeof buildingPrototypes)[keyof typeof buildingPrototypes];
    }
  | { type: "destroy"; icon: string };

export class PlayerStateResource extends Resource {
  readonly tools: Tool[] = [
    ...Object.entries(buildingPrototypes).map(
      ([k, v]) =>
        ({ type: "build", building: k, prototype: v, icon: v.icon }) as Tool,
    ),
    { type: "destroy", icon: "DEL" },
  ];
  private activeTool: Tool = this.tools[0];
  private rotation: Rotation = 0;

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
    this.rotation = ((this.rotation + 1) % 4) as Rotation;
  }
}
