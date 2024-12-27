import Phaser from 'phaser';

export class Ship extends Phaser.GameObjects.Sprite {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private speed: number;
    // I would like to add a method to move the ship
    private acceleration: number = 10;
    private maxSpeed: number = 300;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship');
        this.scene = scene;
        this.speed = 100;
        
        this.create();
        
        // Disable debug rendering for the ship's body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(true);
        }

        // Set up keyboard input
        if (this.scene.input && this.scene.input.keyboard && this.scene.input.keyboard.createCursorKeys) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
        }
    }

    update(): void {
        this.moveShip();    
    }

    protected create() {
        const shipVec = new Phaser.GameObjects.Graphics(this.scene);
        // Set shipVec x and y to the center of the screen
        shipVec.x = this.scene.cameras.main.width / 2;
        shipVec.y = this.scene.cameras.main.height / 2;
    
        // Define the points of the ship
        const shipPoints = [
            { x: 0, y: -20 },
            { x: 10, y: 10 },
            { x: 0, y: 5 },
            { x: -10, y: 10 },
            { x: 0, y: -20 }
        ];
    
        // Draw the ship
        shipVec.lineStyle(2, 0xffffff);
        shipVec.beginPath();
        shipVec.moveTo(shipPoints[0].x + 20, shipPoints[0].y + 20); // Offset points
        for (let i = 1; i < shipPoints.length; i++) {
            shipVec.lineTo(shipPoints[i].x + 20, shipPoints[i].y + 20); // Offset points
        }
        shipVec.closePath();
        shipVec.strokePath();
    
        // Add a dot to the ship's center to make it easier to see the ship's position
        shipVec.fillStyle(0xffffff);
        shipVec.fillCircle(20, 20, 2); // Offset center
    
        // Generate a larger texture to include the entire ship
        const shipTextureKey = 'shipTexture';
        shipVec.generateTexture(shipTextureKey, 40, 40); // Increased size
        this.setTexture(shipTextureKey);
    
        // Add the ship to the scene
        this.scene.add.existing(shipVec);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    public moveShip(): void {
        if (this.body) {
            const body = this.body as Phaser.Physics.Arcade.Body;

            if (this.cursors.up?.isDown) {
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
                body.setVelocity(body.velocity.x * 0.99, body.velocity.y * 0.99); // Apply some drag when not accelerating
            }

            if (this.cursors.left?.isDown) {
                this.angle -= 5; // Continue rotating counterclockwise
            } else if (this.cursors.right?.isDown) {
                this.angle += 5; // Continue rotating clockwise
            }
        }
    }
}