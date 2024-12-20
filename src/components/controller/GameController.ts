import { inject } from 'vue';
import type { IEventDispatcher } from '../../common/event/IEventDispatcher';
import { UIController } from '../../UIController';
import type { IScoreData } from '../data/IScoreData';
import { ScoreEvent } from '../event/ScoreEvent';
import { GameModel } from '../model/GameModel';

export class GameController {
  private eventDispatcher: IEventDispatcher;
  private model: GameModel;
  private uiController!: UIController;

  constructor() {
    this.model = new GameModel();
    this.eventDispatcher = inject<IEventDispatcher>('eventDispatcher')!;
    this.uiController = new UIController();
    this.uiController.createGame();
  }

  public getGameHistoryUIRoot(): HTMLElement {
    return this.uiController.getGameHistoryUIRoot();
}

  public increaseScore(): void {
    this.model.incrementScore();
    let scoreData = this.createEmptyIScoreData();
    scoreData.score = this.model.getScore();
    this.eventDispatcher.dispatchEvent(new ScoreEvent(ScoreEvent.UPDATED, scoreData));
  }

  protected createEmptyIScoreData(): IScoreData {
          return {
              score: 0
          };
      }
}