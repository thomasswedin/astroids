export class GameModel {
    private score: number;
  
    constructor() {
      this.score = 0;
    }
  
    public getScore(): number {
      return this.score;
    }
  
    public incrementScore(): void {
      this.score += 10;
    }
  }