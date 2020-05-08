import React from 'react'
import MapViewDirections from 'react-native-maps-directions'

export default props => {
    return (
        <MapViewDirections
            origin={props.location}
            destination={props.currentMarkerCoord}
            apikey={'AIzaSyCGCawFue0Z9eeazfeEBY3Sg2dJ4-XAXoM'}
            strokeWidth={5}
            strokeColor="black"
            optimizeWaypoints={true}
            onStart={(params) => {
                props.component.directionsConfig('loading')
            }}
            onReady={result => {
                props.component.directionsConfig('trace')
                props.component.directionsTrace(true)
                props.component.setCalcDistance(true)
                setTimeout(() => {
                    props.component.goToCurrentLocation(false, true)
                    props.component.directionsConfig(null)
                }, 1000);
            }}
            onError={(errorMessage) => { }}
        />
    )
}
