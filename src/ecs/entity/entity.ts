import type { Component } from "../components/component";
import type { ComponentMap } from "../components/component.map.ts";
import type { EntityPrototype } from "../prototype";

export class Entity {
  private static internalIdCounter = 1;
  readonly name: string;
  readonly id: number;
  private components = new Map<string, Component>();

  constructor(prototype: EntityPrototype) {
    this.id = Entity.internalIdCounter++;
    this.name = prototype.name;
  }

  getComponent<K extends keyof ComponentMap>(componentName: K) {
    return this.components.get(componentName) as ComponentMap[K] | undefined;
  }

  addComponent<T extends Component>(component: T): void {
    if (this.components.has(component.id)) {
      console.warn(
        `Entity ${this.id} already has a component with id ${component.id}. Overwriting it.`,
      );
    }
    this.components.set(component.id, component);
  }

  removeComponent(componentName: string): void {
    this.components.delete(componentName);
  }
}
