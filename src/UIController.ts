import { createApp } from 'vue';
import '../src/assets/style.css';
import { GameEventManager } from "../src/ui/events/game/GameEventManager";
import { UIEventManager } from "../src/ui/events/ui/UIEventManager";
import GameRoot from './ui/components/GameView';
import { UIDataManager } from "./ui/data/UIDataManager";

export const servicesKey = Symbol();

export interface IUIServices {
    uiEventManager: UIEventManager;
    gameEventManager: GameEventManager;
    dataManager: UIDataManager;
}

export class UIController {

    private _gameUIRoot: HTMLElement;
    private _uiEventManager: UIEventManager;
    private _gameEventManager: GameEventManager;
    private _uiDataManager: UIDataManager;
    private _services: IUIServices;

    constructor() {
        this._gameUIRoot = document.createElement("div");
        this._gameUIRoot.id = "GameUIRoot";
        this._uiEventManager = new UIEventManager();
        this._gameEventManager = new GameEventManager();
        this._uiDataManager = new UIDataManager();

        this._services = {
            uiEventManager: this._uiEventManager,
            gameEventManager: this._gameEventManager,
            dataManager: this._uiDataManager
        };
    }

    public createGame(): void {
        console.log("create game history UI");
        const app = createApp(GameRoot);
        app.provide(servicesKey, this._services);
        app.mount(this._gameUIRoot);
    }

    public getGameUIRoot(): HTMLElement {
        return this._gameUIRoot;
    }

    public get dataManager(): UIDataManager {
        return this._uiDataManager;
    }

    public get uiEventManager(): UIEventManager {
        return this._uiEventManager;
    }

    public get gameEventManager(): GameEventManager {
        return this._gameEventManager;
    }
}