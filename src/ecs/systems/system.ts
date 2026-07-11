import type { World } from "../world";
import type * as THREE from "three";

export type SystemContext = Pick<
  InstanceType<typeof World>,
  "entityManager" | "getResource"
> & {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
};

export abstract class System {
  abstract update(deltaTime: number, context: SystemContext): void;
  reset() {}
}
