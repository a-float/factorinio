import type { ComponentName } from "./components/component.map";
import type { Entity } from "./entity/entity";

export class EntityManager {
  private entities: Map<number, Entity> = new Map();

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
