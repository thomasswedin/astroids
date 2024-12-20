import { EventEmitter } from 'eventemitter3';
import type { IEvent } from './IEvent';
import type { IEventDispatcher } from './IEventDispatcher';

class EventDispatcher extends EventEmitter implements IEventDispatcher {
  private static instance: EventDispatcher;

  private constructor() {
    super();
  }

  public static getInstance(): EventDispatcher {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  public addEventListener(type: string, listener: (event: IEvent) => void): void {
    this.on(type, listener);
  }

  public removeEventListener(type: string, listener: (event: IEvent) => void): void {
    this.off(type, listener);
  }

  public dispatchEvent(event: IEvent): void {
    this.emit(event.type, event);
  }
}

export default EventDispatcher;