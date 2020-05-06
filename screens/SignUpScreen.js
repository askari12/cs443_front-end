import React from 'react';
import { View, Text , TextInput , TouchableOpacity , Alert , Switch } from 'react-native';
import basicStyle from '../StyleSheets' 
import specificStyle from '../StyleSheets/SignUpStyle'

import axios from 'axios'

import config from '../Config/dev.json';
import window from '../Config/Base64';
import * as FileSystem from 'expo-file-system';


export default class SignUp extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            fName: "",
            lName: "",
            email: "",
            password: "",
			rePassword: "",
			
			showPassword: true,
			showPasswordRe: true,
		}
		
		this.checkInputs = this.checkInputs.bind(this);
		this.writeToFile = this.writeToFile.bind(this);
		this.goToMenu = this.goToMenu.bind(this);
		this.toggleSwitch = this.toggleSwitch.bind(this);
	}
	
	// Navigation Options
	static navigationOptions = {
        headerShown: false,
		title: 'SignUp'
	};

	// Navigation Methods
	goToMenu() {
		this.props.navigation.navigate("Menu");
	}

	// Async method to write to file
	writeToFile = async(value) => {
		let fileUri = FileSystem.documentDirectory + config.user_id_store;
		await FileSystem.writeAsStringAsync(fileUri, value, { encoding: FileSystem.EncodingType.UTF8 });
	}

	// Toggle Switch
	toggleSwitch(value) {
		if (value === "pass") {
			this.setState({showPassword: !this.state.showPassword});
		} 
		
		else if (value === "repass") {
			this.setState({showPasswordRe: !this.state.showPasswordRe});
		}
	}

	// Check Inputs
	checkInputs() {

		var fName = this.state.fName;
		var lName = this.state.lName;
		var email = this.state.email;
		var password = this.state.password;
		var rePassword = this.state.rePassword;

		// If Any Field is empty
		if (fName === "" || lName === "" || email === "" || password === "" || rePassword === "" ) {
			Alert.alert(
				"Sign Up Failed",
				"No Field Can be Left Empty",
				[{
					text: 'Try Again'
				}],
				{ cancelable: false}
			);
			return;
		}

		// Check Password Rules
		if (password.length < 8) {
			Alert.alert(
				"Sign Up Failed",
				"Password should be atleast 8 characters long",
				[{
					text: 'Try Again'
				}],
				{ cancelable: false}
			);
			return;
		}

		// Check if Password is entered correctly
		if (password !== rePassword) {
			Alert.alert(
				"Sign Up Failed",
				"Passwords do not match",
				[{
					text: 'Try Again'
				}],
				{ cancelable: false}
			);
			return;
		}

		// Attempt to create a user in db
		axios({
			method: "post",
			url: config.user_api +  "/createUser",
			headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			},
			data: {
				firstName: fName,
				lastName: lName,
				email: email,
				password: password
			}
		})
		.then(res => {
			const result = res.data;
			console.log(result);
			
			// User Is Created
			if (res.status == 200 || res.status == 201 ) {

				// Add User Credentials
				this.writeToFile(result.userId);

				Alert.alert(
					"Signed Up !",
					"Welcome " + this.state.fName + " " + this.state.lName,
					[{
						text: 'LINKLY'
					}],
					{ cancelable: false}
				);

				this.goToMenu();

			} 
			
		})
		.catch(err=> {
			
			// User email already exists
			if (err.response.status == 403 || err.response.status == 404) {
				Alert.alert(
					"Sign Up Failed",
					"This Email Already Exists",
					[{
						text: 'Try Another Email'
					}],
					{ cancelable: false}
				);
			}

			// Else 
			else {
				Alert.alert(
					"Server Error",
					"We're sorry for the inconvenience..",
					[{
						text: 'Try Again'
					}],
					{ cancelable: false}
				);
			}
		});
	};

	// Render Methods
    render() {

        return (
            <View style={styles.container}>
				
				<View style={styles.SignUpContainer}>

					<Text style={styles.SignUpLogo}>Linkly</Text>
					{/* First Name */}
					<View style={styles.inputView} >
						<TextInput  
							style={styles.inputText}
							placeholder="First Name..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({fName:text})}/>
					</View>
					{/* Last Name */}
					<View style={styles.inputView} >
						<TextInput  
							style={styles.inputText}
							placeholder="Last Name..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({lName:text})}/>
					</View>
					{/* Email */}
					<View style={styles.inputView} >
						<TextInput  
							style={styles.inputText}
							placeholder="Email..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({email:text})}/>
					</View>
					{/* Password */}
					<View style={styles.inputView} >
						<View style= {styles.SignUpPasswordView}>
							<TextInput  
							secureTextEntry={this.state.showPassword}
							style={styles.inputText}
							placeholder="Password..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({password:text})}/>
							<Switch
								onValueChange={() => {this.toggleSwitch("pass")}}
								value={!this.state.showPassword}
							/>
						</View> 
					</View>
					{/* Re-enter Password */}
					<View style={styles.inputView} >
						<View style= {styles.SignUpPasswordView}>
							<TextInput  
								secureTextEntry={this.state.showPasswordRe}
								style={styles.inputText}
								placeholder="Re-enter Password..." 
								placeholderTextColor="#003f5c"
								onChangeText={text => this.setState({rePassword:text})}/>
							<Switch
								onValueChange={() => {this.toggleSwitch("repass")} }
								value={!this.state.showPasswordRe}
							/>
						</View> 
					</View>


					<TouchableOpacity style={styles.btn} onPress={this.checkInputs} >
						<Text style={styles.text}>Sign Up !</Text>
					</TouchableOpacity>  

				</View>
        
            </View>
        );

    }

}

// Imort Styles
const styles = {...basicStyle , ...specificStyle}; 