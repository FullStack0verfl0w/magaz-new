import React from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";
import { isLoaded } from "expo-font";

const DEFAULT_FONT = "Gilroy-Regular";

const OurText = (props) =>
{
    const { style, children, translate, params, numberOfLines } = props;
    const { t } = useTranslation();

    const mainStyle = {
        fontFamily: isLoaded(DEFAULT_FONT) ? DEFAULT_FONT : null,
        textShadowColor: "#0008",
        textShadowRadius: 1,
        textShadowOffset: { width: .5, height: .5 },
    };

    return (
        <Text numberOfLines={numberOfLines} style={[mainStyle, style]}
              allowFontScaling={false}>{(translate || params) ? t(children, params) : children}</Text>
    );
};

export default React.memo(OurText);