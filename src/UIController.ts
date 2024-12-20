import { createApp } from 'vue';
import '../src/assets/style.css';
import EventDispatcher from './common/event/EventDispatcher';
import GameRoot from './components/Game';

export class UIController {

    private _gameUIRoot: HTMLElement;

    constructor() {
        this._gameUIRoot = document.createElement("div");
        this._gameUIRoot.id = "GameUIRoot";
    }

    public createGame(): void {
        console.log("create game history UI");
        const app = createApp(GameRoot);
        app.provide('eventDispatcher', EventDispatcher.getInstance());
        app.mount(this._gameUIRoot);
    }

    public getGameHistoryUIRoot(): HTMLElement {
        return this._gameUIRoot;
    }
}