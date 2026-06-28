import { BuildingEntity } from "../entity/building.entity";
import { DeletedComponent } from "../components/deleted.component";
import { mouseToWorldCoordinates } from "../raycast";
import { System, type SystemContext } from "./system";
import type { Tool } from "../resources/player-state.resource";
import type { UserEvent } from "../events/event";

export class BuildSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    this.updateEvents(context);
    this.updateDestroyed(context);
  }

  private updateDestroyed(context: SystemContext) {
    const grid = context.getResource("grid");
    context.entityManager
      .queryEntities(["gridOccupant", "deleted"])
      .forEach((entity) => {
        const gc = entity.getComponent("gridOccupant")!;
        grid.free(gc.x, gc.y, gc.width, gc.height);
      });
  }

  private updateEvents(context: SystemContext) {
    const { activeTool } = context.getResource("playerState");
    const eventQueue = context.getResource("eventQueue");

    for (const event of eventQueue.userEvents) {
      if (
        event.type === "click" &&
        event.payload.button === 0 &&
        activeTool.type === "build"
      ) {
        this.handleBuild(event, activeTool, context);
      }

      if (
        event.type === "click" &&
        event.payload.button === 0 &&
        activeTool.type === "destroy"
      ) {
        this.handleDestroy(event, context);
      }
    }

    // Clear user events after processing
    eventQueue.userEvents.length = 0;
  }

  private handleBuild(
    event: UserEvent & { type: "click" },
    tool: Tool & { type: "build" },
    context: SystemContext,
  ) {
    const grid = context.getResource("grid");
    const pos = mouseToWorldCoordinates(
      event.payload.x,
      event.payload.y,
      context.camera,
      context.renderer,
    );

    // TODO do not create entity if not needed
    const building = new BuildingEntity(pos.x, pos.z, tool.building);
    const { width, height } = building.getComponent("gridOccupant")!;

    if (grid.isEmpty(pos.x, pos.z, width, height)) {
      console.log(`Building a ${building.name} with id ${building.id}`);
      grid.occupy(pos.x, pos.z, width, height, building);
      context.entityManager.addEntity(building);
    } else {
      console.log("No place for the building");
      return;
    }
  }

  private handleDestroy(
    event: UserEvent & { type: "click" },
    context: SystemContext,
  ) {
    const grid = context.getResource("grid");
    const pos = mouseToWorldCoordinates(
      event.payload.x,
      event.payload.y,
      context.camera,
      context.renderer,
    );

    const entityId = grid.getEntityIdAtCell(pos.x, pos.z);
    if (entityId === undefined) return;
    const entity = context.entityManager.getEntity(entityId);
    if (!entity) return;

    entity.addComponent(new DeletedComponent());
  }
}
