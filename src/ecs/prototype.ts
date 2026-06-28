import type * as THREE from "three";

/**
 * Prototypes are blueprints for entity creation.
 */

export type EntityPrototype = {
  name: string;
};

export type BuildingPrototype = EntityPrototype & {
  width: number;
  height: number;
  color: THREE.ColorRepresentation;
};

export const buildingPrototypes = {
  miner: {
    name: "Basic Miner",
    width: 2,
    height: 2,
    color: 0x808080,
  },
  factory: {
    name: "Basic Factory",
    width: 3,
    height: 3,
    color: 0x55bb88,
  },
} as const satisfies Record<string, BuildingPrototype>;
