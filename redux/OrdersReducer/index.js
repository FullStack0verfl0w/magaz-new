import { ORDERS_SET_LIST, ORDERS_SET_LOADING, ORDERS_SET_ERROR, } from "./types";

export const initialOrdersState = {
    orderList: new Map(), // Список товаров
    loading: false,
    error: false,
};

const ordersReducer = ( state = initialOrdersState, action ) => {
    switch (action.type) {        

        /*
         * Устанавливает список заказов
         */
        case ORDERS_SET_LIST: {
            const newState = {...state};
            const { orderList } = action;

            const orders = new Map();

            if ( orderList )
                orderList.forEach( (v, i) => {
                    orders.set( v.databaseId, v );
                } );


            newState.orderList = orders;
            return newState;
        }

        case ORDERS_SET_LOADING: {
            const newState = {...state};
            const { loading } = action;

            newState.loading = loading;
            return newState;
        }

        case ORDERS_SET_ERROR: {
            const newState = {...state};
            const { error } = action;

            newState.error = error;
            return newState;
        }

        default: {
            return state;
        }
    }
};

export default ordersReducer;