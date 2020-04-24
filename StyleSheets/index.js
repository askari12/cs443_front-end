import { StyleSheet } from 'react-native'

const style = StyleSheet.create({

	// Container
    container: {
		flex: 1,
		backgroundColor: '#c0c0c0',
	},
	
	// View
    inputView:{
		width:"80%",
		backgroundColor:"white",
		borderRadius:25,
		height:50,
		marginBottom:20,
		justifyContent:"center",
		padding:20,
	},
	topBar: {
		width: "100%",
		height: "8%",
		backgroundColor: "#1565c0",
		marginTop: Platform.OS === 'android' ? 25 : 0 ,
		borderWidth: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around"
	},
	
	// Input Text
    inputText:{
		height:50,
		color:"black",
	},
	

	// Text
	text:{
		color:"white"
	},
	logoText: {
		fontSize: 30,
		color: "black",
	},

	// button
    btn:{
		width:"80%",
		backgroundColor:"#428bca",
		borderRadius:25,
		height:50,
		alignItems:"center",
		justifyContent:"center",
		marginTop:40,
		marginBottom:10
	},
	barBtn: {
		width: 100,
		backgroundColor:"#0d47a1",
		borderRadius:25,

		height:30,
		alignItems:"center",
		justifyContent:"center",
	},
	
});

export default style;