import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { UIEventManager } from "../events/ui/UIEventManager";
import { Game } from '../scenes/Game';
import { Menu } from '../scenes/Menu';
import { Preloader } from '../scenes/Preloader';


export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const lives = ref(0);
    const gameOver = ref(false);

    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.uiEventManager;
    const uiDataManager: UIDataManager = services.dataManager;


    let game: Phaser.Game;



    const onChangeScreen = () => {
      //Get current scene and update the screen size
    }

    const _orientation = screen.orientation || (screen as any).mozOrientation || (screen as any).msOrientation;
    _orientation.addEventListener('change', () => {
      onChangeScreen();
    });

    window.addEventListener('resize', () => {
      onChangeScreen();
    });


    //https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
    //https://docs.phaser.io/api-documentation/class/scale-scalemanager
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
        scene: [Preloader, Menu, Game],
        input: {
          keyboard: true,
          mouse: true,
          touch: true,
          gamepad: true
        },
        callbacks: {
          preBoot: (game) => {
            game.registry.set('services', services);
          }
        }
      };

      game = new Phaser.Game(config);
      game.scene.start('Preloader', { services });
    });

    watch(uiDataManager.game.score.ref, (newValue) => {
      score.value = newValue;
      game.scene.getScene('Game').events.emit('updateScore', newValue);
    });

    watch(uiDataManager.game.lives.ref, (newValue) => {
      lives.value = newValue;

      if (newValue > 0) {
        game.scene.getScene('Game').events.emit('updateLives', newValue);
      } else {
        gameOver.value = true;
      }
    });

    return () => (
      <>
      </>
    );
  },
});