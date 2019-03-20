import React from 'react';

export default class BaseScreen extends React.Component {

    constructor(props) { super(props); }

// TODO: Dinge die in (fast) jedem Screen gemacht werden sollen einfügen

    // requestLocation(locationConsumer) {
    //     navigator.geolocation.getCurrentPosition(position => {
    //       //this.setState({
    //         locationConsumer({
    //           userLocation: {
    //             latitude: position.coords.latitude,
    //             longitude: position.coords.longitude,
    //             latitudeDelta: 0.0622,
    //             longitudeDelta: 0.0421,
    //           }
    //       })
    //     });
    //   }
}