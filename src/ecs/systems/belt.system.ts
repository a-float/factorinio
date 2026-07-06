import type { Direction } from "../components/belt.component";
import { getOppositeDirection, NEIGHBOR_OFFSETS } from "../directions";
import { System, type SystemContext } from "./system";

export class BeltSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").events;

    for (const event of events.filter((e) => e.type === "build")) {
      const building = event.payload.entity;
      const beltComp = building.getComponent("belt");
      if (!beltComp) continue;
      const { x, y } = building.getComponent("gridOccupant")!;
      const { prev, next } = BeltSystem.getBeltConfigForCellAndRotation(
        { x, z: y }, // Rename is kinda confusing
        context,
      );
      beltComp.prev = prev;
      beltComp.next = next;
    }
  }

  static getBeltConfigForCellAndRotation(
    pos: { x: number; z: number },
    context: SystemContext,
  ) {
    const grid = context.getResource("grid");
    const dirs: Direction[] = ["bottom", "left", "top", "right"];
    const rotation = context.getResource("playerState").getRotation();
    const options: { prev: Direction; next: Direction }[] = [];

    for (const prev of dirs) {
      for (const next of dirs) {
        if (prev === next) continue;
        options.push({ prev, next });
      }
    }

    const incoming: Direction[] = [];

    for (const dir of dirs) {
      const offset = NEIGHBOR_OFFSETS[dir];
      const neighbourId = grid.getEntityIdAtCell(
        pos.x + offset.dx,
        pos.z + offset.dz,
      );
      if (!neighbourId) continue;
      const entity = context.entityManager.getEntity(neighbourId);
      if (!entity) continue;
      const otherBelt = entity.getComponent("belt");
      if (!otherBelt) continue;

      if (otherBelt.next === getOppositeDirection(dir)) {
        incoming.push(dir);
      }
    }

    // TODO Consider prefering straight belts
    const validOptions = options.filter((o) => {
      return incoming.length === 0 || incoming.includes(o.prev);
    });

    return validOptions[rotation % validOptions.length];
  }
}
