import { StyleSheet } from 'react-native';

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
        minHeight: "100%",
        paddingBottom: 32,
    },
    orderNumberContainer: {
        padding: 20,
    },
    orderNumber: {
        color: "#fff",
        fontSize: 32,
    },
    orderStatus: {
        color: "#fff",
        fontSize: 24,
    },
    orderProducts: {
        alignItems: "center",
    },
    productsTitle: {
        color: "#fff",
        fontSize: 32,
        alignSelf: "flex-start",
        marginLeft: 16,
    },
    productCard: {
        width: 320,
        alignItems: "center",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#fffe",
    },
    productCardImage: {
        width: 180,
        height: 180,
        margin: 12,
        resizeMode: "contain",
    },
    productCardName: {
        color: "#fff",
        fontSize: 24,
    },
    productCardBottom: {
        width: 320,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    deliveryDetailsContainer: {
        alignItems: "center",
    },
    deliveryDetailsTitle: {
        color: "#fff",
        fontSize: 32,
        alignSelf: "flex-start",
        marginLeft: 16,
        paddingVertical: 16,
    },
    deliveryDetailsInfo: {
        width: "100%"
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 8,
        borderBottomWidth: .5,
        borderColor: "#fff5",
    },
    fieldText: {
        color: "#fffd",
        fontSize: 20,
    },
    text: {
        color: "#fff",
        fontSize: 16,
        paddingLeft: 16,
        textAlign: "right",
    },
    activityIndicator: {
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default styles;