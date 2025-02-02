import { Background } from '../components/Background';
import { LevelEngine } from '../components/LevelEngine';
import { LevelFactory } from '../components/LevelFactory';
import { TileTextComponent } from '../components/TileTextComponent/TileTextComponent';
import { GameEvents } from '../events/game/GameEvents';
import { UIEventManager } from "../events/ui/UIEventManager";

export class Level1Scene extends Phaser.Scene {

protected _levelFactory: LevelFactory | undefined;
protected _levelEngine: LevelEngine | undefined;
protected _uiEventManager: UIEventManager | undefined;

constructor() {
    super({
        key: 'Level1'
    });
}
public initialize(uiEventManager:UIEventManager, levelFactory:LevelFactory, levelEngine:LevelEngine): void {
    this._uiEventManager = uiEventManager;
    this._levelFactory = levelFactory;
    this._levelEngine = levelEngine;
}   

create() {
    new Background(this, 0, 0);
    
    
    
    if (this._uiEventManager) {
        if (this._levelFactory) {
            
        } else {
            throw new Error('LevelFactory is not initialized');
        }
    } else {
        throw new Error('UIEventManager is not initialized');
    }
    new TileTextComponent(this, 300, 26, 'ASTROIDS');
    //new TileTextComponent(currentScene, 286, 200, 'GAME OVER');

    if (this._levelEngine) {
        this._levelEngine.create();
    } else {
        throw new Error('LevelEngine is not initialized');
    }
    this._uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);

    // Request fullscreen mode
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.requestFullscreen) { // Chrome, Firefox, Safari, and Opera
        document.documentElement.requestFullscreen();
    }

}
}