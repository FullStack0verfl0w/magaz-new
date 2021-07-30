import React, { useState } from "react";
import { View } from "react-native";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import OurIconButton from "~/components/OurIconButton";
import OurTextField from "~/components/OurTextField";
import styles from "~/components/OurPasswordField/styles";

const OurPasswordField = (props) => {
	const { model, validate } = props;

	const [toggleSecure, setToggleSecure] = useState(true);

	const changeSecure = () => {
		setToggleSecure(value => !value);
	};

	return (
		<View style={styles.mainContainer}>
			<OurTextField   placeholder="registerPageFormPassword"
							autoCapitalize="none"
							autoCompleteType="password"
							secureTextEntry={toggleSecure}
							onValidate={validate}
							model={model} />
			<OurIconButton style={styles.eye} onPress={changeSecure} size={32} icon={toggleSecure ? faEyeSlash : faEye} />
		</View>
	);
};

export default OurPasswordField;