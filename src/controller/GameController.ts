import { GameModel } from '../model/GameModel';
import { UIDataManager } from "../ui/data/UIDataManager";
import { GameEventManager } from "../ui/events/game/GameEventManager";
import { GameEvents } from "../ui/events/game/GameEvents";
import { UIEventManager } from "../ui/events/ui/UIEventManager";
import { UIController } from '../UIController';

export class GameController {
  private model: GameModel;
  private uiController!: UIController;

  constructor() {
    this.model = new GameModel();
    this.uiController = new UIController();
    this.uiController.createGame();
  }

  public getUIEventManager(): UIEventManager {
    return this.uiController.uiEventManager;
  }

  public getGameEventManager(): GameEventManager {
    return this.uiController.uiEventManager;
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
    this.getGameEventManager().addEventListener(GameEvents.HitEvent, this.onHitEvent, this);
  }
}