import { ORDERS_SET_LIST, ORDERS_SET_LOADING } from "./types";
import { MUTATION_CHECKOUT, QUERY_GET_ORDERS } from "~/apollo/queries";
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { AddToast } from "../ToastReducer/actions";
import { FetchCartProductList } from "../CartReducer/actions";
import SyncStorage from "sync-storage";
import i18n from "~/i18n";
import client from "~/apollo";

export const SetOrderList = (orderList=[]) => {
    return { type: ORDERS_SET_LIST, orderList };
};

export const FetchOrderList = async (dispatch) => {
    dispatch(SetOrdersLoading(true));
    try {
        const data = await client.query({ query: QUERY_GET_ORDERS });
        dispatch(SetOrderList(data.data?.orders?.nodes));
    }
    catch (e) {
        console.log("Order fetching error", e);
        const toast = {
            icon: faBoxOpen,
            text: i18n.t("activityError"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "ORDER_FETCH_ERROR"));
    }
    dispatch(SetOrdersLoading(false));
};

export const SetOrdersLoading = (loading=false) => {
    return { type: ORDERS_SET_LOADING, loading };
};

export const AddOrder = (data) => async (dispatch) => {
    try {
        let mutationId = SyncStorage.get("user-uuid");
        if ( !mutationId ) {
            mutationId = uuidv4();
            SyncStorage.set("user-uuid", mutationId);
        }

        await client.mutate({
            mutation: MUTATION_CHECKOUT,
            variables: {
                clientMutationId: mutationId,
                isPaid: false,
                address: data.address,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                postcode: data.postcode,
                phone: data.phone,
                paymentMethod: "cod",
            },
        })
        //dispatch(FetchOrderList)
        const toast = {
            icon: faBoxOpen,
            text: i18n.t("orderAdded"),
            duration: 3000,
            color: "#499eda",
        };
        dispatch(AddToast(toast, "ORDER_ADD_SUCCESS"));
        dispatch(FetchCartProductList);
    } catch (e) {
        console.log("Order adding error", e);
        const toast = {
            icon: faBoxOpen,
            text: i18n.t("activityError"),
            duration: 3000,
            color: "#fc0341",
        };
        dispatch(AddToast(toast, "ORDER_ADD_ERROR"));
    }
};