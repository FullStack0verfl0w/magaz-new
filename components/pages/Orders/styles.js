import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	background: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		minHeight: "100%",
	},
	mainContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
		width: "100%",
	},
	flatList: {
		height: "100%",
		width: "100%",
		paddingTop: 12,
	},
	emptyTextContainer: {
		width: "100%",
		position: "absolute",
		alignItems: "center",
		marginTop: 12,
	},
	emptyText: {
		color: "#fff",
		fontSize: 24,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,

		zIndex: 9999,

		backgroundColor: "#fffffffa",
		borderRadius: 100,
	},
});

export default styles;