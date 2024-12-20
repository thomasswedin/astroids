import Phaser from 'phaser';
import { defineComponent, inject, onMounted, ref } from 'vue';
import type { IEventDispatcher } from '../../common/event/IEventDispatcher';
import type { IScoreData } from '../data/IScoreData';
import { ScoreEvent } from '../event/ScoreEvent';

export default defineComponent({
  name: 'GameView',
  setup() {
    const score = ref(0);
    const eventDispatcher = inject<IEventDispatcher>('eventDispatcher');

    function updateScore(event: ScoreEvent) :void{
      score.value += event.data.score;
    }

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
        this.load.image('sky', 'path/to/sky.png');
      }

      function createEmptyIScoreData(): IScoreData {
        return {
            score: 0
        };
    }

      function create(this: Phaser.Scene) {
        this.add.image(400, 300, 'sky');
        this.input.on('pointerdown', () => {
          if (eventDispatcher) {
            let scoreData = createEmptyIScoreData();
            scoreData.score = 10;
            eventDispatcher.dispatchEvent(new ScoreEvent(ScoreEvent.UPDATED, scoreData));
          }
        });
      }
    });

    if (eventDispatcher) {
      eventDispatcher.addEventListener(ScoreEvent.UPDATED, updateScore);
    }

    return () => (
      <div>
        <div id="game-container"></div>
        <p>Score: {score.value}</p>
      </div>
    );
  },
});