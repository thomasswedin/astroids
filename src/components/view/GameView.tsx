import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { IUIServices, servicesKey } from '../../UIController';
import { UIDataManager } from "../../ui/data/UIDataManager";
import { GameEvents } from "../../ui/events/GameEvents";
import { UIEventManager } from "../../ui/events/UIEventManager";

export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const services: IUIServices = inject(servicesKey) as IUIServices;
    const uiEventManager: UIEventManager = services.eventManager;
    const uiDataManager: UIDataManager = services.dataManager;

    /*function updateScore(event: ScoreEvent): void {
      score.value += event.data.score;
    }*/

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

      /*function createEmptyIHitData(): IHitData {
        return {
          enemy: 0
        };
      }*/

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

    /*if (eventDispatcher) {
      eventDispatcher.addEventListener(ScoreEvent.UPDATED, () => updateScore);
    }*/

    return () => (
      <div>
        <div id="game-container"></div>
        <p>Score: {score.value}</p>
      </div>
    );
  },
});