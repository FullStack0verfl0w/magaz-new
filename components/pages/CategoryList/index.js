import React, { useEffect, useLayoutEffect } from "react";
import { FlatList } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

import { useDispatch, useSelector } from "react-redux";
import { FetchCartProductList } from "~/redux/CartReducer/actions";
import { useQuery } from "@apollo/client";
import { MUTATION_REFRESH_TOKEN, QUERY_CATEGORY_LIST } from '~/apollo/queries';
import { ShowLoginModal, ShowModal } from "~/redux/ModalReducer/actions";

import { expo } from "~/app.json";
import SyncStorage from "sync-storage";

import { HeaderTitle, HeaderBackButton, HeaderCartButton } from "~/components/Header";
import OurActivityIndicator from "~/components/OurActivityIndicator";
import CategoryItem from "./CategoryItem";
import styles from "./styles";
import client from "~/apollo";
import { v4 as uuidv4 } from "uuid";
import { AUTH_TOKEN_EXPIRE_TIME } from "~/utils/config";
import OurIconButton from "~/components/OurIconButton";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";


/**Список категорий товаров*/
const CategoryList = (props) => {
    const { navigation } = props;
    const dispatch = useDispatch();
    const [gradStart, gradEnd] = ["#65B7B9", "#078998"];
    const abortController = new AbortController();

    const showAppInfo = (e) => {
        const data = {
            title: { text: expo.name, params: {} },
            text: { text: "appInfo", params: { version: expo.version } },
            animationIn: "bounceInDown",
            animationOut: "bounceOutUp",
            buttons: [{
                text: "ok",
            }]
        };
        dispatch(ShowModal(data));
    };

    useLayoutEffect( () => {
        navigation.setOptions({
            headerLeft: (props)=> {
                return (
                    <>
                        {
                            SyncStorage.get("auth") ?
                                <HeaderBackButton navigation={navigation} />
                            :
                                <HeaderTitle navigation={navigation} title={"categoryListTitle"} onPress={showAppInfo}/>
                        }
                    </>
                );
            },
            headerCenter: (props)=> {
                return (
                    <>
                        {
                            SyncStorage.get("auth") ?
                                <HeaderTitle navigation={navigation} title={"categoryListTitle"} onPress={showAppInfo}/>
                            :
                                <></>
                        }
                    </>
                );
            },
            headerRight: (props)=> {
                const auth = SyncStorage.get("auth");
                const refresh = SyncStorage.get("refresh-auth");

                if ( !auth || !refresh )
                    return <OurIconButton icon={faSignInAlt} size={50} onPress={() => ShowLoginModal(dispatch, navigation)} />;
                else
                    return <HeaderCartButton navigation={navigation}/>;
            },
            headerStyle: {
                backgroundColor: gradStart,
            },
        });
    }, [navigation]);

    useEffect( () => {
        const auth = SyncStorage.get("auth");
        let refresh = SyncStorage.get("refresh-auth");

        if ( refresh ) {
            let mutationId = SyncStorage.get("user-uuid");
            if ( !mutationId ) {
                mutationId = uuidv4();
                SyncStorage.set("user-uuid", mutationId);
            }
            client.mutate({
                mutation: MUTATION_REFRESH_TOKEN,
                variables: {
                    clientMutationId: mutationId,
                    jwtRefreshToken: refresh,
                }
            }).then((res) => {
                SyncStorage.set("auth", res.data.refreshJwtAuthToken.authToken);
                SyncStorage.set("auth-expires-at", Date.now() + AUTH_TOKEN_EXPIRE_TIME);
            }).catch((err) => {
                console.log("Well shit! Something went wrong while updating auth token!", err);

                SyncStorage.set("session", null);
                SyncStorage.set("auth", null);
                SyncStorage.set("refresh-auth", null);
                SyncStorage.set("auth-expires-at", null);
                refresh = null;
            });
            dispatch(FetchCartProductList);
        }
        if ( !refresh && !auth ) {
            ShowLoginModal(dispatch, navigation);
        }
    }, []);

    const { loading, error, data, refetch } = useQuery(QUERY_CATEGORY_LIST, {
        variables: { hideEmpty: true },
        context: {
            fetchOptions: {
                signal: abortController.signal,
            }
        },
        onError: (err) => {console.log("Error while fetching categories", error)}
    });

    return (
        <>
            <LinearGradient
                style={styles.background}
                locations={[0, 1.0]}
                colors={[gradStart, gradEnd]} />
            {
                ( loading || error || abortController.signal.aborted ) ?
                    <OurActivityIndicator error={error} abortController={abortController} doRefresh={refetch} buttonTextColor={gradStart}/>
                    :
                    <FlatList
                        contentContainerStyle={styles.flatListContentContainer}
                        numColumns={2}
                        data={data?.productCategories?.nodes}
                        refreshing={loading}
                        onRefresh={() => {refetch()}}
                        renderItem={({item}) => <CategoryItem navigation={navigation}
                                                        name={item.name}
                                                        id={item.productCategoryId}
                                                        imageUrl={item?.image?.mediaDetails?.file}
                                                        cached={item.cached}/>}
                        keyExtractor={(item, key) => String(key)}/>
            }
        </>
    );
};

export default CategoryList;