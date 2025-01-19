import type { IGameObject } from "../components/IGameObject";

export interface IEnemyData {
    timeBeforAppear: number;
    enemyType: IGameObject;
    enemySpeed: number;
}