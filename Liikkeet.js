import React, { useState } from 'react';
import { List, RadioButton } from 'react-native-paper';
import { StyleSheet, Text, View, FlatList, TextInput, Image, Keyboard } from 'react-native';
import { Button, Icon} from'react-native-elements';

export default function Liikkeet({navigation}) {
  
  const [hakusana, setHakusana] = useState('');
  const [liikkeet, setLiikkeet] = useState([]);

  //radiobutton
  const [radiovalue, setRadiovalue] = useState('name');

  //accordion
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
      'X-RapidAPI-Key': '' //api-key
    }
  };

  const fetchExercises =() => {
    let haku=hakusana.toLowerCase(); //api searches with lowercase
    let hakuUrl=''
    console.log("radio",radiovalue); 
    if (radiovalue=='body'){ //if searching exercises for bodypart
      if (haku==""){ //if no searchword, fetch all exercises
        hakuUrl='https://exercisedb.p.rapidapi.com/exercises'
      }else{ //if searchword, use it
        hakuUrl=`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${haku}`
      }
    }
    if (radiovalue=='name'){ //if searching exercises by name
      if (haku==""){ //if no searchword, fetch all exercises
        hakuUrl='https://exercisedb.p.rapidapi.com/exercises'
      }else{ //if searchword, use it
        hakuUrl=`https://exercisedb.p.rapidapi.com/exercises/name/${haku}`
      }
    }
    fetch(hakuUrl, options)
    .then(res => res.json())
    .then(json => {setLiikkeet(json);console.log(json)})
    .then(console.log(liikkeet))
    // .then(setViesti(""))
    .catch(err => console.error('error:' + err));
    Keyboard.dismiss();
  }

  //fetch at the page load
  // useEffect(() => {
  //   fetchExercises();
  // }, []);

    return (
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <TextInput
          style={styles.input}
          onChangeText={setHakusana}
          value={hakusana}
          placeholder="Search"
        />
        <Text style={styles.radiotitle}>Search by:</Text>
        <RadioButton.Group onValueChange={value => setRadiovalue(value)} value={radiovalue} >
          <View style={styles.radio}>
            <RadioButton.Item color="#2196F3" label="Name" value="name" />
            <RadioButton.Item color="#2196F3" style={styles.radio} label="Body part" value="body" />
          </View>
        </RadioButton.Group>
        <Button onPress={fetchExercises} 
          title="  SEARCH"
          buttonStyle={{
            width:220,
            alignItems:'center'
          }}
          icon={
            <Icon
              name="search"
              color="white"
            />
          } 
        />
        <Text></Text>
        <Text>Search is not working without API-key!</Text>
        <FlatList 
          style={{marginLeft : "5%"}}
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({item}) => 
            <View>
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
    //picture size, important
    width:250,
    height: 250,
    borderColor:'red'
   },
   radio:{
     flexDirection:'row'
  },
   radiotitle:{
     fontSize:16
   }
});

