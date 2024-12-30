import Phaser from 'phaser';

export class Astroid extends Phaser.GameObjects.Sprite {

    private speed: number;
    private _scaleFactor = 10;
    private _id: string;

    constructor(scene: Phaser.Scene, x: number, y: number, id:string) {
        super(scene, x, y, id);
        this._id = id;
        //this.shipVec = new Phaser.GameObjects.Graphics(scene);
        this.scene = scene;
        this.speed = 100;

        this.create();

        // Disable debug rendering for the ship's body
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
        }

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    update(): void {

    }

    protected create() {
        const metroidVec:Phaser.GameObjects.Graphics  = this.drawMetroid();

        const width = 30 * this._scaleFactor;
        const height = 30 * this._scaleFactor;

        // Generate a larger texture to include the entire ship
        metroidVec.generateTexture(this._id, width, height);
        this.setTexture(this._id);
        //this.scene.add.existing(metroidVec);
    }

    protected drawMetroid(): Phaser.GameObjects.Graphics {
        const astroidGraphics = new Phaser.GameObjects.Graphics(this.scene);
        const metroidPoints = this.getAsteroidPoints();

        // Draw the ship
        astroidGraphics.lineStyle(2, 0xffffff);
        astroidGraphics.beginPath();
        astroidGraphics.moveTo(metroidPoints[0].x, metroidPoints[0].y);
        for (let i = 1; i < metroidPoints.length; i++) {
            astroidGraphics.lineTo(metroidPoints[i].x, metroidPoints[i].y);
        }
        astroidGraphics.closePath();
        astroidGraphics.strokePath();

        return astroidGraphics;
    }

    /*protected getMetroidPoints(): { x: number, y: number }[] {
        const offset = 20 * this._scaleFactor;

        return [
            { x: 1, y: 7 },
            { x: 5, y: 5 },
            { x: 7, y: 1 },
            { x: 5, y: -3 },
            { x: 7, y: -7 },
            { x: 3, y: -9 },
            { x: -1, y: -5 },
            { x: -4, y: -2 },
            { x: -8, y: -1 },
            { x: -9, y: 3 },
            { x: -5, y: 5 },
            { x: -1, y: 3 },
            { x: 1, y: 7 }
        ].map(point => ({
            x: point.x * this._scaleFactor + offset,
            y: point.y * this._scaleFactor + offset
        }));
    }*/

    protected getAsteroidPoints(): { x: number, y: number }[] {
        const offset = 20 * this._scaleFactor;
        const numPoints = 12; // Number of points for the asteroid
        const maxRadius = 10; // Maximum radius for the points
    
        const points = [];
    
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radius = maxRadius * (0.5 + Math.random() * 0.5); // Randomize radius between 0.5 and 1 times maxRadius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            points.push({ x, y });
        }
    
        return points.map(point => ({
            x: point.x * this._scaleFactor + offset,
            y: point.y * this._scaleFactor + offset
        }));
    }


    
}
