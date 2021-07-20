import { MODAL_CLOSE, MODAL_SHOW, MODAL_TOGGLE } from "./types";

export const ShowModal = (data = {}) => {
	return { type: MODAL_SHOW, payload: data };
};

export const CloseModal = () => {
	return { type: MODAL_CLOSE };
};

export const ToggleModal = (data = {}) => {
	return { type: MODAL_TOGGLE, payload: data };
};

export const ShowLoginModal = (dispatch, navigation) => {
	const data = {
		title: { text: "cartLoginTitle", params: {} },
		text: { text: "cartLoginMessage", params: {} },
		bottomStyle: {
			flexDirection: "column",
			justifyContent: "center",
			alignSelf: "center",
		},
		animationIn: "fadeInUp",
		animationOut: "fadeOutDown",
		buttons: [
			{
				text: "welcomePageContinue",
				textStyle: {
					color: "#383838",
				},
			},
			{
				text: "welcomePageRegister",
				onPress: (e) => {
					navigation.navigate("RegisterPage");
				},
			},
			{
				text: "welcomePageLogin",
				onPress: (e) => {
					navigation.navigate("LoginPage");
				},
			},
		],
	};
	dispatch(ShowModal(data));
};