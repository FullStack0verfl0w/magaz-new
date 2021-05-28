import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "column",
        marginHorizontal: 8,
        marginBottom: 12,
        overflow: "hidden",
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
    title: {
        color: "#fff",
        fontSize: 26,
        textAlign: "center",
    },

    infoContainer: {

    },
    infoTopContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    attributesContainer: {

    },
    infoMiddleContainer: {
        marginVertical: 8,
    },
    infoBottomContainer: {
        height: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    infoPrice: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    buyButton: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    buyButtonText: {
        color: "#078998",
    },
    descriptionContainer: {
        paddingTop: 8,
        paddingHorizontal: 8,
        maxHeight: 96,
        overflow: "hidden",
    },
    descriptionText: {
        color: "#ffffff",
        fontSize: 18,
    },
    buy: {
    },
});

export default styles;
