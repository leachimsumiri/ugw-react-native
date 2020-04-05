import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import EventsScreen from '../screens/EventsScreen';
//import RecommendScreen from '../screens/RecommendScreen';
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
  // header: navigation => ({
  //   tintColor: '#ff0000',
  // }),
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
/*
const RecommendStack = createStackNavigator({
  Recommendations: RecommendScreen,
});

RecommendStack.navigationOptions = {
  tabBarLabel: 'Vorschlagen',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
    />
  ),
};
*/

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
  //RecommendStack,
}, {
  //tabBarOptions: { activeTintColor: '#ff0000' }
});
