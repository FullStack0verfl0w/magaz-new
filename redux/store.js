import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";

import cartReducer from "./CartReducer";
import modalReducer from "./ModalReducer";
import toastReducer from "./ToastReducer";
import ordersReducer from "./OrdersReducer";
import deliveryDetailsReducer from "./DeliveryDetailsReducer";

const isDebuggingEnabled = (typeof DedicatedWorkerGlobalScope) !== 'undefined';

const reducer = combineReducers({
	cartReducer,
	modalReducer,
	toastReducer,
	ordersReducer,
	deliveryDetailsReducer,
});

const store = __DEV__ && isDebuggingEnabled ?
	createStore(reducer, compose(
		applyMiddleware(thunk),
		(window && (window).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)()
	))
	:
	createStore(reducer, applyMiddleware(thunk));


export default store;