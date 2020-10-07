import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 85
    },
    item_name: {
        color: "#FFF",
        fontSize: 16,
        width: 150,
    },
    item_price: {
        color: "#FFF",
        fontSize: 16,
        marginHorizontal: 0,
    },
    item_count: {
        color: "#FFF",
        fontSize: 16,
        marginHorizontal: 16,
        flexGrow: 0,
        width: 50,
    },
    right: {
        width: 120,
        flexDirection: "column",
        alignItems: "flex-end",
    }
});

export default styles;