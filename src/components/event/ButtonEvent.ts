import { Event } from '../../common/event/Event';
import type { IEvent } from '../../common/event/IEvent';

export class ButtonEvent extends Event implements IEvent {

    public static RESTART: string = "ButtonEvent.RESTART";
    public static PAUSE: string = "ButtonEvent.PAUSE";

    constructor(eventType: string) {
        super(eventType);
    }
}