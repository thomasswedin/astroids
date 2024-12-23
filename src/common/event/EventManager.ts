export interface IEventListenerOptions {
	once: boolean;
}

export interface IEventListener {
	scope: any;
	options: IEventListenerOptions | undefined;
	eventHandler: Function;
}

export interface IEvent {
	data?: any;
}

export class EventManager {
	private _eventListenersMap: Map<IEvent, IEventListener[]> = new Map();

	public dispose(): void {
		this._eventListenersMap.clear();
	}

	public dispatchEvent<T extends IEvent>(event: T, data?: T["data"]): void {
		const listeners = this._eventListenersMap.get(event);
		if (listeners) {
			const listenersToRemove: IEventListener[] = [];

			listeners.forEach((listener: IEventListener) => {
				if (listener.scope) {
					listener.eventHandler.apply(listener.scope, [data]);
				} else {
					listener.eventHandler(data);
				}

				if (listener.options && listener.options.once) {
					listenersToRemove.push(listener);
				}
			});

			if (listenersToRemove.length > 0) {
				listenersToRemove.forEach(listener => {
					this.removeEventListener(event, listener.eventHandler as (event: T["data"]) => void);
				});
			}
		}
	}

	public addEventListener<T extends IEvent>(event: T, callback: (event: T["data"]) => void, scope?: any, options?: IEventListenerOptions): void {
		let listeners = this._eventListenersMap.get(event);
		if (!listeners) {
			listeners = [];
			this._eventListenersMap.set(event, listeners);
		}
		let isEventListenerAdded: boolean = false;
		for (let i = 0; i < listeners.length; i++) {
			const isScopeMatching = (listeners[i].scope === scope) || (listeners[i].scope && !scope) || (!listeners[i].scope && scope);
			if (listeners[i].eventHandler == callback && isScopeMatching) {
				isEventListenerAdded = true;
				break;
			}
		}
		if (!isEventListenerAdded) {
			listeners.push({ eventHandler: callback, options: options, scope: scope });
		}
	}

	public removeEventListener<T extends IEvent>(event: T, callback: (event: T["data"]) => void, scope?: any): void {
		const listeners = this._eventListenersMap.get(event);
		if (listeners) {
			let firstMismatchingScopeListenerIndex: number = -1;
			let mismatchingScopeListeners: number = 0;
			for (let i = listeners.length - 1; i >= 0; i--) {
				const listener = listeners[i];
				if (listener.eventHandler === callback && listener.scope === scope) {
					listeners.splice(i, 1);
				}
				const isScopeMismatch = (listener.scope && !scope) || (!listener.scope && scope);
				if (listener.eventHandler == callback && isScopeMismatch) {
					firstMismatchingScopeListenerIndex = i;
					mismatchingScopeListeners++;
				}
			}
			if (mismatchingScopeListeners > 0) {
				listeners.splice(firstMismatchingScopeListenerIndex, 1);
				if (mismatchingScopeListeners > 1) {
					console.warn("Error: A UI event listener was removed with a non-matching scope, make sure to send the scope with removeEventListener");
				}
			}
		}
	}
}