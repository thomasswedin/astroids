import { KeypadActions as ButtonActions } from "../actions/ButtonActions";

export interface IUIEventButtonActionData {
	action: ButtonActions;
}

export interface IButtonActionEventData {
	action: ButtonActions;
}

export const UIEvents = {
	BUTTON_ACTION: { data: <IButtonActionEventData>{} }
}