import type { Component } from "../components/component";
import type { ComponentMap } from "../components/component.map.ts";
import type { EntityPrototype } from "../prototype";

export class Entity {
  private static internalIdCounter = Date.now() + 1;
  readonly name: string;
  readonly id: number;
  private components: Record<string, Component> = {};

  constructor(prototype: EntityPrototype) {
    this.id = Entity.internalIdCounter++;
    this.name = prototype.name;
  }

  static getComponent<K extends keyof ComponentMap>(
    entity: Entity,
    componentName: K,
  ) {
    return entity.components[componentName] as ComponentMap[K] | undefined;
  }

  static addComponent<T extends Component>(entity: Entity, component: T): void {
    if (Object.hasOwn(entity.components, component.id)) {
      console.warn(
        `Entity ${entity.id} already has a component with id ${component.id}. Overwriting it.`,
      );
    }
    entity.components[component.id] = component;
  }

  static removeComponent(entity: Entity, componentName: string): void {
    delete entity.components[componentName];
  }
}
