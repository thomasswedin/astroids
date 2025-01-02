import Phaser from 'phaser';
import { Bullet } from './Bullet';

export class Ship extends Phaser.GameObjects.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    // I would like to add a method to move the ship
    private acceleration: number = 10;
    private maxSpeed: number = 300;
    //private shipVec: Phaser.GameObjects.Graphics;
    private shipTextureKey: string = "shipTexture";
    private _afterburnerActive: boolean = false;
    private _scaleFactor = 1.5;
    private _widthOfShipTexture: number;
    private _heightOfShipTexture: number;
    private _debug: boolean = false;
    private bullets: Phaser.GameObjects.Group;
    private lastShotTime: number | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        //this.shipVec = new Phaser.GameObjects.Graphics(scene);
        this.scene = scene;
        this._widthOfShipTexture = 32;
        this._heightOfShipTexture = 32;
        this._debug ? this.drawTopLeftDot() : null;
        this._debug ? this.drawCenterCross() : null;
        this.create();
        this._debug ? this.drawSurroundedBox() : null;

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
        this.bullets = this.scene.add.group({
            classType: Bullet,
            runChildUpdate: true
        });
    }

    update(): void {
        this.moveShip();
        this.wrapAroundScreen();
        this.shootingCheck();
    }

    protected create() {
        const shipVec: Phaser.GameObjects.Graphics = this.drawShip();
        shipVec.generateTexture(this.shipTextureKey, this._widthOfShipTexture, this._heightOfShipTexture);
        this.setTexture(this.shipTextureKey);
    }

    protected drawShip(): Phaser.GameObjects.Graphics {
        const shipGraphics = new Phaser.GameObjects.Graphics(this.scene);

        const shipPoints = [
            { x: 0, y: -20 },
            { x: 10, y: 10 },
            { x: 5, y: 3 },
            { x: -5, y: 3 },
            { x: -10, y: 10 },
            { x: 0, y: -20 }
        ].map(point => ({
            x: point.x * this._scaleFactor,
            y: point.y * this._scaleFactor
        }));

        // Calculate bounds
        const minX = Math.min(...shipPoints.map(p => p.x));
        const maxX = Math.max(...shipPoints.map(p => p.x));
        const minY = Math.min(...shipPoints.map(p => p.y));
        const maxY = Math.max(...shipPoints.map(p => p.y));

        this._widthOfShipTexture = maxX - minX;
        this._heightOfShipTexture = maxY - minY;

        //Calculate the Modulo of minX and maxX
        const moduloX = Math.abs((Math.abs(maxX) + minX)) / 2;
        const moduloY = Math.abs((Math.abs(maxY) + minY)) / 2;


        // Calculate the offset to center the ship
        const offsetX = this._widthOfShipTexture / 2 + moduloX;
        const offsetY = this._heightOfShipTexture / 2 + moduloY;

        // Draw the ship
        shipGraphics.lineStyle(2, 0xffffff);
        shipGraphics.beginPath();
        shipGraphics.moveTo(shipPoints[0].x + offsetX, shipPoints[0].y + offsetY);
        for (let i = 1; i < shipPoints.length; i++) {
            shipGraphics.lineTo(shipPoints[i].x + offsetX, shipPoints[i].y + offsetY);
        }
        shipGraphics.closePath();
        shipGraphics.strokePath();

        return shipGraphics;
    }

    protected drawAfterburner(shipVec: Phaser.GameObjects.Graphics): void {
        const afterburnerPoints = [
            { x: -5, y: 8 },
            { x: 0, y: 15 },
            { x: 5, y: 8 }
        ].map(point => ({
            x: point.x * this._scaleFactor,
            y: point.y * this._scaleFactor
        }));

        // Calculate the offset to center the ship
        const offsetX = this._widthOfShipTexture / 2;
        const offsetY = this._heightOfShipTexture / 2;

        // Draw the afterburner
        shipVec.lineStyle(1.5, 0xFFFFFF);
        shipVec.beginPath();
        shipVec.moveTo(afterburnerPoints[0].x + offsetX, afterburnerPoints[0].y + offsetY);
        for (let i = 1; i < afterburnerPoints.length; i++) {
            shipVec.lineTo(afterburnerPoints[i].x + offsetX, afterburnerPoints[i].y + offsetY);
        }
        shipVec.closePath();
        shipVec.strokePath();
    }

    protected drawTopLeftDot(): void {
        const topLeftGraphics = new Phaser.GameObjects.Graphics(this.scene);
        topLeftGraphics.fillStyle(0xffffff);
        topLeftGraphics.fillCircle(0, 0, 1);
        topLeftGraphics.setPosition(this.x, this.y);
        this.scene.add.existing(topLeftGraphics);
        //set layer
        topLeftGraphics.setDepth(1001);
    }


    protected drawCenterCross(): void {
        const centerGraphics = new Phaser.GameObjects.Graphics(this.scene);
        centerGraphics.lineStyle(2, 0xfb6f92);
        centerGraphics.beginPath();
        centerGraphics.moveTo(18 * this._scaleFactor, 20 * this._scaleFactor); // Horizontal line start
        centerGraphics.lineTo(22 * this._scaleFactor, 20 * this._scaleFactor); // Horizontal line end
        centerGraphics.moveTo(20 * this._scaleFactor, 18 * this._scaleFactor); // Vertical line start
        centerGraphics.lineTo(20 * this._scaleFactor, 22 * this._scaleFactor); // Vertical line end
        centerGraphics.strokePath();
        centerGraphics.setPosition(this.x - 20 * this._scaleFactor, this.y - 20 * this._scaleFactor); // Position it at the same coordinates as the ship
        this.scene.add.existing(centerGraphics);
        centerGraphics.setDepth(1000);
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

    protected updateTexture(): void {
        const shipVec = this.drawShip();
        if (this._afterburnerActive) {
            this.drawAfterburner(shipVec);
        }
        this.scene.textures.remove(this.shipTextureKey); // Clear the existing texture
        shipVec.generateTexture(this.shipTextureKey, this._widthOfShipTexture, this._heightOfShipTexture);
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

    private shootingCheck(): void {
        if (this.scene.input.keyboard) {
            const spaceKey = this.scene.input.keyboard.addKey('SPACE');

            if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                this.shoot();
                this.lastShotTime = this.scene.time.now;
            }

            if (spaceKey.isDown) {
                const currentTime = this.scene.time.now;
                if (this.lastShotTime !== undefined && currentTime - this.lastShotTime > 700) {
                    this.shoot();
                    this.scene.time.addEvent({
                        delay: 100,
                        callback: this.shoot,
                        callbackScope: this,
                        repeat: 1
                    });
                    this.lastShotTime = currentTime;
                }
            }
        }
    }

    private shoot(): void {
        const bullet = new Bullet(this.scene, this.x, this.y, this.angle);
        this.bullets.add(bullet);
    }
}