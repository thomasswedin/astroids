import { UIDataManager } from "../../ui/data/UIDataManager";
import { Background } from '../components/Background';
import { MKeypad } from "../components/keypad/mobile/MKeypad";
import { LevelEngine } from '../components/LevelEngine';
import { LevelFactory } from '../components/LevelFactory';
import { LivesPanel } from '../components/LivesPanel';
import { TileTextComponent } from '../components/TileTextComponent/TileTextComponent';
import { GameEvents } from '../events/game/GameEvents';
import { UIEventManager } from "../events/ui/UIEventManager";

export class Game extends Phaser.Scene {

    protected _levelFactory!: LevelFactory;
    protected _levelEngine!: LevelEngine;
    protected _uiEventManager!: UIEventManager;
    protected _livesPanel!: LivesPanel;
    protected _uiDataManager!: UIDataManager;
    protected _keypad!: MKeypad;

    constructor() {
        super({
            key: 'Game'
        });
    }

    create() {
        this._uiEventManager = this.registry.get('services').uiEventManager;
        this._uiDataManager = this.registry.get('services').dataManager;

        new Background(this, 0, 0);
        this._levelFactory = new LevelFactory(this, 3);
        this._levelEngine = new LevelEngine(this, this._levelFactory, this._uiEventManager);
        this._livesPanel = new LivesPanel(this, this.cameras.main.width - 100, 0);
        
        this._keypad = new MKeypad(this, 200, 560);
        
        new TileTextComponent(this, 300, 26, 'ASTROIDS');
        //new TileTextComponent(currentScene, 286, 200, 'GAME OVER');

        if (this._levelEngine) {
            this._levelEngine.create();
        } else {
            throw new Error('LevelEngine is not initialized');
        }

        this.addEventListeners();
        this._uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);
    }

    update(): void {
        if (this._levelEngine) {
            this._levelEngine.update();
        }
    }

    protected addEventListeners() {
        this.events.on('updateLives', this.onUpdateLives, this);
        this.events.on('updateScore', this.onUpdateScore, this);
    }

    protected onUpdateLives(newValue: number) {
        this._livesPanel.setLives(newValue);

        if (newValue > 0) {
            this._levelEngine.newLife(this);
        } else {
            this._levelEngine.gameOver();
        }
    }

    protected onUpdateScore(newValue: number) {
        this._livesPanel.setScore(newValue);
    }
}