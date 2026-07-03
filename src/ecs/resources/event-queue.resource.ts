import type { GameEvent, UserEvent } from "../events/event";
import { Resource } from "./resource";

export class EventQueueResource extends Resource {
  events: GameEvent[] = [];
  userEvents: UserEvent[] = [];
}
