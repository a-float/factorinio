import type * as THREE from "three";

/**
 * Prototypes are blueprints for entity creation.
 */

export type EntityPrototype = {
  name: string;
  icon: string;
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
    icon: "MIN",
  },
  factory: {
    name: "Basic Factory",
    width: 3,
    height: 3,
    color: 0x55bb88,
    icon: "FAC",
  },
  belt: {
    name: "Basic Belt",
    width: 1,
    height: 1,
    color: 0xaabbcc,
    icon: "BEL",
  },
} as const satisfies Record<string, BuildingPrototype>;
