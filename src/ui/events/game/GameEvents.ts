export const ButtonEvents = {
    RestartButtonClicked: {},
    StartButtonClicked: {},
	StopButtonClicked: {},
};

export interface IHitData {
    enemy: number;
}

export const GameEvents = {
    ShipCollisionEvent: {},
    GameSetupComplete: {},
    HitEvent: {data: <IHitData>{}},
    GameOverEvent: {},
};