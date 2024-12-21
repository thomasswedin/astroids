import type { IEvent } from './IEvent';

export interface IEventDispatcher {
  addEventListener(type: string, listener: (event: IEvent) => void): void;
  removeEventListener(type: string, listener: (event: IEvent) => void): void;
  dispatchEvent(event: IEvent): void;
}