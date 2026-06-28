import type { ComponentName } from "./components/component.map";
import { DeletedComponent } from "./components/deleted.component";
import type { Entity } from "./entity/entity";

export class EntityManager {
  private entities: Map<number, Entity> = new Map();
  private toMarkAsDeleted: Entity[] = [];

  deleteEntity(entity: Entity) {
    this.toMarkAsDeleted.push(entity);
  }

  update() {
    const toDelete = this.queryEntities(["deleted"]);
    if (toDelete.length) console.log(`Deleting ${toDelete.length} entities`);
    toDelete.forEach((entity) => {
      this.entities.delete(entity.id);
    });

    this.toMarkAsDeleted.forEach((entity) => {
      entity.addComponent(new DeletedComponent());
    });

    this.toMarkAsDeleted.length = 0;
  }

  getEntity(id: number): Entity | undefined {
    return this.entities.get(id);
  }

  addEntity(entity: Entity): void {
    this.entities.set(entity.id, entity);
  }

  removeEntity(id: number): void {
    this.entities.delete(id);
  }

  // TODO optimize with bitmask or component-based indexing for faster queries if needed
  queryEntities(componentNames: ComponentName[]): Entity[] {
    const result: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (componentNames.every((name) => entity.getComponent(name))) {
        result.push(entity);
      }
    }
    return result;
  }
}
