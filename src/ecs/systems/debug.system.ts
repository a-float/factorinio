import { Entity } from "../entity/entity";
import { getPointerWorldPosition } from "../raycast";
import { System, type SystemContext } from "./system";

/**
 * For handling my debug tools
 */
export class DebugSystem extends System {
  update(_deltaTime: number, context: SystemContext): void {
    const activeTool = context.getResource("playerState").getActiveTool();

    if (activeTool.type !== "debug:placeItem") return;

    for (const event of context.getResource("eventQueue").userEvents) {
      if (event.type === "click" && event.payload.button === 0) {
        const intersect = getPointerWorldPosition(
          event.payload,
          context.camera,
          context.renderer,
        );

        const id = context
          .getResource("grid")
          .getEntityIdAtCell(intersect.x, intersect.z);

        if (!id) return;
        const entity = context.entityManager.getEntity(id);
        if (!entity) return;
        const beltComponent = Entity.getComponent(entity, "belt");
        if (!beltComponent) return;
        beltComponent.items.push({ name: "ball", distance: 0 });
      }
    }
  }
}
