import { UIDataManager } from "../../ui/data/UIDataManager";
import { GameEvents } from "../../ui/events/GameEvents";
import { UIEventManager } from "../../ui/events/UIEventManager";
import { UIController } from '../../UIController';
import { GameModel } from '../model/GameModel';

export class GameController {
  private model: GameModel;
  private uiController!: UIController;

  constructor() {
    this.model = new GameModel();
    this.uiController = new UIController();
    this.uiController.createGame();
  }

  public getGameUIEventManager(): UIEventManager {
    return this.uiController.eventManager;
  }

  public getGameUIDataManager(): UIDataManager {
    return this.uiController.dataManager;
  }

  public getGameUIRoot(): HTMLElement {
    return this.uiController.getGameUIRoot();
  }

  public initializeGameUI(): void {
    this.addEventListeners();
  }

  public onHitEvent(): void {
    this.model.incrementScore();
    this.getGameUIDataManager().gameScore.score.value = this.model.getScore();
  }

  protected addEventListeners(): void {
    this.getGameUIEventManager().addEventListener(GameEvents.HitEvent, this.onHitEvent, this);
  }
}