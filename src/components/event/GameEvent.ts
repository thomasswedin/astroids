import { Event } from '../../common/event/Event';
import type { IEvent } from '../../common/event/IEvent';

export class GameEvent extends Event implements IEvent {

    public static GAME_OVER: string = "GameEvent.GAME_OVER";
    public static RESTART: string = "GameEvent.RESTART";
    public static START: string = "GameEvent.START";

    protected _data: any;

    constructor(eventType: string) {
        super(eventType);
    }
}