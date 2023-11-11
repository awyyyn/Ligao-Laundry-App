import React from "react";
import { Button, Modal, Text } from "react-native-paper";
import { Dimensions, View, StyleSheet } from "react-native";
import userStyles from "../../../styles/user-styles";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../../features/modalSlice";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function index({ isMainPage }) {
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const { isOpen, title, price, desc } = useSelector((state) => state.modal);
	const handleBook = async () => {
		// alert(title);
		dispatch(closeModal());
		await AsyncStorage.setItem("service", title);
		navigation.navigate("user", {
			screen: "book",
			service: title,
		});
		// router.navigate('Book');
	};

	return (
		<Modal
			onDismiss={() => dispatch(closeModal())}
			visible={isOpen}
			contentContainerStyle={styles.modal}>
			<Text style={styles.modalTitle}>{title}</Text>
			<View style={styles.hr} />
			<Text style={styles.description}>{desc}</Text>
			<View style={userStyles.spaceBetween}>
				<Text style={userStyles.price}>Price: ₱ {price}/kilo</Text>
				{!isMainPage && (
					<Button onPress={handleBook} mode="contained" buttonColor="#00667E">
						Book
					</Button>
				)}
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		backgroundColor: "rgb(255, 255, 255)",
		width: Dimensions.get("screen").width - 50,
		paddingBottom: 20,
		alignSelf: "center",
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,
		position: "relative",
		borderRadius: 10,
		display: "flex",
		justifyContent: "flex-start",
	},
	modalTitle: {
		fontSize: 40,
		color: "#00667E",
		fontWeight: "700",
	},
	hr: {
		margin: 3,
		borderColor: "grey",
		borderBottomWidth: 2,
	},
	description: {
		fontSize: 16,
		lineHeight: 25,
		color: "rgba(46, 59, 64, 0.8)",
		textAlign: "justify",
		padding: 4,
	},
});
