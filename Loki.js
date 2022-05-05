import { StyleSheet, View, FlatList} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { List } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { Button, Text, Icon, Input, ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function HomeScreen({ navigation }) {
  //alla olevat accordioniin
  const [expanded, setExpanded] = useState();
  const handlePress = (id) => {
    if (id != expanded){
      setExpanded(id);
    }else{
      setExpanded(0);
    }
  }

  const [treeni, setTreeni] = useState('');
  const [lista, setLista] = useState([]);
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists session (id integer primary key not null, date text, workout text);');
    }, null, updateSession); 
  }, []);

  // Update sessionlist
  const updateSession = () => {
    db.transaction(tx => {
      tx.executeSql('select * from session;', [], (_, { rows }) =>
        setTreeni(rows._array)
      ); 
    });
  }

  const editWorkoutStyle = (workout) =>{
    console.log("edittiä");
    //console.log(workout);
    let text = workout;
    let obj = JSON.parse(text);
    // console.log("Pituus "+obj.length);
    let palauta="";
    for (let i = 0; i < obj.length; i++) {
      // console.log(obj[i].name);
      palauta=palauta+obj[i].name + ", weight: " + obj[i].weight + "kg, sets: " + obj[i].sets +", reps: " + obj[i].sets+"\n";
    }
    return palauta;

  }

  return (
    <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList 
        style={styles.listcontainer}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <ListItem bottomDivider>
            <ListItem.Content>
              <View style={styles.listitems}>
                <View style={styles.listnames}>
                  {/* <ListItem.Title>{item.date}</ListItem.Title>
                  <ListItem.Subtitle>{editWorkoutStyle(item.workout)}</ListItem.Subtitle> */}
                  <List.Section style={styles.accordion}>
                 <List.Accordion
                  title={item.date}
                  expanded={item.id==expanded}
                  onPress={() => handlePress(item.id)}>
                    <Text>{editWorkoutStyle(item.workout)}</Text>
                  </List.Accordion>
                </List.Section>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        } 
        data={treeni} 
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
   padding: 10
  }



});