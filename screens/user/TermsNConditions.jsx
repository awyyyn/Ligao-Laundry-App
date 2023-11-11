import { View, Text } from "react-native";
import React from "react";

const TermsNConditions = () => {
	return (
		<View style={{ padding: 30 }}>
			<Text style={{ fontSize: 16, lineHeight: 30, textAlign: "justify" }}>
				{`\t\t`}
				By using our laundry booking system within this application, you agree
				to abide by the following terms and conditions. You must provide
				accurate and complete information when making a reservation, and you are
				responsible for the timely drop-off and pick-up of your laundry. Any
				special requests or preferences should be communicated at the time of
				booking. We reserve the right to refuse service if your items are not
				suitable for laundering or cleaning. Payment is due upon completion of
				the service, and any disputes regarding the quality of service should be
				reported within 24 hours of pick-up. The use of the laundry booking
				system is subject to compliance with all applicable laws and
				regulations. We reserve the right to modify these terms and conditions
				at any time, and your continued use of the system constitutes your
				acceptance of the updated terms.
			</Text>
		</View>
	);
};

export default TermsNConditions;
