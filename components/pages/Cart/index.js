import React, { useEffect, useLayoutEffect } from "react";
import { View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { FetchCartProductList } from "~/redux/CartReducer/actions";
import { ShowLoginModal, ShowModal } from "~/redux/ModalReducer/actions";
import SyncStorage from "sync-storage";

import { HeaderBackButton, HeaderTitle, HeaderOrdersButton, HeaderCartButton } from "~/components/Header/index";
import CartItem from "./CartItem";
import CartTotal from "./CartTotal";
import OurText from "~/components/OurText";
import OurTextButton from "~/components/OurTextButton";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import styles from "./styles";
import OurIconButton from "~/components/OurIconButton";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import { FetchOrderList } from "~/redux/OrdersReducer/actions";

const LocallyAnimatedFlatList = ({data, navigation, refreshing, onRefresh}) => {
    const renderItemsBlock = ({item, index}) => {
        return (
            <>
            {
            item.variation ?
                <CartItem id={item.key}
                          productId={item.product.node.databaseId}
                          name={item.product.node.name}
                          variationName={item.variation.node.name}
                          price={item.total}
                          productQuantity={item.quantity}
                          navigation={navigation}
                          imageLink={item.variation.node.image.sourceUrl}/>
            :
                <CartItem id={item.key}
                          productId={item.product.node.databaseId}
                          name={item.product.node.name}
                          price={item.total}
                          productQuantity={item.quantity}
                          navigation={navigation}
                          imageLink={item.product.node.image.sourceUrl}/>
        }
        </>);
    };

    return (
        <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.cartList}
            data={data}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={renderItemsBlock}
            keyExtractor={(item) => item.key}
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
            headerRight: (props)=> {
                const auth = SyncStorage.get("auth");
                const refresh = SyncStorage.get("refresh-auth");

                if ( !auth || !refresh )
                    return <OurIconButton icon={faSignInAlt} size={50} onPress={() => ShowLoginModal(dispatch, navigation)} />;
                else
                    return <HeaderOrdersButton navigation={navigation}/>;
            },
            headerStyle: {
                backgroundColor: gradStart,
            },
        });
    }, [navigation]);

    const toDeliveryDetails = (e) => {
        if ( state.productList?.size ) {
            if ( !SyncStorage.get("session") && !SyncStorage.get("refresh-auth") ) {
                ShowLoginModal(dispatch, navigation);
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
                        state.productList.size === 0 ?
                            <OurText style={styles.emptyText}
                                translate={true}>cartEmpty</OurText>
                        : <></>
                    }
                    <MemoedLocallyAnimatedFlatList refreshing={state.loading} onRefresh={() => dispatch(FetchCartProductList)} data={Array.from(state.productList.values())} navigation={navigation}/>
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