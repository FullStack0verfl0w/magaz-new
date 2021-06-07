import { DELIVERY_CHANGE_FIELD, DELIVERY_CLEAR } from "./types";
import countries from "~/CountriesEnum.json";
import i18n from "~/i18n";


const deliveryDetailsInitialState = {
    deliveryDetails: {
        firstname: {
            name: "firstname",
            placeholder: "orderFormFirstName",
            value: "",
            valid: false,
        },
        lastname: {
            name: "lastname",
            placeholder: "orderFormLastName",
            value: "",
            valid: false,
        },
        phone: {
            name: "phone",
            placeholder: "orderFormPhone",
            value: "",
            valid: false,
        },
        email: {
            name: "email",
            placeholder: "orderFormEmail",
            value: "",
            valid: false,
        },
        country: {
            name: "country",
            placeholder: "orderFormCountry",
            value: countries[i18n?.language?.toUpperCase()] || countries["US"],
            valid: true,
        },
        address: {
            name: "address",
            placeholder: "orderFormAddress",
            value: "",
            valid: false,
        },
        postcode: {
            name: "postcode",
            placeholder: "orderFormPostCode",
            value: "",
            valid: false,
        },
        notes: {
            name: "notes",
            placeholder: "orderFormNotes",
            value: "",
            valid: true,
        },
    },
    allFieldsAreValid: false,
};

const deliveryDetailsReducer = ( state = deliveryDetailsInitialState, action ) => {
    switch (action.type) {

        /**
         * Изменяет поле в deliveryDetails
         */
         case DELIVERY_CHANGE_FIELD: {
            const newState = {...state};
            const { fieldName } = action;
            let valid = true;

            newState.deliveryDetails[fieldName].value = action.payload;
            newState.deliveryDetails[fieldName].valid = action.valid;

            for ( const [fn, data] of Object.entries(newState.deliveryDetails) ) {
                if ( !data.valid )
                    valid = false;
            }
            newState.allFieldsAreValid = valid;

            return newState;
        }

        /**
         * Очищает deliveryDetails
         */
        case DELIVERY_CLEAR: {
            const newState = {...state};
            for (const [field, obj] of Object.entries(newState.deliveryDetails) ) {
                newState.deliveryDetails[field].value = "";
            }
            newState.allFieldsAreValid = false;

            return newState;
        }

        default: {
            return state;
        }
    }
};

export default deliveryDetailsReducer;