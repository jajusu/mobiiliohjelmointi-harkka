import React, { useState, useEffect } from 'react';
import { List } from 'react-native-paper';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';


// const axios = require("axios");

// const options = {
//   method: 'GET',
//   url: 'https://exercisedb.p.rapidapi.com/exercises',
//   headers: {
//     'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
//     'X-RapidAPI-Key': '7ff04451a0msh353f13e35d9d2f6p18a39ejsn6a71579b408c'
//   }
// };

// axios.request(options).then(function (response) {
//     setLiikkeet(response.data);
//     console.log("Liikkeet.js");
//     console.log(response.data);
//     console.log(response.data[0].bodyPart);

// }).catch(function (error) {
// 	console.error(error);
// });

export default function Liikkeet({navigation}) {
  
  const [hakusana, setHakusana] = useState('');
  const [liikkeet, setLiikkeet] = useState([]);
  // const [viesti, setViesti] = useState('');

  //alla olevat accordioniin
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

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
      .then(json => setLiikkeet(json))
      .then(console.log(liikkeet))
      .catch(err => console.error('error:' + err));
    }else{ //jos hakusana, haetaan sillä
      fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${haku}`, options)
        .then(res => res.json())
        .then(json => setLiikkeet(json))
        .then(console.log(liikkeet))
        // .then(setViesti(""))
        .catch(err => console.error('error:' + err));
    }
  }

  useEffect(() => {
    haeLiikkeet();
  }, []);

    const listSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "80%",
            backgroundColor: "#CED0CE",
            marginLeft: "10%"
          }}
        />
      );
    };

    return (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
            <TextInput
              style={styles.input}
              onChangeText={setHakusana}
              value={hakusana}
              placeholder="Search exercises"
            />
            <Button title="Search"
              onPress={haeLiikkeet} 
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
                    expanded={!expanded}
                    onPress={handlePress}>
                    <List.Item title={item.bodyPart} />
                    <List.Item title={item.target} />
                  </List.Accordion>
                </List.Section>
              </View>
              
            }
            data={liikkeet} 
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
  }
});

