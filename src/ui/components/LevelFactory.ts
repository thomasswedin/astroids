import type { IEnemyData } from "../data/IEnemyData";

export class LevelFactory {
    private _currentLevel: number;
    private _maxLevel: number;
    private _astroids: number = 0;
    private _enemies: IEnemyData[] = [];

    constructor(maxLevel: number) {
        this._currentLevel = 1;
        this._maxLevel = maxLevel;
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

    public getAmountOfAstroids(): number {
        return this._astroids;
    }

    protected createLevelObjects(level: number): void {
        this._enemies = [];
        switch (level) {
            case 1:
                console.log("Creating level 1 objects");
                this._astroids = 4;
                //this._enemies.push({ timeBeforAppear: 1000, enemyType: EnemyShip as IGameObject, enemySpeed: 100 });
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
}