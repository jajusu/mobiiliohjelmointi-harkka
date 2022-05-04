import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground,TouchableOpacity } from 'react-native';
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import kuva from "./kuva2.jpg";


export default function Etusivu({navigation}) {
    const AppButton = ({ onPress, title }) => (
        <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>{title}</Text>
        </TouchableOpacity>
      );

    return (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
            <ImageBackground source={kuva} style={styles.tausta}>
                <View style={styles.napit}>
                    <AppButton title="Movements"
                        onPress={() => navigation.navigate('Liikkeet')} 
                    />
                    <AppButton title="Logger"
                        onPress={() => navigation.navigate('Loggaa')} 
                    />
                    <AppButton title="Logs"
                        onPress={() => navigation.navigate('Loki')} 
                    />
                </View>
            </ImageBackground>
        </View>  
    );
}

const styles = StyleSheet.create({

  tausta: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width:'100%'
  },
  appButtonContainer: {
    elevation: 8,
    // backgroundColor: "#009688",
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