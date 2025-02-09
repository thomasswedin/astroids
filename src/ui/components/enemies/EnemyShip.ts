import Phaser from 'phaser';
import { GameConstants } from '../../constants/GameConstants';
import { Bullet } from '../Bullet';
import type { IGameObject } from '../IGameObject';

export class EnemyShip extends Phaser.GameObjects.Sprite implements IGameObject {
  private _widthOfShipTexture: number;
  private _heightOfShipTexture: number;
  private enemyShipTextureKey: string = "enemyShipTextureKey";
  private _scaleFactor = 1.6;
  private shootCounter = 0;
  private _id: string;
  private _sizeType: number = 0;
  private _targetPos: Phaser.Math.Vector2;

  constructor(scene: Phaser.Scene, x: number, y: number, id: string, sizeType: number) {
    super(scene, x, y, "enemy_ship");
    this._id = id;
    this._sizeType = sizeType
    this.scene = scene;
    this._targetPos = new Phaser.Math.Vector2();

    this._widthOfShipTexture = 32;
    this._heightOfShipTexture = 32;
    this.create();
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    //this.scene.physics.moveToObject(this, this.target, 100);
    this.scene.physics.moveTo(this, 800, y, 100);
  }

  update(): void {
    this.shootCounter++;
    if (this.shootCounter >= 300) {
      this.shoot();
      this.shootCounter = 0;
    }

    if (this.x > this.scene.cameras.main.width + 100) {
      this.destroy();
    }
  }

  get sizeType(): number {
    return this._sizeType;
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get speed(): number {
    return 100;
  }

  set targetPos(targetPos: Phaser.Math.Vector2) {
    this._targetPos = targetPos;
  }

  get targetPos(): Phaser.Math.Vector2 {  
    return this._targetPos;
  }

  protected create() {
    const shipVec: Phaser.GameObjects.Graphics = this.drawShip();
    shipVec.generateTexture(this.enemyShipTextureKey, this._widthOfShipTexture, this._heightOfShipTexture);
    this.setTexture(this.enemyShipTextureKey);
  }

  private shoot(): void {
    let enemyShipCenter = this.getCenter();
    const angleInRadians = Phaser.Math.Angle.BetweenPoints(enemyShipCenter, this._targetPos);
    const bulletX = this.x + Math.cos(angleInRadians) * this._heightOfShipTexture / 2;
    const bulletY = this.y + Math.sin(angleInRadians) * this._heightOfShipTexture / 2;
    const bullet = new Bullet(this.scene, bulletX, bulletY, Phaser.Math.RadToDeg(angleInRadians), Bullet.ENEMY);
    bullet.setRotation(angleInRadians); // Set the rotation of the bullet to match the angle
    this.scene.events.emit(GameConstants.SHOOT, bullet);
  }

  protected drawShip(): Phaser.GameObjects.Graphics {
    const shipGraphics = new Phaser.GameObjects.Graphics(this.scene);

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
      { x: -13, y: 1 },
      { x: 13, y: 1 }
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
    const minY = Math.min(...shipPoints.map(p => p.y)) - 1;
    const maxY = Math.max(...shipPoints.map(p => p.y)) + 1;

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