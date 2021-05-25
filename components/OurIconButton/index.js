import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import styles from "./styles";

const LONG_PRESS_DELAY = 150;

const OurIconButton = (props) => {
    const { onPress, doLongPress, longPressDelay, icon, size, children, style, color, disabled } = props;
    const [timer, setTimer] = useState(null);
    
    const clearTimer = () => {
        if ( timer ) {
            clearInterval(timer);
            setTimer(null);
        }
    };
    const doPress = (e) => {
        if ( disabled ) return;
        onPress(e);
    };

    const onLongPress = (e) => {
        if ( disabled ) return;

        if ( doLongPress ) {
            clearTimer();
            const tmr = setInterval(() => {
                onPress(e);
            }, longPressDelay || LONG_PRESS_DELAY );
            setTimer(tmr);
        }
    };
    const onPressOut = (e) => {
        clearTimer();
    };

    return (
        <TouchableOpacity activeOpacity={disabled ? 1 : .2}
                          disabled={disabled}
                          onPress={doPress}
                          onLongPress={onLongPress}
                          onPressOut={onPressOut}
                          style={ [styles.button, { opacity: disabled ? .5 : 1 }, style] }>
            <FontAwesomeIcon size={size} color={color || "#fff"} icon={icon}/>
            {children}
        </TouchableOpacity>
    );
};

export default React.memo(OurIconButton);