import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import EventListItem from './EventListItem';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


const CustomListview = ({ itemList }) => (
    <View style={styles.container}>
        <FlatList
                data={itemList}
                renderItem={({ item }) => <EventListItem
                    name={item.name}
                    _time={item._time}
                />}
            />

    </View>
);

export default CustomListview;