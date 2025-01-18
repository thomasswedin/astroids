import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Sprite {
    private speed: number = 500;
    private _scaleFactor: number | undefined;
    private _thickness: number | undefined;
    private _movementDistance: number = 0;
    private _type!: String;

    //Create two types of bullets, one for the player and one for the enemy
    //types should be two static strings, 'player' and 'enemy'
    static PLAYER = 'player';
    static ENEMY = 'enemy';

    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, type:String) {
        //Check if the bullet is being created in the correct scene
        if (!scene) {
            return;
        }
        super(scene, x, y, 'bullet');
        this.scene = scene;
        this._scaleFactor = 1;
        this._thickness = 2;
        this._movementDistance = 0;
        this._type = type;

        this.drawBullet();

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);

        this.setAngle(angle);
        const radianAngle = Phaser.Math.DegToRad(angle);
        const velocityX = Math.cos(radianAngle) * this.speed;
        const velocityY = Math.sin(radianAngle) * this.speed;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(velocityX, velocityY);
    }

    //Create getter for the type of bullet
    get bulletType() {
        return this._type;
    }

    update(): void {
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.wrapAroundScreen();
        }

        this._movementDistance++;

        if (this._movementDistance > 100) {
            this.destroy();
        }
    }

    protected drawBullet(): void {
        const bulletGraphics = new Phaser.GameObjects.Graphics(this.scene);
        bulletGraphics.fillStyle(0xffffff);
        const radius = (this._thickness ?? 1) * (this._scaleFactor ?? 1);
        bulletGraphics.fillCircle(radius, radius, radius);
        bulletGraphics.generateTexture('bullet', radius * 2, radius * 2);
        bulletGraphics.destroy();
        this.setTexture('bullet');
        this.setScale(this._scaleFactor ?? 1);
    }

    private wrapAroundScreen(): void {
        if (this.x < 0) {
            this.x = this.scene.scale.width;
        } else if (this.x > this.scene.scale.width) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = this.scene.scale.height;
        } else if (this.y > this.scene.scale.height) {
            this.y = 0;
        }
    }
}