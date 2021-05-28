import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {

    },
    variationTitle: {
        color: "#fff",
        fontSize: 24,
    },
    variations: {
        paddingTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    variationContainer: {
        alignItems: "flex-start",
        marginHorizontal: 8,
    },
    variationImage: {
        width: 64,
        height: 64,
        resizeMode: "cover",
        borderRadius: 6,
    },
    variationImageActive: {
        borderWidth: 2,
        borderColor: "#eee",
    },
    variationName: {
        color: "#fff",
    },
    variationNameActive: {
        color: "#eee",
    },
});

export default styles;