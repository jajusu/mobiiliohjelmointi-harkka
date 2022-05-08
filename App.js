import { StyleSheet} from 'react-native';
import { NavigationContainer } from'@react-navigation/native';
import { createNativeStackNavigator } from'@react-navigation/native-stack';
import Liikkeet from'./Liikkeet';
import Loggaa from'./Loggaa';
import Loki from'./Loki';
import Etusivu from'./Etusivu';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Etusivu"component={Etusivu}
          options={{ title: 'Training app' }}
        />
        <Stack.Screen 
          name="Liikkeet"component={Liikkeet}
          options={{ title: 'Movements' }}
        />
        <Stack.Screen 
          name="Loggaa"component={Loggaa}
          options={{ title: 'Logger' }}
        />
        <Stack.Screen 
          name="Loki"component={Loki}
          options={{ title: 'Logs' }}
        />
      </Stack.Navigator>
    </NavigationContainer>  
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
