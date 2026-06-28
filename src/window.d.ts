import type { World } from "./ecs/world";

declare global {
  interface Window {
    world: World;
  }
}

export {};
