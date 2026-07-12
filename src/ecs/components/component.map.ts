import type { BeltComponent } from "./belt.component";
import type { DeletedComponent } from "./deleted.component";
import type { DisplayComponent } from "./display.component";
import type { GridOccupantComponent } from "./grid-occupant.component";
import type { InserterComponent } from "./inserter.component";
import type { NetworkComponent } from "./network.component";
import type { ProducerComponent } from "./producer.component";

// TODO Replace hardcoded strings with components id reference
export type ComponentMap = {
  display: InstanceType<typeof DisplayComponent>;
  gridOccupant: InstanceType<typeof GridOccupantComponent>;
  deleted: InstanceType<typeof DeletedComponent>;
  network: InstanceType<typeof NetworkComponent>;
  belt: InstanceType<typeof BeltComponent>;
  inserter: InstanceType<typeof InserterComponent>;
  producer: InstanceType<typeof ProducerComponent>;
};

export type ComponentName = keyof ComponentMap;
