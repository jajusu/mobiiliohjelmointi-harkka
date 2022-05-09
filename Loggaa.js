import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Keyboard, Alert, Modal, Pressable} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Button, Text, Icon, Input, ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function Loggaa() {
  const [name, setName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [comments, setComments] = useState('');
  const [items, setItems] = useState([]);
  const [treeni, setTreeni] = useState('');
  const [modalVisible, setModalVisible] = useState(false);   //modal

  //Create tables
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, name text, sets text, reps text, weight text, comments text);');
      tx.executeSql('create table if not exists session (id integer primary key not null, date text, workout text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (name, sets, reps, weight, comments) values (?, ?, ?, ?, ?);', [name, sets, reps, weight, comments]);    
        console.log("toimii",{name},{sets},{reps},{weight}, {comments});
      }, null, updateList
    )
    emptyForm();
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
    const jsonSession = JSON.stringify(items); //stringify items (exercises)
    console.log({jsonSession});
    const date=new Date().toLocaleString(); //get date
    console.log(date);
    db.transaction(tx => {
      tx.executeSql('insert into session (date, workout) values (?, ?);', [date, jsonSession]);    
      console.log("toimii",{date},{jsonSession});
    }, null, updateSession
    )
    emptyItems(); //empty form
    setModalVisible(true);
  }

  // Delete session (after save)
  const emptyItems = () => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM item');    
      }, null, updateList
    )
  }

  //Empty form
  const emptyForm = () => {
    setName("");
    setSets("");
    setReps("");
    setWeight("");
    setComments("");
    Keyboard.dismiss();
  }
  
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
      <Input 
          placeholder='Comments'
          onChangeText={(comments) => setComments(comments)}
          value={comments}
        /> 
      <Button 
        onPress={saveItem} 
        title=" SAVE EXERCISE"
        buttonStyle={{
          paddingVertical: 10,
          paddingHorizontal: 40,
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
                  <ListItem.Subtitle>{`comments: ${item.comments}`}</ListItem.Subtitle>
                </View>
                <View>
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
      />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Session saved! Check logs.</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>OKAY</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>

      <Button 
        onPress={() => saveSession()}  
        title="  SAVE SESSION"
        buttonStyle={{
          paddingVertical: 10,
          paddingHorizontal: 40,
          backgroundColor: "#009688"
        }}
        icon={
          <Icon
            name="save-alt"
            color="white"
          />
        }
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
  paddingTop:10
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
//  appButtonContainer: { //save-button
//   elevation: 8,
//   backgroundColor: "#009688",
//   paddingVertical: 12,
//   paddingHorizontal: 40,
// },
// appButtonText: { //save-button
//   fontSize: 18,
//   color: "#fff",
//   fontWeight: "bold",
//   alignSelf: "center",
//   textTransform: "uppercase",
// },
centeredView: { //modal
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22,
},
modalView: { //modal
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 25,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
button: { //modal
  borderRadius: 10,
  padding: 20,
  elevation: 2
},
buttonClose: { //modal
  backgroundColor: "#009688",
},
textStyle: { //modal
  color: "white",
  fontWeight: "bold",
  textAlign: "center"
},
modalText: { //modal
  fontSize:18,
  marginBottom: 15,
  textAlign: "center"
}
});