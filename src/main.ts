import { GameController } from "./components/controller/GameController";

async function init() {
    const gameController = new GameController();
    const widgetUI = gameController.getGameUIRoot();
    document.body.appendChild(widgetUI);
    gameController.initializeGameUI();
}

window.addEventListener('DOMContentLoaded', () => {
    init();
});