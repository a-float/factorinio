import type { GameEvent, UserEvent } from "../events/event";
import { Resource } from "./resource";

export class EventQueueResource extends Resource {
  events: GameEvent[] = [];
  userEvents: UserEvent[] = [];

  clear() {
    this.events.length = 0;
    this.userEvents.length = 0;
  }
}
