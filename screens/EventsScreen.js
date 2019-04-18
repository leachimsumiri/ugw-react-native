import React from 'react';
import { FlatList, ActivityIndicator, ScrollView, StyleSheet, View, Button, Text } from 'react-native';
//import { ExpoLinksView } from '@expo/samples';
import EventListItem from '../components/EventListItem';
import { fetchJson } from "../utils/requests";
import CommonData from '../CommonData';
//import EventList from '../components/EventList';

const filterEnum = {'ZEIT':1, 'ORT':2}; //Object.freeze({'zeit':1, 'ort':2});

export default class EventsScreen extends React.Component {

  static navigationOptions = { title: 'Events', };
  

  constructor(props) {
    super(props);
    this.state ={ 
      isLoading: true,
      allEvents: [],
      filter: filterEnum.ZEIT,
      //filteredEvents: [],
      //error: 0, // http response status (im Fehlerfall zB)
      userCoords: null
    }
  }

  componentDidMount(){
    
    CommonData.getInst().requestEvents( (position, events) => {
      
      // Von "Haus aus", nach Zeit gefiltert
      events.sort( function(a,b) { return a._time < b._time ? -1 : 1; })

      this.setState({
        userCoords: position.coords,
        allEvents: events,
        //filteredEvents: events,
        isLoading: false,
      }, function(){}); // TODO: Console log

    });
  }

  _onUpdateEventList
  /*_updateSections*/ = activeSections => {
    this.setState({ activeSections });
  };


  render() {

    if(this.state.isLoading){
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>);
    }

    // if (this.state.filter == filterEnum.ZEIT)
    //   events.sort( function(a,b) { return a._time < b._time ? -1 : 1; });
    /*switch (this.state.filter) {
      case filterEnum.ZEIT: this.state.allEvents.sort( function(a,b) { return a._time < b._time ? -1 : 1; }); break;
      case filterEnum.ORT : this.state.allEvents.sort( function(a,b) { return a.km    < b.km    ? -1 : 1; }); break;
    }*/

    return(
      <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      <View style={{flex: 1, /*paddingTop:20*/}}>
        
        <View style={styles.navHeader}>
          {/* <Text style={styles.filterItem}>Filter</Text> */}
          <Button title="Zeit" color={this.state.filter==filterEnum.ZEIT?"lightblue":"lightgray"}
            onPress={() => { 
              this.state.allEvents.sort( function(a,b) { return a._time < b._time ? -1 : 1; });
              this.setState({filter:filterEnum.ZEIT, allEvents:this.state.allEvents }); 
            }} />
          <Button title="Ort"  color={this.state.filter==filterEnum.ORT ?"lightblue":"lightgray"}
            onPress={() => { 
              this.state.allEvents.sort( function(a,b) { return a.km < b.km ? -1 : 1; });
              this.setState({filter:filterEnum.ORT,  allEvents:this.state.allEvents }); 
            }} />
        </View>

        <FlatList
            filter={this.state.filter} // um Refresh zu gewährleisten, wird nicht von FlatList direkt verwendet
            data={this.state.allEvents}
            renderItem={({ item }) => {
              item.userLoc = this.state.userCoords; // <- nicht die eleganteste Lösung!
              return <EventListItem event={item} />;
            }}
            keyExtractor={({id}, index) => /*id.toString()*/ index.toString()}
        />

      </View>
      {/* <EventList 
        events={this.state.dataSource}
        onUpdateFunc={this._onUpdateEventList}
      /> */}
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#eee',
  },

  scrollView: {
    flex: 1,
    paddingBottom: 10,
    
  },

  navHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginRight: 10,
    // marginTop: 10,
    padding: 10,
  },

  filterItem: {
    //margin: 10,
  },

});
