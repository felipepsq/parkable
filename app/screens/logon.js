import React, { Component } from 'react'
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
import { signup, signin } from '../utils/firebase'

export default class Logon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fontLoaded: false,
            stageNew: false,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            loading: false,
            successMessage: '',
            animationMessage: new Animated.Value(0),
        }
    }

    async UNSAFE_componentWillMount() {
        await Expo.Font.loadAsync({
            'Ubuntu': require('../../assets/fonts/Ubuntu.ttf'),
            'Ubuntu_bold': require('../../assets/fonts/Ubuntu_bold.ttf'),
        })
        this.setState({ fontLoaded: true })
    }

    signup = async () => {
        this.setState({ loading: true })
        await signup(this.state.email, this.state.password)
            .then((msg) => {
                this.setState({ successMessage: msg, password: '', confirmPassword: '' })
                this.animateMessage()
                this.setState({ loading: false, stageNew: false })
            })
            .catch(msg => {
                Alert.alert('Erro', 'Este email já está sendo usado!')
                this.setState({ loading: false, password: '', confirmPassword: '' })
            })
    }

    signin = async () => {
        await signin(this.state.email, this.state.password)
            .then(() => {
                this.props.navigation.navigate('Faq')
            })
            .catch(erro => {
                Alert.alert('Erro', 'Usuário/senha incorreto(a)')
            })
        this.setState({ loading: false })
    }

    signinOrSignup = () => {
        this.setState({ loading: true })
        this.state.stageNew ? this.signup() : this.signin()
    }

    animateMessage = () => {
        Animated.timing(this.state.animationMessage, {
            toValue: 1,
            duration: 600
        }).start(() => {
            setTimeout(() => {
                Animated.timing(this.state.animationMessage, {
                    toValue: 0,
                    timing: 1200
                }).start();
            }, 2500);
        })
    }

    render() {
        const validations = []

        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        this.state.stageNew ? (validations.push(this.state.confirmPassword),
            validations.push(this.state.password === this.state.confirmPassword)) : null

        const validForm = validations.reduce((all, v) => all && v)

        return (
            <ImageBackground source={backgroundImage}
                style={styles.background}>
                <Image style={styles.parkAbleIcon} source={ParkAbleIcon} />

                {this.state.loading ?
                    <ActivityIndicator style={styles.activityIndicator} size="large" color="#2c3e50" /> : null}

                {this.state.successMessage ?
                    <Animated.View style={[styles.successMessage, { opacity: this.state.animationMessage }]} >
                        <Text style={styles.successMessageText}>{this.state.successMessage}</Text>
                    </Animated.View>
                    : null}

                <KeyboardAvoidingView behavior="padding">
                    {this.state.fontLoaded ?
                        <View style={styles.container}>
                            <AuthInput icon='at' placeholder='E-mail'
                                style={styles.input}
                                value={this.state.email}
                                onChangeText={email =>
                                    this.setState({ email })} />
                            <AuthInput icon='lock' secureTextEntry={true}
                                placeholder='Senha'
                                style={styles.input}
                                value={this.state.password}
                                onChangeText={password =>
                                    this.setState({ password })} />
                            {this.state.stageNew &&
                                <AuthInput icon='asterisk'
                                    secureTextEntry={true} placeholder='Confirmação'
                                    style={styles.input}
                                    value={this.state.confirmPassword}
                                    onChangeText={confirmPassword =>
                                        this.setState({ confirmPassword })} />}

                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity
                                        disabled={this.state.loading}
                                        style={[styles.cadastrarOrLogin,
                                        this.state.loading ? { backgroundColor: '#AAA' } : {}
                                        ]}
                                        onPress={() => this.setState({
                                            stageNew: !this.state.stageNew
                                        })}>
                                        <Text style={styles.cadastrarOrLoginText}>
                                            {this.state.stageNew ? 'Login'
                                                : 'Cadastrar'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '50%' }}>
                                    <TouchableOpacity disabled={!validForm || this.state.loading}
                                        onPress={this.signinOrSignup}>
                                        <View style={[styles.button, !validForm || this.state.loading ? { backgroundColor: '#AAA' } : {}]}>
                                            <Text style={styles.buttonText}>
                                                {this.state.stageNew ? 'Registrar' : 'Entrar'}</Text>
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