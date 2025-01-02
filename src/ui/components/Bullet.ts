import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Sprite {
    private speed: number = 500;

    constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setAngle(angle);
        const radianAngle = Phaser.Math.DegToRad(angle - 90);
        const velocityX = Math.cos(radianAngle) * this.speed;
        const velocityY = Math.sin(radianAngle) * this.speed;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
    }

    update(): void {
        if (this.x < 0 || this.x > this.scene.scale.width || this.y < 0 || this.y > this.scene.scale.height) {
            this.destroy();
        }
    }
}