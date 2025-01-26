export interface IGameObject {
    update(): void;
    id: string;
    sizeType: number;
    speed: number;
    targetPos: Phaser.Math.Vector2;
}