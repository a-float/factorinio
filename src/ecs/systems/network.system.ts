import { DIRECTION_OFFSETS, getOppositeDirection } from "../directions";
import { Entity } from "../entity/entity";
import { System, type SystemContext } from "./system";

// TODO It's more of a pipe implementation
export class NetworkSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").events;

    for (const event of events.filter(
      (e) => e.type === "build" || e.type === "destroy",
    )) {
      const building = event.payload.entity;
      const networkComp = Entity.getComponent(building, "network");
      if (!networkComp) continue;

      // Check neighbours and update network connections
      const grid = context.getResource("grid");
      const { x, z, width, height } = Entity.getComponent(
        building,
        "gridOccupant",
      )!;

      for (const dir of ["top", "right", "bottom", "left"] as const) {
        const offset = DIRECTION_OFFSETS[dir];
        const neighbourId = grid.getEntityIdAtCell(
          x + offset.x * width,
          z + offset.z * height,
        );
        if (!neighbourId) continue;
        const entity = context.entityManager.getEntity(neighbourId);
        if (!entity) continue;
        const otherNetworkComp = Entity.getComponent(entity, "network");
        if (!otherNetworkComp) continue;

        if (event.type === "build") {
          networkComp.neighbours[dir] = neighbourId;
          otherNetworkComp.neighbours[getOppositeDirection(dir)] = building.id;
        } else if (event.type === "destroy") {
          otherNetworkComp.neighbours[getOppositeDirection(dir)] = null;
        }
        const displayComponent = Entity.getComponent(entity, "display");
        if (displayComponent) displayComponent.isDirty = true;
      }
    }
  }
}
