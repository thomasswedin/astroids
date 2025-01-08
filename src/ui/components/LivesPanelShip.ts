import Phaser from 'phaser';

export class LivesPanelShip extends Phaser.GameObjects.Sprite {
    protected _scaleFactor: number = 0.8;
    protected shipTextureKey: string = "livesPanelShipTexture";
    private _widthOfShipTexture: number;
    private _heightOfShipTexture: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        this._widthOfShipTexture = 32;
        this._heightOfShipTexture = 32;
        this.create();
        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setCollideWorldBounds(false);
        }
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
}