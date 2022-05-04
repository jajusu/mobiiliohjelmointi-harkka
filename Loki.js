import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button} from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={{flex:1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Olemme lokissa</Text>
            <Button title="Etusivu"
                onPress={() => navigation.navigate('Etusivu')} // Navigate to Etusivu screen
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
});