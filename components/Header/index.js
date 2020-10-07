import React, { useContext, useEffect } from "react";
// import { useRoute, useNavigationState } from "@react-navigation/native";
import {useRoute, useNavigationState} from "react-native-screens/native-stack";

import { View, TouchableOpacity } from "react-native";
import { Badge } from 'native-base';
import { stateContext, dispatchContext } from "../../contexts";
import OurText from "../OurText";
import styles from "./styles.js";
import { faChevronLeft, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import OurIconButton from "../OurIconButton";


const isFirstRouteInParent = (navigation)=>{

    // const route = useRoute();
    // const isFirstRouteInParent = useNavigationState(
    //     state => state.routes[0].key === route.key
    // );

    // return isFirstRouteInParent;

    console.log(JSON.stringify(navigation));

    return true;

}


/** Шапочка приложения с навигацией*/
const Header = (props) =>
{
    const {
        backgroundColor,
        title,
        titleFunc,
        showCart,
        navigation,
    } = props;
    const showBack = (typeof(props.showBack) === "boolean")
        ? props.showBack : !isFirstRouteInParent(navigation);
    
    const state = useContext(stateContext);
    const dispatch = useContext(dispatchContext);


    console.log(`ShowCart is ${showCart}`)

    const goBack = (e) => {
        navigation.goBack();
    };

    const goToCart = (e) => {
        navigation.navigate("Cart");
    };

    return (
        <>
            <View style={[styles.container, {backgroundColor: backgroundColor}]}>
                <View style={styles.backContainer}>
                    {
                        showBack ?
                            <OurIconButton icon={faChevronLeft} size={49} onPress={goBack}/>
                            : <></>
                    }
                </View>

                <View style={styles.titleContainer}>
                    {title ?
                        <TouchableOpacity activeOpacity={ titleFunc ? 0.2 : 1 } onPress={()=>{
                            if (titleFunc)
                                titleFunc();
                        }}
                        >
                            <OurText style={styles.title} translate={true}>{title}</OurText>
                        </TouchableOpacity> : <></>
                    }
                </View>

                <View style={styles.cartContainer}>
                    {showCart ?
                        <View style={styles.iconCart}>
                            <OurIconButton icon={faShoppingBasket} size={50} onPress={goToCart}>
                                {
                                    state?.cartItems?.size ?
                                        <Badge success style={styles.badge}>
                                            <OurText style={styles.badgeText}>
                                                {
                                                    state?.cartItems?.size ?
                                                        (() => {
                                                            if ( state.cartItems.size < 10 )
                                                                return state.cartItems.size;
                                                            else
                                                                return "9+";
                                                        })()
                                                        : <></>
                                                }
                                            </OurText>
                                        </Badge>
                                        : <></>
                                }
                            </OurIconButton>
                            <OurText style={styles.priceText}>
                                {state.cartTotalPrice}$
                            </OurText>
                        </View> : <></>
                    }
                </View>
            </View>
        </>
    );
};

export default React.memo(Header);