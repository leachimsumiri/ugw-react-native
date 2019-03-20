import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
//import { MapView } from 'expo'; // "react-native-maps"; ==> https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Mögliche Icons-Übersicht:
// -------------------------
// https://oblador.github.io/react-native-vector-icons/
// 
// usage zB: <MaterialIcons name='schedule' />

//import Icon from 'react-native-vector-icons/FontAwesome';
//const myIcon = <Icon name="rocket" size={30} color="#900" />;

/*{
    "id":1,
    "name":"Sunday Service",
    "cancel":0,
    "info":"4 Corners, english speaking ",
    "props":"W,P,M",
    "locId":1,
    "repeat":1,
    "zeit":"17:00:00",
    "dauer":150,
    "von":"2018-01-07",
    "bis":{"String":"","Valid":false},
    "loc":"Expedithalle",
    "strasse":"Absberggasse 27",
    "lat":48171539,
    "lon":16390898,

    "_time" : [generiert],
}*/

const EventListItem = ({ event }) => {

    // Distanz 
    // TODO: Außerhalb errechnen um sortieren/filtern zu können
    let PI180 = Math.PI/180;
    let lat = (event.lat / 1000000);
    let lon = (event.lon / 1000000);
    let a = 0.5 
        - Math.cos((event.userLoc.latitude - lat) * PI180)/2
        + Math.cos(lat * PI180) * Math.cos(event.userLoc.latitude * PI180)
            * (1 - Math.cos((event.userLoc.longitude - lon) * PI180)) / 2;
    let km = 12742 * Math.asin(Math.sqrt(a));
    // Diesen Teil im EventItem lassen (=> Darstellung)
    let dist = km < 1 
        ? (parseFloat(km).toFixed(2)*1000 + " m")
        : (parseFloat(km).toFixed(1) + " km");

    return (
    <View style={styles.container}>
        {/* <Image
            style={styles.image}
            source={require('../assets/images/robot-prod.png')}
            source={{uri: "http://unsplash.it/50/50"}}
            resizeMode="contain" />  */}

        <View style={styles.left}>
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.subti}><MaterialIcons name='schedule' /> {event.zeit}</Text>
        </View>

        <View style={styles.right}>
            <Text style={styles.small}><MaterialIcons name='location-on' /> {dist}</Text>
        </View>
    </View>
    )
};


const styles = StyleSheet.create({
  
    container : {
        borderColor:'#fff',
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: '#fafafa',

        margin: 12,
        marginTop:0,
        marginBottom: 10,
        
        padding: 7,

        //flex: 1,
        flexDirection: 'row',
        //justifyContent: 'flex-end',
        justifyContent: 'space-between', // (prim-axis) flex-start, center, flex-end, space-around, space-between and space-evenly
        alignItems: 'center',            // (secn-axis) flex-start, center, flex-end, and stretch

        // alignItems: "center",
        // justifyContent:"center",
    },

    left : {
        //alignItems: "baseline",
    },  

    right : {
        
    },

    title : {
        fontSize: 16,
        color: '#000',
    },

    image : {
        // flex:1, 
        // height: undefined, 
        // width: undefined
    },

    subti : {
        fontSize: 12,
        /*flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'*/
    },

    small : {
        fontSize: 12,
    }

    // map: {
    //   width:'100%',
    //   height:'100%',
    // },
});

// const EventItem = props => {
//     // //let userPositionMarker = null;
//     // let userPositionMarker = props.userLocation==null ? null 
//     //     : <MapView.Marker coordinate={props.userLocation} />;

//     // const eventLocations = props.eventLocations==null ? null
//     //     : props.eventLocations.map(eloc => <MapView.Marker coordinate={eloc} key={eloc.id} />);

//     return (
//         <View style={styles.container}>
//             <Image
//              style={{flex:1, height: undefined, width: undefined}}
//              source={require('../../../assets/images/robot-prod.png')}
//              resizeMode="contain"
//            />
//             {/* <MapView style={styles.map}
//                 initialRegion={{
//                     latitude: 48.208612,
//                     longitude:16.373406,
//                     latitudeDelta: 0.320,
//                     longitudeDelta: 0.320,
//                 }}
//                 region={props.userLocation}
//                 onRegionChange={props.onRegionChange}
//             >
//                 {userPositionMarker}
//             </MapView> */}
//         </View>
//     )
// }

export default EventListItem