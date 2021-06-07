import React, { memo, useState } from "react";
import { LayoutAnimation, TextInput, TouchableOpacity, View } from "react-native";
import PickerModal from "react-native-picker-modal-view";
import OurText from "~/components/OurText";
import PickerButton from "~/components/PickerButton";

import countries from "~/CountriesEnum.json";
import styles from "~/components/OurTextField/styles";
import { useDispatch, useSelector } from "react-redux";
import { ChangeDeliveryField } from "~/redux/DeliveryDetailsReducer/actions";
import { useTranslation } from "react-i18next";

const PickerElement = memo((props) => {
    const { data, isSelected } = props;

    return (
        <View style={[styles.countryElement, isSelected ? styles.countryElementActive : null]}>
            <OurText style={styles.countryElementText}>{data.Name}</OurText>
        </View>
    );
});

const OurCountryPicker = (props) => {
    const [selected, setSelected] = useState(null);
    const state = useSelector(state=>state.deliveryDetailsReducer);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onSelect = (select) => {
        setSelected(select);

        if ( select.Value )
            dispatch(ChangeDeliveryField("country", countries[select.Value]));
        else
            dispatch(ChangeDeliveryField("country", null, false));
    };

    return (
        <View style={styles.mainContainer}>
            <OurText style={[styles.placeholder,
                state.deliveryDetails.country.value ? styles.placeholderFocused : styles.placeholderUnfocused,
                state.deliveryDetails.country.valid ? styles.placeholderValid : styles.placeholderNotValid]} translate={true}>orderFormCountry</OurText>

            <PickerModal
                renderSelectView={(disabled, sel, showModal) =>
                    <TouchableOpacity activeOpacity={1} onPress={showModal} style={{
                        width: "100%"}}>
                        <TextInput style={[styles.textInput, state.deliveryDetails.country.valid ? styles.textInputValid : styles.textInputNotValid]}
                                   editable={false}
                                   value={state.deliveryDetails.country.value?.name}/>
                    </TouchableOpacity>
                }
                searchPlaceholderText={t("productsPickerSearch")}
                renderListItem={(_, data) => <PickerElement data={data} isSelected={selected?.Value === data.Value} />}
                onSelected={onSelect}
                items={Object.entries(countries).map( (v, i) => ({ Name: v[1].name, Value: v[1].code, Id: i }) )}
                showToTopButton={true}
                backButtonDisabled={true}
                showAlphabeticalIndex={true}
                autoGenerateAlphabeticalIndex={true}
                requireSelection={false}
                autoSort={false}
            />
        </View>
    );
};

export default OurCountryPicker;