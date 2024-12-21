import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import type { IUIServices } from '../../UIController';
import { servicesKey } from '../../UIController';
import { UIDataManager } from "../data/UIDataManager";
import { GameEvents } from "../events/GameEvents";
import { UIEventManager } from "../events/UIEventManager";

export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.eventManager;
    const uiDataManager: UIDataManager = services.dataManager;

    onMounted(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
          preload: preload,
          create: create,
        },
      };

      new Phaser.Game(config);

      function preload(this: Phaser.Scene) {
        //this.load.image('sky', 'path/to/sky.png');
      }

      function create(this: Phaser.Scene) {
        this.add.image(400, 300, 'sky');
        this.input.on('pointerdown', () => {
          uiEventManager.dispatchEvent(GameEvents.HitEvent, { enemy: 10 });
        });
      }
    });

    watch(uiDataManager.gameScore.score.ref, (newValue) => {
      score.value = newValue;
    });

    return () => (
      <div>
        <div id="game-container"></div>
        <p>Score: {score.value}</p>
      </div>
    );
  },
});