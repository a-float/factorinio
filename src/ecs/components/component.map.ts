import type { DisplayComponent } from "./display.component";
import type { GridOccupantComponent } from "./grid-occupant.component";

// TODO Replace hardcoded strings with components id reference
export type ComponentMap = {
  display: InstanceType<typeof DisplayComponent>;
  gridOccupant: InstanceType<typeof GridOccupantComponent>;
};

export type ComponentName = keyof ComponentMap;
