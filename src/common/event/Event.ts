import type { IEvent } from "./IEvent";

export class Event implements IEvent {
    constructor(public eventType: string) {}
}