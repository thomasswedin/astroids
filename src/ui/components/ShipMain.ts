import Phaser from 'phaser';

export class ShipMain extends Phaser.GameObjects.Sprite {
    protected shipTextureKey: string = "shipTexture";
    protected _widthOfShipTexture: number;
    protected _heightOfShipTexture: number;
    protected _debug: boolean = false;
    protected _scaleFactor: number = 1.5;


    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this._widthOfShipTexture = 32;
        this._heightOfShipTexture = 32;
        this._debug ? this.drawTopLeftDot() : null;
        this._debug ? this.drawCenterCross() : null;
        this.create();
        this._debug ? this.drawSurroundedBox() : null;
    }

    update(): void {
        // This method should be overridden in the child class
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
}