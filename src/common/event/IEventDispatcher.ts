import type { IEvent } from "./IEvent";

export interface IEventDispatcher {
    addEventListener(eventType: string, listener: any, scope?: any): void;
    removeEventListener(eventType: string, listener: any, scope?: any): void;
    dispatchEvent(event: IEvent): void;
}