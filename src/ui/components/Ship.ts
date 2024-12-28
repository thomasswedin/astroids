import Phaser from 'phaser';

export class Ship extends Phaser.GameObjects.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private speed: number;
    // I would like to add a method to move the ship
    private acceleration: number = 10;
    private maxSpeed: number = 300;
    private shipVec: Phaser.GameObjects.Graphics;
    private shipTextureKey: string = "shipTexture";
    private afterburner: Phaser.GameObjects.Graphics;
    private afterburnerTextureKey: string = "afterburnerTexture";

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        this.shipVec = new Phaser.GameObjects.Graphics(scene);
        this.afterburner = new Phaser.GameObjects.Graphics(scene);
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
    }

    update(): void {
        this.moveShip();
        this.wrapAroundScreen();    
    }

    protected create() {
        this.shipVec = this.drawShip();
        this.afterburner = this.drawAfterburner();
    
        // Generate a larger texture to include the entire ship
        this.shipVec.generateTexture(this.shipTextureKey, 40, 40);
        this.setTexture(this.shipTextureKey);

        this.afterburner.generateTexture(this.afterburnerTextureKey, 40, 40);
        
    
        // Add the ship to the scene
        //this.scene.add.existing(this.shipVec);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    protected drawShip(): Phaser.GameObjects.Graphics {
        const shipGraphics = new Phaser.GameObjects.Graphics(this.scene);
        shipGraphics.x = this.scene.cameras.main.width / 2;
        shipGraphics.y = this.scene.cameras.main.height / 2;
    
        // Define the points of the ship
        const shipPoints = [
            { x: 0, y: -20 },
            { x: 10, y: 10 },
            { x: 0, y: 5 },
            { x: -10, y: 10 },
            { x: 0, y: -20 }
        ];
    
        // Draw the ship
        shipGraphics.lineStyle(2, 0xffffff);
        shipGraphics.beginPath();
        shipGraphics.moveTo(shipPoints[0].x + 20, shipPoints[0].y + 20); // Offset points
        for (let i = 1; i < shipPoints.length; i++) {
            shipGraphics.lineTo(shipPoints[i].x + 20, shipPoints[i].y + 20); // Offset points
        }
        shipGraphics.closePath();
        shipGraphics.strokePath();
    
        // Add a dot to the ship's center to make it easier to see the ship's position
        shipGraphics.fillStyle(0xffffff);
        shipGraphics.fillCircle(20, 20, 2); // Offset center

        return shipGraphics;
    }

    protected drawAfterburner(): Phaser.GameObjects.Graphics {
        const afterburner = new Phaser.GameObjects.Graphics(this.scene);
        afterburner.x = this.shipVec.x;
        afterburner.y = this.shipVec.y;
    
        // Define the points of the afterburner
        const afterburnerPoints = [
            { x: 0, y: 10 },
            { x: 5, y: 15 },
            { x: 0, y: 20 },
            { x: -5, y: 15 },
            { x: 0, y: 10 }
        ];
    
        // Draw the afterburner
        afterburner.lineStyle(2, 0x666666);
        afterburner.beginPath();
        afterburner.moveTo(afterburnerPoints[0].x + 20, afterburnerPoints[0].y + 20); // Offset points
        for (let i = 1; i < afterburnerPoints.length; i++) {
            afterburner.lineTo(afterburnerPoints[i].x + 20, afterburnerPoints[i].y + 20); // Offset points
        }
        afterburner.closePath();
        afterburner.strokePath();
    
        return afterburner;
    }

    protected addAfterburner(): void {
        this.afterburner.x = this.x - this.width / 2;
        this.afterburner.y = this.y - this.height / 2;
        this.scene.add.existing(this.afterburner);
    }
    
    protected removeAfterburner(): void {
        this.scene.children.remove(this.afterburner);
    }

    protected moveShip(): void {
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;

            if (this.cursors.up?.isDown) {
                this.addAfterburner();
                const currentVelocity = new Phaser.Math.Vector2(body.velocity.x, body.velocity.y);
                const angleInRadians = Phaser.Math.DegToRad(this.angle - 90);
                const accelerationVector = new Phaser.Math.Vector2(
                    Math.cos(angleInRadians) * this.acceleration,
                    Math.sin(angleInRadians) * this.acceleration
                );

                currentVelocity.add(accelerationVector);
                if (currentVelocity.length() > this.maxSpeed) {
                    currentVelocity.setLength(this.maxSpeed);
                }

                body.setVelocity(currentVelocity.x, currentVelocity.y);
            } else {
                this.removeAfterburner();
                body.setVelocity(body.velocity.x * 0.99, body.velocity.y * 0.99); // Apply some drag when not accelerating
            }

            if (this.cursors.left?.isDown) {
                this.angle -= 5; // Continue rotating counterclockwise
            } else if (this.cursors.right?.isDown) {
                this.angle += 5; // Continue rotating clockwise
            }
        }
    }

    private wrapAroundScreen(): void {
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;
            const screenWidth = this.scene.scale.width;
            const screenHeight = this.scene.scale.height;

            if (body.x < 0 - body.height) {
                body.x = screenWidth;
            } else if (body.x > screenWidth + body.height) {
                body.x = 0;
                body.x -= body.height;
            }

            if (body.y < 0 - body.height) {
                body.y = screenHeight;
            } else if (body.y > screenHeight + body.height) {
                body.y = 0;
                body.y -= body.height;
            }

            /*if (body.y < 0) {
                body.y = screenHeight;
                body.y -= this.height; // Adjust position to account for ship's height
            } else if (body.y > screenHeight) {
                body.y = 0;
                body.y += this.height; // Adjust position to account for ship's height
            }*/
        }
    }
}