import React from "react";
import { Dimensions, TouchableOpacity, Button } from "react-native";
import styles from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const OurIconButton = (props) =>
{
    const { onPress, icon, size, children } = props;
    const style = props.style || {};
    return (
        <TouchableOpacity onPress={onPress} style={ {...styles.button, ...style} }>
            <FontAwesomeIcon size={size} color={"#fff"} icon={icon}/>
            {children}
        </TouchableOpacity>
    )
};

export default React.memo(OurIconButton);