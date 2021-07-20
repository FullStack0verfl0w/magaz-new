import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",

        minHeight: 48,

        backgroundColor: "#fffe",
        paddingLeft: 28,
        paddingRight: 48,
        paddingVertical: 10,
        marginVertical: 4,

        borderRadius: 8,
        elevation: 2,
    },
    leftBorder: {
        position: "absolute",
        height: Dimensions.get("screen").height,
        width: 16,
        left: 0
    },
    iconContainer: {
        paddingRight: 14,
    },
    text: {
        fontSize: 16,
        textShadowRadius: 0,
    }
});

export default styles;