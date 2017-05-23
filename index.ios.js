/**
* Sample React Native App
* https://github.com/facebook/react-native
* @flow
*/

import React, { Component } from 'react';
import {
    AppRegistry,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    AlertIOS
} from 'react-native';
import * as firebase from 'firebase';

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./styles.js')

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDmzFpIUpPgejqp6FFGTNnh6x0DCMgIfjw",
    authDomain: "groceryapp-6941b.firebaseapp.com",
    databaseURL: "https://groceryapp-6941b.firebaseio.com",
    storageBucket: "groceryapp-6941b.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

class GroceryApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            })
        };
        // this.itemsRef = this.getRef().child('items');
        this.itemsRef = firebaseApp.database().ref();
    }

    getRef() {
        return firebaseApp.database().ref();
    }

    listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    title: child.val().title,
                    _key: child.key
                });
            });

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items)
            });

        });
    }

    componentDidMount() {
        this.listenForItems(this.itemsRef);
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows([
        //         { title: 'Butter' },
        //         { title: 'Cream Cheese' },
        //         { title: 'Almond Flour' },
        //         { title: 'Olive Oil' },
        //         { title: 'Cauliflower' },
        //         { title: 'Eggs' },
        //         { title: 'Bacons' },
        //     ])
        //   })
    }

    render() {
        return (
            <View style={styles.container}>

            <StatusBar title="Keto Grocery List" />

            <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>

            <ActionButton onPress={this._addItem.bind(this)} title="Add" />

            </View>
        )
    }

    _addItem() {
        AlertIOS.prompt(
            'Add New Item',
            null,
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {
                    text: 'Add',
                    onPress: (text) => {
                        this.itemsRef.push({ title: text })
                    }
                },
            ],
            'plain-text'
        );
    }

    _renderItem(item) {
        const onPress = () => {
            AlertIOS.alert(
                'Complete',
                null,
                [
                    {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
                    {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
                ]
            );
        };

        return (
            <ListItem item={item} onPress={onPress} />
        );
    }

}

AppRegistry.registerComponent('GroceryApp', () => GroceryApp);
