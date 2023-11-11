import TermsNConditions from "../screens/user/TermsNConditions";
import {
	BookingScreen,
	Notification,
	HomeScreen,
	Message,
	Record,
	Status,
	Profile,
	ResetPassword,
	Logout,
} from "../screens/user/index";

export default userscreens = [
	{
		label: "Home",
		name: "home",
		screen: HomeScreen,
		icon: "home",
	},
	{
		label: "Profile",
		name: "profile",
		screen: Profile,
		icon: "account",
	},
	{
		label: "Message",
		name: "message",
		screen: Message,
		icon: "message",
	},
	{
		label: "Notification",
		name: "notification",
		screen: Notification,
		icon: "bell",
	},
	{
		label: "Book",
		name: "book",
		screen: BookingScreen,
		icon: "book-arrow-right",
	},
	{
		label: "Status",
		name: "status",
		screen: Status,
		icon: "list-status",
	},
	{
		label: "Records",
		name: "records",
		screen: Record,
		icon: "book-alphabet",
	},
	{
		label: "Terms & Conditions",
		name: "termsNconditions",
		screen: TermsNConditions,
		icon: "book-check",
	},
	{
		label: "Logout",
		name: "logout",
		screen: Logout,
		icon: "logout",
	},
];
