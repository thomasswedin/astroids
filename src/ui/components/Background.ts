import Phaser from 'phaser';

export class Background extends Phaser.GameObjects.Sprite {
    private starsLayer1!: Phaser.GameObjects.Group;
    private starsLayer2!: Phaser.GameObjects.Group;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'backround');
        this.scene = scene;

        // Add the ship to the scene
        this.scene.add.existing(this);
        this.create();
        //There is a green square in the background. We need to remove it.
        this.setTint(0x000000);
    }

    protected create() {
        this.starsLayer1 = this.scene.add.group();
        this.starsLayer2 = this.scene.add.group();

        for (let i = 0; i < 100; i++) {
            const star1 = this.scene.add.graphics();
            star1.fillStyle(0xffffff, 0.2);
            star1.fillCircle(0, 0, Math.random() * 1.4 + 1);
            star1.x = Math.random() * 800;
            star1.y = Math.random() * 600;
            this.starsLayer1.add(star1);

            const star2 = this.scene.add.graphics();
            star2.fillStyle(0xffffff, 0.2);
            star2.fillCircle(0, 0, Math.random() * 1.4 + 1);
            star2.x = Math.random() * 800;
            star2.y = Math.random() * 600;
            this.starsLayer2.add(star2);
        }
    }

    public update() {
        this.starsLayer1.children.iterate((star: Phaser.GameObjects.GameObject) => {
          const starGraphics = star as Phaser.GameObjects.Graphics;
          starGraphics.y += 0.5;
          if (starGraphics.y > 600) {
            starGraphics.y = 0;
            starGraphics.x = Math.random() * 800;
          }
    
          return null;
        });
    
        this.starsLayer2.children.iterate((star: Phaser.GameObjects.GameObject) => {
          const starGraphics = star as Phaser.GameObjects.Graphics;
          starGraphics.y += 1;
          if (starGraphics.y > 600) {
            starGraphics.y = 0;
            starGraphics.x = Math.random() * 800;
          }
    
          return null;
        });
      }

}