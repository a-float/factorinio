import type { DeletedComponent } from "./deleted.component";
import type { DisplayComponent } from "./display.component";
import type { GridOccupantComponent } from "./grid-occupant.component";
import type { NetworkComponent } from "./network.component";

// TODO Replace hardcoded strings with components id reference
export type ComponentMap = {
  display: InstanceType<typeof DisplayComponent>;
  gridOccupant: InstanceType<typeof GridOccupantComponent>;
  deleted: InstanceType<typeof DeletedComponent>;
  network: InstanceType<typeof NetworkComponent>;
};

export type ComponentName = keyof ComponentMap;
