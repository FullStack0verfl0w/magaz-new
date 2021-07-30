import React, { useLayoutEffect } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useDispatch, useSelector } from "react-redux";
import { AddOrder } from "~/redux/OrdersReducer/actions";

import OurText from "~/components/OurText";
import OurTextButton from "~/components/OurTextButton";
import styles from "./styles";
import { HeaderStyle } from "~/utils/config";

const DeliveryDetailsItem = (props) => {
	const { field, text } = props;
	return (
		<View style={styles.itemContainer}>
			<OurText style={styles.fieldText} translate={true}>{field}</OurText>
			<OurText style={styles.text} translate={!text}>{text || "notAvailable"}</OurText>
		</View>
	)
}

const DeliveryDetailsCheck = (props) => {
	const state = useSelector(state => state.deliveryDetailsReducer);
	const dispatch = useDispatch();
	const { navigation } = props;
	const { data, isOrderMade } = props.route.params;

	const [gradStart, gradEnd] = ["#931DC4", "#F33BC8"];

	useLayoutEffect(() => {
		navigation.setOptions({
			headerStyle: HeaderStyle(gradStart),
		});
	}, [navigation]);

	const goToDetailsEdit = (e) => {
		navigation.navigate("DeliveryDetails");
	};

	const makeAnOrder = (e) => {
		const orderData = {
			firstName: state.deliveryDetails.firstname.value,
			lastName: state.deliveryDetails.lastname.value,
			email: state.deliveryDetails.email.value,
			phone: state.deliveryDetails.phone.value,
			country: state.deliveryDetails.country.value.code,
			address: state.deliveryDetails.address.value,
			postcode: state.deliveryDetails.postcode.value,
			notes: state.deliveryDetails.notes.value,
		};
		dispatch(AddOrder(orderData));
		navigation.popToTop();
	};

	return (
		<>
			<LinearGradient style={styles.background} locations={[0, 1.0]} colors={[gradStart, gradEnd]}/>
			<View style={styles.mainContainer}>
				<View style={styles.topContainer}>
					{
						!isOrderMade ?
							<OurText style={styles.title} translate={true}>orderInfoCheck</OurText>
							: <></>
					}
				</View>
				<ScrollView>
					<DeliveryDetailsItem field={"orderFormFirstName"}
										 text={data.firstname}/>
					<DeliveryDetailsItem field={"orderFormLastName"}
										 text={data.lastname}/>
					<DeliveryDetailsItem field={"orderFormEmail"}
										 text={data.email}/>
					<DeliveryDetailsItem field={"orderFormPhone"}
										 text={data.phone}/>
					<DeliveryDetailsItem field={"orderFormCountry"}
										 text={data.country.name}/>
					<DeliveryDetailsItem field={"orderFormAddress"}
										 text={data.address}/>
					<DeliveryDetailsItem field={"orderFormPostcode"}
										 text={data.postcode}/>
					<DeliveryDetailsItem field={"orderFormNotes"}
										 text={data.notes}/>
				</ScrollView>
				{
					!isOrderMade ?
						<SafeAreaView>
							<View style={styles.bottomContainer}>
								<OurTextButton style={styles.button} onPress={goToDetailsEdit}
											   textStyle={{ color: gradEnd }}
											   translate={true}>orderInfoCheckEdit</OurTextButton>
								<OurTextButton style={styles.button} onPress={makeAnOrder} textStyle={{ color: gradEnd }}
											   translate={true}>orderInfoCheckOrder</OurTextButton>
							</View>
						</SafeAreaView>
						: <></>
				}
			</View>
		</>
	);
};

export default DeliveryDetailsCheck;