import { DELIVERY_CHANGE_FIELD, DELIVERY_CLEAR } from "./types";

export const ChangeDeliveryField = (fieldName, value, valid = true) => {
	return { type: DELIVERY_CHANGE_FIELD, fieldName, payload: value, valid };
};

export const ClearDeliveryDetails = () => {
	return { type: DELIVERY_CLEAR };
};