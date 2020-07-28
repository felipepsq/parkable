
import { StyleSheet } from 'react-native'

export default mapStyle = StyleSheet.create({
    iconBar: {
        position: 'absolute',
        top: 50,
        left: 20,
        alignSelf: 'flex-start',
        backgroundColor: '#636e72',
        borderRadius: 6,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderColor: '#636e72'
    },
    iconGps: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        alignSelf: 'flex-end',
        backgroundColor: '#636e72',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#636e72'
    },
    loadingMarkers: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
    },
    iconStopRoute: {
        position: 'absolute',
        bottom: 65,
        left: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#c23616',
        borderRadius: 25
    },
    title: {
        color: '#c0392b',
        fontSize: 25,
        alignSelf: 'center',
        alignContent: 'center',
        textAlign: 'center'
    },
    containerSubView: {
        flex: 1,
        justifyContent: 'space-between'
    },
    reportSpace: {
        alignSelf: 'center',
        borderColor: '#c0392b',
        borderWidth: 2,
        borderRadius: 10,
        padding: 4,
    },
    referencia: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '500'
    },
    traceRoute: {
        alignSelf: 'center',
        borderColor: '#0984e3',
        borderWidth: 2,
        borderRadius: 10,
        padding: 3,
    },
    exitSpace: {
        alignSelf: 'center',
        borderColor: '#27ae60',
        borderWidth: 2,
        borderRadius: 10,
        padding: 3,
    },
    activityIndicatorInit: {
        width: 45,
        height: 45,
        marginTop: 60,
        paddingLeft: 3,
        paddingTop: 4,
        backgroundColor: 'white',
        borderRadius: 15
    },
    markerIcon: {
        height: 40,
        width: 40,
        tintColor: 'white',
        backgroundColor: '#0652DD',
        borderRadius: 10,
    },
    markerIconUsed: {
        height: 40,
        width: 40,
        tintColor: 'white',
        backgroundColor: '#EA2027',
        borderRadius: 10,
    },
    lowAccuracy: {
        height: 25,
        position: 'absolute',
        top: 55,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9ca24',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#f9ca24'
    }
})