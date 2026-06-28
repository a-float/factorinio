import { BuildingEntity } from "../entity/building.entity";
import { mouseToWorldCoordinates } from "../raycast";
import { System, type SystemContext } from "./system";
import * as THREE from "three";

export class BuildSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const eventQueue = context.getResource("eventQueue");
    const grid = context.getResource("grid");

    for (const event of eventQueue.userEvents) {
      if (event.type === "click" && event.payload.button === 0) {
        const { x, y } = event.payload;
        const intersect = mouseToWorldCoordinates(
          x,
          y,
          context.camera,
          context.renderer,
        );
        const pos = new THREE.Vector3().copy(intersect).floor().addScalar(0.5);

        const building = new BuildingEntity(pos.x, pos.z, "factory");
        console.log(`Building a ${building.name} with id ${building.id}`);

        const { width, height } = building.getComponent("gridOccupant")!;
        grid.occupy(pos.x, pos.z, width, height);
        context.entityManager.addEntity(building);
      }
    }

    // Clear user events after processing
    eventQueue.userEvents.length = 0;
  }
}
