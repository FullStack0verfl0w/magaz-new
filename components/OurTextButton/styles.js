import {Dimensions, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    buttonEnabled: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    buttonDisabled: {
        paddingHorizontal: 32,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: '#FFFA',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,

        elevation: 1,
    },
    textButton: {
        fontSize: 16,
        textAlign: "center",
        textShadowRadius: 0,
    },
});

export default styles;