import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { GameEvents } from '../events/game/GameEvents';
import { UIEventManager } from "../events/ui/UIEventManager";
import { Background } from "./Background";
import { LevelEngine } from './LevelEngine';
import { LevelFactory } from './LevelFactory';
import { LivesPanel } from './LivesPanel';
import { TileTextComponent } from './TileTextComponent/TileTextComponent';

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
    let currentScene: Phaser.Scene;
    let levelFactory: LevelFactory;
    let levelEngine: LevelEngine;

    onMounted(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
          }
        },
        scene: {
          create: create,
          update: update,
        },
        input: {
          keyboard: true,
          mouse: true,
          touch: true,
          gamepad: true
        }
      };

      new Phaser.Game(config);

      function create(this: Phaser.Scene) {
        currentScene = this;
        new Background(currentScene, 0, 0);
        livesPanel = new LivesPanel(currentScene, currentScene.cameras.main.width - 100, 0);
        levelFactory = new LevelFactory(currentScene, 3);
        levelEngine = new LevelEngine(currentScene, levelFactory, uiEventManager);
        new TileTextComponent(currentScene, 300, 100, 'ASTROIDS');
        new TileTextComponent(currentScene, 286, 200, 'GAME OVER');

        levelEngine.create();
        uiEventManager.dispatchEvent(GameEvents.GameSetupComplete);
      }

      function update() {
        if (levelEngine) {
          levelEngine.update();
        }
      }
    });

    watch(uiDataManager.game.score.ref, (newValue) => {
      score.value = newValue;
      livesPanel.setScore(newValue);
    });

    watch(uiDataManager.game.lives.ref, (newValue) => {
      lives.value = newValue;
      livesPanel.setLives(newValue);

      if (newValue > 0) {
        levelEngine.newLife(currentScene);
      } else {
        gameOver.value = true;
        levelEngine.gameOver();
      }
    });

    return () => (
      <>
      </>
    );
  },
});