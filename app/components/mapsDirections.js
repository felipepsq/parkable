import React from 'react'
import { GOOGLEAPIKEY } from 'react-native-dotenv'
import MapViewDirections from 'react-native-maps-directions'

export default props => {
    return (
        <MapViewDirections
            origin={props.location}
            destination={props.currentMarkerCoord}
            apikey={GOOGLEAPIKEY}
            strokeWidth={5}
            strokeColor="black"
            optimizeWaypoints={true}
            onStart={(params) => {
            }}
            onReady={result => {
                props.component.directionsConfig('trace')
                props.component.directionsTrace(true)
                props.component.setCalcDistance(true)
                setTimeout(() => {
                    props.component.goToCurrentLocation(false, true)
                    props.component.directionsConfig(false)
                }, 1000);
            }}
            onError={(errorMessage) => { }}
        />
    )
}
