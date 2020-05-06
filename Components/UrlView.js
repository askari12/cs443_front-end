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

            createdAt: this.props.createdAt,
            terminatedAt: this.props.terminatedAt,
            userId: this.props.userId,
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
            createdAt: this.state.createdAt,
            terminatedAt: this.state.terminatedAt,
            userId: this.state.userId,
        });
    }

    onShare = async () => {
        try {
            const result = await Share.share({
                message: "View This Link Through Linkly ! \n" + 
                config.linkly_dns + this.state.URL,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    openLink() {
        Linking.openURL(config.linkly_dns + this.state.URL);
    };

    // Render Method
    render() {
        return (
            <TouchableHighlight onPress={() => this.goToAnalytics()}>
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