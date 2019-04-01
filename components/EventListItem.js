import React from 'react';
import { StyleSheet, View, Image, Text, Alert, TouchableOpacity } from 'react-native';
// import { MapView } from 'expo'; // "react-native-maps"; ==> https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format} from 'date-fns'
//import { de, es, ru} from 'date-fns/locale'
import Collapsible from 'react-native-collapsible';


//// Mögliche Date Formatierungen
// ------------------------------
// https://github.com/date-fns/date-fns
//
// import { format, formatDistance, formatRelative, subDays } from 'date-fns'
// format(new Date(), "'Today is a' iiii")
// //=> "Today is a Friday"
// formatDistance(subDays(new Date(), 3), new Date())
// //=> "3 days ago"
// formatRelative(subDays(new Date(), 3), new Date())
// //=> "last Friday at 7:26 p.m."


// Mögliche Icons-Übersicht:
// -------------------------
// https://oblador.github.io/react-native-vector-icons/
// 
// usage zB: <MaterialIcons name='schedule' />

//import Icon from 'react-native-vector-icons/FontAwesome';
//const myIcon = <Icon name="rocket" size={30} color="#900" />;


// Mögliche Collapsible Usages:
// ----------------------------
// https://github.com/oblador/react-native-collapsible
//
// import Collapsible from 'react-native-collapsible';
// () => (
//   <Collapsible collapsed={isCollapsed}>
//     <SomeCollapsedView />
//   </Collapsible>
// );
// import Accordion from 'react-native-collapsible/Accordion';
// () => (
//   <Accordion
//     activeSections={[0]}
//     sections={['Section 1', 'Section 2', 'Section 3']}
//     renderSectionTitle={this._renderSectionTitle}
//     renderHeader={this._renderHeader}
//     renderContent={this._renderContent}
//     onChange={this._updateSections}
//   />
// );


//const EventListItem = ({ event }) => {
export default class EventListItem extends React.Component {

    state = { isCollapsed: true, }

    render() {
        // // Distanz 
        // // TODO: Außerhalb errechnen um sortieren/filtern zu können
        // let PI180 = Math.PI/180;
        // let lat = (event.lat / 1000000);
        // let lon = (event.lon / 1000000);
        // let a = 0.5 
        //     - Math.cos((event.userLoc.latitude - lat) * PI180)/2
        //     + Math.cos(lat * PI180) * Math.cos(event.userLoc.latitude * PI180)
        //         * (1 - Math.cos((event.userLoc.longitude - lon) * PI180)) / 2;
        // let km = 12742 * Math.asin(Math.sqrt(a));
        
        let event = this.props.event;

        let dist = event.km < 1 
            ? (parseFloat(event.km).toFixed(2)*1000 + " m")
            : (parseFloat(event.km).toFixed(1) + " km");

        // INFO: Noch nicht getestet!
        let time = format(event._time, 
            event._time.getDate()==new Date().getDate() ? 'H:mm' : 'D.M. H:mm'); //, { locale: de }); //'MMMM Do, YYYY H:mma'

        return (
        <View style={styles.container}>
            {/* Header */}
            <TouchableOpacity style={styles.containerHead} onPress={() => { 
                    //Alert.alert('New State: '+(this.state.isCollapsed)); 
                    this.setState({isCollapsed: !this.state.isCollapsed}); 
                }}>
                <View style={styles.middle}>
                    <Text style={styles.title}>{event.name}</Text>
                    <Text style={styles.subti}><MaterialIcons name='schedule' /> {time}</Text>
                </View>

                <View style={styles.right}>
                    <Text style={styles.small}><MaterialIcons name='location-on' /> {dist}</Text>
                </View>
            </TouchableOpacity>
            
            {/* Expended */}
            <Collapsible style={styles.containerCollapsable} collapsed={this.state.isCollapsed}>
                <Text>{event.strasse}</Text>
                <Text>{event.info}</Text>
            </Collapsible>
        </View>
        )
    }
}

// Event-Item:
// -----------
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


const styles = StyleSheet.create({
  
    container: {
        borderColor:'#fff',
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: '#fafafa',

        margin: 12,
        marginTop:0,
        marginBottom: 10,
        
        padding: 7,
    },

    containerHead : {
        //flex: 1,
        flexDirection: 'row',
        //justifyContent: 'flex-end',
        justifyContent: 'space-between',  // (prim-axis) flex-start, center, flex-end, space-around, space-between and space-evenly
        alignItems: 'center',          // (secn-axis) flex-start, center, flex-end, and stretch

        // alignItems: "center",
        // justifyContent:"center",
    },

    containerCollapsable: {
        paddingTop: 7,
    },

    // left : {
    //     //alignItems: "baseline",
    //     borderRadius:25,
    //     width: 50,
    //     height: 50,
    //     padding: 7,
    //     backgroundColor: '#ccc',
    // },  

    middle : {

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

//export default EventListItem