import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
	mainContainer: {
		height: Constants.statusBarHeight + 75,
		paddingTop: Constants.statusBarHeight,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	backContainer: {
		width: 40.5,
		height: 49.5,
	},
	iconBack: {
		width: 49,
		height: 49,
		justifyContent: "center",
		alignItems: "flex-end",
	},
	titleContainer: {},
	title: {
		fontFamily: "Gilroy-ExtraBold",
		fontSize: 25,
		color: "#fff",
		textAlign: "center",
	},
	cartContainer: {
		width: 49.5,
		height: 40.5,
	},
	iconCart: {
		minWidth: 64,
		height: 40.5,
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	badge: {
		position: "absolute",
		width: 28,
		height: 28,
		top: 28,
		left: -15,
		alignItems: "center",
		justifyContent: "center",
	},
	badgeText: {
		color: "#fff",
		textShadowColor: "#000",
		textShadowRadius: 1,
		textShadowOffset: { width: .5, height: .5 },
	},
	priceText: {
		width: 280,
		paddingRight: 12,
		alignSelf: "flex-end",
		textAlign: "right",
		color: "#fff",
	}
});
export default styles;