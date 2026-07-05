import * as THREE from "three";

/**
 * Prototypes are blueprints for entity creation.
 */

export type EntityPrototype = {
  name: string;
  icon: string;
};

export type BuildingPrototype = EntityPrototype & {
  size: THREE.Vector3;
  color: THREE.ColorRepresentation;
};

export const buildingPrototypes = {
  miner: {
    name: "Basic Miner",
    size: new THREE.Vector3(2, 1, 2),
    color: 0x808080,
    icon: "MIN",
  },
  factory: {
    name: "Basic Factory",
    size: new THREE.Vector3(5, 1.5, 2),
    color: 0x55bb88,
    icon: "FAC",
  },
  belt: {
    name: "Basic Belt",
    size: new THREE.Vector3(1, 0.2, 1),
    color: 0xaabbcc,
    icon: "BELT",
  },
  pipe: {
    name: "Basic Pipe",
    size: new THREE.Vector3(1, 0.2, 1),
    color: 0xaaaa22,
    icon: "PIPE",
  },
} as const satisfies Record<string, BuildingPrototype>;
