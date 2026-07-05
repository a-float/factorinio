import type { Direction } from "../components/belt.component";
import type { Rotation } from "../resources/player-state.resource";
import { System, type SystemContext } from "./system";

export class BeltSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").events;
    const rotation = context.getResource("playerState").getRotation();

    for (const event of events.filter((e) => e.type === "build")) {
      const building = event.payload.entity;
      const beltComp = building.getComponent("belt");
      if (!beltComp) continue;

      const { prev, next } = BeltSystem.getBeltConfigForRotation(rotation);
      console.log("Belt", { prev, next });
      beltComp.prev = prev;
      beltComp.next = next;
    }
  }

  static getBeltConfigForRotation(rotation: Rotation) {
    const dirs: Direction[] = ["bottom", "left", "top", "right"];
    let i = 0;
    for (const prev of dirs) {
      for (const next of dirs) {
        if (prev === next) continue;
        if (i === rotation % 12) return { prev, next };
        i++;
      }
    }

    throw new Error("Belt config not found. This shouldn't happen.");
  }
}
