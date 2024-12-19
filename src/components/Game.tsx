import Phaser from 'phaser';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Game',
  setup() {
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

      function create(this: Phaser.Scene) {
        this.add.image(400, 300, 'sky');
      }
    });

    return () => <div id="game-container"></div>;
  },
});