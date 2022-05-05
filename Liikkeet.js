import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { StyleSheet, Text, View, FlatList, TextInput, Image, Keyboard } from 'react-native';
import { Button, Icon} from'react-native-elements';


export default function Liikkeet({navigation}) {
  
  const [hakusana, setHakusana] = useState('');
  const [liikkeet, setLiikkeet] = useState([]);
  // const [viesti, setViesti] = useState('');

  //alla olevat accordioniin
  const [expanded, setExpanded] = useState();
  const handlePress = (id) => {
    if (id != expanded){
      setExpanded(id);
    }else{
      setExpanded(0);
    }
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': '' //oma api-key
    }
  };

  const haeLiikkeet =() => {
    let haku=hakusana.toLowerCase(); //apissa haut pienellä, joten muutetaan kirjaimet pieneksi
    if (haku==""){ //jos ei hakusanaa, haetaan kaikki
      fetch(`https://exercisedb.p.rapidapi.com/exercises`, options)
      .then(res => res.json())
      .then(json => {setLiikkeet(json);console.log(json)})
      .catch(err => console.error('error:' + err));
    }else{ //jos hakusana, haetaan sillä
      fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${haku}`, options)
        .then(res => res.json())
        .then(json => setLiikkeet(json))
        .then(console.log(liikkeet))
        // .then(setViesti(""))
        .catch(err => console.error('error:' + err));
    }
    Keyboard.dismiss();
  }

  useEffect(() => {
    haeLiikkeet();
  }, []);

    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          style={styles.input}
          onChangeText={setHakusana}
          value={hakusana}
          placeholder="Exercise name"
        />
        <Button onPress={haeLiikkeet} 
        title="  SEARCH"
        buttonStyle={{
          width:180
        }}
        icon={
          <Icon
            name="search"
            color="white"
          />
        } 
        />
        {/* <Text>{viesti}</Text> */}
        <FlatList 
          style={{marginLeft : "5%"}}
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({item}) => 
            <View>
              {/* <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.name}</Text> */}
              <List.Section style={styles.accordion}>
                <List.Accordion
                  title={item.name}
                  expanded={item.id==expanded}
                  onPress={() => handlePress(item.id)}>
                    <Image style={styles.image} source={{uri:item.gifUrl}}></Image>
                    {/* <List.Item title={`bodypart: ${item.bodyPart}`} />
                    <List.Item title= {`target: ${item.target}`}/>
                    <List.Item title={`equipment: ${item.equipment}`} /> */}
                    <Text>{`bodypart: ${item.bodyPart}`}</Text>
                    <Text>{`target: ${item.target}`}</Text>
                    <Text>{`equipment: ${item.equipment}`}</Text>
                </List.Accordion>
              </List.Section>
            </View>
          }
          data={liikkeet} 
        /> 
      </View>  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  accordion: {
    width: 300,
  },
  image:{
    //kuvan koon määritys
    width:250,
    height: 250,
    borderColor:'red'
   },
});

