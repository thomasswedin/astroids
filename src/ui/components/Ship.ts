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
    private lastShotTime: number | undefined;
    private _hyperModeActive: boolean = false;

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

    }

    update(): void {
        this.moveShip();
        this.wrapAroundScreen();
        this.shootingCheck();
        this._hyperModeCheck();
        this.gamepadButtonControlConsoleLog();
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

        const gamepad = this.scene.input.gamepad && this.scene.input.gamepad.total ? this.scene.input.gamepad.getPad(0) : undefined;

        const upPressed = this.cursors.up?.isDown || gamepad?.buttons[7].pressed;
        const leftPressed = this.cursors.left?.isDown || gamepad?.buttons[14].pressed;
        const rightPressed = this.cursors.right?.isDown || gamepad?.buttons[15].pressed;

        if (upPressed) {
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

        if (leftPressed) {
            this.angle -= 2;
        } else if (rightPressed) {
            this.angle += 2;
        }

        // Gamepad left stick for movement
        if (gamepad) {
            const leftStickX = gamepad.axes[0];

            if (Math.abs(leftStickX.value) > 0.1) {
                this.angle += leftStickX.value * 2; // Adjust rotation speed as needed
            }
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
        if (!this.scene) {
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

        const gamepad = this.scene.input.gamepad && this.scene.input.gamepad.total ? this.scene.input.gamepad.getPad(0) : undefined;
        if (gamepad) {
            const shootButtonPressed = gamepad.buttons[0].pressed;

            if (shootButtonPressed) {
                const currentTime = this.scene.time.now;
                if (this.lastShotTime === undefined || currentTime - this.lastShotTime > 700) {
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

    private _hyperModeCheck(): void {
        if (!this.scene || !this.scene.input.keyboard) return;

        const hyperModeKey = this.scene.input.keyboard.addKey('H');
        if (Phaser.Input.Keyboard.JustDown(hyperModeKey)) {
            // Randomize the ship's position
            const margin = 50;
            this.x = Math.random() * (this.scene.scale.width - 2 * margin) + margin;
            this.y = Math.random() * (this.scene.scale.height - 2 * margin) + margin;
            this.updateTexture();
        }

        const gamepad = this.scene.input.gamepad && this.scene.input.gamepad.total ? this.scene.input.gamepad.getPad(0) : undefined;
        if (gamepad) {
            const hyperModeButtonPressed = gamepad.buttons[2].pressed;
            if (hyperModeButtonPressed && !this._hyperModeActive) {
            this._hyperModeActive = true;
            // Randomize the ship's position
            const margin = 50;
            this.x = Math.random() * (this.scene.scale.width - 2 * margin) + margin;
            this.y = Math.random() * (this.scene.scale.height - 2 * margin) + margin;
            this.updateTexture();
            } else if (!hyperModeButtonPressed) {
            this._hyperModeActive = false;
            }
        }
    }

    private gamepadButtonControlConsoleLog(): void {
        if (!this.scene) return;

        const gamepad = this.scene.input.gamepad && this.scene.input.gamepad.total ? this.scene.input.gamepad.getPad(0) : undefined;
        if (gamepad) {
            const buttonPressed = gamepad.buttons.find(button => button.pressed);
            if (buttonPressed) {
                console.log(`Button ${buttonPressed.index} pressed`);
            }
        }
    }
}