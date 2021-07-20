export const STORE_ADDRESS = "http://edoprovod.ru/";
export const DATABASE_NAME = "magaz";
export const DATABASE_VERSION = 2;
export const AUTH_TOKEN_EXPIRE_TIME = 300000; // in ms
export const HEADER_HEIGHT = 96;

export const HeaderStyle = (backgroundColor = "#fff", style = {}) => {
	return {
		backgroundColor,
		height: HEADER_HEIGHT,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,
		elevation: 7,
		...style,
	}
};