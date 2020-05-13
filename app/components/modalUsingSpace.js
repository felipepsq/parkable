import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import { updateMarkerProperties } from '../utils/firebase'

export default class ModalUsingSpace extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modalUsingSpace: {
                active: false,
                sameUserUID: null
            },
            currentMarkerID: null,
            loading: false,
            currentMarkerInUse: null
        }
    }

    setCurrentMarkerInUse = (currentMarkerInUse) => {
        this.setState({ currentMarkerInUse })
    }

    getCurrentMarkerInUse = () => {
        return this.state.currentMarkerInUse
    }

    setModalUsingSpace = (modalUsingSpace, currentMarkerID) => {
        this.setState({ modalUsingSpace, currentMarkerID })
    }

    setModalDefault = () => {
        this.setState({
            modalUsingSpace: {
                active: false,
                sameUserUID: null
            },
            loading: false
        })
    }

    setMarkerProperties = (value) => {
        this.setState({ loading: true })
        if (value) {
            // se o usuário já está usando a vaga ele não altera
            if (!this.state.modalUsingSpace.sameUserUID) {
                this.props.component.getCurrentInUseSpace()
                    .then((markerID) => {
                        updateMarkerProperties(markerID, false)
                            .then(() => {
                                updateMarkerProperties(this.state.currentMarkerID, true)
                                    .then(() => {
                                        this.setCurrentMarkerInUse(this.state.currentMarkerID)
                                    })
                            })
                            .finally(() => {
                                this.setModalDefault()
                            })
                    })
                    .catch(() => {
                        updateMarkerProperties(this.state.currentMarkerID, true)
                            .then(() => {
                                this.setCurrentMarkerInUse(this.state.currentMarkerID)
                            })
                            .finally(() => {
                                this.setModalDefault()
                            })
                    })
            }
            else {
                updateMarkerProperties(this.state.currentMarkerID, false)
                    .then(() => {
                        this.setCurrentMarkerInUse(this.state.currentMarkerID)
                    })
                    .finally(() => {
                        this.setModalDefault()
                    })
            }
        }
        else {
            if (!this.state.modalUsingSpace.sameUserUID) {
                updateMarkerProperties(this.state.currentMarkerID, false)
                    .then(() => {
                        this.setModalDefault()
                        this.setCurrentMarkerInUse(null)
                    })
            }
            else {
                this.setModalDefault()
            }
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalUsingSpace.active}
            >
                <View style={styles.mainModal}>

                    <View style={styles.modalItems}>
                        <TouchableOpacity style={styles.modalCloseIcon}
                            onPress={() => this.setState({
                                modalUsingSpace: {
                                    active: false,
                                    sameUserUID: null
                                },
                                loading: false
                            })}>
                            <Icon2 name='close' color={'white'} size={20} />
                        </TouchableOpacity>

                        <Text style={styles.title}>{this.state.modalUsingSpace.sameUserUID ? 'Deseja liberar' : ' Você usará'} esta vaga?</Text>

                        {!this.state.loading ?
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={styles.buttonSim}
                                    onPress={() => { this.setMarkerProperties(true) }}>
                                    <Icon name={"check"} size={16} color="white">
                                        <Text>{` Sim`}</Text>
                                    </Icon>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.buttonNao}
                                    onPress={() => { this.setMarkerProperties(false) }}>
                                    <Icon name={"times"} size={16} color="white">
                                        <Text>{` Não`}</Text>
                                    </Icon>
                                </TouchableOpacity>
                            </View>
                            :
                            <ActivityIndicator style={{ marginTop: 15 }} size="large" color="white" />
                        }


                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    mainModal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalItems: {
        width: 230,
        height: 150,
        backgroundColor: '#fff',
        borderRadius: 20,
        backgroundColor: '#0984e3'
    },
    title: {
        color: 'white',
        fontSize: 24,
        alignSelf: 'center',
        marginTop: -12,
        textAlign: 'center'
    },
    modalCloseIcon: {
        alignSelf: 'flex-end',
        marginRight: 5,
        marginTop: 5
    },
    modalInputs: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 15
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    buttonSim: {
        borderRadius: 20,
        marginTop: 10,
        paddingLeft: 18,
        paddingTop: 13,
        height: 45,
        width: 90,
        backgroundColor: '#27ae60',
    },
    buttonNao: {
        borderRadius: 20,
        marginTop: 10,
        paddingLeft: 22,
        paddingTop: 13,
        height: 45,
        width: 90,
        backgroundColor: '#c0392b',
    }
})