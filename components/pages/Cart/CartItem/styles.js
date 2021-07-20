import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
	mainContainer: {
		marginTop: 12,
		overflow: "hidden",
	},
	topContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingLeft: 16,
		paddingBottom: 4,
		overflow: "hidden",
	},
	counterContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 8,
	},
	deleteButton: {
		backgroundColor: "#fff",
		padding: 8,
		borderRadius: 100,
		marginLeft: 8,
	},
	itemName: {
		color: "#FFF",
		fontSize: 18,
		maxWidth: 240,
		overflow: "hidden",
	},
	productImage: {
		width: 96,
		height: 96,
		borderRadius: 8,
		marginRight: 6,
		overflow: "hidden",
	},
	bottomContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		overflow: "hidden",
	},
	itemPrice: {
		color: "#FFF",
		fontSize: 17,
		marginHorizontal: 0,
		overflow: "hidden",
	},
	itemCount: {
		color: "#FFF",
		fontSize: 18,
		marginHorizontal: 32,
		flexGrow: 0,
		overflow: "hidden",
	},
	itemCountController: {
		width: 120,
		flexDirection: "column",
		alignItems: "flex-end",
		marginRight: 6,
		overflow: "hidden",
	},
	borderContainer: {
		alignItems: "center",
		paddingTop: 7,
		overflow: "hidden",
	},
	itemBorder: {
		width: 340,
		borderWidth: .5,
		borderColor: "#fff5",
		overflow: "hidden",
	},
});

export default styles;