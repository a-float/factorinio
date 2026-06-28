import { DisplayComponent } from "../components/display.component";
import { GridOccupantComponent } from "../components/grid-occupant.component";
import { buildingPrototypes } from "../prototype";
import { Entity } from "./entity";

export class BuildingEntity extends Entity {
  constructor(
    x: number,
    y: number,
    buildingType: keyof typeof buildingPrototypes,
  ) {
    const prototype = buildingPrototypes[buildingType];
    super(prototype);
    this.addComponent(
      new GridOccupantComponent(x, y, prototype.width, prototype.height),
    );
    this.addComponent(new DisplayComponent(prototype.color));
  }
}
