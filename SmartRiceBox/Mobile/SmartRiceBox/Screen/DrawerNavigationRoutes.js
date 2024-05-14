import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './DrawerScreens/HomeScreen';
import SettingsScreen from './DrawerScreens/SettingsScreen';
import ProductsScreen from './Components/Products'; // Import the ProductsScreen component
import CustomSidebarMenu from './Components/CustomSidebarMenu';
import NavigationDrawerHeader from './Components/NavigationDrawerHeader';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#307ecc', // Background color for the header
        },
        headerTintColor: 'white', // Text color for the header
        headerTitleStyle: {
          fontWeight: 'bold', // Font style for the header title
        },
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Home',
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} /> 
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: 'white', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
          }}
      />
    </Stack.Navigator>
  );
};

const SettingScreenStack = ({navigation}) => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: 'blue', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const ProductsScreenStack = ({navigation}) => { // Define a new navigation stack for ProductsScreen
  return (
    <Stack.Navigator
      initialRouteName="ProductsScreen"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: 'blue', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="ProductsScreen"
        component={ProductsScreen}
        options={{
          title: 'Products', //Set Header Title
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'white', // Background color for the drawer
        },
        drawerActiveTintColor: 'white', // Text color for the active item
        drawerInactiveTintColor: 'white', // Text color for the inactive items
        headerShown:false,
      }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="Smart Rice Box"
        options={{ drawerLabel: 'Home Screen' }}
        component={HomeScreenStack}
      />
      <Drawer.Screen
        name="Products" // Define the screen name for ProductsScreen
        options={{ drawerLabel: 'Products' }} // Set the label for the drawer item
        component={ProductsScreenStack} // Set the component for the screen
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;
