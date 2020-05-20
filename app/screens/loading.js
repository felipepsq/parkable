import React, { useEffect } from 'react'
import {
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native'
import { AsyncStorage } from 'react-native'
import { setCurrentUser } from '../utils/firebase'
import * as SplashScreen from 'expo-splash-screen'

export default Loading = (props) => {

    const displaySplashScreen = async () => {
        await SplashScreen.preventAutoHideAsync();
    }

    const navigate = async (route) => {
        await SplashScreen.hideAsync()
        props.navigation.navigate(route)
    }

    useEffect(() => {
        displaySplashScreen()
        AsyncStorage.getItem('UID')
            .then(item => {
                item ? setCurrentUser().then(() => navigate('Map')) : navigate('Logon')
            })
    }, [])

    return (
        <View></View>
    )
}