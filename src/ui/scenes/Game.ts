import { UIDataManager } from "../../ui/data/UIDataManager";
import { Background } from '../components/Background';
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

    constructor() {
        super({
            key: 'Game'
        });
        // Access services from the registry

    }

    /*init(data: { services: IUIServices }) {
        this._uiEventManager = data.services.uiEventManager;
        this._uiDataManager = data.services.dataManager;
    }*/

    //How to covert this to ts
    /*watch(uiDataManager.game.lives.ref, (newValue) => {
          lives.value = newValue;
          livesPanel.setLives(newValue);
    
          if (newValue > 0) {
            //levelEngine.newLife(_currentScene);
          } else {
            gameOver.value = true;
            //levelEngine.gameOver();
          }
        });*/


    create() {
        this._uiEventManager = this.registry.get('services').uiEventManager;
        this._uiDataManager = this.registry.get('services').dataManager;

        /*if (typeof this._uiDataManager.game.lives.ref.subscribe === 'function') {
            this._uiDataManager.game.lives.ref.subscribe((newValue: number) => {
            this._livesPanel.setLives(newValue);

            if (newValue > 0) {
                this._levelEngine.newLife(this);
            } else {
                //gameOver.value = true;
                this._levelEngine.gameOver();
            }
            });
        } else {
            console.error('this._uiDataManager.game.lives.ref.subscribe is not a function');
        }*/

        new Background(this, 0, 0);
        this._levelFactory = new LevelFactory(this, 3);
        this._levelEngine = new LevelEngine(this, this._levelFactory, this._uiEventManager);
        this._livesPanel = new LivesPanel(this, this.cameras.main.width - 100, 0);

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
        

        // Request fullscreen mode
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) { // Chrome, Firefox, Safari, and Opera
            document.documentElement.requestFullscreen();
        }

        this.events.on('updateLives', this.handleUpdateLives, this);
        this._uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);
    }
  
    handleUpdateLives(newValue: number) {
      // Handle the new lives value here
      console.log('New lives value:', newValue);
      // Update your game logic based on the new lives value
      this._levelEngine.newLife(this);
    }

    public newLife() {
        //To be implemented
        this._levelEngine.newLife(this);
    }
}