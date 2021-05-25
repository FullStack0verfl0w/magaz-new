import client from "~/apollo";
import { QUERY_GET_CART, MUTATION_ADD_TO_CART, MUTATION_UPDATE_PRODUCT_QUANTITY, MUTATION_DELETE_PRODUCT_FROM_CART } from "~/apollo/queries";
import { AddToast } from "../ToastReducer/actions";
import { CART_SET_LOADING, CART_SET_PRODUCT_LIST } from "./types";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from 'uuid';
import SyncStorage from "sync-storage";
import i18n from "~/i18n";

export const SetCartProductList = (productList=[], total=0) => {
    return { type: CART_SET_PRODUCT_LIST, productList, total };
};

export const FetchCartProductList = async (dispatch) => {
    dispatch(SetCartLoading(true));

    try {
        const cartData = await client.query({ query: QUERY_GET_CART, fetchPolicy: "no-cache" });

        dispatch(SetCartProductList(cartData?.data?.cart?.contents?.nodes, cartData?.data?.cart?.total));
    } catch (e) {
        console.log("CART FETCH ERROR", e);
        const toast = {
            icon: faShoppingBasket,
            text: i18n.t("activityError"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "CART_FETCH_ERROR"));
    }
    dispatch(SetCartLoading(false));
};

export const SetCartLoading = (loading=false) => {
    return { type: CART_SET_LOADING, loading };
};

export const AddProductToCart = (productId, productName, quantity=1, setLoading=()=>{}) => async (dispatch) => {
    // Oh no
    setLoading(true);

    try {
        let mutationId = SyncStorage.get("user-uuid");
        if ( !mutationId ) {
            mutationId = uuidv4();
            SyncStorage.set("user-uuid", mutationId);
        }

        await client.mutate({
            mutation: MUTATION_ADD_TO_CART,
            variables: {
                productId: productId,
                quantity: quantity,
                clientMutationId: mutationId,
            }
        });
        const toast = {
            icon: faShoppingBasket,
            text: i18n.t("productAddedMessage", {product: productName}),
            duration: 3000,
            color: "#499eda",
        };
        dispatch(AddToast(toast, "PRODUCT_ADDED_" + productId));
        dispatch(FetchCartProductList);
        setLoading(false);
    } catch (e) {
        console.log("ERROR", e)
        const toast = {
            icon: faShoppingBasket,
            text: i18n.t("activityError2"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "PRODUCT_ADDING_ERROR"));
        setLoading(false);
    }
};

export const DeleteProductFromCart = (id, setLoading, anim) => async (dispatch) => {
    setLoading(true);
    try {
        let mutationId = SyncStorage.get("user-uuid");
        if ( !mutationId ) {
            mutationId = uuidv4();
            SyncStorage.set("user-uuid", mutationId);
        }

        await client.mutate({
            mutation: MUTATION_DELETE_PRODUCT_FROM_CART,
            variables: {
                clientMutationId: mutationId,
                keys: id
            }
        });
        anim.start(() => {
            dispatch(FetchCartProductList);
        });
    } catch (e) {
        console.log("ERROR", e)
        const toast = {
            icon: faShoppingBasket,
            text: i18n.t("activityError2"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "PRODUCT_REMOVING_ERROR"));
        setLoading(false);
    }
};

export const ChangeProductQuantity = (id, quantity) => async (dispatch) => {
    dispatch(SetCartLoading(true));
    try {
        
        let mutationId = SyncStorage.get("user-uuid");
        if ( !mutationId ) {
            mutationId = uuidv4();
            SyncStorage.set("user-uuid", mutationId);
        }

        await client.mutate({
            mutation: MUTATION_UPDATE_PRODUCT_QUANTITY,
            variables: {
                clientMutationId: mutationId,
                key: id,
                quantity: quantity,
            }
        });
    } catch (e) {
        console.log("ERROR", e)
        const toast = {
            icon: faShoppingBasket,
            text: i18n.t("activityError2"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "UPDATE_PRODUCT_QUANTITY_ERROR"));
        dispatch(SetCartLoading(false));
    }

    dispatch(FetchCartProductList);
};