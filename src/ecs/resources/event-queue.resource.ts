import type { GameEvent, UserEvent } from "../events/event";
import type { Resource } from "./resource";

export class EventQueueResource implements Resource {
  events: GameEvent[] = [];
  userEvents: UserEvent[] = [];
}
