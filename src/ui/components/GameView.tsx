import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { UIEventManager } from "../events/ui/UIEventManager";
import { Level1Scene } from '../scenes/Level1Scene';
import { LevelEngine } from './LevelEngine';
import { LevelFactory } from './LevelFactory';
import { LivesPanel } from './LivesPanel';


export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const lives = ref(0);
    const gameOver = ref(false);

    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.uiEventManager;
    const uiDataManager: UIDataManager = services.dataManager;
    let livesPanel: LivesPanel;

    //let MenuScene: Phaser.Scene;
    //let Level1Scene: Phaser.Scene;
    //let LoadingScrene: Phaser.Scene;

    let levelFactory: LevelFactory;
    let levelEngine: LevelEngine;
    let game: Phaser.Game;
    let currentScene: Phaser.Scene;

    

    const onChangeScreen = () => {
      //_game.scale.resize(window.innerWidth, window.innerHeight);
      if (game.scene.scenes.length > 0) {
        

        if (currentScene instanceof Level1Scene) {
          currentScene.initialize(uiEventManager, levelFactory, levelEngine);
        }
        //(_currentScene as any).resize();
      }
    }

    const _orientation = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
    _orientation.addEventListener('change', () => {
      onChangeScreen();
    });

    window.addEventListener('resize', () => {
      onChangeScreen();
    });

    onMounted(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        dom: {
          createContainer: true
        },
        parent: "body",
        scene: [Level1Scene],
        /*scene: {
          preload: preload,
          create: create,
          update: update,
        },*/
        input: {
          keyboard: true,
          mouse: true,
          touch: true,
          gamepad: true
        }
      };

      
      game = new Phaser.Game(config);

      function create(this: Phaser.Scene) {
        currentScene = game.scene.scenes[0];
        levelFactory = new LevelFactory(currentScene, 3);
        livesPanel = new LivesPanel(currentScene, currentScene.cameras.main.width - 100, 0);
        levelEngine = new LevelEngine(currentScene, levelFactory, uiEventManager);  
      }
      

      /*function preload(this: Phaser.Scene) {
        //this.load.font('Vectorb', 'assets/fonts/Vectorb1.ttf');
      }

      function create(this: Phaser.Scene) {
        _currentScene = this;
        new Background(_currentScene, 0, 0);
        livesPanel = new LivesPanel(_currentScene, _currentScene.cameras.main.width - 100, 0);
        levelFactory = new LevelFactory(_currentScene, 3);
        levelEngine = new LevelEngine(_currentScene, levelFactory, uiEventManager);
        new TileTextComponent(_currentScene, 300, 26, 'ASTROIDS');
        //new TileTextComponent(currentScene, 286, 200, 'GAME OVER');

        levelEngine.create();
        uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);

        // Request fullscreen mode
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) { // Chrome, Firefox, Safari, and Opera
          document.documentElement.requestFullscreen();
        }
      }*/

      /*function update() {
        if (levelEngine) {
          levelEngine.update();
        }
      }*/
    });

    watch(uiDataManager.game.score.ref, (newValue) => {
      score.value = newValue;
      //livesPanel.setScore(newValue);
    });

    watch(uiDataManager.game.lives.ref, (newValue) => {
      lives.value = newValue;
      //livesPanel.setLives(newValue);

      if (newValue > 0) {
        //levelEngine.newLife(_currentScene);
      } else {
        gameOver.value = true;
        //levelEngine.gameOver();
      }
    });

    return () => (
      <>
      </>
    );
  },
});