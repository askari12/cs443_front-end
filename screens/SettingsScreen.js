import React from 'react'
import { View, Text, TextInput, TouchableOpacity , ScrollView, Alert , Switch, KeyboardAvoidingView} from 'react-native'

import basicStyle from '../StyleSheets'
import specificStyle from '../StyleSheets/SettingsStyle'

import AnimatedLoader from 'react-native-animated-loader';

import config from '../Config/dev.json'
import window from '../Config/Base64'

import * as FileSystem from 'expo-file-system';
import axios from 'axios'

import { StackActions, NavigationActions } from 'react-navigation';

export default class SettingsScreen extends React.Component {

    // Constructor
    constructor(props) {
        super(props);

       
        this.state = {

            user_id: "",

            fName: "",
            lName: "",
            email: "",
            oldPass: "",
            newPass: "",
            newRePass: "",

            showPasswordOld: true,
            showPassword: true,
            showPasswordRe: true,

            loaderVisibility: false,
        }

        this.goToMenu = this.goToMenu.bind(this);
        this.cancel = this.cancel.bind(this);
        this.trySave = this.trySave.bind(this);
        this.toggleSwitch = this.toggleSwitch.bind(this);

        this.readFromFile = this.readFromFile.bind(this);
    }

    // Navigation Options
    static navigationOptions = {
        headerShown: false,
    }

    // Component Life Cycles
    componentDidMount() {

        // Update Info
        this.readFromFile().then (res => {
            
            this.setState({user_id: res});

            // Add URL data
            axios({
            	method: "get",
            	url: config.user_api + "/users/" + res,
                headers: { 
				    authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
                },
            })
            .then(res=> {
                var result = res.data;

                this.setState({fName: result.firstName , lName: result.lastName , email: result.email})
            });        

		});    
    }

    // Methods

    readFromFile = async() => {
	
		let fileUri = FileSystem.documentDirectory + config.user_id_store;  
        let ans = await FileSystem.readAsStringAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
        return ans;
		
    }
    

    goToMenu() {
        this.props.navigation.navigate('Menu');
    }

    cancel() {
        this.goToMenu();
    }

    toggleSwitch(value) {
        if (value === "pass") {
			this.setState({showPassword: !this.state.showPassword});
		} 
		
		else if (value === "repass") {
			this.setState({showPasswordRe: !this.state.showPasswordRe});
        }
        
        else if (value === "passOld") {
            this.setState({showPasswordOld: !this.state.showPasswordOld});
        }
    }

    trySave() {
        
        var fName = this.state.fName;
		var lName = this.state.lName;
        var email = this.state.email;
        var oldPass = this.state.oldPass
		var newPass = this.state.newPass;
        var newRePass = this.state.newRePass;
        
        // Check if The Inputs are empty
        if (fName === "" || lName === "" || email === "" || oldPass === "" || newPass === "" || newRePass === "" ) {
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

        // Check if the new password is greater than 8
        if (newPass.length < 8) {
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
		if (newPass !== newRePass) {
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

        // Check if the Old Pass is correct
        this.setState({loaderVisibility: true});
        axios({
			method: "post",
			url: config.user_api + "/checkPassword",
			data: {
				email: email,
				password: oldPass
			},
			headers: { 
				authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
			}
        })

        .then(res => {



            // The Old pass is correct 
            // Update Over Here
            axios({
                method: "put",
                url: config.user_api + "/updateUser/" + this.state.email,
                headers: { 
                    authorization: 'Basic ' + window.btoa(config.username + ":" + config.password)
                },
                data: {
                    "firstName": this.state.fName ,
                    "lastName": this.state.lName,
                    "email": this.state.email,
                    "password": this.state.newPass
                }
            })
            .then (res => {
                Alert.alert(
					"Updated Successfully",
					"Enjoy " + this.state.fName + " " + this.state.lName,
					[{
						text: 'LINKLY'
					}],
					{ cancelable: false}
                );
            })
            .catch(err=>{
                console.log(err);
            });
            // .finally(() => {
            //     this.setState({loaderVisibility: true});
            //     const resetAction = StackActions.reset({
            //         index: 0,
            //         actions: [NavigationActions.navigate({ routeName: 'Menu' })],
            //     });
            //     this.props.navigation.dispatch(resetAction);
            // });;
        })

        .catch(err =>{
			this.setState({loaderVisibility: false});
			console.log(err);
			
			if (err.response.status == 401 || err.response.status == 403 || err.response.status == 404) {
				Alert.alert(
					"Login Failed",
					"Your Email or Password was incorrect..",
					[{
						text: 'Try Again'
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
            
        })
        .finally(() => {
            this.setState({loaderVisibility: true});
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Menu' })],
            });
            this.props.navigation.dispatch(resetAction);
        });
        
    }


    render() {
        return(
            <View style={styles.container}>
                <View style={styles.settingsContainer}>
                    <View style= {styles.topBar}>
                            <Text style={styles.logoText}>LINKLY</Text>
                            
                            <TouchableOpacity style={styles.barBtn} onPress={this.goToMenu} >
                                <Text style={styles.text}>Go Back</Text>
                            </TouchableOpacity>

                    </View>

                    <AnimatedLoader visible={this.state.loaderVisibility}          overlayColor="rgba(255,255,255,0.75)"          animationStyle={{width: 100 , height: 100}}          speed={1}        />  

                    <View  style={styles.settingsInputContainer} >
                        
                            <Text style={styles.settingsLogo}>Linkly</Text>
                            {/* First Name */}
                            <View style={styles.inputView} >
                                <TextInput  
                                    style={styles.inputText}
                                    value={this.state.fName} 
                                    placeholderTextColor="#003f5c"
                                    onChangeText={text => this.setState({fName:text})}/>
                            </View>
                            {/* Last Name */}
                            <View style={styles.inputView} >
                                <TextInput  
                                    style={styles.inputText}
                                    value={this.state.lName}
                                    placeholderTextColor="#003f5c"
                                    onChangeText={text => this.setState({lName:text})}/>
                            </View>
                            {/* Old Password */}
                            <View style={styles.inputView} >
                                <View style= {styles.settingsPasswordView}>
                                    <TextInput  
                                    secureTextEntry={this.state.showPasswordOld}
                                    style={styles.inputText}
                                    placeholder="Old Password..." 
                                    placeholderTextColor="#003f5c"
                                    onChangeText={text => this.setState({oldPass:text})}/>
                                    <Switch
                                        onValueChange={() => {this.toggleSwitch("passOld")}}
                                        value={!this.state.showPasswordOld}
                                    />
                                </View> 
                            </View>
                            {/* Password */}
                            <View style={styles.inputView} >
                                <View style= {styles.settingsPasswordView}>
                                    <TextInput  
                                    secureTextEntry={this.state.showPassword}
                                    style={styles.inputText}
                                    placeholder="Password..." 
                                    placeholderTextColor="#003f5c"
                                    onChangeText={text => this.setState({newPass:text})}/>
                                    <Switch
                                        onValueChange={() => {this.toggleSwitch("pass")}}
                                        value={!this.state.showPassword}
                                    />
                                </View> 
                            </View>
                            {/* Re-enter Password */}
                            <View style={styles.inputView} >
                                <View style= {styles.settingsPasswordView}>
                                    <TextInput  
                                        secureTextEntry={this.state.showPasswordRe}
                                        style={styles.inputText}
                                        placeholder="Re-enter Password..." 
                                        placeholderTextColor="#003f5c"
                                        onChangeText={text => this.setState({newRePass:text})}/>
                                    <Switch
                                        onValueChange={() => {this.toggleSwitch("repass")} }
                                        value={!this.state.showPasswordRe}
                                    />
                                </View> 
                            </View>

                            <View style={styles.settingsBtnContainer} >
                                <TouchableOpacity style={styles.settingsBtn } onPress={this.trySave} >
                                    <Text style={styles.text}>Save</Text>
                                </TouchableOpacity> 

                                <TouchableOpacity style={styles.settingsBtn} onPress={this.cancel} >
                                    <Text style={styles.text}>Cancel</Text>
                                </TouchableOpacity> 
                            </View>
                        
                    </View>

                </View>
            </View>
        );
    }
}


const styles = { ...basicStyle , ...specificStyle };