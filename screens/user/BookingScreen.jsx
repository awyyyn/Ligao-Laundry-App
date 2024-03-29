import {
	View,
	StyleSheet,
	Dimensions,
	ScrollView,
	Keyboard,
	TouchableWithoutFeedback,
	Image,
	Alert,
} from "react-native";
import globalStyles from "../styles/auth-styles";
import {
	Button,
	Dialog,
	HelperText,
	Modal,
	Portal,
	Provider,
	Text,
	TextInput,
} from "react-native-paper";
import userStyles from "../styles/user-styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { setSession, toggleIsBlocked } from "../../features/userSlice";
import { useEffect, useRef, useState } from "react";
import Ant from "react-native-vector-icons/AntDesign";
// import { SelectList } from 'react-native-dropdown-select-list';
import { Picker } from "@react-native-picker/picker";
import ModalSelect from "react-native-expo-modal-select";
import DateTimePicker from "react-native-modal-datetime-picker";
import services from "./services";
import { Notify } from "../components";
import { toggleNotify } from "../../features/uxSlice";
import { RefreshControl, TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BookScreen() {
	// console.log(asd);
	// const { title } = params;
	// console.log("BOOK SCREEN", title);

	const navigation = useNavigation();

	const [type, settype] = useState("Select Type");

	navigation.addListener("focus", async () => {
		// const s = await AsyncStorage.multiGet(["service", "price"]);
		const type = await AsyncStorage.getItem("service");
		const price = await AsyncStorage.getItem("price");
		// console.log("FOCUSSED");
		if (type && price) {
			settype(type);
			setPrice(price);
		} else {
			settype("Select Type");
			setPrice(`00`);
		}
	});

	navigation.addListener("blur", async () => {
		// console.log("BLUR");
		await AsyncStorage.removeItem("service");
	});

	const { notify } = useSelector((state) => state.ux);
	async function getAvailableTime(datee, s_type) {
		// console.log("DAATTEE", datee.toLocaleDateString())
		const { data, error } = await supabase
			.from("laundries_table")
			.select("time")
			.match({ date: datee.toLocaleDateString(), service_type: s_type });
		// console.log(data)
		setAvailableTime(data);
	}

	useEffect(() => {
		(async () => {
			const { data } = await supabase
				.from("customers")
				.select()
				.eq("user_id", session);
		})();

		console.log("HELLO WORLD");
		return () => console.log("UNMOUNTED");
	}, [navigation]);

	useEffect(() => {
		const date = new Date();
		getAvailableTime(date, type);
	}, [date, type]);

	const [availableTime, setAvailableTime] = useState();

	const dispatch = useDispatch();
	const { session, user, isblocked } = useSelector((state) => state.user);
	const [isBlocked, setIsBlocked] = useState(isblocked);
	const [refresh, setRefresh] = useState(false);
	// const [samp, setSamp] = useState(0);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [getTime, setGetTime] = useState("");
	const [price, setPrice] = useState("00.00");
	const [date, setDate] = useState(new Date());
	const [errors, setErrors] = useState({
		typeErr: "",
		dateErr: "",
		timeErr: "",
	});
	// console.log(date.toLocaleString().split(',')[0])
	const [booking, setBooking] = useState(false);
	// console.log(date)
	// useEffect(() => {
	//   navigation.addListener('blur', () => {
	//     navigation.reset({routes: [{name: 'book', key: 'book'}]})
	//     // navigation.navigate('home')
	//   })
	// }, [navigation])

	const time = [
		{
			label: "08:00 AM",
			value: "08:00 AM",
			disabled: availableTime?.find(({ time }) => time == "08:00 AM"),
		},
		{
			label: "09:00 AM",
			value: "09:00 AM",
			disabled: availableTime?.find(({ time }) => time == "09:00 AM"),
		},
		{
			label: "10:00 AM",
			value: "10:00 AM",
			disabled: availableTime?.find(({ time }) => time == "10:00 AM"),
		},
		{
			label: "11:00 AM",
			value: "11:00 AM",
			disabled: availableTime?.find(({ time }) => time == "11:00 AM"),
		},
		{
			label: "01:00 PM",
			value: "01:00 PM",
			disabled: availableTime?.find(({ time }) => time == "01:00 PM"),
		},
		{
			label: "02:00 PM",
			value: "02:00 PM",
			disabled: availableTime?.find(({ time }) => time == "02:00 PM"),
		},
		{
			label: "03:00 PM",
			value: "03:00 PM",
			disabled: availableTime?.find(({ time }) => time == "03:00 PM"),
		},
		{
			label: "04:00 PM",
			value: "04:00 PM",
			disabled: availableTime?.find(({ time }) => time == "04:00 PM"),
		},
	];

	const handleRefresh = async () => {
		setRefresh(true);
		const { data, error } = await supabase
			.from("customers")
			.select()
			.eq("user_id", session)
			.single();
		if (error) {
			setRefresh(false);
			console.log(error);
			// console.log(data)
			return alert(error.message);
		}
		dispatch(toggleIsBlocked(data.is_block));
		setIsBlocked(data.is_block);
		setRefresh(false);
	};

	if (isBlocked) {
		return (
			<Provider>
				<SafeAreaView>
					<Portal>
						<ScrollView
							refreshControl={
								<RefreshControl
									refreshing={refresh}
									onRefresh={handleRefresh}
								/>
							}
							style={{ zIndex: 2, backgroundColor: "#FFF" }}>
							<Image
								source={{
									uri: "https://us.123rf.com/450wm/denyshutter/denyshutter2302/denyshutter230200899/198201485-ransomware-attack-and-cyber-protection-for-user-account-vector-illustration-cartoon-blocked-content.jpg?ver=6",
								}}
								resizeMode="cover"
								resizeMethod="scale"
								style={{
									width: Dimensions.get("screen").width - 20,
									height: 220,
									// marginHorizontal: 'auto'
									alignSelf: "center",
									marginTop: "40%",
								}}
							/>
							<Text
								style={{
									fontSize: 18,
									textAlign: "center",
									paddingHorizontal: 30,
									color: "#00667eaa",
									marginTop: 10,
								}}>
								To address this issue, please contact the admin or staff.
							</Text>
						</ScrollView>
					</Portal>
				</SafeAreaView>
			</Provider>
		);
	}

	return (
		<Provider>
			<SafeAreaView>
				<Portal>
					<Notify />
					<ScrollView
						style={{ zIndex: 2 }}
						refreshing={refresh}
						onRefresh={handleRefresh}>
						<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
							<View style={styles.container}>
								<Text style={[userStyles.heading, userStyles.textshadow]}>
									Book a Service
								</Text>
								<View style={userStyles.hr} />
								<View
									style={{
										display: "flex",
										justifyContent: "space-between",
										height: Dimensions.get("screen").height - 300,
									}}>
									<View style={{ gap: 10, paddingHorizontal: 20 }}>
										<View>
											<Text style={{ marginBottom: 5 }}>Select Service</Text>
											<Picker
												selectedValue={type}
												onValueChange={async (item) => {
													// console.log(item, 'INDEX', index)
													setErrors((prev) => ({ ...prev, typeErr: "" }));
													const getItem = services.find(
														(service) => service.label == item
													);
													if (getItem) {
														setPrice(getItem.price);
													} else {
														setPrice("00.00");
													}
													// console.log("ITEM", item)
													settype(item);
													getAvailableTime(date, item);
												}}
												style={styles.picker}
												mode="dropdown">
												<Picker.Item
													value="Select Type"
													label="Select Type"
													style={{
														color: "#00667E",
														fontWeight: "900",
														// font
													}}
												/>
												{services.map((type) => (
													<Picker.Item
														key={type.value}
														label={type.label}
														value={type.value}
														style={{ zIndex: 99, color: "#000000" }}
													/>
												))}
											</Picker>
											{errors.typeErr && (
												<HelperText style={styles.error}>
													{errors.typeErr}
												</HelperText>
											)}
										</View>
										<View>
											<Text>Price (kg)</Text>
											<TextInput
												left={<TextInput.Icon icon="currency-php" />}
												editable={false}
												mode="outlined"
												outlineStyle={{
													borderWidth: 0,
												}}
												contentStyle={{
													borderRadius: 0,
													backgroundColor: "#ffffff",
												}}
												style={{
													margin: 0,
													padding: 0,
													borderWidth: 0,
													borderColor: "transparent",
												}}
												value={`${price}.00`}
											/>
											{/* <HelperText></HelperText> */}
										</View>
										<View>
											<Text>Date</Text>
											{date.toLocaleDateString() ==
											new Date().toLocaleDateString() ? (
												<TouchableOpacity
													onPressIn={() => setShowDatePicker(true)}>
													<TextInput
														editable={false}
														mode="outlined"
														outlineStyle={{
															borderWidth: 0,
														}}
														contentStyle={{
															borderRadius: 0,
															backgroundColor: "#ffffff",
															paddingHorizontal: 15,
														}}
														value="mm/dd/yyyy"
													/>
												</TouchableOpacity>
											) : (
												<TextInput
													mode="outlined"
													outlineStyle={{
														borderWidth: 0,
													}}
													contentStyle={{
														borderRadius: 0,
														backgroundColor: "#ffffff",
														paddingHorizontal: 15,
													}}
													onPressIn={() => setShowDatePicker(true)}
													value={date.toLocaleDateString()}
												/>
											)}

											{errors.dateErr && (
												<HelperText style={styles.error}>
													{errors.dateErr}
												</HelperText>
											)}
										</View>
										<View>
											<Text style={{ marginBottom: 5 }}>Time</Text>
											<Picker
												style={styles.picker}
												selectedValue={getTime}
												onValueChange={(value) => {
													setErrors((prev) => ({ ...prev, timeErr: "" }));
													setGetTime(value);
												}}>
												<Picker.Item
													color="#00667E"
													value="Select Time"
													label="Select Time"
												/>
												{time.map((timee) => (
													<Picker.Item
														key={timee.value}
														value={timee.value}
														label={timee.label}
														enabled={!timee.disabled}
														style={{
															textDecorationLine: "underline",
															textDecorationStyle: "solid",
															textDecorationColor: "#000000",
															fontStyle: !timee.disabled ? "normal" : "italic",
															backgroundColor: !timee.disabled
																? "transparent"
																: "rgba(0, 0, 0, 0.18)",
														}}
														color={!timee.disabled ? "black" : "gray"}
													/>
												))}
											</Picker>
											{errors.timeErr && (
												<HelperText style={styles.error}>
													{errors.timeErr}
												</HelperText>
											)}
										</View>
										<DateTimePicker
											isVisible={showDatePicker}
											onConfirm={(datee) => {
												setShowDatePicker(false);
												Keyboard.dismiss();
												setDate(datee);
												setGetTime("Select Time");
												getAvailableTime(datee, type);
											}}
											onCancel={() => {
												setShowDatePicker(false);
												Keyboard.dismiss();
											}}
											mode="date"
											minimumDate={new Date()}
											date={date}
										/>
									</View>
									<Button
										style={styles.booknow_btn}
										buttonColor="#00667E"
										textColor="#ffffff"
										onPress={async () => {
											// setErrors('')
											// return
											if (!type || type == "Select Type") {
												setErrors((prevErrors) => ({
													...prevErrors,
													typeErr: "Please select type of service!",
												}));
											}
											const dateVal =
												date.toLocaleString().split(",")[0] ==
												new Date().toLocaleDateString();
											if (dateVal) {
												setErrors((prevErrors) => ({
													...prevErrors,
													dateErr: "Please select other date.",
												}));
											} else {
												setErrors((prevErrors) => ({
													...prevErrors,
													dateErr: "",
												}));
											}
											if (!getTime || getTime == "Select Time") {
												setErrors((prevErrors) => ({
													...prevErrors,
													timeErr: "Please select schedule time!",
												}));
											}
											// console.log("TIME", getTime, "TYPE", type)
											if (
												!type ||
												!getTime ||
												type == "Select Type" ||
												getTime == "Select Time" ||
												dateVal
											)
												return errors;
											// console.log("TYPE", type)
											setBooking(true);
											const { data, error } = await supabase
												.from("laundries_table")
												.insert({
													user_id: session,
													name: user.name,
													address: user.address,
													// email: user.email,
													phone: user.phone,
													service_type: type,
													price: price,
													status: "pending",
													time: getTime,
													date: date.toLocaleString().split(",")[0],
												})
												.select();
											await supabase.from("notification").insert({
												recipent_id: "admin",
												is_read: false,
												notification_title: "book",
												notification_message: `${user.name} book a ${type} service.`,
												sent_by: user.name,
												sent_by_id: session,
											});
											// console.log(data)
											if (error) console.log(error);
											dispatch(
												toggleNotify({
													isOpen: true,
													label: "Booked Successfully",
													color: "#00667E",
													top: 10,
												})
											);
											settype("Select Type");
											setGetTime("Select Time");
											setPrice("00.00");
											setBooking(false);
											setDate(new Date());
											navigation.navigate("home");
											getAvailableTime(new Date());
											setTimeout(() => {
												dispatch(
													toggleNotify({
														isOpen: false,
														label: "",
														color: "#00cc00",
														top: 0,
													})
												);
											}, 5000);
										}}>
										{booking ? "Booking..." : "Book now"}
									</Button>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</ScrollView>
				</Portal>
			</SafeAreaView>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("screen").width - 30,
		display: "flex",
		alignSelf: "center",
	},
	selectStyle: {
		borderRadius: 5,
		borderColor: "rgba(0, 0, 0, 0.5)",
		backgroundColor: "rgba(255, 255, 255, 0.9)",
	},
	error: {
		color: "#ff0000",
	},
	booknow_btn: {
		color: "#00667E",
		width: "85%",
		alignSelf: "center",
	},
	picker: {
		backgroundColor: "#ffffff",
	},
});
