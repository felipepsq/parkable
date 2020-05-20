import firebase from 'firebase'
import {
    APIKEY,
    AUTHDOMAIN,
    DATABASEURL,
    PROJECTID,
    STORRAGEBUCKET,
    MESSAGINGSENDERID,
    APPID,
    MEASUREMENTID
} from 'react-native-dotenv'
import { AsyncStorage } from 'react-native'
import axios from 'axios'

const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    databaseURL: DATABASEURL,
    projectId: PROJECTID,
    storageBucket: STORRAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID
}
firebase.apps.length == 0 ? firebase.initializeApp(firebaseConfig) : null

var currentUser = null

export const getCurrentUser = () => {
    return currentUser
}

export const setCurrentUser = () => {
    return new Promise((resolve) => {
        AsyncStorage.getItem('UID')
            .then(user => {
                currentUser = user
                resolve()
            })
    })

}

export const signOut = () => {
    AsyncStorage.removeItem("UID")
    AsyncStorage.removeItem("faqRead")
    currentUser = null
}

export const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((usuario) => {
                currentUser = usuario.user.uid
                AsyncStorage.setItem("UID", usuario.user.uid)
                resolve()
            })
            .catch((erro) => {
                reject(erro)
            })
    })
}

export const signUp = (email, password) => {

    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resolve("Usuário cadastrado com sucesso!")
            })
            .catch(error => {
                reject(error)
            })
    })
}

export const getInitMarkers = (setMarkers) => {
    return new Promise((resolve, reject) => {
        firebase
            .database()
            .ref(`/markers`)
            .on('value', snapshot => {
                let data = snapshot.val()
                if (data) {
                    const keys = Object.keys(data)
                    const markers = keys.map(id => {
                        return { ...data[id], id }
                    })
                    setMarkers({ markers, loadingMarkers: false })
                    resolve()
                }
                else {
                    setMarkers({ markers: null, loadingMarkers: false })
                    resolve()
                }
            })
    })
}

export const addMarker = (props) => {
    var markerConfig = {
        currentMarkerCoord: props.currentMarkerCoord,
        pontoReferencia: props.pontoReferencia,
        tipoVaga: props.tipoVaga,
        properties: { inUse: false, dateTime: null, userUsing: null },
        reports: []
    }

    return new Promise((resolve, reject) => {
        firebase
            .database()
            .ref(`/markers/`)
            .push(markerConfig)
            .then(() => resolve())
            .catch((erro) => reject(erro))
    })
}

export const updateMarkerProperties = (id, value) => {
    var currentDate = Date.now()
    if (value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem("UID")
                .then(item => {
                    firebase
                        .database()
                        .ref(`/markers/${id}/properties/`)
                        .set({ inUse: value, dateTime: currentDate, userUsing: item })
                        .then(() => {
                            resolve()
                            axios({
                                method: 'post',
                                // url: 'http://192.168.1.110:3000/crontab',
                                url: 'https://parkable-server.herokuapp.com/crontab',
                                data: {
                                    markerID: id,
                                    date: currentDate
                                },
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                }
                            })
                                .then(function (response) {
                                    // console.log(response)
                                })
                        }
                        )
                        .catch((erro) => reject(erro))
                })
        })
    }
    else {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref(`/markers/${id}/properties/`)
                .set({ inUse: value, dateTime: null, userUsing: null })
                .then(() => resolve(''))
                .catch((error) => reject(error))
        })
    }
}

export const reportMarker = (id, value) => {
    return new Promise((resolve, reject) => {
        firebase
            .database()
            .ref(`/markers/${id}/reports`)
            .once('value', snapshot => {
                let reports = snapshot.val()
                if (reports) {
                    if (Object.values(reports).includes(currentUser)) {
                        resolve()
                    }
                    else {
                        Object.keys(reports).length >= 2 ? deleteMarker(id).then(() => { resolve('delete') })
                            : firebase
                                .database()
                                .ref(`/markers/${id}/reports/`)
                                .push(currentUser)
                                .then(() => resolve())
                    }
                }
                else {
                    firebase
                        .database()
                        .ref(`/markers/${id}/reports`)
                        .push(currentUser)
                        .then(() => { resolve() })
                }
            })
    })
}

export const deleteMarker = (id) => {
    return new Promise((resolve, reject) => {
        firebase
            .database()
            .ref(`/markers/${id}`)
            .set(null)
            .then(() => { resolve() })
    })
}