import Phaser from 'phaser';

export class Ship extends Phaser.GameObjects.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private speed: number;
    // I would like to add a method to move the ship
    private acceleration: number = 10;
    private maxSpeed: number = 300;
    //private shipVec: Phaser.GameObjects.Graphics;
    private shipTextureKey: string = "shipTexture";
    private _afterburnerActive: boolean = false;
    private _scaleFactor = 1.5;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        //this.shipVec = new Phaser.GameObjects.Graphics(scene);
        this.scene = scene;
        this.speed = 100;

        this.create();

        // Disable debug rendering for the ship's body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
        }

        // Set up keyboard input
        if (this.scene.input && this.scene.input.keyboard && this.scene.input.keyboard.createCursorKeys) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    update(): void {
        this.moveShip();
        this.wrapAroundScreen();
    }

    protected create() {
        const shipVec = this.drawShip();

        // Generate a larger texture to include the entire ship
        shipVec.generateTexture(this.shipTextureKey, (40 * this._scaleFactor), (40 * this._scaleFactor));
        this.setTexture(this.shipTextureKey);
    }

    protected drawShip(): Phaser.GameObjects.Graphics {
        const shipGraphics = new Phaser.GameObjects.Graphics(this.scene);
        const offset = 20 * this._scaleFactor;

        const shipPoints = [
            { x: 0, y: -20 },
            { x: 10, y: 10 },
            { x: 8.5, y: 6 },
            { x: -8.5, y: 6 },
            { x: -10, y: 10 },
            { x: 0, y: -20 }
        ].map(point => ({
            x: point.x * this._scaleFactor + offset,
            y: point.y * this._scaleFactor + offset
        }));

        // Draw the ship
        shipGraphics.lineStyle(2, 0xffffff);
        shipGraphics.beginPath();
        shipGraphics.moveTo(shipPoints[0].x, shipPoints[0].y);
        for (let i = 1; i < shipPoints.length; i++) {
            shipGraphics.lineTo(shipPoints[i].x, shipPoints[i].y);
        }
        shipGraphics.closePath();
        shipGraphics.strokePath();

        return shipGraphics;
    }

    protected drawAfterburner(shipVec: Phaser.GameObjects.Graphics): void {
        const afterburnerPoints = [
            { x: -6, y: 6 },
            { x: 0, y: 14 },
            { x: 6, y: 6 }
        ].map(point => ({
            x: point.x * this._scaleFactor + 20 * this._scaleFactor,
            y: point.y * this._scaleFactor + 20 * this._scaleFactor
        }));

        // Draw the afterburner
        shipVec.lineStyle(1.5, 0xFFFFFF);
        shipVec.beginPath();
        shipVec.moveTo(afterburnerPoints[0].x, afterburnerPoints[0].y);
        for (let i = 1; i < afterburnerPoints.length; i++) {
            shipVec.lineTo(afterburnerPoints[i].x, afterburnerPoints[i].y);
        }
        shipVec.closePath();
        shipVec.strokePath();
    }

    protected updateTexture(): void {
        const shipVec = this.drawShip();
        if (this._afterburnerActive) {
            this.drawAfterburner(shipVec);
        }
        this.scene.textures.remove(this.shipTextureKey); // Clear the existing texture
        shipVec.generateTexture(this.shipTextureKey, (40 * this._scaleFactor), (40 * this._scaleFactor));
        this.setTexture(this.shipTextureKey);

        shipVec.destroy();
    }

    protected moveShip(): void {
        if (!this.body) return;

        const body = this.body as Phaser.Physics.Arcade.Body;
        const currentVelocity = new Phaser.Math.Vector2(body.velocity.x, body.velocity.y);

        if (this.cursors.up?.isDown) {
            const angleInRadians = Phaser.Math.DegToRad(this.angle - 90);
            const accelerationVector = new Phaser.Math.Vector2(
                Math.cos(angleInRadians) * this.acceleration,
                Math.sin(angleInRadians) * this.acceleration
            );

            currentVelocity.add(accelerationVector).limit(this.maxSpeed);
            body.setVelocity(currentVelocity.x, currentVelocity.y);

            if (!this._afterburnerActive) {
                this._afterburnerActive = true;
                this.updateTexture();
            }
        } else {
            body.setVelocity(currentVelocity.scale(0.99).x, currentVelocity.scale(0.99).y);

            if (this._afterburnerActive) {
                this._afterburnerActive = false;
                this.updateTexture();
            }
        }

        if (this.cursors.left?.isDown) {
            this.angle -= 2;
        } else if (this.cursors.right?.isDown) {
            this.angle += 2;
        }
    }

    private wrapAroundScreen(): void {
        if (!this.body) return;

        const body = this.body as Phaser.Physics.Arcade.Body;
        const screenWidth = this.scene.scale.width;
        const screenHeight = this.scene.scale.height;

        if (body.x < -body.height) {
            body.x = screenWidth;
        } else if (body.x > screenWidth + body.height) {
            body.x = -body.height;
        }

        if (body.y < -body.height) {
            body.y = screenHeight;
        } else if (body.y > screenHeight + body.height) {
            body.y = -body.height;
        }
    }
}