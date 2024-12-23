export const ButtonEvents = {
    RestartButtonClicked: {},
    StartButtonClicked: {},
	StopButtonClicked: {},
};

export interface IHitData {
    enemy: number;
}

export const GameEvents = {
    HitEvent: {data: <IHitData>{}},
};