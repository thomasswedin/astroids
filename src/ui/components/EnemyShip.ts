import Phaser from 'phaser';
//Create a EnemyShip class. This class will be used to create enemy ships that will attack the player's ship.
export class EnemyShip extends Phaser.GameObjects.Sprite {
    private target: Phaser.GameObjects.Sprite;
    private _widthOfShipTexture: number;
    private _heightOfShipTexture: number;
    private enemyShipTextureKey: string = "enemyShipTextureKey";
    private _scaleFactor = 1.5;

    constructor(scene: Phaser.Scene, x: number, y: number, target: Phaser.GameObjects.Sprite) {
        super(scene, x, y, "enemy_ship");

        this.scene = scene;
        this.target = target;

        this._widthOfShipTexture = 32;
        this._heightOfShipTexture = 32;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.moveToObject(this, this.target, 100);
    }

    protected create() {
        const shipVec: Phaser.GameObjects.Graphics = this.drawShip();
        shipVec.generateTexture(this.enemyShipTextureKey, this._widthOfShipTexture, this._heightOfShipTexture);
        this.setTexture(this.enemyShipTextureKey);
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

    /*public update(): void {
      if (this.x < 0) {
        this.x = this.scene.cameras.main.width;
      } else if (this.x > this.scene.cameras.main.width) {
        this.x = 0;
      }
  
      if (this.y < 0) {
        this.y = this.scene.cameras.main.height;
      } else if (this.y > this.scene.cameras.main.height) {
        this.y = 0;
      }
    }*/
}