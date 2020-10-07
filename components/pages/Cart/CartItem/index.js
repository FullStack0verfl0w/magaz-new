import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { stateContext } from "../../../../contexts";
import ItemCount from "./ItemCount";
import styles from "./styles";
import OurText from "../../../OurText";

const findProductById = (productId, cartItems) => {
    if(cartItems.has(productId))
        return cartItems.get(productId);
    else
        return null;
};

/** Компонент товара в корзине */
const CartItem = (props) =>
{
    const { productId, product } = props;

    return (
        <>
        { product ?
            <View style={styles.container}>
                <OurText style={styles.item_name}>{product.name}</OurText>
                <OurText style={styles.item_count} params={{count: product.count}}>cartPcs</OurText>
                <View style={styles.right}>
                    <OurText style={styles.item_price}>{product.price * product.count}$</OurText>
                    <ItemCount productId={productId}/>
                </View>
            </View>
            : <></>
        }
        </>
    );
};





export default React.memo(CartItem); 