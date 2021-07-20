import React, { useLayoutEffect } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ChangeDeliveryField } from "~/redux/DeliveryDetailsReducer/actions";
import { EMAIL_PATTERN, PHONE_PATTERN } from "~/utils/patterns";
import OurTextButton from "~/components/OurTextButton";
import OurTextField from "~/components/OurTextField";
import styles from "./styles";
import OurCountryPicker from "~/components/OurCountryPicker";
import { HeaderStyle } from "~/utils/config";

const DeliveryDetails = (props) => {
	const state = useSelector(state => state.deliveryDetailsReducer);
	const dispatch = useDispatch();
	const { navigation } = props;
	const { t } = useTranslation();
	const [gradStart, gradEnd] = ["#1DC44F", "#3BF3AE"];

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: HeaderStyle(gradStart),
		});
	}, [navigation]);

	const validateForm = (value, name) => {
		if ( value.trim() !== "" ) {
			dispatch(ChangeDeliveryField(name, value));
			return true;
		}
		dispatch(ChangeDeliveryField(name, value, false));
	};
	const validateFormEmail = (value) => {
		if ( value.trim() !== "" ) {
			if ( value.toLowerCase().match(EMAIL_PATTERN) ) {
				dispatch(ChangeDeliveryField("email", value));
				return true;
			}
		}
		dispatch(ChangeDeliveryField("email", value, false));
	};
	const validateFormPhone = (value) => {
		if ( value.trim() !== "" ) {
			if ( value.toLowerCase().match(PHONE_PATTERN) ) {
				dispatch(ChangeDeliveryField("phone", value));
				return true;
			}
		}
		dispatch(ChangeDeliveryField("phone", value, false));
	};

	const goToDetailsCheck = (e) => {
		const deliveryDetails = {
			firstname: state.deliveryDetails.firstname.value,
			lastname: state.deliveryDetails.lastname.value,
			email: state.deliveryDetails.email.value,
			phone: state.deliveryDetails.phone.value,
			country: state.deliveryDetails.country.value,
			address: state.deliveryDetails.address.value,
			postcode: state.deliveryDetails.postcode.value,
			notes: state.deliveryDetails.notes.value,
		};
		navigation.navigate("DeliveryDetailsCheck", { data: deliveryDetails, isOrderMade: false });
	};

	return (
		<>
			<LinearGradient style={styles.background} locations={[0, 1.0]} colors={[gradStart, gradEnd]}/>
			<View style={styles.mainContainer}>
				<KeyboardAvoidingView style={styles.infoContainer}>
					<ScrollView style={styles.scrollView} contentContainerStyle={styles.details}>
						<OurTextField name="firstname"
									  autoCompleteType="name"
									  defValue={state.deliveryDetails.firstname.value}
									  onValidate={validateForm}
									  placeholder={t("orderFormFirstName")}/>
						<OurTextField name="lastname"
									  autoCompleteType="name"
									  defValue={state.deliveryDetails.lastname.value}
									  onValidate={validateForm}
									  placeholder={t("orderFormLastName")}/>
						<OurTextField name="email"
									  keyboardType="email-address"
									  autoCompleteType="email"
									  defValue={state.deliveryDetails.email.value}
									  onValidate={validateFormEmail}
									  placeholder={t("orderFormEmail")}/>
						<OurTextField name="phone"
									  keyboardType="phone-pad"
									  autoCompleteType="tel"
									  defValue={state.deliveryDetails.phone.value}
									  onValidate={validateFormPhone}
									  placeholder={t("orderFormPhone")}/>
						<OurCountryPicker/>
						<OurTextField name="address"
									  autoCompleteType="street-address"
									  defValue={state.deliveryDetails.address.value}
									  onValidate={validateForm}
									  placeholder={t("orderFormAddress")}/>
						<OurTextField name="postcode"
									  autoCompleteType={"postal-code"}
									  defValue={state.deliveryDetails.postcode.value}
									  onValidate={validateForm}
									  placeholder={t("orderFormPostcode")}/>
						<OurTextField name="notes"
									  defValue={state.deliveryDetails.notes.value}
									  onValidate={validateForm}
									  placeholder={t("orderFormNotes")}/>
					</ScrollView>
				</KeyboardAvoidingView>
				<View style={styles.bottomContainer}>
					<OurTextButton disabled={!state.allFieldsAreValid} onPress={goToDetailsCheck}
								   textStyle={{ color: gradEnd }} translate={true}>orderInfoCheckOrder</OurTextButton>
				</View>
			</View>
		</>
	);
};

export default DeliveryDetails;