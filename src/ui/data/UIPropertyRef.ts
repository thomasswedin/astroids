import { ref } from 'vue';

export interface IReactiveProperty {
	value: any;
	subscribe: (subscriber:ISubscriber<any>) => void;
	unsubscribe: (subscriber:ISubscriber<any>) => void;
}

export interface ISubscriber<T> {
	update: (value: T) => void;
}

export class UIPropertyRef<T> {
	private _valueRef:any;
	private _boundProperty:IReactiveProperty | undefined;

	constructor(value:T) {
		this._valueRef = ref<T>(value);
	}

	bind(property:IReactiveProperty) {
		this._boundProperty = property;
		this._valueRef.value = property.value;

		const propertyUpdateSubscriber:ISubscriber<T> = {
			update: (_value:T) => {
				if (property.value !== this._valueRef.value) {
					this._valueRef.value = property.value;
				}
			}
		}

		property.subscribe(propertyUpdateSubscriber);
	}

	public get ref():any {
		return this._valueRef;
	}

	public get value():T {
		if (this._boundProperty) {
			if (this._valueRef.value !== this._boundProperty.value) {
				this._valueRef.value = this._boundProperty.value;
			}
		}
		return this._valueRef.value;
	}

	public set value(newValue:T) {
		if (this._boundProperty) {
			if (this._boundProperty.value !== newValue) {
				this._boundProperty.value = newValue;
			}
		}
		if (this._valueRef.value !== newValue) {
			this._valueRef.value = newValue;
		}
	}
}