import Phaser from 'phaser';
import { ShipMain } from './ShipMain';

import { Bullet } from './Bullet';

export class Ship extends ShipMain {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    // I would like to add a method to move the ship
    private acceleration: number = 10;
    private maxSpeed: number = 300;
    private _afterburnerActive: boolean = false;
    private _scaleFactor: number = 1.5;
    
    private lastShotTime: number | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        
        // Set up keyboard input
        if (this.scene.input && this.scene.input.keyboard && this.scene.input.keyboard.createCursorKeys) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }

        // Disable debug rendering for the ship's body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
        }
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        
    }

    update(): void {
        this.moveShip();
        this.wrapAroundScreen();
        this.shootingCheck();
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
        if(!this.scene){
            return;
        }

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
        const angleInRadians = Phaser.Math.DegToRad(this.angle - 90);
        const bulletX = this.x + Math.cos(angleInRadians) * this._heightOfShipTexture / 2;
        const bulletY = this.y + Math.sin(angleInRadians) * this._heightOfShipTexture / 2;
        const bullet = new Bullet(this.scene, bulletX, bulletY, this.angle);
        this.scene.events.emit('shoot', bullet);
    }
}