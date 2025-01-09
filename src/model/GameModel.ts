export class GameModel {
  private _score: number;
  private _lives: number;

  constructor() {
    this._score = 0;
    this._lives = 3;
  }

  public getScore(): number {
    return this._score;
  }

  public get lives(): number {
    return this._lives;
  }

  public incrementScore(sizeType: number): void {
    //create switch case for score
    switch (sizeType) {
      case 1:
        this.addScore(100);
        break;
      case 2:
        this.addScore(50);
        break;
      case 3:
        this.addScore(10);
        break;
      default:
        this.addScore(0);
    }
  }

  public resetScore(): void {
    this._score = 0;
  }

  public resetLives(): void {
    this._lives = 3;
  }

  public decrementLives(): void {
    this._lives--;
  }

  protected addScore(score: number): void {
    this._score += score;
  }


}