import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",

        backgroundColor: "#fffe",
        paddingLeft: 28,
        paddingRight: 48,
        paddingVertical: 10,
        marginVertical: 4,

        borderRadius: 8,
        elevation: 2,
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