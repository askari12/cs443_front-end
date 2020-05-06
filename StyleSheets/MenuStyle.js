import { StyleSheet } from 'react-native'

const style = StyleSheet.create({

    // Containers
	menuContainer: {
		width: "100%",
		height: "100%",
	},

	// Flat List
	menuFlatList: {
		margin:"1.25%",
		width: "47%",
		height: "100%",
		marginTop:10,
	},

	// Views
	menuEmptyTextContainer: {
		width: "100%",
		height: "100%",
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	// Text
	menuText: {
		fontSize:18,
		color:"black",
		justifyContent: "center"
	},

})

export default style;