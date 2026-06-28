import { buildingPrototypes } from "../prototype";
import type { Resource } from "./resource";

export type Tool =
  | { type: "build"; building: keyof typeof buildingPrototypes; icon: string }
  | { type: "destroy"; icon: string };

export class PlayerStateResource implements Resource {
  readonly tools: Tool[] = [
    ...Object.entries(buildingPrototypes).map(
      ([k, v]) => ({ type: "build", building: k, icon: v.icon }) as Tool,
    ),
    { type: "destroy", icon: "DEL" },
  ];
  activeTool: Tool = this.tools[0];
}
