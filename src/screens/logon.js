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
} from 'react-native'
import AuthInput from '../components/authInput'
import backgroundImage from '../../assets/imgs/backgroundImage.jpg'
import ParkAbleIcon from '../../assets/imgs/icon.png'
import { signup, signin } from '../utils/firebase'

export default class Logon extends Component {
    state = {
        stageNew: false,
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        loading: false
    }

    signup = async () => {
        this.setState({ loading: true })
        await signup(this.state.email, this.state.password)
            .then(msg => this.setState({ successMessage: msg, errorMessage: "" }))
            .catch(msg => Alert.alert('Erro', 'Este email já está sendo usado!'))
        this.setState({ loading: false, stageNew: false })
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
                {this.state.loading ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#2c3e50" /> : null}
                <KeyboardAvoidingView behavior="padding">
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
                        <TouchableOpacity disabled={!validForm}
                            onPress={this.signinOrSignup}>
                            <View style={[styles.button, !validForm ? { backgroundColor: '#AAA' } : {}]}>
                                <Text style={styles.buttonText}>
                                    {this.state.stageNew ? 'Registrar' : 'Entrar'}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10 }}
                            onPress={() => this.setState({
                                stageNew: !this.state.stageNew
                            })}>
                            <Text style={styles.buttonTextBottom}>
                                {this.state.stageNew ? 'Já possui conta?'
                                    : 'Ainda não possui conta?'}</Text>
                        </TouchableOpacity>
                    </View>
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
    container: {
        marginTop: 90,
    },
    formContainer: {
        padding: 25,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    },
    buttonTextBottom: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20
    }
})