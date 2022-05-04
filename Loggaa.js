import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Button, Text, Icon, Input,ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function App() {
  const [name, setName] = useState('');
  const [setit, setSetit] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, name text, setit text, reps text, weight text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (name, setit, reps, weight) values (?, ?, ?, ?);', [name, setit, reps, weight]);    
        console.log("toimii",{name},{setit},{reps},{weight});

      }, null, updateList
    )
  }

  // Update itemlist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item;', [], (_, { rows }) =>
        setItems(rows._array)
      ); 
    });
  }

  // Delete item
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from item where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };
  

  return (
    <View style={styles.container}>
      <Input 
        placeholder='Name'
        onChangeText={(name) => setName(name)}
        value={name}
        label="NAME"
      /> 
      <Input 
        placeholder='Sets'
        onChangeText={(setit) => setSetit(setit)}
        value={setit}
        label="SETS"
      />
      <Input 
        placeholder='Reps'
        onChangeText={(reps) => setReps(reps)}
        value={reps}
        label="REPS"
      /> 
      <Input 
        placeholder='Weight'
        onChangeText={(weight) => setWeight(weight)}
        value={weight}
        label="WEIGHT"
      />   
      <Button 
        style={styles.button}
        onPress={saveItem} 
        title="  SAVE"
        buttonStyle={{
          width:220
        }}
        icon={
          <Icon
            name="save"
            color="white"
          />
        }
      /> 
      <FlatList 
        style={styles.listcontainer}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <ListItem bottomDivider>
            <ListItem.Content>
              <View style={styles.listitems}>
                <View style={styles.listnames}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.setit}</ListItem.Subtitle>
                  <ListItem.Subtitle>{item.reps}</ListItem.Subtitle>
                  <ListItem.Subtitle>{item.weight}</ListItem.Subtitle>
                </View>
                <View style={styles.deletebutton}>
                  <ListItem button onPress={() => 
                    {deleteItem(item.id)}}>
                    <Icon name="delete" size={20} color='red' />
                  </ListItem>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        } 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
 },
 listcontainer: {
  paddingTop:10,
  backgroundColor: '#fff',
  width:300,
 },
 listitems:{
   flexDirection:'row',
 },
 listnames:{
  paddingTop:5,
  width:220,
  paddingBottom:5
 },
 deletebutton:{ 
 }


});