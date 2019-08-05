//import React from 'react';
import { fetchJsonOrThrow } from "./requests";

export default class CommonData { //extends React.Component {

    static myInst = null;

    lastPosition = null;
    //lastEvents = null;

    static getInst() {
        if (CommonData.myInst == null) {
            CommonData.myInst = new CommonData();
        }
        return CommonData.myInst;
    }
    //constructor(props) { super(props); }

    requestPosition() {

      var options = {
        enableHighAccuracy: true,
        timeout:   60000, // Zeit nach der ein Error Callback ausgelöst wird (0 = nie auslösen??)
        maximumAge: 2000, // Maximales gecachtes Positionsalter (in ms)
      };

      return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(
          pos => { resolve(pos); this.lastPosition = pos; }, 
          err => { reject(err); console.warn("Position abrufen: "+err); },
          options);
      });
    }

    async requestEvents() {

      position = (lastPosition == null) ? await requestPosition() : lastPosition;
        
      //return new Promise(function(resolve, reject) {
        var lat = parseInt(position.coords.latitude  * 1000000);
        var lon = parseInt(position.coords.longitude * 1000000);
        var reqStr = `http://37.221.194.244:8080/v1/api/schedule/gps/${lat}/${lon}`;
        //var reqStr = 'http://37.221.194.244:8080/v1/api/schedule/gps/aa'+lat.toString()+'/'+lon.toString();
        //var reqStr = 'http://37.221.194.244:8080/v1/api/schedule/gps/48157083/16382141';
        return fetchJsonOrThrow(reqStr) //'http://37.221.194.244:8080/v1/api/event/gps/48157083/16382141')
          .then(this.responseToJson)
          .catch((error) => {
            //console.error(error); // <- etwas zu drastisch
            // TODO: ev mehr ErrorHandling für Production
            // -> was soll passieren wenn Server nicht erreichbar?

            console.warn("Events abrufen: "+error);
            return []; // Leere Liste und Fehler als Warn?
          });

      //}, err => console.error(err));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    responseToJson(responseJson) {
      
      var events = [];
      //var date = new Date();
      //var timeLimit = date.getTime()/1000 + (3600*24*10); // 10 Tage von jetzt
      var timeLimit = new Date().setDate(new Date().getDate() + 14); // 14 Tage von jetzt
      //date.getDay();
      let PI180 = Math.PI/180;

      responseJson.map((item) => {

          var eventZeit = new Date(item.von);
          //var eventZeit = new Date(Date.UTC( ...item.von.split("-") )); // Leider kein Unterschied
          eventZeit.setHours(item.zeit.substring(0,2), item.zeit.substring(3,5));
          //eventZeit.setMinutes(); //if (item.start.Valid) { // Ansonsten wird gerade "Mitternacht" übergeben, hm ...
          //eventZeit.setUTCHours(item.zeit.substring(0,2), item.zeit.substring(3,5)); // verdoppelter Zeitumstellungseffekt (2h zu spät)
          var dauer = item.dauer==0 ? 120 : item.dauer;
          let nowMinusEventLength = new Date(); nowMinusEventLength.setMinutes(nowMinusEventLength.getMinutes() - dauer);
          //let z = new Date(eventZeit);

          // TODO: Ev auch checken ob datebeg malformed / gültiges Datum ist --- (aber REST Server sollte schon "leer" oder "gültig" ausspucken, keine Mischung)

          // Distanz 
          let a = 0.5 
          - Math.cos((position.coords.latitude - (item.lat / 1000000)) * PI180)/2
          + Math.cos((item.lat / 1000000) * PI180) * Math.cos(position.coords.latitude * PI180)
              * (1 - Math.cos((position.coords.longitude - (item.lon / 1000000)) * PI180)) / 2;
          let km = 12742 * Math.asin(Math.sqrt(a));

          // Einmalig (bis max. Zeitgrenze && spätestens jetzt (- Eventdauer))
          //if (item.repeat == 0 && /*item.datebeg.Valid &&*/ /*new Date(item.von).getDate()*/ eventZeit < timeLimit /* && new Date == überhaupt gültig bzw > 0 oder so?*/ && date.getTime()/1000 - (item.dauer==0 ? 7200/*def=2h*/ : item.dauer) < eventZeit) {
          /*if (item.repeat == 0 && z >= nowMinusEventLength) { // TODO: NOCH TESTEN!
            // INFO: Hier (aktuell) "gut", dass "jüngere" Events nicht rausgefiltert werden, weil das aktuell am Server geschehen sollte (damit man auf solche Server Fehler aufmerksam wird und DORT behebt)             
            var ev = Object.assign({ _time: eventZeit, km, }, item); // <- das jeweils direkt returnen nicht optimal, wegen Mehrfach-Events (weiter unten)
            events.push(ev);
          }*/
          // Einmalig 
          var ev = Object.assign({ _time: eventZeit, km, }, item); // <- das jeweils direkt returnen nicht optimal, wegen Mehrfach-Events (weiter unten)
          events.push(ev);

          // (Mehrmals) Wöchentlich
          ///*else*/ if (item.repeat <= 7) {
          if (item.repeat > 0) {
            //var first = zeit.getTime()/1000;  // Unix Sekunden des Events
            //var jetzt = date.getTime()/1000 - item.ende/*umbenennen zu "dauer"*/; // Unix Sekudnen jetzt gerade - Dauer vom Event
            //const zeitspanne = 7*24*3600;
            //if (item.name=="Anbetungsgottesdienst") 
            //alert ("Repeat: "+item.name);
            // TODO: Wenn Beginn vom Event in der Zukunft liegt ... ansonsten 
            //var zeitspanne_seit_letztem_event = ((jetzt - first)%(7*24*3600));
            
            // Von jetzt, bis Zeitlimit
            var date = new Date();
            date.setHours(eventZeit.getHours());
            date.setMinutes(eventZeit.getMinutes());
            for (; date <= timeLimit; date.setDate(date.getDate()+1)) {

              if (item.repeat&(1<<(7-date.getDay())))
                events.push(Object.assign({ _time: new Date(z)/*.toLocaleString()*/, km, }, item));
            }

            // Schleife von nächstem Event bis Maximalzeit
            /*const SIEBEN = 7; // 7 Tage (für REPEAT-Funktion)
            for (var tagoffset=0; tagoffset < item.repeat || item.repeat==0; tagoffset++) {

                // Alle 7 Tage
                let z = new Date(eventZeit);
                for (z.setDate(z.getDate() + tagoffset); z <= timeLimit; z.setDate(z.getDate() + SIEBEN)) { 
                  //if (i > 1) {console.warn(item.name);}

                  // Schon vorbei?
                  if (z < nowMinusEventLength) continue;

                  // Außerhalb 
                  //if (z)

                  events.push(Object.assign({ _time: new Date(z)/*.toLocaleString()* /, km, }, item));
                  
                  // Keine Wiederholung => Fertig
                  if (item.repeat == 0)
                    return;
                }
            }*/
          }
      })
      //.catch((err) => console.warn(err));
      //callbackFunktion(position, events);
      //this.lastEvents = events;

      return events;
    }
}