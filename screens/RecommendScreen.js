import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { BorderlessButton, TextInput } from 'react-native-gesture-handler';
import { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ScrollView, Button, Select } from 'react-native';
import PickerModal from 'react-native-picker-modal-view';
import DatePicker from 'react-native-datepicker'

export default class RecommendScreen extends React.Component {
  static navigationOptions = {
    title: 'Vorschlagen',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedLocation: {},
      selectedFrequency: {},
      selectedStartTime: {},
      selectedDuration: {},
      TextInput_Name: '',
      InfoText: '',
      value: '',
      date: ''
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);    
	}

	selectedLoc(selected) {
		this.setState({
			selectedLocation: selected
		})
  }

  selectedFreq(selected) {
		this.setState({
			selectedFrequency: selected
		})
  }

  selectedStart(selected){
    this.setState({
      selectedStartTime: selected
    })
  }

  selectedDur(selected){
    this.setState({
      selectedDuration: selected
    })
  }
  
  handleSubmit(event) {
    alert('Folgendes Event wird vorgeschlagen\n\nTitel: ' + this.state.TextInput_Name + '\nOrt: ' + this.state.selectedLocation['Name'] + '\nFrequenz: ' +
    this.state.selectedFrequency['Name'] + '\nStart: ' + this.state.selectedStartTime['Name'] + '\nDauer: ' + this.state.selectedDuration['Name'] + 
    '\nDatum: ' + this.state.date + '\nBeschreibung: ' + this.state.InfoText);
    event.preventDefault();
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    //return <ExpoConfigView />;

    const locationList = [ 
      { "Name": "United States", "Value": "United States", "Code": "US", "Id": 1 }, 
      { "Name": "China", "Value": "China", "Code": "CN", "Id": 2 }, 
      { "Name": "Japan", "Value": "Japan", "Code": "JP", "Id": 3 }, 
      { "Name": "Germany", "Value": "Germany", "Code": "DE", "Id": 4 }, 
      { "Name": "Austria", "Value": "Austria", "Code": "AUT", "Id": 5 }
    ]

    const frequencyList = [
      {"Name": "One time event"}
    ]

    const startTimeList = [
      {"Name": "07:00"}
    ]

    const durationList = [
      {"Name": "00:30"}
    ]

    return (
      <ScrollView>
        <Text style={styles.h1}>
          Schlage hier dein eigenes Event vor
        </Text>
        <Text style={styles.pad}>
          Titel:
        </Text>
        <TextInput style={{borderWidth:1, borderColor:'black', padding: 5}}
        onChangeText={data => this.setState({ TextInput_Name: data })}/>
        <Text style={styles.pad}>
          Ort:
        </Text>
        <PickerModal
          style={styles.pad}
          onSelected={(selected) => this.selectedLoc(selected)}	
          items={locationList}
          sortingLanguage={'en'}
          showToTopButton={true}
          selected={this.state.selectedLocation}
          autoGenerateAlphabeticalIndex={true}
          selectPlaceholderText={'Choose one...'}
          onEndReached={() => console.log('list ended...')}
          searchPlaceholderText={'Search...'}
          requireSelection={false}
          autoSort={true}
          FlatListProps={{viewabilityConfig:{viewAreaCoveragePercentThreshold:50 }}}
          />
        <Text style={styles.pad}>
          Frequenz:
        </Text>
        <PickerModal
          style={styles.pad}
          onSelected={(selected) => this.selectedFreq(selected)}	
          items={frequencyList}
          sortingLanguage={'en'}
          showToTopButton={true}
          selected={this.state.selectedFrequency}
          autoGenerateAlphabeticalIndex={true}
          selectPlaceholderText={'Choose one...'}
          onEndReached={() => console.log('list ended...')}
          searchPlaceholderText={'Search...'}
          requireSelection={false}
          autoSort={true}
          FlatListProps={{viewabilityConfig:{viewAreaCoveragePercentThreshold:50 }}}
          />
        <Text style={styles.pad}>
          Start:
        </Text>
        <PickerModal
          style={styles.pad}
          onSelected={(selected) => this.selectedStart(selected)}	
          items={startTimeList}
          sortingLanguage={'en'}
          showToTopButton={true}
          selected={this.state.selectedStartTime}
          autoGenerateAlphabeticalIndex={true}
          selectPlaceholderText={'Choose one...'}
          onEndReached={() => console.log('list ended...')}
          searchPlaceholderText={'Search...'}
          requireSelection={false}
          autoSort={true}
          FlatListProps={{viewabilityConfig:{viewAreaCoveragePercentThreshold:50 }}}
          />
        <Text style={styles.pad}>
          Dauer:
        </Text>
        <PickerModal
          style={styles.pad}
          onSelected={(selected) => this.selectedDur(selected)}	
          items={durationList}
          sortingLanguage={'en'}
          showToTopButton={true}
          selected={this.state.selectedDuration}
          autoGenerateAlphabeticalIndex={true}
          selectPlaceholderText={'Choose one...'}
          onEndReached={() => console.log('list ended...')}
          searchPlaceholderText={'Search...'}
          requireSelection={false}
          autoSort={true}
          FlatListProps={{viewabilityConfig:{viewAreaCoveragePercentThreshold:50 }}}
          />
        <Text style={styles.pad}>
          Datum:
        </Text>
          <DatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="1970-01-01"
            maxDate="2030-12-31"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 1,
                top: 4,
                marginLeft: 1
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
              // https://github.com/xgfe/react-native-datepicker
            }}
              onDateChange={(date) => {this.setState({date: date})}}
            /> 
        <Text style={styles.pad}>
          InfoText:
        </Text>
        <TextInput style={{borderWidth:1, borderColor:'black', padding: 5}}
        onChangeText={data => this.setState({ InfoText: data })}/>
        <Button
          title='Recommend Event'
          onPress={this.handleSubmit}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    padding: 5,
    textAlign: 'center'
  },
  pad: {
    padding:5
  }
})