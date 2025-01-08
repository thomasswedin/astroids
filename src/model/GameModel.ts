export class GameModel {
  private score: number;

  constructor() {
    this.score = 0;
  }

  public getScore(): number {
    return this.score;
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

  protected addScore(score: number): void {
    this.score += score;
  }
}