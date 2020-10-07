import {
    ADD_TO_CART,
    CHANGE_BUTTON_STATUS, COMPUTE_TOTAL_PRICE, DELETE_FROM_CART, MINUS, PLUS,
    SET_CART_ITEMS, SET_CATEGORIES_LIST,
    SET_CATEGORY_PAGE_ID,
    SET_DELIVERY_DETAILS_FIELD,
    SET_FIELD, SET_PRODUCTS_LIST
} from "./types";
import { Alert, AsyncStorage, ToastAndroid } from "react-native";
import { ComputeTotalPrice, DeleteFromCart } from "./actions";
import { addProductToCart, deleteProductFromCart } from "./db_handler";

const showToastMessage = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};

const isAllDeliveryDetailsSet = (state) => {
    for ( let key in state.deliveryDetails) {

        if (!state.deliveryDetails[key])
            return false;
    }
    return true;
};

/**
 * Редюсер
 * @param  {object} state - объект state
 * @param  {object} action - объект action
 */
const reducer = (state, action) => {
    /**
     * Проверяет тип действия
     */
    switch (action.type)
    {
        case SET_CART_ITEMS:
        {
            const newState = {...state};
            
            newState.cartItems = action.payload || [];

            return newState;
        }

        case SET_FIELD:
        {
            const newState = {...state};
            newState[action.fieldName] = action.payload;

            return newState;
        }


        case SET_DELIVERY_DETAILS_FIELD:
        {
            const newState = {...state};
            newState.deliveryDetails[action.fieldName] = action.payload;

            return newState;
        }

        case CHANGE_BUTTON_STATUS:{
            const newState = {...state};

            if(isAllDeliveryDetailsSet(newState) && !action.buttonEnabled)
                action.setButtonEnabled(true);
            else if(!isAllDeliveryDetailsSet(newState) && action.buttonEnabled)
                action.setButtonEnabled(false);

            return newState;
        }

        /**
         * Устанавливает id категории для текущей страницы
         */
        case SET_CATEGORY_PAGE_ID:
        {
            const newState = {...state};
            newState.currentCategory = action.payload;
            return newState;
        }
        /**
         * Заносит товар и его данные в state
         */
        case ADD_TO_CART:
        {
            const t = action.t; // Translate
            const newState = {...state};



            if(state.cartItems.has(action.payload.productId)){
                const item = state.cartItems.get(action.payload.productId);
                item.count += action.payload.count;
            }
            else{
                state.cartItems.set(action.payload.productId, action.payload);
            }

            
            addProductToCart(action.payload.name,
                action.payload.productId,
                action.payload.imageLink,
                action.payload.count,
                action.payload.price,
                action.payload.selectedVariants,
                action.payload.stockQuantity);

            action.dispatch(ComputeTotalPrice());
            showToastMessage(t("productAddedMessage", {product: action.payload.name}));

            return newState;
        }

        /**
         * Устанавливает список продуктов для текущей страницы
         */
        case SET_PRODUCTS_LIST:
        {
            const newState = {...state};

            newState.products = {...newState.products, [action.id]: action.payload.products.nodes};

            return newState;
        }

        /**
         * Устанавливает список категорий для текущей страницы
         */
        case SET_CATEGORIES_LIST:
        {
            const newState = {...state};

            newState.categories = action.payload;

            return newState;
        }

        /**
         * Расчитывает общую цену для корзины
         */
        case COMPUTE_TOTAL_PRICE:
        {
            const newState = {...state};
            newState.cartTotalPrice = 0;
            
            console.log(`COMPUTE TOTAL PRICE`);

            if(newState.cartItems.size){
                newState.cartItems.forEach( (value)=>{

                    newState.cartTotalPrice += value.itemsTotalPrice;

                })
                
            }
            else{
                newState.cartTotalPrice = 0;
                return newState;
            }
                
            
            
            return newState;
        }

        /**
         * Удаляет товар из корзины
         */
        case DELETE_FROM_CART:
        {
            const newState = {...state};

            
            newState.cartItems.delete(action.payload);
                        

            deleteProductFromCart(action.payload);
            return newState;
        }

        /**
         * Минусует 1 товар из корзины
         */
        case MINUS:
        {
            const t = action.t;
            const newState = {...state};

            if(state.cartItems.has(action.payload)){
                const item = state.cartItems.get(action.payload);
                if( item.count === 1 ){
                    Alert.alert(t("cartDeleteTitle"), t("cartDeleteMessage"), [
                        {
                            text: t("cancel"),
                            onPress: () => {/*action.dispatch({type: "plus", payload: action.payload})*/},
                            style: "cancel"
                        },
                        {
                            text: t("ok"),
                            onPress: () => {
                                action.dispatch(DeleteFromCart(action.payload));
                            }
                        }
                    ],
                    {cancelable: false});

                }
                else{
                    item.count = Math.clamp(item.count - 1, 0, item.stockQuantity || 99);
                    item.itemsTotalPrice = item.count * item.price;
                    addProductToCart(item.name, item.productId, item.imageLink, item.count, item.price, item.selectedVariants, item.stockQuantity);

                }
            }
            else
                return state;


            newState.cartTotalPrice = 0;
        
            console.log(`COMPUTE TOTAL PRICE IN MINUS`);

            if(newState.cartItems.size){
                newState.cartItems.forEach( (value)=>{

                    newState.cartTotalPrice += value.itemsTotalPrice;

                })
                
            }
            else{
                newState.cartTotalPrice = 0;
                
            }
                    



            return newState;

            
        }
        /**
         * Плюсует 1 товар в корзину
         */
        case PLUS:
        {
            const newState = {...state};

            if(newState.cartItems.has(action.payload)){
                const item = newState.cartItems.get(action.payload);
                item.count = Math.clamp(item.count + 1, 1, item.stockQuantity || 99);
                item.itemsTotalPrice = item.count * item.price;
                addProductToCart(item.name, item.productId, item.imageLink, item.count, item.price, item.selectedVariants, item.stockQuantity);
            }
            else 
                return state;
            

            newState.cartTotalPrice = 0;
    
            console.log(`COMPUTE TOTAL PRICE IN plus`);

            if(newState.cartItems.size){
                newState.cartItems.forEach( (value)=>{

                    newState.cartTotalPrice += value.itemsTotalPrice;

                })
                
            }
            else{
                newState.cartTotalPrice = 0;
                
            }



            return newState;

            
        }

        default:
            return state;
    }
};

export default reducer;