import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import SwitchSelector from "react-native-switch-selector"
import AuthInput from '../components/authInput'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import { addMarker } from '../utils/firebase'

export default class ModalNewMarker extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: false,
            loading: false,
            currentMarkerCoord: null,
            tipoVaga: 0,
            pontoReferencia: '',
        }
    }

    setModalActive = (currentMarkerCoord) => {
        this.setState({ active: true, currentMarkerCoord })
    }

    setModalDefault = () => {
        this.setState({
            active: false,
            loading: false,
            currentMarkerCoord: null,
            tipoVaga: 0,
            pontoReferencia: '',
        })
    }

    addNewMarker = async () => {
        this.setState({ loading: true })
        await addMarker(this.state)
            .then(markerConfig => {
                // this.setState({ markers: [...this.state.markers, markerConfig], loading: false, pontoReferencia: null })
                // this.setModalNewMarker(false, null)
                this.setModalDefault()
            })
            .catch(err => console.log("ERR>> ", err))
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.active}
            >
                <View style={styles.mainModal}>
                    <KeyboardAvoidingView behavior="padding">
                        <View style={styles.modalItems}>
                            <TouchableOpacity style={styles.modalCloseIcon}
                                onPress={() => this.setModalDefault()}>
                                <Icon2 name='close' color={'white'} size={28} />
                            </TouchableOpacity>

                            <View style={styles.modalInputs}>
                                <SwitchSelector
                                    options={[
                                        { label: "Deficiente", value: 0 },
                                        { label: "Idoso", value: 1 }
                                    ]}
                                    initial={0}
                                    onPress={tipoVaga => this.setState({ tipoVaga })}
                                    buttonColor={'#2f3542'}
                                    value={this.state.tipoVaga}
                                    style={{ marginTop: 15, marginBottom: 25 }}
                                />

                                <AuthInput icon='map-marker' placeholder='Ponto de refêrencia'
                                    placeholderTextColor="black"
                                    style={styles.input}
                                    value={this.state.pontoReferencia}
                                    onChangeText={pontoReferencia => this.setState({ pontoReferencia })} />

                                {this.state.loading ? <ActivityIndicator style={{ marginTop: 40 }} size="large" color="white" /> :
                                    <TouchableOpacity
                                        style={styles.buttonConfirmar}
                                        onPress={() => this.addNewMarker()}>
                                        <Icon name={"check"} size={20} color="white">
                                            <Text style={{ paddingLeft: 50 }}>Confirmar</Text>
                                        </Icon>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    mainModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalItems: {
        width: 300,
        height: 300,
        backgroundColor: '#fff',
        borderRadius: 20,
        backgroundColor: '#0984e3',
    },
    modalCloseIcon: {
        alignSelf: 'flex-end',
        marginRight: 5,
        marginTop: 5
    },
    modalInputs: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15,
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    buttonConfirmar: {
        padding: 12,
        borderRadius: 20,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 165,
        height: 45,
        width: 135,
        backgroundColor: '#27ae60'
    }
})