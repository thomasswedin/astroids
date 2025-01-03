import Phaser from 'phaser';

export class Astroid extends Phaser.GameObjects.Sprite {

    private speed: number;
    private _scaleFactor = 8;
    private _id: string;
    private _angle: number;
    private _widthOfAstroidTexture: number;
    private _heightOfAstroidTexture: number;
    private _debug: boolean = false;
    private _thickness: number;

    constructor(scene: Phaser.Scene, x: number, y: number, id: string) {
        super(scene, x, y, id);
        this._id = id;
        //this.shipVec = new Phaser.GameObjects.Graphics(scene);
        this.scene = scene;
        this.speed = 80;
        this._thickness = 2;
        this._angle = Math.random() * Math.PI * 2;

        this._widthOfAstroidTexture = 32;
        this._heightOfAstroidTexture = 32;
        this._debug ? this.drawTopLeftDot() : null;
        this._debug ? this.drawCenterCross() : null;

        this.create();
        this._debug ? this.drawSurroundedBox() : null;

        // Disable debug rendering for the ship's body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
        }

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enableBody(this, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.body = this.body as Phaser.Physics.Arcade.Body;
    }

    update(): void {
        this.moveAstroid();
        this.wrapAroundScreen();
    }

    protected create() {
        const metroidVec: Phaser.GameObjects.Graphics = this.drawAstroid();
        metroidVec.generateTexture(this._id, this._widthOfAstroidTexture, this._heightOfAstroidTexture);
        this.setTexture(this._id);
        metroidVec.destroy();
    }

    protected drawAstroid(): Phaser.GameObjects.Graphics {
        const astroidGraphics = new Phaser.GameObjects.Graphics(this.scene);
        const metroidPoints = this.getAsteroidPoints();

        // Calculate bounds
        const minX = Math.min(...metroidPoints.map(p => p.x));
        const maxX = Math.max(...metroidPoints.map(p => p.x));
        const minY = Math.min(...metroidPoints.map(p => p.y));
        const maxY = Math.max(...metroidPoints.map(p => p.y));

        this._widthOfAstroidTexture = maxX - minX + this._thickness;
        this._heightOfAstroidTexture = maxY - minY + this._thickness;

        // Draw the ship
        astroidGraphics.lineStyle(this._thickness, 0xffffff);
        astroidGraphics.beginPath();
        astroidGraphics.moveTo(metroidPoints[0].x - minX, metroidPoints[0].y - minY);
        for (let i = 1; i < metroidPoints.length; i++) {
            astroidGraphics.lineTo(metroidPoints[i].x - minX, metroidPoints[i].y - minY);
        }
        astroidGraphics.closePath();
        astroidGraphics.strokePath();

        return astroidGraphics;
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
        centerGraphics.lineStyle(this._thickness, 0xfb6f92);
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
        surroundedBoxGraphic.lineStyle(this._thickness, 0xff00ff);
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

    protected getAsteroidPoints(): { x: number, y: number }[] {
        const numPoints = 12; // Number of points for the asteroid
        const maxRadius = 10; // Maximum radius for the points

        const points = [];

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = maxRadius * (0.5 + Math.random() * 0.5);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push({ x, y });
        }

        return points.map(point => ({
            x: point.x * this._scaleFactor,
            y: point.y * this._scaleFactor
        }));
    }

    protected moveAstroid(): void {
        if (!this.body) return;
        //Move the astroid in a random direction

        const x = Math.cos(this._angle) * this.speed;
        const y = Math.sin(this._angle) * this.speed;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(x, y);
    }

    private wrapAroundScreen(): void {
        // Smooth wrap around the screen considering the width and height of the asteroid
        const bufferX = this.width / 2;
        const bufferY = this.height / 2;

        if (this.x < -bufferX) {
            this.x = this.scene.scale.width + bufferX;
        } else if (this.x > this.scene.scale.width + bufferX) {
            this.x = -bufferX;
        }

        if (this.y < -bufferY) {
            this.y = this.scene.scale.height + bufferY;
        } else if (this.y > this.scene.scale.height + bufferY) {
            this.y = -bufferY;
        }
    }
}
