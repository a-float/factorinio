import { MathUtils } from "three";
import type { Direction } from "../components/belt.component";
import { getOppositeDirection, DIRECTION_OFFSETS } from "../directions";
import { Entity } from "../entity/entity";
import { System, type SystemContext } from "./system";

export class BeltSystem extends System {
  update(deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").events;

    // Update belt's prev and next on build
    for (const event of events.filter((e) => e.type === "build")) {
      const building = event.payload.entity;
      const beltComp = Entity.getComponent(building, "belt");
      if (!beltComp) continue;
      const { x, z } = Entity.getComponent(building, "gridOccupant")!;
      const { prev, next } = BeltSystem.getBeltConfigForCellAndRotation(
        { x, z },
        context,
      );
      beltComp.prev = prev;
      beltComp.next = next;
    }

    // Move items along belts
    for (const entity of context.entityManager.queryEntities(["belt"])) {
      const belt = Entity.getComponent(entity, "belt")!;
      const { x, z } = Entity.getComponent(entity, "gridOccupant")!;
      for (const item of belt.items) {
        item.distance = MathUtils.clamp(item.distance + deltaTime * 0.5, 0, 1); // TODO move speed to belt (look out for save states)
        if (item.distance >= 1) {
          const offset = DIRECTION_OFFSETS[belt.next];
          const nextId = context
            .getResource("grid")
            .getEntityIdAtCell(x + offset.x, z + offset.z);
          if (!nextId) continue;
          const nextEntity = context.entityManager.getEntity(nextId);
          if (!nextEntity) continue;
          const nextBelt = Entity.getComponent(nextEntity, "belt");
          if (!nextBelt) continue;
          nextBelt.items.push({ ...item, distance: 0 });
        }
      }
      belt.items = belt.items.filter((item) => item.distance < 1);
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
      const offset = DIRECTION_OFFSETS[dir];
      const neighbourId = grid.getEntityIdAtCell(
        pos.x + offset.x,
        pos.z + offset.z,
      );
      if (!neighbourId) continue;
      const entity = context.entityManager.getEntity(neighbourId);
      if (!entity) continue;
      const otherBelt = Entity.getComponent(entity, "belt");
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
