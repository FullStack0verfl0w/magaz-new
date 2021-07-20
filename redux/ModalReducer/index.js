import { MODAL_CLOSE, MODAL_SHOW, MODAL_TOGGLE } from "./types";

export const initialModalState = {
	visible: false, // Видимость окна
	title: { text: "", params: {} }, // Заголовок
	text: { text: "", params: {} }, // Текст
	animationIn: "slideInRight", // Анимация появления
	animationOut: "slideOutLeft", // Анимация исчезновения
	buttons: [], // Кнопки
};

const modalReducer = (state = initialModalState, action) => {
	switch (action.type) {

		/**
		 * Открывает модальное окно
		 */
		case MODAL_SHOW: {
			const { payload } = action;
			let newState = { ...state };
			if ( payload )
				newState = { ...newState.modal, ...payload }
			newState.visible = true;

			return newState;
		}

		/**
		 * Закрывает модальное окно
		 */
		case MODAL_CLOSE: {
			const newState = { ...state };
			newState.visible = false;

			return newState;
		}

		/**
		 * Переключает состояние модального окна
		 */
		case MODAL_TOGGLE: {
			const { payload } = action;
			let newState = { ...state };
			if ( payload )
				newState = { ...newState.modal, ...payload }
			newState.visible = !newState.visible;

			return newState;
		}

		default: {
			return state;
		}
	}
};

export default modalReducer;