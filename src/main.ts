import { GameController } from "./components/controller/GameController";

async function init() {
    const gameController = new GameController();
    const widgetUI = gameController.getGameHistoryUIRoot();
    document.body.appendChild(widgetUI);
}

window.addEventListener('DOMContentLoaded', () => {
    init();
});