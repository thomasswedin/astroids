export const ButtonEvents = {
    RestartButtonClicked: {},
    StartButtonClicked: {},
	StopButtonClicked: {},
};

export interface IHitData {
    enemy: number;
}

export const GameEvents = {
    GameSetupComplete: {},
    HitEvent: {data: <IHitData>{}},
};