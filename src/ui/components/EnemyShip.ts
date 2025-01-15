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
    this.create();
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

    /*{ x: -10, y: -15 },
      { x: -10, y: -20 },
      { x: 10, y: -20 }*/

    const saucerPoints = [
      { x: -15, y: 0 },
    { x: -10, y: -3 },
    { x: -5, y: -5 },
    { x: -3, y: -7 },
    { x: 3, y: -7 },
    { x: 5, y: -5 },
    { x: 10, y: -3 },
    { x: 15, y: 0 },
    { x: 10, y: 3 },
    { x: 5, y: 5 },
    { x: -5, y: 5 },
    { x: -10, y: 3 },
    { x: -15, y: 0 }
    ].map(point => ({
      x: point.x * this._scaleFactor,
      y: point.y * this._scaleFactor
    }));

    const middleLine = [
      { x: -15, y: 0 },
      { x: 15, y: 0 }
    ].map(point => ({
      x: point.x * this._scaleFactor,
      y: point.y * this._scaleFactor
    }));

    const topLine = [
      { x: -10, y: -3 },
      { x: 10, y: -3 }
    ].map(point => ({
      x: point.x * this._scaleFactor,
      y: point.y * this._scaleFactor
    }));

    const shipPoints = [...saucerPoints, ...middleLine, ...topLine];

    // Calculate bounds
    const minX = Math.min(...shipPoints.map(p => p.x));
    const maxX = Math.max(...shipPoints.map(p => p.x));
    const minY = Math.min(...shipPoints.map(p => p.y))-1;
    const maxY = Math.max(...shipPoints.map(p => p.y))+1;

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
    // Draw saucer points
    shipGraphics.moveTo(saucerPoints[0].x + offsetX, saucerPoints[0].y + offsetY);
    for (let i = 1; i < saucerPoints.length; i++) {
      shipGraphics.lineTo(saucerPoints[i].x + offsetX, saucerPoints[i].y + offsetY);
    }

    // Draw middle line
    shipGraphics.moveTo(middleLine[0].x + offsetX, middleLine[0].y + offsetY);
    for (let i = 1; i < middleLine.length; i++) {
      shipGraphics.lineTo(middleLine[i].x + offsetX, middleLine[i].y + offsetY);
    }

    // Draw top line
    shipGraphics.moveTo(topLine[0].x + offsetX, topLine[0].y + offsetY);
    for (let i = 1; i < topLine.length; i++) {
      shipGraphics.lineTo(topLine[i].x + offsetX, topLine[i].y + offsetY);
    }
    shipGraphics.closePath();
    shipGraphics.strokePath();

    return shipGraphics;
  }
}