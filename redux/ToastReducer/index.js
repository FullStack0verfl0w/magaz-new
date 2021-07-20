import { TOAST_ADD, TOAST_CHANGE_DURATION, TOAST_DELETE } from "./types";

export const initialToastState = {
	toastList: new Map(), // Список тостов
};

const toastReducer = (state = initialToastState, action) => {
	switch (action.type) {

		/**
		 * Добавляет новый Toast
		 */
		case TOAST_ADD: {
			const newState = { ...state };
			const { payload, id } = action;

			if ( payload ) {
				payload.id = id || uuidv4();
				newState.toastList.set(payload.id, payload);
				return newState;
			}
			return state;
		}

		/**
		 * Удаляет Toast
		 */
		case TOAST_DELETE: {
			const newState = { ...state };
			const { id } = action;

			if ( id ) {
				newState.toastList.delete(id)
				return newState;
			}
			return state;
		}

		/**
		 * Изменяет длительность Toast
		 */
		case TOAST_CHANGE_DURATION: {
			const newState = { ...state };
			const { id, duration } = action;

			if ( id && duration ) {
				const toast = newState.toastList.get(id);
				toast.duration = duration;
				newState.toast.set(id, toast);
				return newState;
			}
			return state;
		}

		default: {
			return state;
		}
	}
};

export default toastReducer;