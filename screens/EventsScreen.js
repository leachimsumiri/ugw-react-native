import React from 'react';
import {  FlatList, ActivityIndicator, Text, ScrollView, StyleSheet, View } from 'react-native';
//import { ExpoLinksView } from '@expo/samples';

export default class EventsScreen extends React.Component {
  static navigationOptions = { title: 'Events', };

  constructor(props) {
    super(props);
    this.state ={ isLoading: true}
  }

  //hasValidishDateAndTime(item) { return item.datebeg.Valid && item.start.Valid && item.start.String.length >=5; }

  componentDidMount(){
    return fetch('http://37.221.194.244:8080/v1/api/schedule/gps/48157083/16382141') //'http://37.221.194.244:8080/v1/api/event/gps/48157083/16382141')
      .then((response) => response.json())
      .then((responseJson) => {

        //for(a , responseJson) {
        var date = new Date();
        var dateLimit = date.getDate() + 10; // 10 Tage von jetzt
        var maxDays = 10;
        var events = [];

        responseJson.map(function(item, index) {
            // if (item.repeat=='0') {
            //   // Kein reapeat => einfach so lassen
            //   // EVDO: Checken ob "Zeitpunkt" gesetzt?
            //   return;
            // }
            //var withRemovedItem = _.omit(item, "attributeToRemove") //

            // TODO: Ev auch checken ob datebeg malformed / gültiges Datum ist --- (aber REST Server sollte schon "leer" oder "gültig" ausspucken, keine Mischung)
            if (item.repeat == 0 && item.datebeg.Valid && new Date(item.datebeg.String).getDate() < dateLimit /* && new Date == überhaupt gültig bzw > 0 oder so?*/) {
              // INFO: Hier (aktuell) "gut", dass "jüngere" Events nicht rausgefiltert werden, weil das aktuell am Server geschehen sollte (damit man auf solche Server Fehler aufmerksam wird und DORT behebt)
              //responseJson[index]._time = new Date(item.datebeg.String).setHours(item.start.String.substring(0,2)); // HOURS: Zeitzone, UTC?? -> auf Timestamps ganz wechseln?
              var zeit = new Date(item.datebeg.String);
              if (item.start.Valid) { // Ansonsten wird gerade "Mitternacht" übergeben, hm ...
                zeit.setHours(item.start.String.substring(0,2));
                zeit.setMinutes(item.start.String.substring(3,5));
              }
              var ev = Object.assign({ _time: zeit.toLocaleString(), }, item);
              events.push(ev);
            }
            else if (item.repeat >= 1 && item.repeat <= 7) {
              var todayDaysAfterSunday = date.getDay();
              //responseJson[index]._time = date.setDate(date.getDate() - todayDaysAfterSunday + item.repeat)
            }
            /*switch (item.repeat) {
              //case 0: if (item.datebeg.Valid) responseJson[index]._startdate = item.datebeg.String.toString(); return Object.assign(item, { _startdate: item.datebeg.String });
              case 1: return;
              case 7: date.setDate(date.getDate() + todayDiffFromSunday)/*.setHours(item.start.String.substring(0,2))* /; responseJson[index]._startdate = date.toString(); return;
            }*/ 
        });

        this.setState({
          dataSource: events,
          isLoading: false,
          
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  // POST-Example
  /* 
  fetch('https://mywebsite.com/endpoint/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstParam: 'yourValue',
      secondParam: 'yourOtherValue',
    }),
  }); */

  render() {
    /*return (
      <ScrollView style={styles.container}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
           * content, we just wanted to provide you with some helpful links 
          <ExpoLinksView />* /}
      </ScrollView>
    );*/

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <ScrollView style={styles.container}>
      <View style={{flex: 1, paddingTop:20}}>
      <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <Text>{item.title}, {item._time}, {item.props}</Text>}
          keyExtractor={({id}, index) => id.toString()}
      />
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#eee',
  },
});
