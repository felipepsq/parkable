import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native'
import { AsyncStorage } from 'react-native'
import { setCurrentUser } from '../utils/firebase'

export default class Loading extends Component {

    render() {
        AsyncStorage.getItem('UID')
            .then((item) => {
                if (item != null) {
                    setCurrentUser()
                    AsyncStorage.getItem('faqRead')
                        .then(read => {
                            read ? this.props.navigation.navigate('Map') : this.props.navigation.navigate('Faq', { read })
                        })
                }
                else {
                    this.props.navigation.navigate('Logon')
                }
            });
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})