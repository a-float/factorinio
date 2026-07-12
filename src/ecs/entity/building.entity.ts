import { BeltComponent } from "../components/belt.component";
import { DisplayComponent } from "../components/display.component";
import {
  getRotatedFootprint,
  GridOccupantComponent,
} from "../components/grid-occupant.component";
import { InserterComponent } from "../components/inserter.component";
import { NetworkComponent } from "../components/network.component";
import { ProducerComponent } from "../components/producer.component";
import { getDirectionFromRotation } from "../directions";
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
    Entity.addComponent(
      this,
      new GridOccupantComponent(
        x,
        y,
        footprint.width,
        footprint.height,
        rotation,
      ),
    );
    Entity.addComponent(
      this,
      new DisplayComponent(prototype.size.y, prototype.color),
    );

    // TODO Don't base it on name
    if (prototype.name === "Basic Pipe") {
      Entity.addComponent(this, new NetworkComponent());
    }

    if (prototype.name === "Basic Belt") {
      Entity.addComponent(this, new BeltComponent("left", "right"));
    }

    if (prototype.name === "Basic Miner") {
      Entity.addComponent(this, new ProducerComponent("ball", 0.5));
    }

    if (prototype.name === "Inserter") {
      Entity.addComponent(
        this,
        new InserterComponent(getDirectionFromRotation(rotation)),
      );
    }
  }
}
