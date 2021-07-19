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
        flex: 1,
        justifyContent: "space-between",
    },
    topContainer: {
        height: "100%",
        width: "100%",
        justifyContent: "space-between",
        paddingTop: 10,
    },
    scrollContainer: {
        paddingHorizontal: 10,
    },
    title: {
        paddingVertical: 20,
        color: "#fff",
        fontSize: 28,
        textAlign: "center",
    },
    note: {
        color: "#fffd",
        fontSize: 22,
        textAlign: "center",
    },
    bottomContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    bottomSignInContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    bottomSignInText: {
        color: "#fff",
        fontSize: 18,
        flexWrap: "wrap"
    },
    bottomSignInButton: {
        marginLeft: 8,
    },
    button: {
        marginVertical: 10,
        elevation: 1,
        width: "100%",
    },
});

export default styles;