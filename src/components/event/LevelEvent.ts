import { Event } from '../../common/event/Event';
import type { IEvent } from '../../common/event/IEvent';
import type { ILevelData } from '../data/ILevelData';

export class LevelEvent extends Event implements IEvent {

    public static LEVEL_UP: string = "LevelEvent.LEVEL_UP";
    protected _data: ILevelData;

    constructor(eventType: string, data: ILevelData) {
        super(eventType);
        this._data = data;
    }

    public get data(): ILevelData {
        return this._data;
    }
}