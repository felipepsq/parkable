import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    ActivityIndicator,
    Animated
} from 'react-native'
import AuthInput from '../components/authInput'
import backgroundImage from '../../assets/imgs/backgroundImage.jpg'
import ParkAbleIcon from '../../assets/imgs/icon.png'
import { signUp, signIn } from '../utils/firebase'

export default Logon = (props) => {

    const [fontLoaded, setFontLoaded] = useState(false)
    const [stageNew, setStageNew] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [validForm, setValidForm] = useState(false)
    const [animationMessage] = useState(new Animated.Value(0))

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

    useEffect(() => {
        const validations = []

        validations.push(email && email.includes('@'))
        validations.push(password && password.length >= 6)

        stageNew ? (validations.push(confirmPassword),
            validations.push(password === confirmPassword)) : null

        setValidForm(validations.reduce((all, v) => all && v))
    }, [email, password, confirmPassword, stageNew])

    signup = async () => {
        await signUp(email, password)
            .then((msg) => {
                setSuccessMessage(msg)
                setPassword('')
                setConfirmPassword('')
                setLoading(false)
                animateMessage()
                setStageNew(false)
            })
            .catch(msg => {
                Alert.alert('Erro', 'Este email já está sendo usado!')
                setLoading(false)
                setPassword('')
                setConfirmPassword('')
            })
    }

    const signin = async () => {
        await signIn(email, password)
            .then(() => {
                setLoading(false)
                props.navigation.navigate('Faq', { read: false })
            })
            .catch(erro => {
                setLoading(false)
                setPassword('')
                Alert.alert('Erro', 'Usuário/senha incorreto(a)')
            })
    }

    const signinOrSignup = () => {
        setLoading(true)
        stageNew ? signup() : signin()
    }

    const animateMessage = () => {
        Animated.timing(animationMessage, {
            toValue: 1,
            duration: 600
        }).start(() => {
            setTimeout(() => {
                Animated.timing(animationMessage, {
                    toValue: 0,
                    timing: 1200
                }).start();
            }, 2500);
        })
    }

    return (
        <ImageBackground source={backgroundImage}
            style={styles.background}>
            <Image style={styles.parkAbleIcon} source={ParkAbleIcon} />

            {loading ?
                <ActivityIndicator style={styles.activityIndicator} size="large" color="#2c3e50" /> : null}

            {successMessage ?
                <Animated.View style={[styles.successMessage, { opacity: animationMessage }]} >
                    <Text style={styles.successMessageText}>{successMessage}</Text>
                </Animated.View>
                : null}

            <KeyboardAvoidingView behavior="padding">
                {fontLoaded ?
                    <View style={styles.container}>
                        <AuthInput icon='at' placeholder='E-mail'
                            style={styles.input}
                            value={email}
                            onChangeText={email => setEmail(email)} />
                        <AuthInput icon='lock' secureTextEntry={true}
                            placeholder='Senha'
                            style={styles.input}
                            value={password}
                            onChangeText={pass => setPassword(pass)} />
                        {stageNew &&
                            <AuthInput icon='asterisk'
                                secureTextEntry={true} placeholder='Confirmação'
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={confirm => setConfirmPassword(confirm)} />}

                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: '50%' }}>
                                <TouchableOpacity
                                    disabled={loading}
                                    style={[styles.cadastrarOrLogin,
                                    loading ? { backgroundColor: '#AAA' } : {}
                                    ]}
                                    onPress={() => setStageNew(!stageNew)}>
                                    <Text style={styles.cadastrarOrLoginText}>
                                        {stageNew ? 'Login'
                                            : 'Cadastrar'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '50%' }}>
                                <TouchableOpacity
                                    onPress={signinOrSignup}>
                                    <View style={[styles.button, !validForm || loading ? { backgroundColor: '#AAA' } : {}]}>
                                        <Text style={styles.buttonText}>
                                            {stageNew ? 'Registrar' : 'Entrar'}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    :
                    null
                }

            </KeyboardAvoidingView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    parkAbleIcon: {
        width: 225,
        height: 175,
        position: 'absolute',
        top: 120,
    },
    activityIndicator: {
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        paddingLeft: 2,
        paddingTop: 2,
        position: 'absolute',
        top: 50
    },
    successMessage: {
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        padding: 4,
        position: 'absolute',
        top: 55,
    },
    successMessageText: {
        fontSize: 18,
        color: '#2c3e50',
        fontFamily: 'Ubuntu_bold'
    },
    container: {
        marginTop: 5,
        marginBottom: 20,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    cadastrarOrLogin: {
        backgroundColor: '#303952',
        borderRadius: 10,
        marginTop: 12,
        alignSelf: "flex-start",
        padding: 10,
        marginLeft: 20,
        width: '60%'
    },
    cadastrarOrLoginText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Ubuntu_bold'
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        marginRight: 20,
        padding: 10,
        alignSelf: "flex-end",
        borderRadius: 10,
        width: '60%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Ubuntu_bold'
    },
})