import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { GameEventManager } from "../events/game/GameEventManager";
import { GameEvents } from "../events/game/GameEvents";
import { UIEventManager } from "../events/ui/UIEventManager";
import { Background } from "./Background";
import { Ship } from "./Ship";
export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.uiEventManager;
    const gameEventManager: GameEventManager = services.gameEventManager;
    const uiDataManager: UIDataManager = services.dataManager;
    let background:Background;
    let ship:Ship;

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
          update: update
        }
      };

      new Phaser.Game(config);

      function update(this: Phaser.Scene) {
        // Update logic here
        /*if(background){
          background.update();
        }*/
          if(ship){
            ship.update();
          }
      }

      function create(this: Phaser.Scene) {
        this.input.on('pointerdown', () => {
          uiEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: 10 });
          gameEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: 10 });
        });

        background = new Background(this, 0, 0);
        ship = new Ship(this, this.cameras.main.width / 2, this.cameras.main.height / 2);
      }
    });

    watch(uiDataManager.gameScore.score.ref, (newValue) => {
      score.value = newValue;
    });

    return () => (
      <div>
        <div id='score-container'>Score: {score.value}</div>
      </div>
    );
  },
});