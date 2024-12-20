import { Event } from '../../common/event/Event';
import type { IEvent } from '../../common/event/IEvent';
import type { IScoreData } from '../data/IScoreData';

export class ScoreEvent extends Event implements IEvent {

    public static UPDATED: string = "ScoreEvent.UPDATED";
    protected _data: IScoreData;

    constructor(eventType: string, data: IScoreData) {
        super(eventType);
        this._data = data;
    }

    public get data(): IScoreData {
        return this._data;
    }
}