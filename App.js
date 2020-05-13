import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Loading from './app/screens/loading'
import Logon from './app/screens/logon'
import Map from './app/screens/map'
import Faq from './app/screens/faq'
import Settings from './app/screens/settings'
import Icon from 'react-native-vector-icons/FontAwesome'

const DrawerNavigator = createDrawerNavigator({
	Loading: {
		screen: Loading,
		navigationOptions: {
			drawerLabel: 'Loading',
			header: null,
			drawerLockMode: 'locked-closed',
			disableGestures: true,
			drawerLabel: () => null,
		}
	},
	Logon: {
		screen: Logon,
		navigationOptions: {
			drawerLabel: 'Logon',
			header: null,
			drawerLockMode: 'locked-closed',
			disableGestures: true,
			drawerLabel: () => null,
		}
	},
	Map: {
		screen: Map,
		navigationOptions: {
			drawerLabel: 'Mapa',
			drawerIcon: () => (
				<Icon name={'location-arrow'} size={18} color='#0652DD' size={22} />
			)
		}
	},
	Faq: {
		screen: Faq,
		navigationOptions: {
			drawerLabel: 'FAQ',
			drawerIcon: () => (
				<Icon name={'question-circle'} size={18} color='#0652DD' size={22} />
			)
		},
	},
	Settings: {
		screen: Settings,
		navigationOptions: {
			drawerLabel: 'Configurações',
			drawerIcon: () => (
				<Icon name={'cog'} size={18} color='#0652DD' size={22} />
			)
		}
	},
}, {
	initialRouteName: 'Loading',
	unmountInactiveRoutes: true,
	contentOptions: {
		activeTintColor: '#0652DD',
		activeBackgroundColor: '#f1f2f6',
		labelStyle: {
			fontSize: 17,
		},
		itemStyle: {
			marginTop: 3,
			marginBottom: 8,
			paddingLeft: 10,
			borderRadius: 15
		},
	},
	drawerWidth: 260,
});

export default createAppContainer(DrawerNavigator);