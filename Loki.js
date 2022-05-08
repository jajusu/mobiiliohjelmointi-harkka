import { StyleSheet, View, FlatList} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { List } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import {Text, ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function HomeScreen({ navigation }) {
  // accordion
  const [expanded, setExpanded] = useState();
  const handlePress = (id) => {
    if (id != expanded){
      setExpanded(id);
    }else{
      setExpanded(0);
    }
  }

  const [treeni, setTreeni] = useState('');

  //create table
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

  // Parse from JSON all different exercises
  const editWorkoutStyle = (workout) =>{
    console.log("edittiä");
    //console.log(workout);
    let text = workout;
    let obj = JSON.parse(text);
    // console.log("Pituus "+obj.length);
    let palauta="";
    for (let i = 0; i < obj.length; i++) {
      // console.log(obj[i].name);
      let nimi=obj[i].name.toUpperCase();
      if (obj[i].comments==""){
        palauta=palauta + nimi + "\nweight: " + obj[i].weight + " kg, sets: " + obj[i].sets +", reps: " + obj[i].reps+"\n\n";
      }else{
        palauta=palauta + nimi + "\nweight: " + obj[i].weight + " kg, sets: " + obj[i].sets +", reps: " + obj[i].reps+"\ncomments: "+obj[i].comments+"\n\n";
      }
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
              <View style={styles.listnames}>
                  {/* <ListItem.Title>{item.date}</ListItem.Title>
                  <ListItem.Subtitle>{editWorkoutStyle(item.workout)}</ListItem.Subtitle> */}
                    <List.Accordion
                      left={props => <List.Icon {...props} icon="weight-lifter" />}
                      title={item.date}
                      expanded={item.id==expanded}
                      onPress={() => handlePress(item.id)}>
                      <Text style={styles.teksti}>{editWorkoutStyle(item.workout)}</Text>
                    </List.Accordion>
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
  listcontainer: {
   width:'100%',
   backgroundColor: '#fff',
  },
  listitems:{
    flexDirection:'row',
  },
  listnames:{
   width:'100%',
  },
  accordion:{

  },
  teksti:{
    paddingTop:10,
    paddingLeft:75,
  }
});