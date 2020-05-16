import React, { Component } from 'react'
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Alert,
	ActivityIndicator,
	Image,
} from 'react-native'
import { Marker, Callout, CalloutSubview, Polyline } from 'react-native-maps'
import MapView from "react-native-map-clustering"
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import { getInitMarkers, addMarker, getCurrentUser, updateMarkerProperties } from '../utils/firebase'
var disabledIcon = require('../../assets/imgs/disabled.png')
var oldIcon = require('../../assets/imgs/old.png')
import MapDirections from '../components/mapsDirections'
import ModalNewMarker from '../components/modalNewMarker'
import { getDistance } from 'geolib'
import ModalUsingSpace from '../components/modalUsingSpace'
import ModalReportMarker from '../components/modalReportMarker'

export default class Map extends Component {

	constructor(props) {
		super(props)

		this.state = {
			loadingMarkers: false,
			location: null,
			markers: [],
			currentMarkerID: null,
			directions: false,
			directionsTrace: false,
			heading: null,
			calcDistance: false,
			routeCoordinates: [],
			lowAccuracy: false,
			iconGpsDisabled: false
		}
		this.markers = []
		this.markersInUse = []
		this.currentHeading = null
	}

	getHeading = async (callBack) => {
		this.currentHeading = await Location.watchHeadingAsync(e => {
			if (!this.state.heading) {
				this.setState({ heading: e.magHeading })
			}
			else {
				if (e.magHeading > (this.state.heading + 50) || e.magHeading < (this.state.heading - 50)) {
					this.setState({ heading: e.magHeading })

					this.mapView && this.state.directionsTrace && !this.state.iconGpsDisabled ?
						(this.mapView.animateCamera({
							center: this.state.location,
							heading: this.state.heading
						})) : null
				}
			}
			this.currentHeading.remove()
			if (this.state.directionsTrace != false) {
				setTimeout(() => {
					this.getHeading(() => { })
				}, 3000)
			}
			callBack()
		})
	}

	getLocationAsync = async (callBack) => {
		let position = await Location.getCurrentPositionAsync({})
		let location = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			latitudeDelta: 0.005,
			longitudeDelta: 0.005
		}
		this.setState({ location })
		callBack()
	}

	watchLocationAsync = async () => {
		await Location.watchPositionAsync(
			{
				accuracy: 6,
				distanceInterval: 15
			},
			newLocation => {
				let { coords } = newLocation
				if (this.mapView) {
					coords.accuracy > 12 ? this.setState({ lowAccuracy: true }) : this.setState({ lowAccuracy: false })
				}
				let location = {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: 0.005,
					longitudeDelta: 0.005
				}
				if (this.state.directionsTrace && this.state.calcDistance) {
					let newCoordinate = { latitude: coords.latitude, longitude: coords.longitude }
					this.setState({
						routeCoordinates: this.state.routeCoordinates.concat([newCoordinate]),
					})
					let stateDistance = getDistance(location, this.state.location)

					stateDistance > 30 && this.mapView ? (
						this.setState({ location: coords }),
						this.mapView.animateCamera({
							center: this.state.location,
							heading: this.state.heading
						})
					) : null

					let distanceToSpace = getDistance(location, this.state.currentMarkerCoord)
					if (distanceToSpace <= 15 && this.refs.ModalUsingSpace) {
						// if (this.refs.ModalUsingSpace) {
						setTimeout(() => {
							this.setCalcDistance(false)
							this.directionsTrace(false)
							this.refs.ModalUsingSpace.setModalUsingSpace({
								active: true,
								sameUserUID: null
							}, this.state.currentMarkerID)
						}, 1)
					}
				}
				else {
					this.state.routeCoordinates.length != 0 ? this.setState({ routeCoordinates: [] }) : null
				}

				if (this.refs.ModalUsingSpace) {
					var currentMarkerInUse = this.refs.ModalUsingSpace.getCurrentMarkerInUse()
					if (currentMarkerInUse) {
						var markerID = this.state.markers.filter(marker => marker.id == currentMarkerInUse)
						let distance = getDistance(location, markerID[0].currentMarkerCoord)

						distance > 400 ? (updateMarkerProperties(markerID[0].id, false),
							this.refs.ModalUsingSpace.setCurrentMarkerInUse(null)) : null
					}
				}
			},
			// error => console.log(error)
		)
	}

	goToCurrentLocation = async (init, mapsDirections) => {
		let { status } = await Permissions.askAsync(Permissions.LOCATION)
		if (status !== 'granted') {
			Alert.alert('Erro', 'Por favor, habilite o serviço de localização!')
		}
		else if (mapsDirections) {
			this.getHeading(() => {
				this.mapView && this.mapView.animateCamera({
					center: this.state.location,
					altitude: 600
				})
			})
		}
		else {
			if (init) {
				this.getLocationAsync(() => {
					this.getHeading(() => {
						this.mapView && this.mapView.animateCamera({
							center: this.state.location,
							altitude: 8000
						})
						this.watchLocationAsync()
					})
				})
			}
			else {
				this.state.directionsTrace ?
					this.mapView && this.mapView.animateCamera({
						center: this.state.location,
						heading: this.state.heading,
						altitude: 600
					}) :
					this.getHeading(() => {
						!this.state.location ? this.getLocationAsync(() => {
							this.mapView && this.mapView.animateCamera({
								center: this.state.location,
								heading: this.state.heading,
								altitude: 600
							})
						})
							: this.mapView && this.mapView.animateCamera({
								center: this.state.location,
								heading: this.state.heading,
								altitude: 600
							})
					})
			}
		}
	}

	setMarkers = (markers) => {
		this.mapView && this.setState({ markers: markers.markers, loadingMarkers: markers.loadingMarkers })
	}

	createInitMarkers = async () => {
		this.setState({ loadingMarkers: true })
		getInitMarkers(this.setMarkers)
			.then(() => this.goToCurrentLocation(true, false))
	}

	getCurrentInUseSpace = () => {
		return new Promise((resolve, reject) => {
			id = this.state.markers.filter(marker => marker.properties.userUsing == getCurrentUser())
			id.length > 0 ? resolve(id[0].id) : reject()
		})
	}

	addNewMarker = async () => {
		this.setState({ loading: true })
		await addMarker(this.state)
			.then(markerConfig => {
				this.setState({ markers: [...this.state.markers, markerConfig], loading: false, pontoReferencia: null })
				this.setModalNewMarker(false, null)
			})
			.catch(err => console.log("ERR>> ", err))
	}

	directionsConfig = (props) => {
		this.setState({ directions: props })
	}

	directionsTrace = (props) => {
		this.setState({ directionsTrace: props })
	}

	stopRoute = (markerID) => {
		this.state.currentMarkerID == markerID ? this.setState({
			directions: false, directionsTrace: false,
			calcDistance: false, routeCoordinates: []
		}) : null
	}

	setCalcDistance = (calcDistance) => {
		this.setState({ calcDistance })
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<MapView
					style={{ flex: 1 }}
					mapRef={ref => this.mapView = ref}
					initialRegion={{
						"latitude": -13.986505601368954,
						"latitudeDelta": 72.72577156069167,
						"longitude": -54.49218800000002,
						"longitudeDelta": 40.60546900000004
					}}
					loadingEnabled={true}
					loadingIndicatorColor="white"
					loadingBackgroundColor="white"
					mapType='hybrid'
					showsUserLocation
					userLocationAnnotationTitle='Sua localização'
					onLongPress={(event) => { this.refs.ModalNewMarker.setModalActive(event.nativeEvent.coordinate) }}
					onMapReady={(e) => this.createInitMarkers()}
				>
					{this.state.markers && this.state.markers.length > 0 && this.state.markers.map((marker, index) => {
						return (
							!marker.properties.inUse ?
								<Marker
									ref={(ref) => this.markers[index] = ref}
									tracksViewChanges={false}
									key={index}
									coordinate={{
										latitude: marker.currentMarkerCoord.latitude,
										longitude: marker.currentMarkerCoord.longitude
									}}
									onPress={() =>
										// fixed marker closes bug
										this.markers[index].showCallout()
									}
									onDeselect={() => this.setState({ directions: false })}
								>
									<Image source={marker.tipoVaga == 0 ? disabledIcon : oldIcon} style={styles.markerIcon} />
									<Callout style={{ height: 125, width: 160 }} >
										<View style={styles.containerSubView}>
											<CalloutSubview onPress={() =>
												this.refs.ModalReportMarker.setModalReportMarker({
													active: true,
													markerID: marker.id
												})}
												style={styles.reportSpace}>
												<Icon name={"exclamation-triangle"} size={18} color="#c0392b">
													<Text style={{ fontSize: 16 }}> Reportar vaga</Text>
												</Icon>

											</CalloutSubview>

											<Text style={styles.referencia}>Referência: {marker.pontoReferencia}</Text>

											<CalloutSubview onPress={() => {
												this.setState({
													directions: '', directionsTrace: true, currentMarkerCoord: {
														latitude: marker.currentMarkerCoord.latitude,
														longitude: marker.currentMarkerCoord.longitude
													},
													currentMarkerID: marker.id
												})
											}}>
												{!this.state.directions &&
													<Icon style={styles.traceRoute} name={"car"} size={22} color={'#0984e3'}>
														<Text>Traçar rota</Text>
													</Icon>}

												{this.state.directions == 'loading' &&
													<ActivityIndicator size="large" color="#0984e3" />}

												{this.state.directions == 'trace' &&
													<Icon style={{ alignSelf: 'center' }} name={"check"} size={22} color={'green'}>
														<Text>Rota ok!</Text>
													</Icon>}

											</CalloutSubview>
										</View>

									</Callout>
								</Marker>
								:
								<Marker
									tracksViewChanges={false}
									ref={(ref) => this.markersInUse[index] = ref}
									key={index}
									coordinate={{
										latitude: marker.currentMarkerCoord.latitude,
										longitude: marker.currentMarkerCoord.longitude
									}}
									onPress={() =>
										// fixed marker closes bug
										this.markersInUse[index].showCallout()
									}
									onDeselect={() => this.setState({ directions: false })}
								>
									<Image source={marker.tipoVaga == 0 ? disabledIcon : oldIcon} style={styles.markerIconUsed} />
									<Callout style={{ height: 125, width: 160 }} >
										<View style={{
											flex: 1,
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											justifyContent: "space-around"
										}}>
											<View style={styles.containerSubView}>
												<CalloutSubview onPress={() =>
													this.refs.ModalReportMarker.setModalReportMarker({
														active: true,
														markerID: marker.id
													})}
													style={styles.reportSpace}>
													<Icon name={"exclamation-triangle"} size={18} color="#c0392b">
														<Text style={{ fontSize: 16 }}> Reportar vaga</Text>
													</Icon>

												</CalloutSubview>

												<Text style={styles.title}>Vaga em uso!</Text>
												{getCurrentUser() == marker.properties.userUsing
													?
													<View style={{ textAlign: 'center', alignItems: 'center' }}>
														<CalloutSubview onPress={() => this.refs.ModalUsingSpace.setModalUsingSpace({
															active: true,
															sameUserUID: getCurrentUser() == marker.properties.userUsing
														}, marker.id
														)}
															style={styles.exitSpace}>
															<Icon name={"check"} size={20} color="#27ae60">
																<Text style={{ fontSize: 20 }}>Liberar vaga</Text>
															</Icon>

														</CalloutSubview>
													</View>
													:
													<View></View>}
											</View>
										</View>
									</Callout>

								</Marker>)

					})}

					{this.state.directionsTrace &&
						<MapDirections component={this} location={this.state.location}
							currentMarkerCoord={this.state.currentMarkerCoord} />
					}

					<Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor="#44bd32" />

				</MapView >

				<View style={styles.iconBar}>
					<TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
						<Icon name='bars' color={'white'} size={32} />
					</TouchableOpacity>
				</View>

				<View style={styles.iconGps}>
					<TouchableOpacity disabled={this.state.iconGpsDisabled} onPress={() => {
						this.setState({ iconGpsDisabled: true }, () => {
							setTimeout(() => {
								this.setState({ iconGpsDisabled: false })
							}, 2000)
						})
						this.goToCurrentLocation(false, false)

					}}>
						<Icon2 name='my-location' color={'white'} size={32} />
					</TouchableOpacity>
				</View>

				{this.state.loadingMarkers && <View style={styles.loadingMarkers}>
					<ActivityIndicator style={styles.activityIndicatorInit} size="large" color="blue" />
				</View>}

				{this.state.directionsTrace && this.state.location &&
					<View style={styles.iconStopRoute}>
						<TouchableOpacity onPress={() => this.stopRoute(this.state.currentMarkerID)}>
							<Icon2 name='clear' color={'white'} size={45} />
						</TouchableOpacity>
					</View>
				}

				<ModalNewMarker component={this} ref='ModalNewMarker' />

				<ModalUsingSpace component={this} ref='ModalUsingSpace' />

				<ModalReportMarker component={this} ref='ModalReportMarker' />

				{this.state.lowAccuracy && <View style={styles.lowAccuracy}>
					<Text>GPS sem precisão!</Text>
				</View>}

			</View>
		)
	}
}

const styles = StyleSheet.create({
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