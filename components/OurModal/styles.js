import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        padding: 8,
        paddingTop: 12,
        minHeight: 120,
        backgroundColor: "#fff",
        borderRadius: 1.5,
        alignItems: "center",
        justifyContent: "space-between",
    },
    topContainer: {
    },
    title: {
        color: "#383838",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
        textShadowRadius: 0,
    },
    middleContainer: {
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        textShadowRadius: 0,
    },
    bottomContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignSelf: "flex-end",
    },
    button: {
        borderRadius: 1,
        paddingHorizontal: 10,
        margin: 2,
        backgroundColor: null,
        elevation: 0,
    },
    buttonText: {
        color: "#fc0341",
        textTransform: "uppercase",
        textShadowRadius: 0,
    },
});

export default styles;