import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        minHeight: "100%",
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        minHeight: "100%",
    },
    productNameContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 24,
    },
    productName: {
        fontSize: 24,
        color: "#fff",
    },
    sliderContainer: {
        width: "100%",
        height: 320,
        marginTop: 24,
        paddingBottom: 16,
    },
    productImageContainer: {
        width: Dimensions.get("screen").width,
        alignItems: "center",
        justifyContent: "center",
    },
    productImage: {
        width: 320,
        height: 320,
        resizeMode: "contain",
    },
    productInfoContainer: {
        paddingVertical: 24,
        paddingHorizontal: 12,
    },
    descriptionContainer: {
        paddingBottom: 12,
        borderBottomWidth: .5,
        borderBottomColor: "#fffa",
    },
    descriptionTitle: {
        fontSize: 24,
        color: "#fff",
    },
    description: {
        textAlign: "justify",
        fontSize: 16,
        color: "#fff",
    },
    attributeContainer: {
        paddingTop: 12,
        paddingHorizontal: 8,
    },
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 12,
        paddingHorizontal: 8,
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 24,
    },
    quantity: {
        color: "#fff",
        fontSize: 20,
    },
    price: {
        color: "#fff",
        fontSize: 20,
        marginLeft: 16,
    },
    buyButtonContanier: {
        marginRight: 16,
        padding: 16,
        borderRadius: 100,
        backgroundColor: "#fff",
    },
    buyButtonText: {
        color: "#fc67fa",
    },
    loadingIndicator: {
        position: null,
        marginTop: 32,
    },
});

export default styles;