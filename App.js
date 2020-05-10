import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Loading from './src/screens/loading'
import Logon from './src/screens/logon'
import Map from './src/screens/map'
import Faq from './src/screens/faq'
import Settings from './src/screens/settings'

const DrawerNavigator = createDrawerNavigator({
	Loading: {
		screen: Loading,
		navigationOptions: {
			drawerLabel: "Loading",
			header: null,
			drawerLockMode: "locked-closed",
			disableGestures: true,
			drawerLabel: () => null,
		}
	},
	Logon: {
		screen: Logon,
		navigationOptions: {
			drawerLabel: "Logon",
			header: null,
			drawerLockMode: "locked-closed",
			disableGestures: true,
			drawerLabel: () => null,
		}
	},
	Map: {
		screen: Map,
		navigationOptions: {
			drawerLabel: "Mapa",
		}
	},
	Faq: {
		screen: Faq,
		navigationOptions: {
			drawerLabel: "FAQ",
		}
	},
	Settings: {
		screen: Settings,
		navigationOptions: {
			drawerLabel: "Configurações",
		}
	},
}, {
	initialRouteName: 'Loading',
	unmountInactiveRoutes: true
});

export default createAppContainer(DrawerNavigator);