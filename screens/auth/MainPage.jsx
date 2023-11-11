import { View, Text } from "react-native";
import React from "react";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import services from "../user/services";
import { Card, Modal } from "../components";
import { Portal, Provider } from "react-native-paper";

export default function MainPage() {
	return (
		<Provider>
			<Portal>
				<Modal isMainPage />
			</Portal>
			<ScrollView>
				{/* {isLoading && <Loading />} */}
				<Text
					style={[
						userStyles.heading,
						userStyles.textshadow,
						// { marginTop: 75 },
					]}>
					Ligao Laundry
				</Text>
				<Text style={[userStyles.heading, { fontWeight: "400", fontSize: 18 }]}>
					Bed and Breakfast
				</Text>
				<View style={userStyles.hr} />
				{services?.map((service) => (
					<Card
						price={service.price}
						desc={service.description}
						key={service.title}
						image={service.image}
						title={service.title}
						subheading={service.subheading}
						blur={service.blurr}
					/>
				))}
			</ScrollView>
		</Provider>
	);
}
