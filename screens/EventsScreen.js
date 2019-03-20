import React from 'react';
import { FlatList, ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
//import { ExpoLinksView } from '@expo/samples';
import EventListItem from '../components/EventListItem';
import { fetchJson } from "../utils/requests";

export default class EventsScreen extends React.Component {
  static navigationOptions = { title: 'Events', };

  constructor(props) {
    super(props);
    this.state ={ 
      isLoading: true,
      dataSource: [],
      //error: 0, // http response status (im Fehlerfall zB)
      userCoords: null
    }
  }

  //hasValidishDateAndTime(item) { return item.datebeg.Valid && item.start.Valid && item.start.String.length >=5; }

  /*getNaechstesEventInSeconds(firstInSeconds, intervalInSeconds, includeStartedBeforeSeconds) {
    var jetzt = new Date().getTime()/1000;
    var zeit = ((jetzt - firstInSeconds)  // Gesamte Differenz zu jetzt
                % intervalInSeconds)      // Überschüssige Sekunden, seit letztem Intervall
                * (-1) + jetzt;           // Abgezogen von jetzt
      console.log(zeit);

    return firstInSeconds > jetzt ? firstInSeconds :    // falls erstes Event in Zukunft, ist das das erste ;-)
           (jetzt - zeit <= includeStartedBeforeSeconds) ? zeit : (zeit + intervalInSeconds); // Liegt letztes in Toleranz, sonst nächstes
  }*/
  
  addEvents(events, item, erstTime, interval, iTimelimit) {
    var jetzt = new Date().getTime()/1000;
    var zeit = ((jetzt - erstTime)  // Gesamte Differenz zu jetzt
                % interval)                    // Überschüssige Sekunden, seit letztem Intervall
                * (-1) + jetzt;                // Abgezogen von jetzt
    const includeStartedBeforeSeconds = item.dauer; //item.end.Valid ? item.end.String * 60 : 120; // 2h default?

    // TODO 
    // Ggf iTimelimit vorverlegen, falls Event dann schon aus
    if (item.bis.Valid) {
      // iTimelimit = ...
    }
    
    var erstes = erstTime > jetzt ? erstTime :    // falls erstes Event in Zukunft, ist das das erste ;-)
           (jetzt - zeit <= includeStartedBeforeSeconds) ? zeit : (zeit + interval); // Liegt letztes in Toleranz, sonst nächstes

    //console.log(erstes + " - " + iTimelimit);
    //console.log(((jetzt-erstDate.getTime()/1000)%(interval*repeatSpan))%erstes);
    for (var secs=erstes; secs < iTimelimit; secs+=interval) {
        events.push(Object.assign({ _time: new Date(secs*1000)/*.toLocaleString()*/, }, item));
    }
  }

  componentDidMount(){
    //this.requestEvents(null);
    
    navigator.geolocation.getCurrentPosition(position => {
      // this.setState({
      //     userLocation: {
      //       latitude: position.coords.latitude,
      //       longitude: position.coords.longitude,
      //       latitudeDelta: 0.0622,
      //       longitudeDelta: 0.0421,
      //     }
      // })

      this.requestEvents(position); 
    }, err => console.error(err));
  }

  requestEvents(position) {
    // TODO: Echte Koordinaten verwenden
    var lat = parseInt(position.coords.latitude  * 1000000).toString();
    var lon = parseInt(position.coords.longitude * 1000000).toString();
    var reqStr = `http://37.221.194.244:8080/v1/api/schedule/gps/${lat}/${lon}`;
    //var reqStr = 'http://37.221.194.244:8080/v1/api/schedule/gps/aa'+lat.toString()+'/'+lon.toString();
    //var reqStr = 'http://37.221.194.244:8080/v1/api/schedule/gps/48157083/16382141';
    //console.log(reqStr);
    //alert(reqStr);
    //return fetch(reqStr).then((resp) => { resp.text });
    return fetchJson(reqStr) //'http://37.221.194.244:8080/v1/api/event/gps/48157083/16382141')
      /*.then((response) => { 
        if (response.status != 200) {
          // TODO: Ev ErrorHandling für Production? (User mitteilen dass iwas nicht geht?)
          //console.warn(response.status+' '+response.statusText);
          //this.setState({ isLoading: false })
          //return response.text();
          throw new Error(response.statusText);
        }
        return response.json(); 
      })*/
      //.then((responseJson) => {
      .then((responseJson) => {
 
        //for(a , responseJson) {
        var date = new Date();
        var iTimeLimit = date.getTime()/1000 + (3600*24*10); // 10 Tage von jetzt
        //var maxDays = 10;
        var events = [];

        //responseJson.map(function(item, index) {
        responseJson.map((item) => {
            // if (item.repeat=='0') {
            //   // Kein reapeat => einfach so lassen
            //   // EVDO: Checken ob "Zeitpunkt" gesetzt?
            //   return;
            // }
            //var withRemovedItem = _.omit(item, "attributeToRemove") //

            var eventZeit = new Date(item.von);
              //if (item.start.Valid) { // Ansonsten wird gerade "Mitternacht" übergeben, hm ...
            eventZeit.setHours(item.zeit.substring(0,2));
            eventZeit.setMinutes(item.zeit.substring(3,5));
              //}

            // TODO: Ev auch checken ob datebeg malformed / gültiges Datum ist --- (aber REST Server sollte schon "leer" oder "gültig" ausspucken, keine Mischung)

            // Einmalig (bis max. Zeitgrenze && spätestens jetzt (- Eventdauer))
            if (item.repeat == 0 && /*item.datebeg.Valid &&*/ /*new Date(item.von).getDate()*/ eventZeit < iTimeLimit /* && new Date == überhaupt gültig bzw > 0 oder so?*/ && date.getTime()/1000 - (item.dauer==0 ? 7200/*def=2h*/ : item.dauer) < eventZeit) {
              // INFO: Hier (aktuell) "gut", dass "jüngere" Events nicht rausgefiltert werden, weil das aktuell am Server geschehen sollte (damit man auf solche Server Fehler aufmerksam wird und DORT behebt)
              //responseJson[index]._time = new Date(item.datebeg.String).setHours(item.start.String.substring(0,2)); // HOURS: Zeitzone, UTC?? -> auf Timestamps ganz wechseln?
              
              var ev = Object.assign({ _time: eventZeit/*.toLocaleString()*/, }, item); // <- das jeweils direkt returnen nicht optimal, wegen Mehrfach-Events (weiter unten)
              events.push(ev);
            }

            // Wöchentlich
            else if (item.repeat <= 7) {
              //var first = zeit.getTime()/1000;  // Unix Sekunden des Events
              //var jetzt = date.getTime()/1000 - item.ende/*umbenennen zu "dauer"*/; // Unix Sekudnen jetzt gerade - Dauer vom Event
              //const zeitspanne = 7*24*3600;

                // TODO: Wenn Beginn vom Event in der Zukunft liegt!!
              // ... Ansonsten 
              //var zeitspanne_seit_letztem_event = ((jetzt - first)%(7*24*3600));
              
              // Schleife von nächstem Event bis Maximalzeit
              // for (var i=jetzt-zeitspanne_seit_letztem_event+(7*24*3600); i < dateLimit; i+=7*24*3600) {
              //     events.push(Object.assign({ _time: new Date(i), }, item));
              // }
              for (var i=0; i < item.repeat; i++) {

                this.addEvents(events, item, (eventZeit.getTime()/1000)+(i * 24*3600), 7*24*3600, iTimeLimit); // <- 5 mal aufrufen (und vorher umschreiben)

              }
              // for (var secs=this.getNaechstesEventInSeconds(zeit.getTime()/1000, zeitspanne, 60 * (item.end.Valid ? item.end.String : 120) /* = zeitspanne in minuten */ + 30 /* noch 30 Minuten extra länger anzeigen?*/); secs < dateLimit; secs+=zeitspanne) {
              //   events.push(Object.assign({ _time: new Date(secs*1000)/*.toLocaleString()*/, }, item));
              // }
              
              //var todayDaysAfterSunday = date.getDay();
              //responseJson[index]._time = date.setDate(date.getDate() - todayDaysAfterSunday + item.repeat)
              //item.start
            }
        })
        //.catch((err) => console.warn(err));

        events.sort( function(a,b) { return a._time < b._time ? -1 : 1; })

        this.setState({
          userCoords: position.coords,
          dataSource: events,
          isLoading: false,
        }, function(){

        });

      })
      .catch((error) => {
        //console.warn(error); 
        console.error(error); // <- etwas zu drastisch ev
        // TODO: ev mehr ErrorHandling für Production
        // ----  wassoll passieren wenn Server nicht erreichbar?
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



    if(this.state.isLoading){
      return (
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>);
    }

    return(
      <ScrollView style={styles.container}>
      <View style={{flex: 1, paddingTop:20}}>
      <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => {
            item.userLoc = this.state.userCoords; // <- nicht die eleganteste Lösung!
            return <EventListItem event={item} />;
          }}
          keyExtractor={({id}, index) => /*id.toString()*/ index.toString()}
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
