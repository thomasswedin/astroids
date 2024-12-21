import type { IEvent } from './IEvent';

export class Event implements IEvent {
  public type: string;
  constructor(type: string) {
    this.type = type;
  }
}