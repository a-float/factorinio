import { NEIGHBOR_OFFSETS, getOppositeDirection } from "../directions";
import { System, type SystemContext } from "./system";

// TODO It's more of a pipe implementation
export class NetworkSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const events = context.getResource("eventQueue").events;

    for (const event of events.filter(
      (e) => e.type === "build" || e.type === "destroy",
    )) {
      const building = event.payload.entity;
      const networkComp = building.getComponent("network");
      if (!networkComp) continue;

      // Check neighbours and update network connections
      const grid = context.getResource("grid");
      const { x, y, width, height } = building.getComponent("gridOccupant")!;

      for (const dir of ["top", "right", "bottom", "left"] as const) {
        const offset = NEIGHBOR_OFFSETS[dir];
        const neighbourId = grid.getEntityIdAtCell(
          x + offset.dx * width,
          y + offset.dy * height,
        );
        if (!neighbourId) continue;
        const entity = context.entityManager.getEntity(neighbourId);
        if (!entity) continue;
        const otherNetworkComp = entity.getComponent("network");
        if (!otherNetworkComp) continue;

        if (event.type === "build") {
          networkComp.neighbours[dir] = neighbourId;
          otherNetworkComp.neighbours[getOppositeDirection(dir)] = building.id;
        } else if (event.type === "destroy") {
          otherNetworkComp.neighbours[getOppositeDirection(dir)] = null;
        }
        entity.getComponent("display")?.setDirty(true);
      }
    }
  }
}
