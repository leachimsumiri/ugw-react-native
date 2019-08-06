import React from 'react';
import { FlatList, ActivityIndicator, ScrollView, RefreshControl, StyleSheet, View, Button } from 'react-native';
//import { ExpoLinksView } from '@expo/samples';
import EventListItem from '../components/EventListItem';
//import { fetchJson } from "../utils/requests";
import CommonData from '../utils/CommonData';
//import EventList from '../components/EventList';
//import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import MultiSelect from '../utils/react-native-multiple-select/react-native-multi-select';
import R from 'res/R';
import DropdownChecklist from '../components/DropdownChecklist';

const filterEnum = {'ZEIT':1, 'ORT':2}; //Object.freeze({'zeit':1, 'ort':2});

export default class EventsScreen extends React.Component {

  static navigationOptions = { title: 'Events', };
  

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      allEvents: [],
      filter: filterEnum.ZEIT,
      selectedTypes: [],
      //filteredEvents: [],
      //error: 0, // http response status (im Fehlerfall zB)
      userCoords: null
    }
  }

  async componentDidMount(){
    
    position = await CommonData.getInst().requestPosition();
    events = await CommonData.getInst().requestEvents(/*position*/);

    // Von "Haus aus", nach Zeit gefiltert (und sekundär nach Ort, daher davor)
    //events.sort(function(a,b) { return a.km    < b.km    ? -1 : 1; });
    events.sort(function(a,b) { return a._time < b._time ? -1 : 1; });
          //.sort(function(a,b) { return a._time < b._time ? -1 : 1; });
    this.setState({
      userCoords: position.coords,
      allEvents: events,
      filter: filterEnum.ZEIT,
      //filteredEvents: events,
      isLoading: false,
    }, function(){}); // TODO: Console log
    
  }

  // Event-Handler
  //async _onRefreshSwipe() {
  _onRefreshSwipe = () => {
    this.setState({isLoading: true});

    // Etwas hässlich, aber funktioniert zuverlässig; TODO: Überarbeiten!
    outerThis = this;
    (async function reloadEventsAutorunner() {
      events = await CommonData.getInst().requestEvents().catch((err) => console.warn("caught: "+err));
      outerThis.setState({isLoading: false, allEvents: events, filter: outerThis.state.filter});
    })();
  }

  // _onUpdateEventList
  // /*_updateSections*/ = activeSections => {
  //   this.setState({ activeSections });
  // }; 


  render() {

    if (this.state.isLoading){
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

    switch (this.state.filter) {
      case filterEnum.ZEIT: this.state.allEvents.sort( function(a,b) { return a._time < b._time ? -1 : 1; }); break;
      case filterEnum.ORT:  this.state.allEvents.sort( function(a,b) { return a.km < b.km ? -1 : 1; }); break;
    }

    let items = [ {id:'treff', name:'Treffen'}, {id:'frei', name:'Freizeit'}, ];
    //const { selectedTypes } = this.state; // ev etwas überbelegt

    return(
      <View style={styles.container}>
      <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={this.state.isLoading} onRefresh={this._onRefreshSwipe} />}>
      {/* <View style={{flex: 1, /*paddingTop:20* /}}> */}
        
        <View style={styles.navHeader}>        

          {/* <DropdownChecklist /> */}
          {/* <Text style={styles.filterItem}>Filter</Text> */}
          {/* https://www.npmjs.com/package/react-native-multiple-select */}
          {/* <View style={{width:'50%', marginLeft:2}}>
          <MultiSelect 
            hideTags
            items={items} 
            onSelectedItemsChange={(selectedTypes) => { this.setState({selectedTypes}); console.log(selectedTypes); }}
            uniqueKey="id"
            displayKey="name"
            selectText=" -nu- "
            //ref={(component) => { /*this.multiSelect = component* / }}
            selectedItems={this.state.selectedTypes}
            ref={(component) => { this.multiSelect = component }}
            
            // searchInputPlaceholderText="Search Items..."
            // searchInputStyle={{ color: '#CCC' }}
            // //altFontFamily="ProximaNova-Light" // font family für "searchInputPlaceholderText"

            onChangeInput={ (text)=> console.log(text)}
            
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#000"
            selectedItemIconColor="#CCC"

            itemTextColor="#CCC"
            displayKey="name"
            
            submitButtonColor="#CCC"
            submitButtonText="Auswählen"
          />
          </View> */}
        
          <View style={{flex:1}} />

          <Button title="Zeit" color={this.state.filter==filterEnum.ZEIT?R.color.activeblue :"lightgray"} onPress={() => { this.setState({filter:filterEnum.ZEIT}); }} />
          <Button title="Ort"  color={this.state.filter==filterEnum.ORT ?R.color.activeblue :"lightgray"} onPress={() => { this.setState({filter:filterEnum.ORT}); }} />
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

      {/* </View> */}
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
    //flex: 1,

    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline', // Buttons oben bleiben (bei ausgeklapptem Filter zB)
    // marginRight: 10,
    // marginTop: 10,
    padding: 10,
  },

  filterItem: {
    //margin: 10,
  },

});
