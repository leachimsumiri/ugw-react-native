import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MapView } from 'expo'; // "react-native-maps"; ==> https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md

const UsersMap = props => {
    //let userPositionMarker = null;
    let userPositionMarker = props.userLocation==null ? null 
        : <MapView.Marker coordinate={props.userLocation} />;

    const eventLocations = props.eventLocations==null ? null
        : props.eventLocations.map(eloc => <MapView.Marker coordinate={eloc} key={eloc.id} />);

    return (
    <View style={{flex:1,}}>
        <MapView style={styles.map}
            initialRegion={{
                latitude: 48.208612,
                longitude:16.373406,
                latitudeDelta: 0.320,
                longitudeDelta: 0.320,
            }}
            region={props.userLocation} /* <- wird bei jedem Neuladen gesetzt!! */
            onRegionChange={props.onRegionChange}
        >
            {userPositionMarker}
            {eventLocations}
        </MapView>
    </View>
    )
}

const styles = StyleSheet.create({
  
    map: {
       flex: 1,
    //   width:'100%',
    //   height:'100%',
    },
})

export default UsersMap