import React from 'react';
import { StyleSheet, View, Image, Text, Alert, TouchableOpacity, ImageBackground } from 'react-native';
// import { MapView } from 'expo'; // "react-native-maps"; ==> https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format} from 'date-fns'
//import { de, es, ru} from 'date-fns/locale'
import Collapsible from 'react-native-collapsible';
import UsersMap from "../components/UsersMap";
import R from 'res/R';

//import Images from '../assets/images'

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

var deLocale = require('date-fns/locale/de')

//const EventListItem = ({ event }) => {
export default class EventListItem extends React.Component {

    state = { isCollapsed: true, lastId: 0, }

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

        // Falls andere ID ("reused" View) -- UND nicht zufällig ein ander(szeitig)es Event mit gleicher id
        if (this.state.lastId != event.id) {
            this.state.lastId = event.id;
            this.state.isCollapsed = true; // -> einklappen!
        }

        let dist = event.km < 1 
            ? (parseFloat(event.km).toFixed(2)*1000 + " m")
            : (parseFloat(event.km).toFixed(1) + " km");

        let time = format(
            event._time, 
            event._time.getDate()==new Date().getDate() ? '\\H\\e\\u\\t\\e HH:mm' : 'dd D.M. HH:mm',
            {locale: deLocale,}); //, { locale: de }); //'MMMM Do, YYYY H:mma'
            //{ locale: locales[window.__localeId__] } // or global.__localeId__
            //var locales = {
            //  en: require('date-fns/locale/en'),
            //  eo: require('date-fns/locale/eo'),
            //  ru: require('date-fns/locale/ru')
            //} 

        let props =  event.props.split(",");
        let bgcolor = //props.includes('W') ? '#e2e2ff' : //ccccff (beides) ehübsches lila
                      props.includes('W') ? R.color.events.worship : //ccccff hübsches lila
                      //props.includes('P') ? '#ddeedd' :
                      //props.includes('P') ? '#ffcccc' :
                      props.includes('P') ? R.color.events.outreach :
                      //props.includes('W') ? '#aaaaff' :
                      event.km < 3 ? R.color.events.onetime :

                      //event.repeat == 0 ? '#ffcccc' : // #ffaaaa recht gutes rot
                      //'#fcfcfc';
                      R.color.events.regular;

        //let img = event.orgId in R.images.orgs ? R.images.orgs[event.orgId] : undefined;
        
        // let time = 
        //     event._time.getDate()==new Date().getDate() ? // Selber Tag (oder ev 1h bei Verschiebung/Umstellung -> testen?)
        //     event._time.

        return (
        <TouchableOpacity style={[styles.container, {backgroundColor:bgcolor}]} onPress={() => { this.setState({isCollapsed: !this.state.isCollapsed}); }}>
        <ImageBackground source={R.images.orgs[event.orgId]} style={styles.containerBg} imageStyle={{opacity:0.10}}>
            {/* Header */}
            <View style={styles.containerHeader}>

                <View style={styles.containerHeader}>
                    {/* <View style={styles.left}>
                        <Text>{/*<Text style={styles.subti}><MaterialIcons name='schedule' />* /}{time}</Text>
                    </View> */}
                    <View style={styles.middle}>
                        <Text style={styles.title}>{event.name}</Text>
                        <Text>{time}, {event.loc}</Text>
                    </View>
                </View>

                <View style={styles.right}>
                    <Text style={styles.small}>{dist} <MaterialIcons name='location-on' /></Text>
                </View>
            </View>
            
            {/* Expended */}
            <Collapsible style={styles.containerCollapsable} collapsed={this.state.isCollapsed}>
                {/* <View style={{flexGrow:1, }}> */}
                <View>
                    {/* <Text>{event.loc}</Text> */}
                    <Text>{event.strasse}, {event.plz} {event.ort}</Text>
                </View>
                <View>
                    <Text>{event.info}</Text>
                </View>
                {/* <UsersMap style={{width:100,}} /> */}
            </Collapsible>
        </ImageBackground>
        </TouchableOpacity> 
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
    //"bis":{"String":"","Valid":false}, // 15.4.19 geändert ->
    "bis":"",

    "loc":"Expedithalle",
    "strasse":"Absberggasse 27",

    // seit 15.4.19 auch
    "plz":"1100",
    "ort":"Wien",
    // --

    "lat":48171539,
    "lon":16390898,

    "_time" : [generiert],
}*/


const styles = StyleSheet.create({

    container: {
        borderColor:     'transparent',//'#fafafa',
        //backgroundColor: '#ffaaaa',//'#fafafa',
        borderWidth: 1,
        borderRadius: 10, //7
        
        marginLeft: 10,
        marginRight:10,
        marginBottom:7, // 10
        
    },
  
    containerBg: {
        flex: 1,
        padding: 7,
        borderColor: '#aaa', //'transparent',
        borderWidth: 1,
        borderRadius:10,

        //resizeMode: 'stretch', cover, contain, stretch, repeat, center
        //blurRadius: 2,
        //resizeMode: 'center',
    },

    containerHeader: {
        //flex: 1,
        flexDirection: 'row',
        //justifyContent: 'flex-end',
        justifyContent: 'space-between', //'space-between',  // (prim-axis) flex-start, center, flex-end, space-around, space-between and space-evenly
        alignItems: 'center',          // (secn-axis) flex-start, center, flex-end, and stretch

        // alignItems: "center",
        // justifyContent:"center",
        
    },

    containerCollapsable: {
        paddingTop: 7,

        flex: 1,
        //flexDirection:'row',
        //justifyContent:'flex-end',
    },

    left : {
         //alignItems: "baseline",
         borderRadius:25,
         width: 50,
         height: 50,
         padding: 7,
         backgroundColor: '#ccc',
    },  

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
    },

    map: {
       width: 40,
       height:70,
     },
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