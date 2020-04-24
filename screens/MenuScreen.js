import React from 'react'
import { View, Text, BackHandler, TouchableOpacity , FlatList, Alert} from 'react-native'
import basicStyle from '../StyleSheets'
import specificStyle from '../StyleSheets/MenuStyle'

import UrlView from '../Components/UrlView'
import AnimatedLoader from 'react-native-animated-loader';

import config from '../Config/dev.json'
import * as FileSystem from 'expo-file-system';
import axios from 'axios'

export default class MainPage extends React.Component {

    // Constructor
    constructor(props) {
        super(props);

        var randDict = [];
       
        this.state = {
            data: randDict,

            user_id: "",

            loaderVisibility: false,
        }

        this.goToNewURL = this.goToNewURL.bind(this);
        this.goToURLAnalytics = this.goToURLAnalytics.bind(this);
        this.goToLogin = this.goToLogin.bind(this);

        this.deleteUserId = this.deleteUserId.bind(this);
        this.readFromFile = this.readFromFile.bind(this);
    }

    // Navigation Options
    static navigationOptions = {
        headerShown: false,
    }

    // Component Life Cycle 

    onFocusFunction = () => {
        // do some stuff on every screen focus
        BackHandler.addEventListener("hardwareBackPress" , this.disableBackAction);

        this.setState({loaderVisibility: true});
        this.readFromFile().then (res => {
 

            // Add URL data
            axios({
            	method: "get",
            	url: config.url_mapping_api + "/url/user/getAll/" + res,
            	headers: {},
            })
            .then(res => {
                const result = res.data;
                
                var randDict = []
                for (var i = 0 ; i < result.length ; i++) {
                    randDict.push( { 'URL': result[i].shortUrl , 'exDate': result[i].terminated_at.slice(0, 10) , 'longUrl' : result[i].longUrl , 'id' : result[i]._id});
                }

                this.setState({loaderVisibility: false});
                this.setState({data: randDict});

                console.log(randDict);

            })
            .catch(err =>{
                Alert.alert(
					"Server Error",
					"We are sorry for the inconvenince...",
					[{
						text: 'Try Again'
					}],
					{ cancelable: false}
                );
                
                this.setState({loaderVisibility: false});
            });


		});    
      }

    async componentDidMount() {

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
          })
    }

    // and don't forget to remove the listener
    componentWillUnmount () {
        this.focusListener.remove()
    }

    // Methods

    // Navigation Methods
    disableBackAction = () => {
        return true;
    }

    goToNewURL() {
        this.props.navigation.navigate('NewURL');
    }

    goToURLAnalytics() {
        this.props.navigation.navigate('UrlAnalytics');
    }

    goToLogin() {
        this.deleteUserId();
        this.props.navigation.navigate('Login');
    }

    deleteUserId = async () => {
        let fileUri = FileSystem.documentDirectory + config.user_id_store;
		await FileSystem.deleteAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
    }

    readFromFile = async() => {
	
		let fileUri = FileSystem.documentDirectory + config.user_id_store;  
        let ans = await FileSystem.readAsStringAsync(fileUri , { encoding: FileSystem.EncodingType.UTF8 });
        return ans;
		
	}

    // Render Method
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.menuContainer}>

                <AnimatedLoader visible={this.state.loaderVisibility}          overlayColor="rgba(255,255,255,0.75)"          animationStyle={{width: 100 , height: 100}}          speed={1}        />
                    <View style= {styles.topBar} >
                        <Text style={styles.logoText}>LINKLY</Text>
                        
                        <TouchableOpacity style={styles.barBtn} onPress={this.goToNewURL} >
                            <Text style={styles.text}>New URL</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.barBtn} onPress={this.goToLogin} >
                            <Text style={styles.text}>Sign Out</Text>
                        </TouchableOpacity>

                    </View>

                    <FlatList 

                        numColumns={2}
                        keyExtractor= {(item) => item.URL}
                        data= {this.state.data}
                        renderItem={({item}) => (
                            <View style={styles.menuFlatList}>
                               <UrlView URL={item.URL} exDate={item.exDate} longUrl={item.longUrl} id={item.id} navigation={this.props.navigation} />
                            </View>
                        )}
                    />

                    
                </View>
            </View>
        );
    }	
} 

const styles = { ...basicStyle , ...specificStyle };