import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
// import { MapView } from 'expo'; // "react-native-maps"; ==> https://github.com/react-native-community/react-native-maps/blob/master/docs/installation.md
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
//import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format} from 'date-fns'
//import { de, es, ru} from 'date-fns/locale'
//import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';


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

// _updateSections = activeSections => {
//     this.setState({ activeSections });
// };

export default class EventList extends React.Component {
    
    state = { activeSections: [], }

    render() {
        return (
        <Accordion
            activeSections={this.state.activeSections} // {[0]}
            sections={this.props.events}
            renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={activeSections => {this.setState({activeSections})}} //{this.props._updateSections}
        />);
    }
    
// const EventList = ({ events, onUpdateFunc }) => {
//     return (
//         <Accordion
//             activeSections={[]} // {[0]}
//             sections={events}
//             renderSectionTitle={_renderSectionTitle}
//             renderHeader={_renderHeader}
//             renderContent={_renderContent}
//             onChange={onUpdateFunc} //{_updateSections}
//         />
//     );
// }

    /*
    Accordion
    ---------
    sections	                                        An array of sections passed to the render methods
    renderHeader(content, index, isActive, sections)	A function that should return a renderable representing the header
    renderContent(content, index, isActive, sections)	A function that should return a renderable representing the content
    renderSectionTitle(content, index, isActive)	    A function that should return a renderable representing the title of the section outside the touchable element
    onChange(indexes)	                                A function that is called when the currently active section(s) are updated.
    onAnimationEnd(key, index)	                        See Collapsible
    activeSections	            Control which indices in the sections array are currently open. If empty, closes all sections.
    underlayColor	            The color of the underlay that will show through when tapping on headers. Defaults to black.
    touchableComponent	        The touchable component used in the Accordion. Defaults to TouchableHighlight
    touchableProps	            Properties for the touchableComponent
    disabled	                Set whether the user can interact with the Accordion
    align	                    See Collapsible
    duration	                See Collapsible
    easing	                    See Collapsible
    expandFromBottom	        Expand content from the bottom instead of the top
    expandMultiple	            Allow more than one section to be expanded. Defaults to false.
    sectionContainerStyle	    Optional styling for the section container.
    containerStyle	            Optional styling for the Accordion container.
    */


     _renderSectionTitle(event) { return <View><Text>header</Text></View> } //content, index, isActive) { }
     //_renderHeader(event) { //content, index, isActive, sections)
     _renderHeader(event, index, isActive, sections) {        
        // // Distanz (nicht darstellungsrelevant -> außerhalb)
        // // TODO: Außerhalb errechnen um sortieren/filtern zu können
        // let PI180 = Math.PI/180;
        // let lat = (event.lat / 1000000);
        // let lon = (event.lon / 1000000);
        // let a = 0.5 
        //     - Math.cos((event.userLoc.latitude - lat) * PI180)/2
        //     + Math.cos(lat * PI180) * Math.cos(event.userLoc.latitude * PI180)
        //         * (1 - Math.cos((event.userLoc.longitude - lon) * PI180)) / 2;
        // let km = 12742 * Math.asin(Math.sqrt(a));
        
        //if (isActive) return;

        // Darstellungsrelevante Berechnungen 
        let dist = event.km < 1 
            ? (parseFloat(event.km).toFixed(2)*1000 + " m")
            : (parseFloat(event.km).toFixed(1) + " km");
        // INFO: Noch nicht getestet!
        let time = format(event._time, 
            event._time.getDate()==new Date().getDate() ? 'H:mm' : 'D.M. H:mm'); //, { locale: de }); //'MMMM Do, YYYY H:mma'

        return (
        <View style={styles.container}>
            {/* <View style={styles.left}>
                <Text>{time}</Text>
            </View> */}
            <View style={styles.middle}>
                <Text style={styles.title}>{event.name}</Text>
                <Text style={styles.subti}><MaterialIcons name='schedule' /> {time}</Text>
            </View>

            <View style={styles.right}>
                <Text style={styles.small}><MaterialIcons name='location-on' /> {dist}</Text>
            </View>
        </View>
        )
    }

    /* event {
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

    _renderContent(event, index, isActive, sections) {
                
                //     // Darstellungsrelevante Berechnungen 
                //     let dist = event.km < 1 
                //     ? (parseFloat(event.km).toFixed(2)*1000 + " m")
                //     : (parseFloat(event.km).toFixed(1) + " km");
                // // INFO: Noch nicht getestet!
                // let time = format(event._time, 
                //     event._time.getDate()==new Date().getDate() ? 'H:mm' : 'D.M. H:mm'); //, { locale: de }); //'MMMM Do, YYYY H:mma'

        
        return (
                // <View style={styles.container}>
                //     {/* <View style={styles.left}>
                //         <Text>{time}</Text>
                //     </View> */}
                //     <View style={styles.middle}>
                //         <Text style={styles.title}>{event.name}</Text>
                //         <Text style={styles.subti}><MaterialIcons name='schedule' /> {time}</Text>
                //     </View>
        
                //     <View style={styles.right}>
                //         <Text style={styles.small}><MaterialIcons name='location-on' /> {dist}</Text>
                //     </View>
                // </View>    
                
            <Animatable.View
              duration={300}
              transition="backgroundColor"
              style={{ backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)') }}>
              <Animatable.Text
                duration={300}
                easing="ease-out"
                animation={isActive ? 'zoomIn' : false}>
                {event.info}
              </Animatable.Text>
            </Animatable.View>
            
          );
    }

}

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
        justifyContent: 'space-between',  // (prim-axis) flex-start, center, flex-end, space-around, space-between and space-evenly
        alignItems: 'center',          // (secn-axis) flex-start, center, flex-end, and stretch

        // alignItems: "center",
        // justifyContent:"center",
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

//export default EventList