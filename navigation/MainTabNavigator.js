import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import EventsScreen from '../screens/EventsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MapScreen from '../screens/MapScreen';

const HomeStack = createStackNavigator({
  Home: EventsScreen,
  //Home: MapScreen, 
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Events',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? 'ios-list-box'
          : 'md-list-box'
          //? `ios-information-circle${focused ? '' : '-outline'}`
          //: 'md-information-circle'
      }
    />
  ),
};

//////////////////////////////////////////////////////////////////

const LinksStack = createStackNavigator({
  Links: MapScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Karte',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      //name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
      name={Platform.OS === 'ios' ? 'ios-locate' : 'md-locate'}
    />
  ),
};

//////////////////////////////////////////////////////////////////

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Vorschlagen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
    />
  ),
};


// SettingsStack.navigationOptions = {
//   tabBarLabel: 'Settings',
//   tabBarIcon: ({ focused }) => (
//     <TabBarIcon
//       focused={focused}
//       name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
//     />
//   ),
// };

export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});
