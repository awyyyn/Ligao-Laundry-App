import { View } from "react-native";
import React from "react";
import { Text, Surface } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Dimensions } from "react-native";
import { Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { openModal } from "../../../features/modalSlice";

export default function index({ title, subheading, image, blur, price, desc }) {
	const dispatch = useDispatch();

	return (
		<Pressable onPress={() => dispatch(openModal({ title, price, desc }))}>
			<Surface elevation={4} style={styles.container}>
				<View style={[styles.bgColor, styles.absolute]} />
				<View style={styles.text}>
					<Text style={styles.title}>{title}</Text>
					{subheading && (
						<>
							<View style={styles.hr} />
							<Text style={styles.subheading}>{subheading}</Text>
						</>
					)}
				</View>
				<Image
					blurRadius={blur}
					style={[styles.image, styles.absolute]}
					source={image}
				/>
			</Surface>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 10,
		display: "flex",
		alignSelf: "center",
		height: Dimensions.get("screen").width - 155,
		width: Dimensions.get("screen").width - 75,
		margin: 10,
		borderRadius: 30,
		overflow: "hidden",
		position: "relative",
	},
	absolute: {
		position: "absolute",
		height: "100%",
		width: "100%",
	},
	image: {
		zIndex: 1,
	},
	bgColor: {
		backgroundColor: "rgba(9, 9, 15, 0.75)",
		zIndex: 11,
	},
	text: {
		zIndex: 13,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
	},
	title: {
		color: "rgb(240, 240, 240)",
		fontSize: 30,
		fontWeight: "800",
	},
	hr: {
		borderBottomColor: "#FFFFFF",
		borderBottomWidth: 2,
		margin: 2,
		width: "80%",
		zIndex: 14,
	},
	subheading: {
		color: "#FFFFFF",
		fontSize: 20,
		fontWeight: "300",
	},
});
