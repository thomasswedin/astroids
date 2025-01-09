import { UIPropertyRef } from "./UIPropertyRef";

export class UIDataManager {

    public game = {
        score: new UIPropertyRef(0),
        lives: new UIPropertyRef(0),
        level: new UIPropertyRef(0),
        gameOver: new UIPropertyRef(false)
    };
}