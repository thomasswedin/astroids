//create a class that extends Phaser.GameObjects.Sprite
// this class will represent the explosion effect when the ship collides with an astroid
// the explosion effect will be a sprite sheet animation
// the explosion effect will be created when the ship collides with an astroid
import Phaser from 'phaser';

export class AstroidsExplosion extends Phaser.GameObjects.Sprite {

    private _scaleFactor = 1.5;
    private _debug: boolean = false;
    private _angle: number;
    private _asteroidPoints: { x: number, y: number }[] = [];

    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, id: string = 'explosion', _asteroidPoints) {
        super(scene, x, y, id);
        this.scene = scene;
        this._angle = angle;
        new Phaser.GameObjects.Container(this.scene);
        this._asteroidPoints = _asteroidPoints;


        this._debug ? this.drawSurroundedBox() : null;
        this.drawShipPices();
    }

    protected drawShipPices(): Phaser.GameObjects.Container {
        let _shipVecContainer: Phaser.GameObjects.Container = new Phaser.GameObjects.Container(this.scene);

        
        // Draw ship pieces
        for (let i = 1; i < this._asteroidPoints.length; i++) {
            const shipGraphics = new Phaser.GameObjects.Graphics(this.scene);
            shipGraphics.lineStyle(2, 0xffffff);
            shipGraphics.beginPath();
            shipGraphics.moveTo(this._asteroidPoints[i - 1].x, this._asteroidPoints[i - 1].y);
            shipGraphics.lineTo(this._asteroidPoints[i].x, this._asteroidPoints[i].y);
            shipGraphics.closePath();
            shipGraphics.strokePath();
            shipGraphics.setPosition(this.x, this.y);
            shipGraphics.setAngle(this._angle);
            this.scene.add.existing(shipGraphics);
            this.scene.physics.add.existing(shipGraphics);
            this.scene.physics.world.enable(shipGraphics);

            // Animate the graphics in random directions
            this.scene.tweens.add({
                targets: shipGraphics,
                x: this.x + Phaser.Math.Between(-100, 100),
                y: this.y + Phaser.Math.Between(-100, 100),
                alpha: 0, // Fade out
                duration: Phaser.Math.Between(700, 2000),
                ease: 'Power2',
                onComplete: () => {
                    shipGraphics.destroy(); // Optional: destroy the graphics after animation
                }
            });
        }

        return _shipVecContainer;
    }

    protected drawSurroundedBox(): void {
        const boxWidth = this.width;
        const boxHeight = this.height;
        const surroundedBoxGraphic = new Phaser.GameObjects.Graphics(this.scene);
        surroundedBoxGraphic.lineStyle(1, 0xff00ff);
        surroundedBoxGraphic.beginPath();
        surroundedBoxGraphic.moveTo(0, 0);
        surroundedBoxGraphic.lineTo(boxWidth, 0);
        surroundedBoxGraphic.lineTo(boxWidth, boxHeight);
        surroundedBoxGraphic.lineTo(0, boxHeight);
        surroundedBoxGraphic.closePath();
        surroundedBoxGraphic.strokePath();

        surroundedBoxGraphic.setPosition(this.x - boxWidth / 2, this.y - boxHeight / 2); // Center the box around the ship
        this.scene.add.existing(surroundedBoxGraphic);
    }
}
