export interface IGameObject {
    update(): void;
    id: string;
    sizeType: number;
    speed: number;
}