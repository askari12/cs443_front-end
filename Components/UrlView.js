import React from 'react'
import { View , Text , TouchableOpacity , TouchableHighlight , Share , Linking} from 'react-native';
import styles from '../StyleSheets/URLViewStyle'

import config from '../Config/dev.json'

export default class UrlView extends React.Component {

    // Constructor
    constructor(props){
        super(props);

        this.state = {
            URL: this.props.URL,
            exDate: this.props.exDate,
            longUrl: this.props.longUrl,
            id: this.props.id,
        }

        // Bind Methods
        this.goToAnalytics = this.goToAnalytics.bind(this);
        this.onShare = this.onShare.bind(this);
        this.openLink = this.openLink.bind(this);
    }

    // Methods
    
    // Navigation Methods
    goToAnalytics(){
        this.props.navigation.navigate("UrlAnalytics" , {
            longUrl: this.state.longUrl,
            shortUrl: this.state.URL,
            expirationDate: this.state.exDate,
            id: this.state.id,
        });
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message: this.state.longUrl,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    openLink() {
        Linking.openURL(this.state.longUrl);
    };

    // Render Method
    render() {
        return (
            <TouchableHighlight onLongPress={() => this.goToAnalytics()}>
                <View style={styles.urlContainer} >

                    <Text style={styles.text}>{this.state.URL}</Text>
                    <Text style={styles.text}>{this.state.exDate}</Text>

                    <View style ={styles.urlBtnView} >
                        <TouchableOpacity style={styles.urlShareBtn} >
                            <Text style={styles.text} onPress={this.onShare}>Share</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.urlShareBtn} >
                            <Text style={styles.text} onPress={this.openLink}>Go To</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
        
            </TouchableHighlight>
        )
    }

}