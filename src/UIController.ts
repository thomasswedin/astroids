import { createApp } from 'vue';
import '../src/assets/style.css';
import GameRoot from './ui/components/GameView';
import { UIDataManager } from "./ui/data/UIDataManager";
import { UIEventManager } from "./ui/events/UIEventManager";

export const servicesKey = Symbol();

export interface IUIServices {
    eventManager: UIEventManager;
    dataManager: UIDataManager;
}

export class UIController {

    private _gameUIRoot: HTMLElement;
    private _uiEventManager: UIEventManager;
    private _uiDataManager: UIDataManager;
    private _services: IUIServices;

    constructor() {
        this._gameUIRoot = document.createElement("div");
        this._gameUIRoot.id = "GameUIRoot";
        this._uiEventManager = new UIEventManager();
        this._uiDataManager = new UIDataManager();

        this._services = {
            eventManager: this._uiEventManager,
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

    public get eventManager(): UIEventManager {
        return this._uiEventManager;
    }
}