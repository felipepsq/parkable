import React, { useState, useEffect } from 'react'
import { signOut } from '../utils/firebase'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

export default Settings = (props) => {

    const [fontLoaded, setFontLoaded] = useState(false)

    const loadFont = async () => {
        await Expo.Font.loadAsync({
            'Ubuntu': require('../../assets/fonts/Ubuntu.ttf'),
            'Ubuntu_bold': require('../../assets/fonts/Ubuntu_bold.ttf'),
        })
        setFontLoaded(true)
    }

    useEffect(() => {
        loadFont()
    }, [])


    disconnect = () => {
        signOut()
        props.navigation.navigate('Logon')
    }

    return (
        fontLoaded ?
            <View style={styles.container}>
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <Icon name='bars' color={'white'} size={32} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.quiz} onPress={() => { }} >
                    <Text style={styles.quizText}>
                        Questionário
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exit} onPress={() => disconnect()} >
                    <Text style={styles.exitText}>
                        Sair
                        </Text>
                </TouchableOpacity>
                <View style={styles.about}>
                    <Text style={styles.title}>Desenvolvido por: </Text>
                    <Text style={styles.text}>Felipe Pasqualotto </Text>
                    <Text style={styles.text}>felipe.psq@outlook.com</Text>
                </View>

            </View > :
            <View></View>
    )
}

const styles = StyleSheet.create({
    iconBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        alignSelf: 'flex-start',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#747d8c',
    },
    quiz: {
        backgroundColor: '#0652DD',
        width: '50%',
        height: '6%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginBottom: 50
    },
    quizText: {
        fontFamily: 'Ubuntu',
        fontSize: 26,
        color: 'white'
    },
    exit: {
        backgroundColor: '#485460',
        width: '25%',
        height: '5%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25
    },
    exitText: {
        fontFamily: 'Ubuntu',
        fontSize: 26,
        color: 'white'
    },
    about: {
        position: 'absolute',
        bottom: 45,
        width: '90%',
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        marginBottom: 5,
        fontFamily: 'Ubuntu',
        color: 'white'
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 5,
        fontFamily: 'Ubuntu',
        color: 'white'
    }
})