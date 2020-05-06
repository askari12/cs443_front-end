import { StyleSheet } from 'react-native'

const style = StyleSheet.create({ 
    
    // Containers
    newUrlContainer: {
        width: "100%",
        height: "100%",
    
    },
    newUrlBottomContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingBottom: 80
    },

    // Views
	longURLInput: {
        backgroundColor: "white",
        width: "90%",
        height: 100,
        borderRadius: 25,
        borderWidth: 5,
        borderColor: "#0d47a1",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    shortURLInput: {
        width: "90%",
        backgroundColor: "white",
        
        borderRadius: 25,
        borderWidth: 5,
        borderColor: "#0d47a1",

        alignItems: "center",
        justifyContent: "center"
    },
    datePickerInput: {
        width: "90%",
        backgroundColor: "white",
        
        borderRadius: 25,
        borderWidth: 5,
        borderColor: "#0d47a1",

        alignItems: "center",
        justifyContent: "space-evenly"
    },
    displayDate: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: "space-evenly"
    },
    
    // Button
    newURLBtn: {
        width:"80%",
		backgroundColor:"#428bca",
		borderRadius:25,
		height:50,
		alignItems:"center",
		justifyContent:"center",
		marginBottom:10
    },

    // Input Text 
    newURLInputText: {
        height:50,
        color:"black",
        fontSize: 20,
        // textAlign: "center",
    },

    // Text
    newUrltext: {
        height:30,
        color:"black",
        fontSize: 20,
        textAlign: "center",
    },


});

export default style;