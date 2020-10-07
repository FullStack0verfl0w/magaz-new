import React, { useContext } from "react";
import { stateContext } from "../../../contexts";
import { View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import styles from "./styles";

import * as CartItemStyles from "./CartItem/styles";

import OurTextButton from "../../OurTextButton";

const findProductById = (productId, cartItems) => {
    if(cartItems.has(productId))
        return cartItems.get(productId);
    else
        return null;
};


/** Компонент корзины */
const Cart = (props) =>
{
    const state = useContext(stateContext);
    const { navigation } = props;

    const toDeliveryDetails = (e)=> {
        if ( state.cartItems.length )
            navigation.navigate('DeliveryDetails');
    };
    



    /** Компонент блока товаров  */
    const ItemsBlock = ({item})=> {    
        const product = findProductById(item.productId, state.cartItems);
        return (
            <CartItem productId={item.productId} count={item.count} product={product}/>
        );
    };



    const itemHeight = CartItemStyles.default.container.height;
    

    return (
        <>
            <LinearGradient
                style={styles.gradient}
                locations={[0, 1.0]}
                colors={["#E81C1C", "#E4724F"]}/>

                
                <View style={styles.items}>
                    <View style={styles.cartIcon}>
                        <FontAwesomeIcon size={42} color={"#fff"} icon={faShoppingBasket}/>
                    </View>
                    <FlatList
                        contentContainerStyle={styles.cartList}
                        data={Array.from(state.cartItems.values())}
                        renderItem={ItemsBlock}
                        keyExtractor={(item) => String(item.productId)}
                        getItemLayout={(data, index) => (
                            {length: itemHeight, offset: itemHeight * index, index}
                          )}
                        
                        />
                    <CartTotal />
                    <OurTextButton
                        translate={true}
                        disabled={!state.cartItems.size}
                        onPress={toDeliveryDetails}
                        style={styles.checkoutButton}
                        >cartCheckout</OurTextButton>
                </View>
        </>
    );
};

export default Cart; 