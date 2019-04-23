//import React from 'react';
import { fetchJsonOrThrow } from "./requests";

export default class CommonData { //extends React.Component {

    static myInst = null;

    lastPosition = null;
    lastEvents = null;

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
            .then((responseJson) => {
       
              var date = new Date();
              var timeLimit = date.getTime()/1000 + (3600*24*10); // 10 Tage von jetzt
              var lastTime = new Date().setDate(date.getDate() + 10); // 10 Tage von jetzt
              var interv = 7; // 7 Tage (für REPEAT-Funktion)

              var events = [];
              
              let PI180 = Math.PI/180;
      
              responseJson.map((item) => {
      
                  var eventZeit = new Date(item.von);
                  //var eventZeit = new Date(Date.UTC( ...item.von.split("-") )); // Leider kein Unterschied
                  eventZeit.setHours(item.zeit.substring(0,2), item.zeit.substring(3,5));
                  //eventZeit.setMinutes(); //if (item.start.Valid) { // Ansonsten wird gerade "Mitternacht" übergeben, hm ...
                  //eventZeit.setUTCHours(item.zeit.substring(0,2), item.zeit.substring(3,5)); // verdoppelter Zeitumstellungseffekt (2h zu spät)
                  var dauer = item.dauer==0 ? 120 : item.dauer;
                  let nowMinusEventLength = new Date(); nowMinusEventLength.setMinutes(nowMinusEventLength.getMinutes() - dauer);
                  let z = new Date(eventZeit);

                  //alert("Name:"+item.name+", Zeit:"+eventZeit);
                  //alert("Name:"+item.name+", Stunde:"+item.zeit.substring(0,2));
                  // TODO: Ev auch checken ob datebeg malformed / gültiges Datum ist --- (aber REST Server sollte schon "leer" oder "gültig" ausspucken, keine Mischung)
      
                  // Distanz 
                  let a = 0.5 
                  - Math.cos((position.coords.latitude - (item.lat / 1000000)) * PI180)/2
                  + Math.cos((item.lat / 1000000) * PI180) * Math.cos(position.coords.latitude * PI180)
                      * (1 - Math.cos((position.coords.longitude - (item.lon / 1000000)) * PI180)) / 2;
                  let km = 12742 * Math.asin(Math.sqrt(a));
      
                  // Einmalig (bis max. Zeitgrenze && spätestens jetzt (- Eventdauer))
                  //if (item.repeat == 0 && /*item.datebeg.Valid &&*/ /*new Date(item.von).getDate()*/ eventZeit < timeLimit /* && new Date == überhaupt gültig bzw > 0 oder so?*/ && date.getTime()/1000 - (item.dauer==0 ? 7200/*def=2h*/ : item.dauer) < eventZeit) {
                  if (item.repeat == 0 && z >= nowMinusEventLength) { // TODO: NOCH TESTEN!
                    // INFO: Hier (aktuell) "gut", dass "jüngere" Events nicht rausgefiltert werden, weil das aktuell am Server geschehen sollte (damit man auf solche Server Fehler aufmerksam wird und DORT behebt)             
                    var ev = Object.assign({ _time: eventZeit, km, }, item); // <- das jeweils direkt returnen nicht optimal, wegen Mehrfach-Events (weiter unten)
                    events.push(ev);
                  }
      
                  // Wöchentlich
                  else if (item.repeat <= 7) {
                    //var first = zeit.getTime()/1000;  // Unix Sekunden des Events
                    //var jetzt = date.getTime()/1000 - item.ende/*umbenennen zu "dauer"*/; // Unix Sekudnen jetzt gerade - Dauer vom Event
                    //const zeitspanne = 7*24*3600;
      
                    // TODO: Wenn Beginn vom Event in der Zukunft liegt ... ansonsten 
                    //var zeitspanne_seit_letztem_event = ((jetzt - first)%(7*24*3600));
                    
                    // Schleife von nächstem Event bis Maximalzeit
                    for (var i=0; i < item.repeat; i++) {
      
                        //var erstTime = (eventZeit.getTime()/1000)+(i * 24*3600);
                        //var interval = 7*24*3600;
                        //var jetzt = new Date().getTime()/1000;                        
                        // var zeit = ((jetzt - erstTime)  // Gesamte Differenz zu jetzt
                        //             % interval)                    // Überschüssige Sekunden, seit letztem Intervall
                        //             * (-1) + jetzt;                // Abgezogen von jetzt
                        // const includeStartedBeforeSeconds = item.dauer; //item.end.Valid ? item.end.String * 60 : 120; // 2h default?
                    
                        // // TODO: Ggf iTimelimit vorverlegen, falls Event dann schon aus
                        // if (item.bis != "") { // INFO: 15.04.19 von "Nullable" (bis.Valid check) auf leeren String idF abgeändert!
                        //   // iTimelimit = ...
                        // }

                        
                        
                        // var erstes = erstTime > jetzt ? erstTime :    // falls erstes Event in Zukunft, ist das das erste ;-)
                        //        (jetzt - zeit <= includeStartedBeforeSeconds) ? zeit : (zeit + interval); // Liegt letztes in Toleranz, sonst nächstes
                    
                        //console.log(((jetzt-erstDate.getTime()/1000)%(interval*repeatSpan))%erstes);
                        // for (var secs=erstes; secs < timeLimit; secs+=interval) {
                        //     events.push(Object.assign({ _time: new Date(secs*1000)/*.toLocaleString()*/, km, }, item));
                        // }
                        
                        // Eventdauer für Abschätzung hinzunehmen
                        //let firstEventEndTime = new Date(eventZeit); firstEventEndTime.setMinutes(firstEventEndTime.getMinutes() + dauer);

                        for (z.setDate(z.getDate() + i); z < lastTime; z.setDate(z.getDate() + interv)) {
                          if (z < nowMinusEventLength) continue;
                          events.push(Object.assign({ _time: new Date(z)/*.toLocaleString()*/, km, }, item));
                        }
                    }
                  }
              })
              //.catch((err) => console.warn(err));
              //callbackFunktion(position, events);
              this.lastEvents = events;
              return events;
            })
            .catch((error) => {
              //console.error(error); // <- etwas zu drastisch ev
              // TODO: ev mehr ErrorHandling für Production
              // -> was soll passieren wenn Server nicht erreichbar?

              console.warn("Events abrufen: "+error);
              return []; // Leere Liste und Fehler als Warn?
            });

        //}, err => console.error(err));
    }
}