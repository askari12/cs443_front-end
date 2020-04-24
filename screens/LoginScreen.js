import React from 'react';
import { View, Text , TextInput , TouchableOpacity , Alert } from 'react-native';
import basicStyle from '../StyleSheets' ;
import specificStyle from '../StyleSheets/LoginStyle';
import AnimatedLoader from 'react-native-animated-loader';

import axios from 'axios';
import config from '../Config/dev.json';

import * as FileSystem from 'expo-file-system';


export default class Login extends React.Component {

    constructor(props) {
		super(props);
		
		this.readFromFile().then (res => {
			if (res != "" && res != undefined) {
				
				// User is already signed in and is authenticated
				this.goToMenu();
			}
		});
		// State
        this.state = {
            email:"",
			password:"",
			
			loaderVisibility: false,
		}

		// Bind Methods
		this.goToSignUp = this.goToSignUp.bind(this);
		this.goToMenu = this.goToMenu.bind(this);
		this.handleInputs = this.handleInputs.bind(this);

		this.writeToFile = this.writeToFile.bind(this);
		this.readFromFile = this.readFromFile.bind(this);
	}
	
	// Navigation OptionsonPress
	static navigationOptions = {
		headerShown: false,
		title: 'Login',
	};

	// Methods

	// Navigation Methods
	goToMenu() {
		this.props.navigation.navigate("Menu");
	}

	goToSignUp() {
		// this.readFromFile();
		this.props.navigation.navigate("SignUp");
	}

	writeToFile = async(value) => {
		let fileUri = FileSystem.documentDirectory + config.user_id_store;
		await FileSystem.writeAsStringAsync(fileUri, value, { encoding: FileSystem.EncodingType.UTF8 });

	}

	readFromFile = async() => {
	
		let fileUri = FileSystem.documentDirectory + config.user_id_store;
		try{
			let ans = await FileSystem.readAsStringAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
			return ans;
		}
		 
		catch {
			return "";
		}
	}

	// Handle Inputs
	handleInputs() {

		const email = this.state.email;
		const pass = this.state.password;

		// Create Alerts If Empty
		if (!email || !pass) {
			Alert.alert(
				"Login Failed",
				"Email or Password Cannot be Blank",
				[{
					text: 'OK'
				}],
				{ cancelable: false}
			);
			return;
		}

		// Check inputs

		this.setState({loaderVisibility: true});
		axios({
			method: "post",
			url: config.user_api + "/checkPassword",
			headers: {},
			data: {
				email: this.state.email,
				password: this.state.password
			}
		})
		.then(res => {
			const result = res.data;
			console.log(result.data);
			console.log(result.userId);

			this.setState({loaderVisibility: false});

			if (result.data === "true"){

				// Store the userID value in a file
				this.writeToFile(result.userId);

				this.goToMenu();
			} else {
				Alert.alert(
					"Login Failed",
					"Your Email or Password was incorrect..",
					[{
						text: 'Try Again'
					}],
					{ cancelable: false}
				);
			}

		});
		
	}

	// Render Methods
    render() {

		// const visible = this.state.loaderVisibility;

        return (
            <View style={styles.container}>


				<View style={styles.LoginContainer}>

					<AnimatedLoader visible={this.state.loaderVisibility}          overlayColor="rgba(255,255,255,0.75)"          animationStyle={{width: 100 , height: 100}}          speed={1}        />  


					<Text style={styles.LoginLogo}>Linkly</Text>
					<View style={styles.inputView} >
						<TextInput  
							style={styles.inputText}
							placeholder="Email..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({email:text})}/>
					</View>
					<View style={styles.inputView} >
						<TextInput  
							secureTextEntry
							style={styles.inputText}
							placeholder="Password..." 
							placeholderTextColor="#003f5c"
							onChangeText={text => this.setState({password:text})}/>
					</View>

					<TouchableOpacity style={styles.LoginSignUpBtn} onPress={this.goToSignUp} >
						<Text style={styles.text}>Sign Up</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.btn} onPress={() => this.handleInputs()}  >
						<Text style={styles.text}>LOGIN</Text>
					</TouchableOpacity>

				</View>

            </View>
        );

    }

}

// Imort Styles
const styles = { ...basicStyle, ...specificStyle}; 