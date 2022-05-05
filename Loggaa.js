import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Keyboard} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Button, Text, Icon, Input, ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function App() {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [items, setItems] = useState([]);
  const [treeni, setTreeni] = useState('');

  const AppButton = ({ onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, name text, sets text, reps text, weight text);');
      tx.executeSql('create table if not exists session (id integer primary key not null, date text, workout text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (name, sets, reps, weight) values (?, ?, ?, ?);', [name, sets, reps, weight]);    
        console.log("toimii",{name},{sets},{reps},{weight});
      }, null, updateList
    )
    tyhjennaLomake();
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

  // Update sessionlist
  const updateSession = () => {
    db.transaction(tx => {
      tx.executeSql('select * from session;', [], (_, { rows }) =>
        setTreeni(rows._array)
      ); 
    });
  }

  // Save session
  const saveSession = () => {
    console.log({items});
    const jsonSession = JSON.stringify(items);
    console.log({jsonSession});
    const date=new Date().toLocaleString();
    console.log(date);
    db.transaction(tx => {
      tx.executeSql('insert into session (date, workout) values (?, ?);', [date, jsonSession]);    
      console.log("toimii",{date},{jsonSession});
    }, null, updateSession
    )
    emptyItems(); //lopuksi taulu tyhjäksi
  }

  const emptyItems = () => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM item');    
      }, null, updateList
    )
  }

  const tyhjennaLomake = () => {
    setName("");
    setSets("");
    setReps("");
    setWeight("");
    Keyboard.dismiss();
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
        placeholder='Exercise name'
        onChangeText={(name) => setName(name)}
        value={name}
      /> 
      <View style={styles.inputs}>
        <Input 
          placeholder='Weight'
          onChangeText={(weight) => setWeight(weight)}
          value={weight}
        />   
        <Input 
          placeholder='Sets'
          onChangeText={(sets) => setSets(sets)}
          value={sets}
        />
        <Input 
          placeholder='Reps'
          onChangeText={(reps) => setReps(reps)}
          value={reps}
        /> 
      </View>
      <Button 
        onPress={saveItem} 
        title="  SAVE EXERCISE"
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
                  <ListItem.Title>{item.name}, {`${item.weight}`} kg</ListItem.Title>
                  <ListItem.Subtitle>{`sets: ${item.sets}`}, {`reps: ${item.reps}`}</ListItem.Subtitle>
                </View>
                <View style={styles.deletebutton}>
                  <ListItem button onPress={() => 
                    {deleteItem(item.id)}}>
                    <Icon name="clear" size={30} color='red' />
                  </ListItem>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        } 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />
     <AppButton title="Save session"
        onPress={() => saveSession()} 
      />
      <Text> </Text>
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
  width:'100%',
 },
 listitems:{
   flexDirection:'row',
 },
 listnames:{
  paddingTop:5,
  width:'80%',
  paddingBottom:5
 },
 deletebutton:{ 
 },
 button:{
  alignItems: "center",
  backgroundColor: "#DDDDDD",
  padding: 10,
  width:220
 },
 inputs:{
  flexDirection:'row',
  width:120,
  justifyContent: 'center',
 },
 appButtonContainer: {
  elevation: 8,
  backgroundColor: "#009688",
  paddingVertical: 10,
  paddingHorizontal: 12,
},
appButtonText: {
  fontSize: 18,
  color: "#fff",
  fontWeight: "bold",
  alignSelf: "center",
  textTransform: "uppercase"
}
});