import { TOAST_ADD, TOAST_CHANGE_DURATION, TOAST_DELETE } from "./types";

export const AddToast = (data, id) => {
	return { type: TOAST_ADD, payload: data, id };
};

export const DeleteToast = (id) => {
	return { type: TOAST_DELETE, id };
};

export const ChangeToastDuration = (id, duration) => {
	return { type: TOAST_CHANGE_DURATION, id, duration };
};