import Phaser from 'phaser';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  name: 'Background',
  setup() {
    onMounted(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
      };

      new Phaser.Game(config);

      let starsLayer1: Phaser.GameObjects.Group;
      let starsLayer2: Phaser.GameObjects.Group;

      function preload(this: Phaser.Scene) {
        // No assets to preload
      }

      function create(this: Phaser.Scene) {
        starsLayer1 = this.add.group();
        starsLayer2 = this.add.group();

        for (let i = 0; i < 100; i++) {
          const star1 = this.add.graphics();
          star1.fillStyle(0xffffff, 0.2);
          star1.fillCircle(0, 0, Math.random() * 1.4 + 1);
          star1.x = Math.random() * 800;
          star1.y = Math.random() * 600;
          starsLayer1.add(star1);

          const star2 = this.add.graphics();
          star2.fillStyle(0xffffff, 0.2);
          star2.fillCircle(0, 0, Math.random() * 1.4 + 1);
          star2.x = Math.random() * 800;
          star2.y = Math.random() * 600;
          starsLayer2.add(star2);
        }
      }

      function update(this: Phaser.Scene) {
        /* starsLayer1.children.iterate((star: Phaser.GameObjects.GameObject) => {
          const starGraphics = star as Phaser.GameObjects.Graphics;
          starGraphics.y += 0.5;
          if (starGraphics.y > 600) {
            starGraphics.y = 0;
            starGraphics.x = Math.random() * 800;
          }

          return null;
        });

        starsLayer2.children.iterate((star: Phaser.GameObjects.GameObject) => {
          const starGraphics = star as Phaser.GameObjects.Graphics;
          starGraphics.y += 1;
          if (starGraphics.y > 600) {
            starGraphics.y = 0;
            starGraphics.x = Math.random() * 800;
          }

          return null;
        }); */
      }
    });

    return () => <div id="background-container"></div>;
  },
});