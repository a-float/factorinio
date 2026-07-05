import { DisplayComponent } from "../components/display.component";
import {
  getRotatedFootprint,
  GridOccupantComponent,
} from "../components/grid-occupant.component";
import { NetworkComponent } from "../components/network.component";
import { buildingPrototypes } from "../prototype";
import type { Rotation } from "../resources/player-state.resource";
import { Entity } from "./entity";

// TODO Render system does not use rotation. Will probably break after replacing cubes with models.
export class BuildingEntity extends Entity {
  constructor(
    x: number,
    y: number,
    rotation: Rotation,
    buildingType: keyof typeof buildingPrototypes,
  ) {
    const prototype = buildingPrototypes[buildingType];
    const footprint = getRotatedFootprint(
      prototype.size.x,
      prototype.size.z,
      rotation,
    );
    super(prototype);
    this.addComponent(
      new GridOccupantComponent(
        x,
        y,
        footprint.width,
        footprint.height,
        rotation,
      ),
    );
    this.addComponent(new DisplayComponent(prototype.size.y, prototype.color));

    // TODO Don't base it on name
    if (prototype.name === "Basic Belt") {
      this.addComponent(new NetworkComponent());
    }
  }
}
