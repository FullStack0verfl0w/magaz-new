import React, { useEffect, useLayoutEffect } from "react";
import { View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { FetchCartProductList } from "~/redux/CartReducer/actions";
import { ShowModal } from "~/redux/ModalReducer/actions";
import SyncStorage from "sync-storage";

import { HeaderBackButton, HeaderTitle, HeaderOrdersButton } from "~/components/Header/index";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import OurText from "~/components/OurText";
import OurTextButton from "~/components/OurTextButton";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import styles from "./styles";

const LocallyAnimatedFlatList = ({data}) => {
    const renderItemsBlock = ({item, index}) => {
        return (
            <CartItem id={item.key} productId={item.product.databaseId} name={item.product.name} price={item.total} productQuantity={item.quantity} imageLink={item.product.image.mediaDetails.file}/>
        );
    };

    return (
        <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.cartList}
            data={data}
            renderItem={renderItemsBlock}
            keyExtractor={(item) => String(item.key)}
        />
    )
};

const MemoedLocallyAnimatedFlatList = React.memo(LocallyAnimatedFlatList);

/** Компонент корзины */
const Cart = (props) => {
    const state = useSelector(state=>state.cartReducer);
    const dispatch = useDispatch();
    const { navigation } = props;
    const [gradStart, gradEnd] = ["#E81C1C", "#E4724F"];

    useEffect(() => {
        if ( !state.loading ) {
            dispatch(FetchCartProductList);
        }
    }, []);

    useLayoutEffect( () => {
        navigation.setOptions({
            headerLeft: (props) => <HeaderBackButton navigation={navigation}/>,
            headerCenter: (props) => <HeaderTitle navigation={navigation} title={"cartTitle"}/>,
            headerRight: (props) => <HeaderOrdersButton navigation={navigation}/>,
            headerStyle: {
                backgroundColor: gradStart,
            },
        });
    }, [navigation]);

    const toDeliveryDetails = (e) => {
        if ( state.productList?.size ) {
            if ( !SyncStorage.get("bearer-token") ) {
                const loginModalData = {
                    title: { text: "cartLoginTitle", params: {} },
                    text: { text: "cartLoginMessage", params: {} },
                    animationIn: "fadeInUp",
                    animationOut: "fadeOutDown",
                    buttons: [
                        {
                            text: "cancel",
                            textStyle: {
                                color: "#383838",
                            },
                        },
                        {
                            text: "welcomePageRegister",
                            onPress: (e) => {
                                navigation.navigate("RegisterPage");
                            },
                        },
                        {
                            text: "welcomePageLogin",
                            onPress: (e) => {
                                navigation.navigate("LoginPage");
                            },
                        },
                    ],
                };
                dispatch(ShowModal(loginModalData));
            } else {
                navigation.navigate("DeliveryDetails");
            }
        }
    };

    return (
        <>
            <LinearGradient
                style={styles.gradient}
                locations={[0, 1.0]}
                colors={[gradStart, gradEnd]}/>

                <View style={styles.items}>
                    {
                        state.loading ?
                            <OurActivityIndicator style={styles.loadingContainer} size={64} oneState={true} color={gradStart} />
                        :
                            state.productList.size === 0 ?
                                <OurText style={styles.emptyText}
                                    translate={true}>cartEmpty</OurText>
                            : <></>
                        
                    }
                    <MemoedLocallyAnimatedFlatList data={Array.from(state.productList.values())}/>
                    <CartTotal total={state.total} />
                    <View style={styles.bottomContainer}>
                    <OurTextButton
                        translate={true}
                        disabled={!state.productList.size || state.loading}
                        onPress={toDeliveryDetails}
                        style={styles.checkoutButton}
                        textStyle={{color: gradEnd}}
                        >{state.loading ? "activityLoading" : "cartCheckout"}</OurTextButton>
                    </View>
                </View>
        </>
    );
};

export default Cart; 