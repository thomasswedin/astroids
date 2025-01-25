import { GameConstants } from "../constants/GameConstants";
import type { IAstroidData } from "../data/IAstroidData";
import type { IEnemyData } from "../data/IEnemyData";

export class LevelFactory {
    private _currentLevel: number;
    private _maxLevel: number;
    private _astroids: IAstroidData[] = [];
    private _enemies: IEnemyData[] = [];
    private _currentScene: Phaser.Scene;

    constructor(scene: Phaser.Scene, maxLevel: number) {
        this._currentLevel = 1;
        this._maxLevel = maxLevel;
        this._currentScene = scene;
        this.createLevelObjects(this._currentLevel);
    }

    public getCurrentLevel(): number {
        return this._currentLevel;
    }

    public nextLevel(): void {
        if (this._currentLevel < this._maxLevel) {
            this._currentLevel++;
        } else {
            console.log("You have reached the maximum level.");
        }
    }

    public resetLevel(): void {
        this._currentLevel = 1;
    }

    public getAstroids(): IAstroidData[] {
        return this._astroids;
    }

    public getEnemies(): IEnemyData[] {
        return this._enemies;
    }

    protected createLevelObjects(level: number): void {
        this._enemies = [];
        switch (level) {
            case 1:
                console.log("Creating level 1 objects");
                //Create IAstroidData objects
                for (let i = 0; i < 4; i++) {
                    const astroidPosition = this.calculateAstroidsStartPosition();
                    this._astroids.push({ x: astroidPosition.x, y: astroidPosition.y, enemySpeed: 100});
                }
                //this._enemies.push({ timeBeforAppear: 1000, enemyType: GameConstants.ENEMY, x: -120, y: this._currentScene.cameras.main.height - this._currentScene.cameras.main.height / 4, enemySpeed: 100});
                this._enemies.push({ timeBeforAppear: 4000, enemyType: GameConstants.ENEMY, x: -120, y: this._currentScene.cameras.main.height / 4, enemySpeed: 100});
                break;
            case 2:
                console.log("Creating level 2 objects");
                break;
            case 3:
                console.log("Creating level 3 objects");
                break;
            default:
                console.log("Creating default level objects");
                break;
        }
    }

    protected calculateAstroidsStartPosition(): any {
        let x = Math.random() * this._currentScene.cameras.main.width;
            let y = Math.random() * this._currentScene.cameras.main.height;
            const centerX = this._currentScene.cameras.main.width / 2;
            const centerY = this._currentScene.cameras.main.height / 2;
            const distanceFromCenter = 200;

            while (Math.abs(x - centerX) < distanceFromCenter && Math.abs(y - centerY) < distanceFromCenter) {
                x = Math.random() * this._currentScene.cameras.main.width;
                y = Math.random() * this._currentScene.cameras.main.height;
            }

            x = Math.round(x / 10) * 10;
            y = Math.round(y / 10) * 10;

            return { x: x, y: y };
    }
}