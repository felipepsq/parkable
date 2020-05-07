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
import { reportMarker } from '../utils/firebase'

export default class ModalReportMarker extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modalReportMarker: {
                active: false,
                markerID: null
            },
            loading: false
        }
    }

    setModalReportMarker = (modalReportMarker) => {
        this.setState({ modalReportMarker })
    }

    setMarkerProperties = (value) => {
        if (value) {
            this.setState({ loading: true })
            reportMarker(this.state.modalReportMarker.markerID, true)
                .then(status => {
                    status == 'delete' ? this.props.component.stopRoute(this.state.modalReportMarker.markerID) : null
                    this.setState({
                        modalReportMarker: {
                            active: false,
                            markerID: null
                        },
                        loading: false
                    })
                })
        }
        else {
            this.setState({
                modalReportMarker: {
                    active: false,
                    markerID: null
                }
            })
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalReportMarker.active}
            >
                <View style={styles.mainModal}>

                    <View style={styles.modalItems}>
                        <TouchableOpacity style={styles.modalCloseIcon}
                            onPress={() => this.setState({
                                modalReportMarker: {
                                    active: false,
                                    markerID: null
                                },
                                loading: false
                            })}>
                            <Icon2 name='close' color={'white'} size={20} />
                        </TouchableOpacity>

                        <Text style={styles.title}>Informar que esta vaga é inexistente?</Text>

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
        backgroundColor: '#0984e3',
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